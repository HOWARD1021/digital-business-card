import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '../config/env';

export type TaskType = 'image_generation' | 'image_description' | 'image_evaluation' | 'prompt_improvement';

function toBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

function extractImagePart(parts: any[]): { data: string; mimeType: string } | null {
  for (const p of parts || []) {
    if (p.inlineData && p.inlineData.data) {
      const mimeType = p.inlineData.mimeType || 'image/png';
      return { data: p.inlineData.data as string, mimeType };
    }
  }
  return null;
}

export class ModelManager {
  private env = getEnv();
  private paid = new GoogleGenerativeAI(this.env.PAID_API_KEY);
  private free = new GoogleGenerativeAI((this.env.FREE_API_KEY || this.env.PAID_API_KEY)!);

  getModelFor(task: TaskType) {
    if (task === 'image_generation') {
      return this.paid.getGenerativeModel({ model: this.env.PAID_MODEL });
    }
    return this.free.getGenerativeModel({ model: this.env.FREE_MODEL });
  }
}

export async function describeImage(image: Buffer, mimeType: string): Promise<string> {
  const mm = new ModelManager();
  const model = mm.getModelFor('image_description');
  const prompt = '請詳細描述這張圖片，包括：主要內容、風格、顏色、構圖、氛圍。用中文回答。';
  const imagePart = { inlineData: { data: toBase64(image), mimeType } };
  const result = await model.generateContent([{ text: prompt }, imagePart]);
  const text = result.response.text();
  return text || '無法描述此圖片';
}

export async function improvePrompt(original: string, critique: string): Promise<string> {
  const mm = new ModelManager();
  const model = mm.getModelFor('prompt_improvement');
  const prompt = `原始提示：${original}\n問題：${critique}\n\n請改進提示詞，修正問題。只回答改進後的提示詞。`;
  const result = await model.generateContent([{ text: prompt }]);
  return result.response.text() || original;
}

export async function evaluateImage(image: Buffer, mimeType: string, goal: string): Promise<{ meets: boolean; critique: string }>{
  const mm = new ModelManager();
  const model = mm.getModelFor('image_evaluation');
  const evalPrompt = `評估這張圖片是否符合要求："${goal}"\n\n請回答 JSON 格式：{"符合": true/false, "評語": "具體評語"}`;
  const imagePart = { inlineData: { data: toBase64(image), mimeType } };
  const result = await model.generateContent([{ text: evalPrompt }, imagePart]);
  const text = result.response.text() || '';
  try {
    const json = JSON.parse(text);
    return { meets: Boolean(json['符合']), critique: String(json['評語'] ?? '') };
  } catch {
    const meets = /符合|good|correct/i.test(text);
    return { meets, critique: text };
  }
}

export async function generateImageFromImage(source: Buffer, sourceMime: string, transformPrompt: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const mm = new ModelManager();
  const model = mm.getModelFor('image_generation');
  const sourcePart = { inlineData: { data: toBase64(source), mimeType: sourceMime } };
  const result = await model.generateContent([{ text: transformPrompt }, sourcePart]);
  // The image model returns inlineData image parts
  for (const cand of result.response.candidates || []) {
    const hit = extractImagePart(cand.content?.parts || []);
    if (hit) {
      return { buffer: Buffer.from(hit.data, 'base64'), mimeType: hit.mimeType };
    }
  }
  // Fallback: some SDKs expose a top-level parts collection
  const hit = extractImagePart((result as any).response?.candidates?.[0]?.content?.parts || []);
  if (hit) return { buffer: Buffer.from(hit.data, 'base64'), mimeType: hit.mimeType };
  return null;
}

export async function generateWithSelfCorrectionI2I(params: {
  source: Buffer;
  sourceMime: string;
  transformPrompt: string;
  maxIterations?: number;
  retryDelayMs?: number;
}): Promise<{ image?: Buffer; mimeType?: string; status: string; evaluation?: string; attempts: number }>{
  const { source, sourceMime, transformPrompt } = params;
  const maxIterations = params.maxIterations ?? 5;
  const retryDelayMs = params.retryDelayMs ?? 500;

  let currentPrompt = transformPrompt;
  for (let i = 1; i <= maxIterations; i++) {
    const generated = await generateImageFromImage(source, sourceMime, currentPrompt);
    if (!generated) {
      if (i < maxIterations) await new Promise(r => setTimeout(r, retryDelayMs));
      continue;
    }
    const goal = `將圖片轉換為：${transformPrompt}`;
    const evalRes = await evaluateImage(generated.buffer, generated.mimeType, goal);
    if (evalRes.meets) {
      return { image: generated.buffer, mimeType: generated.mimeType, status: `轉換成功 (第 ${i} 次嘗試)`, evaluation: evalRes.critique, attempts: i };
    }
    if (i < maxIterations) {
      currentPrompt = await improvePrompt(currentPrompt, evalRes.critique);
      await new Promise(r => setTimeout(r, retryDelayMs));
    }
  }
  return { status: `轉換未達成目標 (嘗試 ${maxIterations} 次)`, attempts: maxIterations };
}