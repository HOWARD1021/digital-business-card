import { getEnv } from '../config/env';

export interface ImageMeta {
  id: string;
  createdAt: number;
  completedAt?: number;
  status: string;
  paidModel?: string;
  freeModel?: string;
  originalPrompt?: string;
  transformPrompt?: string;
  iterations?: number;
  retries?: number;
  wasFallback?: boolean;
  evaluation?: string;
  imageUrl?: string;
  storageBucket?: string;
  costEstimate?: number;
}

// Simple in-memory fallback for local dev
const mem: { images: Record<string, ImageMeta>; config?: any } = { images: {} };

export async function insertImageMeta(meta: ImageMeta): Promise<void> {
  const env = getEnv();
  if (!env.D1_API_URL || !env.D1_API_TOKEN) {
    mem.images[meta.id] = meta;
    return;
  }
  try {
    await fetch(`${env.D1_API_URL}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.D1_API_TOKEN}`,
      },
      body: JSON.stringify(meta),
    });
  } catch (e) {
    mem.images[meta.id] = meta;
  }
}

export async function updateImageMeta(id: string, patch: Partial<ImageMeta>): Promise<void> {
  const env = getEnv();
  if (!env.D1_API_URL || !env.D1_API_TOKEN) {
    mem.images[id] = { ...mem.images[id], ...patch };
    return;
  }
  try {
    await fetch(`${env.D1_API_URL}/images/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.D1_API_TOKEN}`,
      },
      body: JSON.stringify(patch),
    });
  } catch (e) {
    mem.images[id] = { ...mem.images[id], ...patch };
  }
}

export async function getImageMeta(id: string): Promise<ImageMeta | undefined> {
  const env = getEnv();
  if (!env.D1_API_URL || !env.D1_API_TOKEN) {
    return mem.images[id];
  }
  const res = await fetch(`${env.D1_API_URL}/images/${encodeURIComponent(id)}`, {
    headers: { 'Authorization': `Bearer ${env.D1_API_TOKEN}` },
  });
  if (!res.ok) return undefined;
  return res.json();
}

// Config storage for encrypted keys (fallback in-memory)
export async function setConfig(key: string, value: any): Promise<void> {
  const env = getEnv();
  if (!env.D1_API_URL || !env.D1_API_TOKEN) {
    mem.config = { ...(mem.config || {}), [key]: value };
    return;
  }
  await fetch(`${env.D1_API_URL}/config/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.D1_API_TOKEN}`,
    },
    body: JSON.stringify({ value }),
  });
}

export async function getConfig<T = any>(key: string): Promise<T | undefined> {
  const env = getEnv();
  if (!env.D1_API_URL || !env.D1_API_TOKEN) {
    return mem.config?.[key];
    
  }
  const res = await fetch(`${env.D1_API_URL}/config/${encodeURIComponent(key)}`, {
    headers: { 'Authorization': `Bearer ${env.D1_API_TOKEN}` },
  });
  if (!res.ok) return undefined;
  const data = await res.json();
  return data?.value as T;
}