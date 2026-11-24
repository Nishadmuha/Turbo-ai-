import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import { connectDatabase } from '../server/db.mjs';
import { createApp } from '../server/app.mjs';
import { passwordHash } from '../server/security.mjs';

// This test deliberately ignores MONGODB_URI and never writes to Atlas.
const dbName = `turbo_ai_cms_browser_test_${randomUUID().replaceAll('-', '')}`;
const { db, client } = await connectDatabase('mongodb://127.0.0.1:27017', dbName);
const uploadDir = await mkdtemp(path.join(os.tmpdir(), 'turbo-cms-browser-'));
const origin = 'http://127.0.0.1:5178';
let testBuildRuns = 0;
// Exercise the refresh UI lifecycle without replacing the developer's current build.
const app = await createApp({ db, uploadDir, origins: [origin], secure: false, allowLocalBuild: true, runBuild: async () => { testBuildRuns += 1; } });
const api = app.listen(0, '127.0.0.1');
await once(api, 'listening');
process.env.VITE_CMS_PROVIDER = 'mongodb';
process.env.VITE_CMS_ENABLED = 'true';
process.env.VITE_CMS_API_URL = '/api/cms';
let vite;
let browser;
let visitor;
let cmsOffline = false;
const publicCmsRequests = [];
try {
  const password = randomUUID() + '-temporary';
  await db.collection('cms_users').insertOne({ id: randomUUID(), email: 'cms-browser-admin@example.test', role: 'admin', passwordHash: await passwordHash(password), disabled: false });
  vite = await createServer({ envFile: false, server: { host: '127.0.0.1', port: 5178, strictPort: true, hmr: false, watch: null, proxy: { '/api/cms': { target: `http://127.0.0.1:${api.address().port}`, changeOrigin: false } } } });
  await vite.listen();
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  visitor = await browser.newPage();
  await visitor.setViewport({ width: 1440, height: 1100 });
  visitor.on('pageerror', error => errors.push(error.message));
  visitor.on('console', async message => {
    if (message.type() === 'error' && message.text().includes('ErrorBoundary caught')) {
      const error = await message.args()[1]?.evaluate(value => String(value?.stack || value));
      errors.push(error || message.text());
      console.error('Public rendering error:', error);
    }
  });
  for (const tab of [page, visitor]) {
    tab.setDefaultTimeout(15000);
    await tab.setRequestInterception(true);
    tab.on('request', request => {
      const target = request.url();
      if (tab === visitor && target.includes('/api/cms/')) publicCmsRequests.push(target);
      if (tab === visitor && cmsOffline && target.includes('/api/cms/')) void request.abort();
      else if (/^https?:/.test(target) && new URL(target).origin !== origin) void request.abort();
      else void request.continue();
    });
  }
  async function fill(labelText, value) {
    await page.bringToFront();
    const handle = await page.evaluateHandle(text => [...document.querySelectorAll('label')].find(label => label.firstChild?.textContent.trim() === text)?.querySelector('input,textarea,select'), labelText);
    const input = handle.asElement();
    assert.ok(input, `Missing form field: ${labelText}`);
    if (await input.evaluate(element => element.tagName === 'SELECT')) await input.select(value);
    else { await input.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' })); await input.click({ clickCount: 3 }); await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control'); await input.type(value); }
    await handle.dispose();
  }
  async function button(text) {
    await page.bringToFront();
    const handle = await page.evaluateHandle(text => [...document.querySelectorAll('button')].find(button => button.textContent.trim() === text), text);
    const element = handle.asElement(); assert.ok(element, `Missing button: ${text}`);
    await element.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
    const saved = text === 'Save draft' || text === 'Save & publish' ? page.waitForResponse(response => response.url().includes('/api/cms/admin/entries') && ['POST', 'PUT'].includes(response.request().method())) : null;
    await element.click(); await handle.dispose();
    if (saved) { const response = await saved; assert.ok(response.ok(), `Save failed: ${response.status()} ${await response.text()}`); }
  }
  await page.goto(`${origin}/admin/login`, { waitUntil: 'networkidle0' });
  console.log('CMS browser: signing in to isolated local test database.');
  await fill('Email', 'cms-browser-admin@example.test'); await fill('Password', password); await button('Sign in');
  await page.waitForFunction(() => location.pathname === '/admin/dashboard');
  await page.waitForSelector('.admin-workflow');
  for (const section of ['pages', 'products', 'industries', 'solutions']) assert.equal(await page.$(`nav[aria-label="Admin"] a[href="/admin/${section}"]`), null, `${section} must not be editable in the blog CMS.`);
  await page.goto(`${origin}/admin/products/new`, { waitUntil: 'networkidle0' });
  assert.equal(await page.$('form input[required]'), null, 'A direct product editor URL must not expose an editor.');
  console.log('CMS browser: creating a blog draft in the editor.');
  await page.goto(`${origin}/admin/blog/new`, { waitUntil: 'networkidle0' });
  await fill('Title', 'A practical enterprise AI update');
  await fill('Slug', 'cms-browser-article');
  await fill('Excerpt', 'An editable blog description from the SEO workspace.');
  await fill('Featured image URL', '/products/interstellar-one.jpg');
  await fill('Article (Markdown)', '## A useful update\n\nThis article was written and published through the blog CMS.');
  await fill('Author', 'Turbo AI editorial team');
  await fill('SEO title', 'Blog CMS SEO test');
  await fill('SEO description', 'Search metadata saved by the SEO team in MongoDB.');
  assert.equal(await page.$eval('.admin-search-title', element => element.textContent), 'Blog CMS SEO test');
  await button('Save draft');
  await page.waitForFunction(() => /\/admin\/blog\/[a-f0-9-]+$/.test(location.pathname));
  await page.waitForFunction(() => document.body.textContent.includes('All changes saved'));
  const editorUrl = page.url();
  const recordId = new URL(editorUrl).pathname.split('/').pop();
  const stored = await db.collection('cms_entries').findOne({ id: recordId });
  assert.equal(stored.status, 'draft');
  assert.equal(stored.kind, 'blog');
  assert.equal(stored.seo_title, 'Blog CMS SEO test');
  console.log('CMS browser: checking draft isolation and publishing.');
  await visitor.bringToFront();
  await visitor.goto(`${origin}/blog/cms-browser-article`, { waitUntil: 'networkidle0' });
  await visitor.waitForSelector('[data-not-found]');
  assert.equal(await visitor.$eval('h1', element => element.textContent), 'Page not found');
  await visitor.goto(`${origin}/blog/this-blog-does-not-exist`, { waitUntil: 'networkidle0' });
  await visitor.waitForSelector('[data-not-found]');
  assert.equal(await visitor.$eval('h1', element => element.textContent), 'Page not found', 'A healthy API must distinguish a missing blog from an outage.');
  await fill('Status', 'published'); await button('Save & publish');
  await page.waitForFunction(() => document.body.textContent.includes('Published changes saved.'));
  await visitor.bringToFront();
  await visitor.goto(`${origin}/blog/cms-browser-article`, { waitUntil: 'networkidle0' });
  await visitor.waitForSelector('main article');
  console.log('CMS browser: published article rendered; checking metadata.');
  await visitor.waitForSelector('meta[name="description"]');
  assert.equal(await visitor.$eval('h1', element => element.textContent), 'A practical enterprise AI update');
  assert.ok((await visitor.title()).includes('Blog CMS SEO test'));
  assert.ok(await visitor.$eval('article', element => element.textContent.includes('This article was written and published through the blog CMS.')));
  assert.equal(await visitor.$eval('meta[name="description"]', element => element.content), 'Search metadata saved by the SEO team in MongoDB.');
  await fill('Title', 'Updated enterprise AI article');
  await fill('Excerpt', 'The SEO team updated this article description.');
  await fill('Article (Markdown)', '## An updated article\n\nThe published article body can be edited without changing website pages.');
  await fill('SEO title', 'Updated by the SEO team'); await button('Save & publish');
  await page.waitForFunction(() => document.body.textContent.includes('Published changes saved.'));
  await visitor.bringToFront();
  await visitor.reload({ waitUntil: 'networkidle0' });
  await visitor.waitForFunction(() => document.title.includes('Updated by the SEO team'));
  assert.equal(await visitor.$eval('main h1', element => element.textContent), 'Updated enterprise AI article');
  assert.ok(await visitor.$eval('article', element => element.textContent.includes('The published article body can be edited without changing website pages.')));
  await visitor.goto(`${origin}/blog`, { waitUntil: 'networkidle0' });
  await visitor.waitForSelector('a[href="/blog/cms-browser-article"]');
  assert.ok(await visitor.$eval('main', element => element.textContent.includes('The SEO team updated this article description.')));
  await visitor.goto(`${origin}/blog/cms-browser-article`, { waitUntil: 'networkidle0' });
  await page.bringToFront();
  await page.goto(`${origin}/admin/settings`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Refresh blog search pages' && !button.disabled));
  await button('Refresh blog search pages');
  await page.waitForFunction(() => document.body.textContent.includes('Local site files refreshed.'));
  assert.equal(testBuildRuns, 1, 'Refresh action must start exactly one server-side refresh.');
  await page.goto(`${origin}/admin/team`, { waitUntil: 'networkidle0' });
  console.log('CMS browser: creating and verifying the editor role.');
  const editorPassword = randomUUID() + '-temporary-editor';
  await fill('Email', 'cms-browser-editor@example.test'); await fill('Password', editorPassword); await button('Create account');
  await page.waitForFunction(() => document.body.textContent.includes('Team account created.'));
  await button('Log out');
  await page.waitForFunction(() => location.pathname === '/admin/login');
  await fill('Email', 'cms-browser-editor@example.test'); await fill('Password', editorPassword); await button('Sign in');
  await page.waitForFunction(() => location.pathname === '/admin/dashboard');
  await page.waitForSelector('.admin-workflow');
  assert.equal(await page.$('nav[aria-label="Admin"] a[href="/admin/team"]'), null);
  assert.equal(await page.$('nav[aria-label="Admin"] a[href="/admin/settings"]'), null);
  const denied = await page.evaluate(async () => (await fetch('/api/cms/admin/team')).status);
  assert.equal(denied, 403);
  await page.goto(editorUrl, { waitUntil: 'networkidle0' });
  await fill('SEO description', 'An editor can update SEO without administrator privileges.'); await button('Save & publish');
  await page.waitForFunction(() => document.body.textContent.includes('Published changes saved.'));
  await visitor.bringToFront();
  await visitor.reload({ waitUntil: 'networkidle0' });
  await visitor.waitForFunction(() => document.querySelector('meta[name="description"]')?.content === 'An editor can update SEO without administrator privileges.');
  await page.setViewport({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'CMS editor must fit a narrow mobile viewport.');
  await button('Log out');
  await page.waitForFunction(() => location.pathname === '/admin/login');
  assert.equal((await page.evaluate(async () => fetch('/api/cms/admin/stats').then(response => response.status))), 401);
  console.log('CMS browser: verifying the website with the CMS completely unavailable.');
  cmsOffline = true;
  await visitor.bringToFront();
  publicCmsRequests.length = 0;
  for (const [route, expectedHeading] of [
    ['/', null], ['/about', null], ['/ai-engineering-software-development', null], ['/products/interstellar-one', 'INTERSTELLAR ONE'],
    ['/products/spectra-plus', 'SPECTRA PLUS'], ['/products/quantum-apex', 'QUANTUM APEX'],
    ['/products/orbit-core', 'ORBIT CORE'], ['/products/adrs', null], ['/industries/mining', 'AI for Mining'],
  ]) {
    console.log(`CMS offline check: ${route}`);
    await visitor.goto(`${origin}${route}`, { waitUntil: 'networkidle0' });
    await visitor.waitForSelector('main h1');
    assert.equal(await visitor.$('[data-cms-error], [data-not-found]'), null, `${route} must work without the CMS.`);
    const heading = await visitor.$eval('main h1', node => node.textContent.trim());
    assert.ok(heading && heading !== 'Content temporarily unavailable', `${route} must show authored content.`);
    if (expectedHeading) assert.equal(heading, expectedHeading);
    assert.ok(await visitor.title(), `${route} must retain its SEO title without the CMS.`);
    assert.ok(await visitor.$eval('meta[name="description"]', node => node.content.trim()), `${route} must retain its SEO description without the CMS.`);
    assert.equal(new URL(await visitor.$eval('link[rel="canonical"]', node => node.href)).pathname, route, `${route} must retain its canonical URL.`);
    if (route === '/') {
      assert.equal(await visitor.$$eval('#our-products .product-ecosystem-card', nodes => nodes.length), 6);
      await visitor.click('nav[aria-label="Main navigation"] button[aria-label="Products menu"]');
      for (const slug of ['interstellar-one', 'spectra-plus', 'quantum-apex', 'orbit-core', 'adrs']) assert.ok(await visitor.$(`nav[aria-label="Main navigation"] a[href="/products/${slug}"]`), `${slug} must stay in navigation during a CMS outage.`);
      assert.equal(await visitor.$('nav[aria-label="Main navigation"] a[href="/products"]'), null);
    }
  }
  assert.deepEqual(publicCmsRequests, [], 'Non-blog website routes must not depend on any CMS API request.');
  await visitor.goto(`${origin}/blog/cms-browser-article`, { waitUntil: 'networkidle0' });
  await visitor.waitForSelector('[data-cms-error]');
  assert.equal(await visitor.$('[data-not-found]'), null, 'A blog API outage must not be presented as a missing page.');
  assert.ok(await visitor.$$eval('button', nodes => nodes.some(node => /retry|try again/i.test(node.textContent))), 'Blog article outage must offer retry.');
  cmsOffline = false;
  const retryArticle = await visitor.evaluateHandle(() => [...document.querySelectorAll('button')].find(node => /retry|try again/i.test(node.textContent)));
  await retryArticle.asElement().click(); await retryArticle.dispose();
  await visitor.waitForSelector('main article');
  assert.equal(await visitor.$eval('main h1', node => node.textContent), 'Updated enterprise AI article');
  cmsOffline = true;
  await visitor.goto(`${origin}/blog`, { waitUntil: 'networkidle0' });
  await visitor.waitForSelector('[role="alert"]');
  assert.ok(await visitor.$eval('main h1', node => /Insights/.test(node.textContent)), 'The blog index must keep its page heading during an outage.');
  assert.ok(await visitor.$$eval('button', nodes => nodes.some(node => /retry|try again/i.test(node.textContent))), 'Blog outage must offer retry.');
  cmsOffline = false;
  const retry = await visitor.evaluateHandle(() => [...document.querySelectorAll('button')].find(node => /retry|try again/i.test(node.textContent)));
  await retry.asElement().click(); await retry.dispose();
  await visitor.waitForSelector('a[href="/blog/cms-browser-article"]');
  assert.ok(publicCmsRequests.every(target => !/\/entries\/(page|product|industry|solution)\//.test(target) && !/[?&]kind=(page|product|industry|solution)/.test(target)), 'Only blog records may be requested publicly.');
  assert.deepEqual(errors, [], 'CMS workflow must have no uncaught browser errors.');
  console.log('Blog CMS browser workflow passed: real local MongoDB, blog-only editor, draft isolation, publication and SEO edits, editor permissions, refresh, mobile, logout, all main pages/products working with CMS offline, and blog retry recovery. Atlas was not used.');
} catch (error) {
  if (visitor && !visitor.isClosed()) console.error('Public page diagnostic:', await visitor.evaluate(() => ({ url: location.href, metadata: [...document.head.querySelectorAll('title,meta,link[rel="canonical"],script[type="application/ld+json"]')].map(element => element.outerHTML), heading: document.querySelector('h1')?.textContent })).catch(() => 'Page closed'));
  console.error('Stored blog diagnostic:', await db.collection('cms_entries').find({}, { projection: { _id: 0, title: 1, status: 1, seo_title: 1, seo_description: 1 } }).toArray());
  throw error;
} finally {
  if (browser) await browser.close();
  if (vite) await vite.close();
  await new Promise(resolve => api.close(resolve));
  if (!db.databaseName.startsWith('turbo_ai_cms_browser_test_')) throw new Error('Refusing to delete a non-test database.');
  await db.dropDatabase(); await client.close();
  if (!path.resolve(uploadDir).startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(uploadDir).startsWith('turbo-cms-browser-')) throw new Error('Unexpected temporary upload directory.');
  await rm(uploadDir, { recursive: true, force: true });
}
