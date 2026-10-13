import { randomBytes, createHash } from 'node:crypto';

export const newToken = () => randomBytes(32).toString('base64url');
export const tokenHash = token => createHash('sha256').update(token).digest();
