import fs from 'node:fs';
import http from 'node:http';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import puppeteer from 'puppeteer';

const seed = JSON.parse(fs.readFileSync('supabase/seed/cms-entries.json', 'utf8'));
const newIndustries = [
  { slug: 'mining', title: 'Mining', city: 'Saskatoon' },
  { slug: 'real-estate', title: 'Real Estate', city: 'Toronto' },
  { slug: 'oil-and-gas', title: 'Oil & Gas', city: 'Calgary' },
];
const article = seed.find((entry) => entry.kind === 'blog' && entry.slug === 'energy-ai-asset-intelligence-foundations');
assert.ok(article, 'The CMS fixture needs the published energy article.');
const rows = [article];
const cmsRequests = [];
const launchProducts = [
  { slug: 'interstellar-one', name: 'INTERSTELLAR ONE' },
  { slug: 'spectra-plus', name: 'SPECTRA PLUS' },
  { slug: 'quantum-apex', name: 'QUANTUM APEX' },
  { slug: 'orbit-core', name: 'ORBIT CORE' },
];
assert.ok(launchProducts.every(({ slug }) => !rows.some((entry) => entry.kind === 'product' && entry.slug === slug)),
  'The CMS fixture intentionally omits launch entries to verify authored product pages remain available.');
const retiredSlugs = ['i-lakehouse', 'ilakehouse', 'dci-360', 'dci360'];
const retiredNames = /i[-_\s]?lakehouse|dci[-_\s]?360/i;
// Simulate published records left in a remote CMS after the authored site is cleaned up.
for (const slug of retiredSlugs) {
  rows.push({ ...article, kind: 'product', id: `retired-${slug}`, slug, title: slug,
    hero_title: slug, canonical_url: `https://turbo-ai.ca/products/${slug}` });
}
rows.push({ ...article, kind: 'page', id: 'legacy-home', slug: 'home',
  hero_title: 'A remote CMS must not replace the authored homepage',
  seo_description: 'i-Lakehouse and DCI 360 power older deployments.',
  sections: [{ title: 'Legacy i-Lakehouse and DCI360 references',
    body: 'CMS_INJECTION_MUST_NOT_REACH_MAIN_WEBSITE', image: '/cms-seed/dci-data-center.webp' }] });
article.body += '\n\nLegacy platforms: [i-Lakehouse](/products/i-lakehouse), [DCI360](https://turbo-ai.ca/products/dci360), and [ADRS](/products/adrs).';
article.seo_keywords += ', i-Lakehouse, DCI360';
rows.push({ ...seed.find((entry) => entry.kind === 'blog' && entry.slug !== 'energy-ai-asset-intelligence-foundations'), status: 'draft' });
const server = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.setHeader('Content-Type', 'application/json');
  if (request.method === 'OPTIONS') { response.writeHead(204).end(); return; }
  const url = new URL(request.url, 'http://localhost');
  cmsRequests.push(url);
  if (url.pathname === '/rest/v1/cms_settings' || url.pathname === '/rest/v1/cms_redirects') {
    response.end('[]'); return;
  }
  if (url.pathname !== '/rest/v1/cms_entries') { response.writeHead(404).end('{}'); return; }
  let result = rows.filter((entry) => entry.status === 'published');
  for (const field of ['kind', 'slug', 'status']) {
    const filter = url.searchParams.get(field);
    if (filter?.startsWith('eq.')) result = result.filter((entry) => entry[field] === filter.slice(3));
  }
  if (request.headers.accept?.includes('vnd.pgrst.object+json')) response.end(JSON.stringify(result[0] || null));
  else response.end(JSON.stringify(result));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
let browser;
let preview;
try {
const child = spawn('npm', ['run', 'build'], {
  shell: true,
  env: { ...process.env, VITE_CMS_PROVIDER: 'supabase', VITE_CMS_ENABLED: 'true', VITE_SUPABASE_URL: `http://127.0.0.1:${port}`,
    VITE_SUPABASE_PUBLISHABLE_KEY: 'mock-publishable-key' },
  stdio: 'inherit',
});
const exitCode = await new Promise((resolve) => child.on('exit', resolve));
assert.equal(exitCode, 0, 'The CMS fixture build must succeed.');

const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
assert.ok(!retiredNames.test(sitemap), 'Stale published products must not enter the CMS sitemap.');
assert.ok(!sitemap.includes('/products</loc>'), 'The removed overview must not appear in the CMS sitemap.');
for (const oldSlug of ['vigilorra-apex', 'orchavon-pulse', 'cirrava-orbit']) {
  assert.ok(!sitemap.includes(`/products/${oldSlug}</loc>`), 'Renamed product URLs must not appear in the CMS sitemap.');
}
for (const slug of retiredSlugs) {
  assert.ok(!fs.existsSync(`dist/products/${slug}/index.html`), `Retired CMS product ${slug} must not be prerendered.`);
}
for (const filename of fs.readdirSync('dist', { recursive: true }).filter((name) => name.endsWith('.html'))) {
  const html = fs.readFileSync(`dist/${filename}`, 'utf8');
  assert.ok(!retiredNames.test(html), `Generated CMS HTML must remove retired names and links: ${filename}`);
  assert.ok(!html.includes('dci-data-center'), `Generated CMS HTML must remove retired imagery: ${filename}`);
}
const homeHtml = fs.readFileSync('dist/index.html', 'utf8');
assert.ok(!homeHtml.includes('CMS_INJECTION_MUST_NOT_REACH_MAIN_WEBSITE'), 'The blog CMS must not replace authored homepage content.');
assert.ok(!homeHtml.includes('A remote CMS must not replace'), 'The blog CMS must not replace authored homepage metadata.');
const productHtml = fs.readFileSync('dist/products/adrs/index.html', 'utf8');
assert.ok(productHtml.includes('ADRS') && sitemap.includes('/products/adrs</loc>'), 'The retained ADRS product must still publish.');
for (const { slug, name } of launchProducts) {
  const route = `/products/${slug}`;
  const html = fs.readFileSync(`dist${route}/index.html`, 'utf8');
  assert.equal(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1], name, `${route} must prerender without a CMS entry.`);
  assert.ok(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].includes(name), `${route} needs its own title.`);
  const canonical = html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]*)"/i)?.[1];
  assert.equal(new URL(canonical).pathname, route);
  assert.ok(sitemap.includes(`${route}</loc>`), `${route} must remain in the CMS-enabled sitemap.`);
  assert.ok(homeHtml.includes(`href="${route}"`), `The CMS homepage must link to ${name}.`);
  assert.ok(!html.includes('data-not-found'), `${route} must not require a CMS product record.`);
  assert.ok(html.includes(`src="/products/${slug}.jpg"`), `${route} must prerender its distinct photograph without a CMS record.`);
}
const notFound = fs.readFileSync('dist/404.html', 'utf8');
assert.ok(notFound.includes('data-not-found'), 'CMS builds must prerender the branded 404.');
assert.ok(/<header\b/.test(notFound) && /<footer\b/.test(notFound), 'The CMS 404 must keep the site navigation and footer.');
assert.ok(/<meta\b(?=[^>]*\bname="robots")[^>]*\bcontent="[^"]*noindex/.test(notFound), 'The CMS 404 must not be indexed.');
assert.ok(!/<link\b[^>]*\brel="canonical"/.test(notFound), 'The CMS 404 must not inherit a canonical URL.');
assert.ok(!notFound.includes('data-cms-error'), 'The 404 must work without a CMS entry.');
assert.ok(!sitemap.includes('/404'), 'The CMS sitemap must exclude the error page.');
const post = fs.readFileSync('dist/blog/energy-ai-asset-intelligence-foundations/index.html', 'utf8');
const draft = rows.find((entry) => entry.status === 'draft');
if (!sitemap.includes('/blog/energy-ai-asset-intelligence-foundations') || sitemap.includes(`/blog/${draft.slug}`)) {
  throw new Error('Sitemap did not filter published/draft content.');
}
if (!post.includes('Building Asset Intelligence for Energy Operations') || !post.includes('Start with an operational question')) {
  throw new Error('Published article was not prerendered with its CMS content.');
}
assert.ok(post.includes('Legacy platforms:') && /href="\/products\/adrs"/.test(post),
  'Sanitization must preserve the shared article and its valid ADRS link.');
if (fs.existsSync(`dist/blog/${draft.slug}/index.html`)) throw new Error('Draft article was prerendered.');
for (const { slug, title, city } of newIndustries) {
  const route = `/industries/${slug}`;
  const html = fs.readFileSync(`dist${route}/index.html`, 'utf8');
  const encodedTitle = title.replaceAll('&', '&amp;');
  assert.equal(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1], `${encodedTitle} AI Solutions | Turbo AI`,
    `${route} must prerender the location-free authored title.`);
  assert.equal(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1], `AI for ${encodedTitle}`,
    `${route} must prerender its own industry heading.`);
  const description = html.match(/<meta\b(?=[^>]*\bname="description")[^>]*\bcontent="([^"]*)"/i)?.[1];
  assert.ok(description?.includes(city), `${route} must prerender its target market in the SEO description.`);
  const canonical = html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]*)"/i)?.[1];
  assert.ok(canonical, `${route} must prerender a canonical URL.`);
  assert.equal(new URL(canonical).pathname, route);
  assert.ok(sitemap.includes(`${route}</loc>`), `${route} must appear in the CMS-generated sitemap.`);
}
// Exercise the runtime menu while the mock CMS remains available.
const previewPort = 4176;
const origin = `http://127.0.0.1:${previewPort}`;
preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(previewPort), '--strictPort'], { stdio: 'ignore' });
let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  try { ready = (await fetch(origin)).ok; } catch { /* Preview is starting. */ }
  if (ready) break;
  await new Promise((resolve) => setTimeout(resolve, 250));
}
assert.ok(ready, 'The CMS preview must start.');
browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setRequestInterception(true);
page.on('request', (request) => {
  const requestOrigin = new URL(request.url()).origin;
  if (requestOrigin === origin || requestOrigin === `http://127.0.0.1:${port}` || request.url().startsWith('data:')) request.continue();
  else request.abort();
});
const waitForRoute = (route) => page.waitForFunction((expected) =>
  window.__TURBOAI_RENDERED_PATH__ === expected && document.querySelector('main h1') &&
  !document.querySelector('[data-route-loading], [data-cms-loading]'), { timeout: 10000 }, route);
await page.goto(origin, { waitUntil: 'domcontentloaded' });
await waitForRoute('/');
await page.click('nav[aria-label="Main navigation"] button[aria-label="Products menu"]');
const links = await page.$$eval('nav[aria-label="Main navigation"] a[href^="/products"]', (nodes) => nodes.map((node) => ({
  name: node.textContent.trim(), href: node.getAttribute('href'),
})));
for (const { slug, name } of launchProducts) {
  assert.ok(links.some((link) => link.name === name && link.href === `/products/${slug}`), `${name} must remain in the CMS-enabled menu without a CMS record.`);
}
assert.ok(links.some((link) => link.href === '/products/adrs'), 'The published ADRS entry must remain in the menu.');
assert.equal(new Set(links.map(({ href }) => href)).size, links.length, 'The Products menu must not contain duplicate links.');
assert.ok(!links.some((link) => link.href === '/products' || link.name === 'All Products'), 'The removed All Products overview must stay out of the CMS-enabled menu.');
await page.click('nav[aria-label="Main navigation"] a[href="/products/interstellar-one"]');
await waitForRoute('/products/interstellar-one');
for (const { slug, name } of launchProducts) {
  const route = `/products/${slug}`;
  await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
  await waitForRoute(route);
  assert.equal(await page.$eval('main h1', (node) => node.textContent.trim()), name);
  assert.equal(new URL(await page.$eval('link[rel="canonical"]', (node) => node.href)).pathname, route);
  assert.equal(await page.$$eval('.lp-capabilities > li', (nodes) => nodes.length), 5, `${name} must retain its five capabilities in CMS mode.`);
  await page.waitForFunction(() => document.querySelector('.lp-hero-photo')?.naturalWidth >= 1200);
  assert.equal(await page.$eval('.lp-hero-photo', (node) => new URL(node.src).pathname), `/products/${slug}.jpg`);
}
await page.goto(`${origin}/products`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => location.pathname === '/' && location.hash === '#our-products');
await waitForRoute('/');
assert.ok(cmsRequests.length > 0, 'The fixture must exercise real blog API requests.');
for (const url of cmsRequests) {
  assert.equal(url.pathname, '/rest/v1/cms_entries', 'Public pages must not request CMS site settings or redirects.');
  assert.equal(url.searchParams.get('kind'), 'eq.blog', 'Every public CMS query must be scoped to blogs.');
}
console.log('Blog CMS mock passed: only published blog records queried, drafts hidden and sitemap filtered; static website ignores CMS page/product records; four corrected product pages, distinct photographs, menu links, capabilities, ADRS and industry SEO remain available; retired products excluded and branded noindex 404 rendered.');
} finally {
  if (browser) await browser.close();
  if (preview?.pid) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(preview.pid), '/f', '/t']);
    else preview.kill();
  }
  await new Promise((resolve) => server.close(resolve));
}
