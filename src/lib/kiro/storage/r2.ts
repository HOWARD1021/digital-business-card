import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getEnv } from '../config/env';

function getClient() {
  const env = getEnv();
  if (!env.CLOUDFLARE_R2_ACCOUNT_ID || !env.CLOUDFLARE_R2_ACCESS_KEY_ID || !env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 credentials are not set');
  }
  const endpoint = env.CLOUDFLARE_R2_ENDPOINT || `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadImageToR2(key: string, buffer: Buffer, mimeType: string): Promise<string> {
  const env = getEnv();
  if (!env.CLOUDFLARE_R2_BUCKET) throw new Error('CLOUDFLARE_R2_BUCKET is not set');
  const client = getClient();
  await client.send(new PutObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  }));
  // Note: This URL may require public bucket or signed URL via Worker to access
  const endpoint = env.CLOUDFLARE_R2_ENDPOINT || `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const url = `${endpoint}/${env.CLOUDFLARE_R2_BUCKET}/${encodeURIComponent(key)}`;
  return url;
}