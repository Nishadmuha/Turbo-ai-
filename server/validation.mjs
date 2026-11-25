// The CMS is deliberately limited to articles. Other website content is authored in code.
export const kinds = ['blog'];
export function bad(message) { throw Object.assign(new Error(message), { status: 400 }); }
export function text(value, max = 1000) {
  if (typeof value !== 'string' || value.length > max) bad(`Text must be a string up to ${max} characters.`);
  return value.trim();
}
export function url(value, { canonical = false } = {}) {
  value = text(value || '', 2048);
  if (!value) return value;
  if ([...value].some(character => character.charCodeAt(0) <= 32 || character === '\\')) bad('URLs cannot contain whitespace or backslashes.');
  if (/^https?:\/\//i.test(value)) { try { const u = new URL(value); if (u.username || u.password) bad('URLs cannot contain credentials.'); return value; } catch { bad('Invalid URL.'); } }
  if (!canonical && (/^\/(?!\/)/.test(value) || /^#[a-z0-9_-]+$/i.test(value))) return value;
  bad(canonical ? 'Canonical URLs must use HTTP or HTTPS.' : 'Use HTTP(S), a site-relative path, or an anchor URL.');
}
const strings = ['summary', 'hero_title', 'hero_description', 'hero_image', 'body', 'cta_text', 'cta_url', 'seo_title', 'seo_description', 'seo_keywords', 'canonical_url', 'og_title', 'og_description', 'og_image', 'author', 'category'];
const arrays = ['features', 'benefits', 'related_products', 'related_industries', 'tags'];
export function validateEntry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) bad('Invalid content.');
  if (!kinds.includes(input.kind)) bad('This CMS manages blog posts only.');
  const slug = text(input.slug, 160).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) bad('Use a lowercase URL slug with hyphens.');
  const title = text(input.title, 200); if (!title) bad('Title is required.');
  if (!['draft', 'published'].includes(input.status)) bad('Invalid publishing status.');
  const result = { kind: input.kind, slug, title, status: input.status };
  for (const field of strings) result[field] = text(input[field] ?? '', field === 'body' ? 150000 : 10000);
  for (const field of ['hero_image', 'og_image', 'cta_url']) result[field] = url(result[field]);
  result.canonical_url = url(result.canonical_url, { canonical: true });
  for (const field of arrays) {
    if (!Array.isArray(input[field] ?? []) || (input[field]?.length ?? 0) > 100) bad(`Invalid ${field}.`);
    result[field] = (input[field] ?? []).map(item => text(item, 1000));
  }
  if (!Array.isArray(input.sections ?? []) || (input.sections?.length ?? 0) > 50) bad('Invalid content sections.');
  result.sections = (input.sections ?? []).map(section => {
    if (!section || typeof section !== 'object' || Array.isArray(section)) bad('Each section must be an object.');
    return { title: text(section.title ?? '', 200), body: text(section.body ?? '', 20000), image: url(section.image ?? '') };
  });
  result.robots = input.robots ?? 'index,follow';
  if (!['index,follow', 'noindex,nofollow'].includes(result.robots)) bad('Invalid robots directive.');
  result.reading_time = Number(input.reading_time ?? 0);
  if (!Number.isInteger(result.reading_time) || result.reading_time < 0 || result.reading_time > 1000) bad('Invalid reading time.');
  result.published_at = input.published_at ? text(input.published_at, 40) : null;
  if (result.published_at && Number.isNaN(Date.parse(result.published_at))) bad('Invalid publication date.');
  if (result.status === 'published' && !result.published_at) result.published_at = new Date().toISOString();
  return result;
}
