import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { passwordHash, verifyPassword, tokenHash, publicUser, validEmail } from './security.mjs';
import { validateEntry, kinds, text, bad } from './validation.mjs';
import { createBuildController } from './rebuild.mjs';

const cookieName = 'turbo_cms_session';
const publicProjection = { _id: 0 };
export async function createApp({ db, uploadDir = path.resolve('.cms-data/uploads'), origins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'], secure = process.env.NODE_ENV === 'production', allowLocalBuild = process.env.CMS_ALLOW_LOCAL_BUILD === 'true', runBuild }) {
  await mkdir(uploadDir, { recursive: true });
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
  app.use(express.json({ limit: '2mb' }));
  const api = express.Router();
  app.use('/api/cms', api);
  api.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      // Both are required: a forged HTML form cannot supply the custom header.
      if (!origins.includes(req.get('origin')) || req.get('X-CMS-Request') !== '1') return res.status(403).json({ error: 'Request origin is not allowed.' });
      if (['POST', 'PUT'].includes(req.method) && req.path !== '/auth/logout' && req.path !== '/admin/media' && (!req.body || typeof req.body !== 'object' || Array.isArray(req.body))) return res.status(400).json({ error: 'A JSON object is required.' });
    }
    next();
  });
  const entries = db.collection('cms_entries');
  const users = db.collection('cms_users');
  const sessions = db.collection('cms_sessions');
  const media = db.collection('cms_media');
  const builds = createBuildController({ enabled: allowLocalBuild, ...(runBuild ? { run: runBuild } : {}) });
  const token = req => (req.get('cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) || '';
  async function currentUser(req) {
    const raw = token(req); if (!/^[a-f0-9]{64}$/.test(raw)) return null;
    const session = await sessions.findOne({ tokenHash: tokenHash(raw), expires: { $gt: new Date() } });
    return session ? users.findOne({ id: session.userId, disabled: { $ne: true } }) : null;
  }
  async function authenticated(req, res, next) {
    req.cmsUser = await currentUser(req);
    if (!req.cmsUser) return res.status(401).json({ error: 'Sign in to continue.' });
    next();
  }
  function admin(req, res, next) { if (req.cmsUser.role !== 'admin') return res.status(403).json({ error: 'Administrator access is required.' }); next(); }
  const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many login attempts. Try again in 15 minutes.' } });
  const dummyHash = await passwordHash(randomBytes(32).toString('hex'));
  api.get('/health', async (_req, res) => { await db.command({ ping: 1 }); res.json({ ok: true, database: 'mongodb', scope: 'blog' }); });
  api.get('/auth/me', async (req, res) => { const user = await currentUser(req); res.json(user ? publicUser(user) : null); });
  api.post('/auth/login', authLimit, async (req, res) => {
    const email = validEmail(req.body.email);
    const user = await users.findOne({ email });
    const valid = await verifyPassword(req.body.password, user?.passwordHash || dummyHash);
    if (!user || user.disabled || !valid) return res.status(401).json({ error: 'Email or password is incorrect.' });
    const raw = randomBytes(32).toString('hex');
    await sessions.insertOne({ tokenHash: tokenHash(raw), userId: user.id, expires: new Date(Date.now() + 8 * 60 * 60 * 1000) });
    res.cookie(cookieName, raw, { httpOnly: true, secure, sameSite: 'strict', maxAge: 8 * 60 * 60 * 1000, path: '/api/cms' });
    res.json(publicUser(user));
  });
  api.post('/auth/logout', async (req, res) => { await sessions.deleteOne({ tokenHash: tokenHash(token(req)) }); res.clearCookie(cookieName, { httpOnly: true, secure, sameSite: 'strict', path: '/api/cms' }); res.json({ ok: true }); });
  api.get('/entries', async (req, res) => {
    if (!kinds.includes(req.query.kind)) bad('Invalid content kind.');
    const limit = Math.min(500, Math.max(1, Math.floor(Number(req.query.limit) || 100)));
    res.json(await entries.find({ kind: req.query.kind, status: 'published' }, { projection: { ...publicProjection, body: 0 } }).sort({ published_at: -1 }).limit(limit).toArray());
  });
  api.get('/entries/:kind/:slug', async (req, res) => {
    if (!kinds.includes(req.params.kind)) return res.status(404).json({ error: 'This CMS manages blog posts only.' });
    res.json(await entries.findOne({ kind: 'blog', slug: req.params.slug, status: 'published' }, { projection: publicProjection }));
  });
  api.use('/media/files', express.static(uploadDir, { dotfiles: 'deny', index: false, setHeaders: res => { res.set('Content-Security-Policy', "default-src 'none'"); res.set('X-Content-Type-Options', 'nosniff'); } }));
  api.use('/admin', authenticated);
  api.get('/admin/rebuild', admin, (_req, res) => res.json(builds.getStatus()));
  api.post('/admin/rebuild', admin, (req, res) => {
    if (Object.keys(req.body).length) bad('Site refresh accepts no parameters.');
    res.status(202).json(builds.start());
  });
  api.get('/admin/stats', async (_req, res) => {
    const rows = await entries.aggregate([{ $match: { kind: 'blog' } }, { $group: { _id: { kind: '$kind', status: '$status' }, count: { $sum: 1 } } }]).toArray();
    res.json(kinds.map(kind => { const published = rows.find(row => row._id.kind === kind && row._id.status === 'published')?.count || 0; const draft = rows.find(row => row._id.kind === kind && row._id.status === 'draft')?.count || 0; return { kind, total: published + draft, published, draft }; }));
  });
  api.get('/admin/entries', async (req, res) => {
    if (!kinds.includes(req.query.kind)) bad('Invalid content kind.');
    const filter = { kind: req.query.kind };
    if (req.query.status && req.query.status !== 'all') { if (!['draft', 'published'].includes(req.query.status)) bad('Invalid status.'); filter.status = req.query.status; }
    if (req.query.search) filter.title = { $regex: text(req.query.search, 200).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const page = Math.min(10000, Math.max(0, Math.floor(Number(req.query.page) || 0)));
    res.json({ entries: await entries.find(filter, { projection: publicProjection }).sort({ updated_at: -1 }).skip(page * 20).limit(20).toArray(), count: await entries.countDocuments(filter) });
  });
  api.get('/admin/entries/:id', async (req, res) => { const row = await entries.findOne({ id: req.params.id, kind: 'blog' }, { projection: publicProjection }); if (!row) return res.status(404).json({ error: 'Blog post was not found.' }); res.json(row); });
  api.post('/admin/entries', async (req, res) => { const now = new Date().toISOString(); const row = { ...validateEntry(req.body), id: randomUUID(), created_at: now, updated_at: now }; await entries.insertOne(row); delete row._id; res.status(201).json(row); });
  api.put('/admin/entries/:id', async (req, res) => { const row = await entries.findOneAndUpdate({ id: req.params.id, kind: 'blog' }, { $set: { ...validateEntry(req.body), updated_at: new Date().toISOString() } }, { returnDocument: 'after', projection: publicProjection }); if (!row) return res.status(404).json({ error: 'Blog post was not found.' }); res.json(row); });
  api.delete('/admin/entries/:id', admin, async (req, res) => { const result = await entries.deleteOne({ id: req.params.id, kind: 'blog' }); if (!result.deletedCount) return res.status(404).json({ error: 'Blog post was not found.' }); res.json({ ok: true }); });
  api.get('/admin/media', async (_req, res) => res.json(await media.find({}, { projection: publicProjection }).sort({ created_at: -1 }).limit(1000).toArray()));
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 3 } });
  api.post('/admin/media', upload.single('file'), async (req, res) => {
    const file = req.file; if (!file) bad('Choose an image.');
    const b = file.buffer;
    const signature = b.subarray(0, 12);
    let ext;
    if (signature.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ext = 'png';
    else if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = 'jpg';
    else if (signature.toString('ascii', 0, 4) === 'RIFF' && signature.toString('ascii', 8, 12) === 'WEBP') ext = 'webp';
    else if (['GIF87a', 'GIF89a'].includes(signature.toString('ascii', 0, 6))) ext = 'gif';
    else if (signature.toString('ascii', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(signature.toString('ascii', 8, 12))) ext = 'avif';
    else bad('Choose a valid PNG, JPEG, WebP, GIF, or AVIF image.');
    const alt = text(req.body.alt, 500); if (!alt) bad('Alt text is required.');
    const filename = `${randomUUID()}.${ext}`;
    const record = { id: randomUUID(), name: text(file.originalname, 255), path: `/api/cms/media/files/${filename}`, alt, category: text(req.body.category || 'General', 100), created_at: new Date().toISOString() };
    await writeFile(path.join(uploadDir, filename), b, { flag: 'wx' });
    try { await media.insertOne(record); } catch (error) { await unlink(path.join(uploadDir, filename)); throw error; }
    delete record._id; res.status(201).json(record);
  });
  api.delete('/admin/media/:id', admin, async (req, res) => { const row = await media.findOne({ id: req.params.id }); if (row) { const filename = path.basename(row.path); if (!/^[a-f0-9-]+\.(png|jpg|webp|gif|avif)$/.test(filename)) bad('Invalid media path.'); await unlink(path.join(uploadDir, filename)).catch(error => { if (error.code !== 'ENOENT') throw error; }); await media.deleteOne({ id: row.id }); } res.json({ ok: true }); });
  api.get('/admin/team', admin, async (_req, res) => res.json((await users.find({}).toArray()).map(publicUser)));
  api.post('/admin/team', admin, async (req, res) => { const role = req.body.role; if (!['admin', 'editor'].includes(role)) bad('Invalid role.'); const user = { id: randomUUID(), email: validEmail(req.body.email), role, passwordHash: await passwordHash(req.body.password), created_at: new Date().toISOString(), disabled: false }; await users.insertOne(user); res.status(201).json(publicUser(user)); });
  api.put('/admin/team/:id', admin, async (req, res) => {
    const changes = {};
    if (req.body.role !== undefined) { if (!['admin', 'editor'].includes(req.body.role)) bad('Invalid role.'); changes.role = req.body.role; }
    if (req.body.disabled !== undefined) { if (typeof req.body.disabled !== 'boolean') bad('Invalid account status.'); changes.disabled = req.body.disabled; }
    if (req.params.id === req.cmsUser.id && (changes.disabled || changes.role === 'editor')) bad('You cannot disable or demote your own administrator account.');
    if (req.body.password) changes.passwordHash = await passwordHash(req.body.password);
    const row = await users.findOneAndUpdate({ id: req.params.id }, { $set: changes }, { returnDocument: 'after' });
    if (!row) return res.status(404).json({ error: 'Team member was not found.' });
    await sessions.deleteMany({ userId: row.id });
    res.json(publicUser(row));
  });
  api.use((_req, res) => res.status(404).json({ error: 'CMS endpoint was not found.' }));
  app.use((error, _req, res, _next) => {
    if (error.code === 11000) return res.status(409).json({ error: 'This email or content slug already exists.' });
    if (error instanceof multer.MulterError) return res.status(400).json({ error: 'Upload failed. Images must be 8 MB or smaller.' });
    const status = error.status || 500;
    res.status(status).json({ error: status < 500 ? error.message : 'CMS request failed. Check the server and database connection.' });
  });
  return app;
}
