import { createInterface } from 'node:readline/promises';
import { randomUUID } from 'node:crypto';
import { Writable } from 'node:stream';
import { connectDatabase } from './db.mjs';
import { passwordHash, validEmail } from './security.mjs';

let hidden = false;
const output = new Writable({ write(chunk, _encoding, callback) { if (!hidden) process.stdout.write(chunk); callback(); } });
const prompt = createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) });
try {
  const email = validEmail(process.env.CMS_ADMIN_EMAIL || await prompt.question('Administrator email: '));
  let password = process.env.CMS_ADMIN_PASSWORD;
  if (!password) { process.stdout.write('Password (12–128 characters, hidden): '); hidden = true; password = await prompt.question(''); hidden = false; process.stdout.write('\n'); }
  const hash = await passwordHash(password);
  const { db, client } = await connectDatabase();
  try { await db.collection('cms_users').insertOne({ id: randomUUID(), email, role: 'admin', passwordHash: hash, disabled: false, created_at: new Date().toISOString() }); console.log('Administrator created. Sign in at /admin/login.'); }
  catch (error) { if (error.code === 11000) throw new Error('This account already exists; no changes were made.'); throw error; }
  finally { await client.close(); }
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { prompt.close(); }
