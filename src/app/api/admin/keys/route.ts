import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/kiro/config/env';
import { encryptSecret } from '@/lib/kiro/security/crypto';
import { setConfig } from '@/lib/kiro/db/d1';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const env = getEnv();
    const body = await req.json();
    const paid = String(body.paidKey || '');
    const free = String(body.freeKey || '');
    if (!paid) return NextResponse.json({ error: 'paidKey is required' }, { status: 400 });

    if (!env.MASTER_SECRET) return NextResponse.json({ error: 'MASTER_SECRET is not configured on server' }, { status: 500 });

    const encrypted = {
      paid: encryptSecret(paid, env.MASTER_SECRET),
      free: free ? encryptSecret(free, env.MASTER_SECRET) : undefined,
      updatedAt: Date.now(),
    };

    await setConfig('google_api_keys', encrypted);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}