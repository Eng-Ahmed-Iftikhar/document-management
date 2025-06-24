import crypto from 'crypto';

export function generateSecureCode() {
  return crypto.randomInt(1000, 10000).toString();
}
