import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const PBKDF2_ITER = 100_000;
const KEY_LEN = 32;
const DIGEST = 'sha256';

function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(Buffer.from(secret, 'utf8'), salt, PBKDF2_ITER, KEY_LEN, DIGEST);
}

export function encryptSecret(plaintext: string, masterSecret?: string): string {
  if (!masterSecret) throw new Error('MASTER_SECRET is required to encrypt');
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = deriveKey(masterSecret, salt);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([Buffer.from('v1'), salt, iv, tag, ciphertext]).toString('base64');
  return payload;
}

export function decryptSecret(payloadB64: string, masterSecret?: string): string {
  if (!masterSecret) throw new Error('MASTER_SECRET is required to decrypt');
  const buf = Buffer.from(payloadB64, 'base64');
  const version = buf.subarray(0, 2).toString('utf8');
  if (version !== 'v1') throw new Error('Unsupported secret payload version');
  const salt = buf.subarray(2, 18);
  const iv = buf.subarray(18, 30);
  const tag = buf.subarray(30, 46);
  const ciphertext = buf.subarray(46);
  const key = deriveKey(masterSecret, salt);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return plaintext;
}