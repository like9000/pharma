import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const AES_ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;

function deriveKey(secret: string): Buffer {
  return scryptSync(secret, 'pharma-salt', 32);
}

export function encryptSecret(plaintext: string, secret: string) {
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(secret);
  const cipher = createCipheriv(AES_ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptSecret(payload: string, secret: string) {
  const buffer = Buffer.from(payload, 'base64');
  const iv = buffer.subarray(0, IV_LENGTH);
  const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = buffer.subarray(IV_LENGTH + 16);
  const key = deriveKey(secret);
  const decipher = createDecipheriv(AES_ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
