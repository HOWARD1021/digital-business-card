import { z } from 'zod';

const EnvSchema = z.object({
  PAID_API_KEY: z.string().min(1, 'PAID_API_KEY is required'),
  FREE_API_KEY: z.string().min(1, 'FREE_API_KEY is required').optional(),
  PAID_MODEL: z.string().default('gemini-2.5-flash-image-preview'),
  FREE_MODEL: z.string().default('gemini-1.5-flash'),
  FALLBACK_TO_PAID: z.string().default('true'),
  MAX_RETRIES: z.string().default('3'),
  RATE_LIMIT_DELAY: z.string().default('1000'),

  // Cloudflare R2
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_BUCKET: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().optional(),

  // Cloudflare D1 (optional; use Worker or REST endpoint)
  D1_API_URL: z.string().optional(),
  D1_API_TOKEN: z.string().optional(),

  // Crypto
  MASTER_SECRET: z.string().optional(),
});

export type AppEnv = z.infer<typeof EnvSchema> & {
  isDualModel: boolean;
  fallbackToPaid: boolean;
  maxRetries: number;
  rateLimitDelay: number;
};

export function getEnv(): AppEnv {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // We don't throw here to allow partial setup; runtime checks will enforce required vars where needed.
    const defaults = EnvSchema.parse({});
    const merged: any = { ...defaults, ...process.env };
    const result = EnvSchema.parse(merged);
    return decorate(result);
  }
  return decorate(parsed.data);
}

function decorate(env: z.infer<typeof EnvSchema>): AppEnv {
  const paidKey = env.PAID_API_KEY || '';
  const freeKey = env.FREE_API_KEY || env.PAID_API_KEY || '';
  const isDualModel = Boolean(freeKey) && freeKey !== paidKey;
  return {
    ...env,
    isDualModel,
    fallbackToPaid: (env.FALLBACK_TO_PAID ?? 'true').toLowerCase() === 'true',
    maxRetries: Number(env.MAX_RETRIES ?? '3'),
    rateLimitDelay: Number(env.RATE_LIMIT_DELAY ?? '1000'),
  } as AppEnv;
}