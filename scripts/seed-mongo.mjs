import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { connectDatabase } from '../server/db.mjs';
import { validateEntry } from '../server/validation.mjs';
import { sanitizePublishedEntry } from '../src/content/retiredProducts.mjs';

// Insert missing blog posts only. Never replace existing editor work or remove
// previously seeded pages/products; those records are simply outside CMS scope.
const records = JSON.parse(await readFile('supabase/seed/cms-entries.json', 'utf8'))
  .filter(entry => entry.kind === 'blog').map(sanitizePublishedEntry);
const { client, db } = await connectDatabase();
try {
  let inserted = 0;
  for (const input of records) {
    const entry = validateEntry(input); const now = new Date().toISOString();
    const result = await db.collection('cms_entries').updateOne({ kind: 'blog', slug: entry.slug }, { $setOnInsert: { ...entry, id: randomUUID(), created_at: now, updated_at: now } }, { upsert: true });
    inserted += result.upsertedCount;
  }
  console.log(`Blog seed complete: ${inserted} new posts; existing records preserved.`);
} finally { await client.close(); }
