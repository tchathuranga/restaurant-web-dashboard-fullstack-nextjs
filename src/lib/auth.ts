import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'sv_admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const MIN_SECRET_LENGTH = 32;

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET ?? '';
  return secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

// Hashing first gives equal-length buffers, so the comparison leaks neither content nor length
function safeEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

// False when the admin account or signing secret is missing, so login fails closed instead of open
export function isAuthConfigured(): boolean {
  return Boolean(getSecret() && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

export function checkCredentials(username: string, password: string): boolean {
  if (!isAuthConfigured()) return false;
  const userOk = safeEqual(username, process.env.ADMIN_USERNAME ?? '');
  const passOk = safeEqual(password, process.env.ADMIN_PASSWORD ?? '');
  return userOk && passOk;
}

export function createSessionToken(username: string): string {
  const secret = getSecret();
  if (!secret) throw new Error('AUTH_SECRET is not configured');
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${Buffer.from(username).toString('base64url')}.${expires}`;
  return `${payload}.${sign(payload, secret)}`;
}

// Returns the signed-in username, or null if the token is missing, forged, or expired
export function verifySessionToken(token: string | undefined): string | null {
  const secret = getSecret();
  if (!secret || !token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [encodedUser, expires, signature] = parts;

  if (!safeEqual(signature, sign(`${encodedUser}.${expires}`, secret))) return null;
  if (!/^\d+$/.test(expires) || Number(expires) < Math.floor(Date.now() / 1000)) return null;

  return Buffer.from(encodedUser, 'base64url').toString();
}
