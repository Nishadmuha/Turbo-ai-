import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export const tokenHash = token => createHash('sha256').update(token).digest('hex');
export async function passwordHash(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw Object.assign(new Error('Use a password of 12–128 characters.'), { status: 400 });
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${(await scrypt(password, salt, 64)).toString('hex')}`;
}
export async function verifyPassword(password, hash) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [salt, stored] = hash.split(':');
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(stored, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export const publicUser = user => ({ id: user.id, email: user.email, role: user.role, disabled: Boolean(user.disabled) });
export function validEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
  return value.trim().toLowerCase();
}
