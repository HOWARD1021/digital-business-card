import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/kiro/db/d1';

export const runtime = 'nodejs';

export async function GET() {
  const cfg = await getConfig('google_api_keys');
  const configured = Boolean(cfg && (cfg.paid || cfg.free));
  return NextResponse.json({ configured, updatedAt: cfg?.updatedAt || null });
}