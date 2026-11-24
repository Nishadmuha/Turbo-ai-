import { MongoClient } from 'mongodb';

export async function connectDatabase(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', name = process.env.MONGODB_DB || 'turbo_ai_cms') {
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) throw new Error('Invalid MongoDB database name.');
  let client;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
  }
  catch (error) {
    await client?.close();
    const reason = error.code === 18 || error.codeName === 'AuthenticationFailed' ? 'authentication failed; check the database account' : 'connection failed; check the URI, network access list, and TLS settings';
    throw new Error(`MongoDB ${reason}. Connection details have been omitted.`);
  }
  const db = client.db(name);
  try { await Promise.all([
    db.collection('cms_entries').createIndex({ kind: 1, slug: 1 }, { unique: true }),
    db.collection('cms_entries').createIndex({ id: 1 }, { unique: true }),
    db.collection('cms_users').createIndex({ email: 1 }, { unique: true }),
    db.collection('cms_sessions').createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection('cms_sessions').createIndex({ expires: 1 }, { expireAfterSeconds: 0 }),
    db.collection('cms_settings').createIndex({ key: 1 }, { unique: true }),
  ]); }
  catch { await client.close(); throw new Error('MongoDB schema initialization failed. Check database permissions and existing duplicate records. Connection details have been omitted.'); }
  return { client, db };
}
