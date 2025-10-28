import { NextResponse } from 'next/server';
import { generateWithSelfCorrectionI2I, describeImage } from '@/lib/kiro/ai/google';
import { uploadImageToR2 } from '@/lib/kiro/storage/r2';
import { insertImageMeta } from '@/lib/kiro/db/d1';
import { getEnv } from '@/lib/kiro/config/env';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

function nowTs() { return Date.now(); }
function yyyymmddhhmmss() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function POST(req: Request) {
  try {
    const env = getEnv();
    const contentType = req.headers.get('content-type') || '';

    let sourceBuffer: Buffer | undefined;
    let sourceMime = 'image/png';
    let transformPrompt = '';
    let iterations = 5;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('image');
      transformPrompt = String(form.get('transformPrompt') || '');
      iterations = Number(form.get('iterations') || '5');
      if (file && typeof file !== 'string') {
        const f = file as File;
        sourceMime = f.type || 'image/png';
        const arr = await f.arrayBuffer();
        sourceBuffer = Buffer.from(arr);
      }
    } else {
      const body = await req.json();
      const b64 = body.imageBase64 as string | undefined;
      transformPrompt = String(body.transformPrompt || '');
      iterations = Number(body.iterations || 5);
      const m = (body.mimeType as string | undefined) || 'image/png';
      if (b64) {
        sourceBuffer = Buffer.from(b64.replace(/^data:[^,]+,/, ''), 'base64');
        sourceMime = m;
      }
    }

    if (!sourceBuffer) return NextResponse.json({ error: 'image is required' }, { status: 400 });
    if (!transformPrompt) return NextResponse.json({ error: 'transformPrompt is required' }, { status: 400 });

    // Optional: describe the original image (for logging / audit)
    const originalDescription = await describeImage(sourceBuffer, sourceMime).catch(() => '');

    const startedAt = nowTs();
    const result = await generateWithSelfCorrectionI2I({ source: sourceBuffer, sourceMime, transformPrompt, maxIterations: iterations });

    if (!result.image) {
      await insertImageMeta({
        id: uuidv4(),
        createdAt: startedAt,
        completedAt: nowTs(),
        status: result.status,
        freeModel: env.FREE_MODEL,
        paidModel: env.PAID_MODEL,
        originalPrompt: originalDescription,
        transformPrompt,
        iterations,
        retries: result.attempts,
        wasFallback: false,
      });
      return NextResponse.json({ success: false, status: result.status }, { status: 422 });
    }

    // Save to R2
    const key = `i2i_success_${yyyymmddhhmmss()}_${Math.floor(Math.random()*9000+1000)}.png`;
    const url = await uploadImageToR2(key, result.image, result.mimeType || 'image/png');

    const id = uuidv4();
    await insertImageMeta({
      id,
      createdAt: startedAt,
      completedAt: nowTs(),
      status: result.status,
      freeModel: env.FREE_MODEL,
      paidModel: env.PAID_MODEL,
      originalPrompt: originalDescription,
      transformPrompt,
      iterations,
      retries: result.attempts,
      wasFallback: false,
      evaluation: result.evaluation,
      imageUrl: url,
      storageBucket: env.CLOUDFLARE_R2_BUCKET,
    });

    return NextResponse.json({ success: true, id, imageUrl: url, status: result.status, evaluation: result.evaluation, attempts: result.attempts });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}