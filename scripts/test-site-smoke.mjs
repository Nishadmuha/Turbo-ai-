import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { loadEnv } from 'vite';

const port = 4174;
const baseUrl = (loadEnv('production', process.cwd(), 'VITE_').VITE_BASE_URL || 'https://turbo-ai.ca').replace(/\/$/, '');
const retiredRoutes = ['/products/i-lakehouse', '/products/ilakehouse', '/products/dci-360', '/products/dci360'];
const retiredNames = /i[-_\s]?lakehouse|dci[-_\s]?360/i;
const launchProducts = [
  { slug: 'interstellar-one', name: 'INTERSTELLAR ONE', category: 'Enterprise Data Intelligence & AI Analytics' },
  { slug: 'spectra-plus', name: 'SPECTRA PLUS', category: 'Cybersecurity, Threat Detection & Risk Management' },
  { slug: 'quantum-apex', name: 'QUANTUM APEX', category: 'Agentic AI & Intelligent Workflow Automation' },
  { slug: 'orbit-core', name: 'ORBIT CORE', category: 'Cloud Infrastructure Management & Cost Optimization' },
];
const launchRoutes = launchProducts.map(({ slug }) => `/products/${slug}`);
const showcaseProducts = [
  ...launchProducts.map(({ name, slug }) => ({ name, href: `/products/${slug}` })),
  { name: 'ADRS', href: '/products/adrs' },
  { name: 'SEISMIC AI', href: 'https://seismicai.ca' },
];
const renamedRoutes = [
  ['/products/vigilorra-apex', '/products/spectra-plus'],
  ['/products/orchavon-pulse', '/products/quantum-apex'],
  ['/products/cirrava-orbit', '/products/orbit-core'],
];
const productImageHashes = launchProducts.map(({ slug }) => {
  const image = readFileSync(path.resolve('public', 'products', `${slug}.jpg`));
  assert.equal(image.subarray(0, 2).toString('hex'), 'ffd8', `${slug} must use a real JPEG asset.`);
  return createHash('sha256').update(image).digest('hex');
});
assert.equal(new Set(productImageHashes).size, launchProducts.length, 'Every product must have a different photograph.');
const industries = [
  { label: 'Financial Services', slug: 'financial-services' },
  { label: 'Insurance', slug: 'insurance' },
  { label: 'Healthcare', slug: 'healthcare' },
  { label: 'Manufacturing', slug: 'manufacturing' },
  { label: 'Construction', slug: 'construction' },
  { label: 'Automotive & Mobility', slug: 'automotive-mobility' },
  { label: 'Mining', slug: 'mining', city: 'Saskatoon' },
  { label: 'Real Estate', slug: 'real-estate', city: 'Toronto' },
  { label: 'Oil & Gas', slug: 'oil-and-gas', city: 'Calgary' },
  { label: 'Retail', slug: 'retail' },
  { label: 'Supply Chain & Logistics', slug: 'supply-chain-logistics' },
  { label: 'Telecommunications', slug: 'telecommunications' },
  { label: 'Utilities', slug: 'utilities' },
  { label: 'Government', slug: 'government' },
  { label: 'Defence & Intelligence', slug: 'defence-intelligence' },
  { label: 'Semiconductors', slug: 'semiconductors' },
  { label: 'Technology & SaaS', slug: 'technology-saas' },
  { label: 'Data Centres', slug: 'data-centres' },
];
const industryLinks = industries.map(({ label, slug }) => ({ label, href: `/industries/${slug}` }));
const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { shell: true, stdio: 'ignore' });
let browser;
let profileDirectory;
let testFailure;
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { const response = await fetch(`http://127.0.0.1:${port}/`); ready = response.ok; } catch { /* wait for preview */ }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Preview server did not start.');
  // Own the isolated profile so Windows can retry transient locked-file cleanup
  // after Chromium exits instead of masking an assertion inside browser.close().
  profileDirectory = await mkdtemp(path.join(os.tmpdir(), 'turbo-ai-smoke-'));
  browser = await puppeteer.launch({ headless: true, userDataDir: profileDirectory, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  const waitForRoute = (route) => page.waitForFunction((expectedPath) =>
    window.__TURBOAI_RENDERED_PATH__ === expectedPath &&
    document.querySelector('main h1') &&
    !document.querySelector('[data-route-loading], [data-cms-loading]'),
    { timeout: 10000 }, route);
  // Keyboard focus uses the site's smooth scrolling. Finish that movement before
  // sending a real pointer click so the intended control is under the cursor.
  const clickControl = async (selector) => {
    await page.$eval(selector, (node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction((target) => {
      const node = document.querySelector(target);
      const rect = node?.getBoundingClientRect();
      return rect && node.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
    }, {}, selector);
    await page.click(selector);
  };
  const routes = ['/', '/about', '/products/adrs',
    ...launchRoutes,
    '/enterprise-ai-solutions', '/blog', '/blog/energy-ai-asset-intelligence-foundations',
    ...industryLinks.map(({ href }) => href)];
  const heroAnimationSignatures = [];
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded' });
    await waitForRoute(route);
    const heading = await page.$eval('main h1', (node) => node.textContent.trim());
    if (!heading) throw new Error(`${route} has no heading.`);
    assert.equal(await page.$('nav[aria-label*="breadcrumb" i], .lp-breadcrumb, [data-breadcrumb]'), null,
      `${route} must not show a breadcrumb trail.`);
    assert.equal(await page.$('.lp-motion-toggle'), null, `${route} must not show an animation pause control.`);
    assert.equal(await page.$$eval('button, [role="button"]', nodes => nodes.some(node =>
      /\b(?:pause|resume)\s+animations?\b/i.test(`${node.textContent} ${node.getAttribute('aria-label') || ''}`))), false,
    `${route} must not expose pause/resume animation controls.`);
    assert.equal(await page.$$eval('head title', nodes => nodes.length), 1, `${route} must have exactly one title.`);
    assert.equal(await page.$$eval('head meta[name="description"]', nodes => nodes.length), 1, `${route} must retain one current SEO description.`);
    assert.equal(await page.$$eval('head link[rel="canonical"]', nodes => nodes.length), 1, `${route} must retain one current canonical URL.`);
    const industry = industries.find(({ slug }) => route === `/industries/${slug}`);
    if (industry) assert.equal(heading, `AI for ${industry.label}`, `${route} must render its own industry page.`);
    const product = launchProducts.find(({ slug }) => route === `/products/${slug}`);
    if (product) {
      assert.equal(heading, product.name, `${route} must render its own product heading.`);
      assert.equal(await page.$eval('link[rel="canonical"]', (node) => node.href), `${baseUrl}${route}`);
      assert.ok((await page.title()).includes(product.name), `${route} needs product-specific metadata.`);
      assert.equal(await page.$$eval('.lp-capabilities > li', (items) => items.length), 5, `${route} must show all five supplied capabilities.`);
      assert.ok(await page.$('main a[href="#connect"]') && await page.$('#connect'), `${route} needs a working contact destination.`);
      assert.equal(await page.$eval('.lp-hero-copy .lp-category', (node) => node.textContent.trim()), product.category,
        `${route} must use the corrected product category.`);
      await page.waitForFunction(() => {
        const photo = document.querySelector('.lp-hero-photo');
        return photo?.complete && photo.naturalWidth >= 1200 && photo.naturalHeight >= 700;
      });
      const photo = await page.$eval('.lp-hero-photo', (node) => ({ src: new URL(node.src).pathname, alt: node.alt }));
      assert.equal(photo.src, `/products/${product.slug}.jpg`, `${route} must show its own photograph.`);
      assert.ok(photo.alt.length > 15, `${route} needs descriptive image alt text.`);
      assert.equal(await page.$('.lp-photo-frame'), null, `${route} must not retain a boxed side photograph.`);
      assert.ok(await page.$eval('.lp-hero-photo', node => {
        const photo = node.getBoundingClientRect();
        const hero = node.closest('.lp-photo-hero').getBoundingClientRect();
        return photo.left <= hero.left + 2 && photo.right >= hero.right - 2 && photo.top <= hero.top + 2 && photo.bottom >= hero.bottom - 2;
      }), `${route} photograph must cover the entire hero background.`);
      const animationNames = await page.$eval('.lp-photo-hero', hero => [...new Set(hero.getAnimations({ subtree: true })
        .filter(animation => animation instanceof CSSAnimation && animation.effect.getTiming().iterations === Infinity)
        .map(animation => animation.animationName))].sort());
      assert.ok(animationNames.length, `${route} needs a continuous product animation.`);
      heroAnimationSignatures.push(animationNames.join(','));
      assert.ok(await page.$eval('.lp-photo-hero', hero => hero.getAnimations({ subtree: true })
        .some(animation => animation instanceof CSSAnimation && animation.effect.getTiming().iterations === Infinity && animation.playState === 'running')),
      `${route} must keep its product animations running without pause controls.`);
      const tab = '.lp-workflow-track [role="tab"]';
      assert.equal(await page.$$eval(tab, (nodes) => nodes.length), 4, `${route} needs four implementation stages.`);
      await page.focus(`${tab}[aria-selected="true"]`);
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.$eval(`${tab}[aria-selected="true"]`, (node) => node.id), 'step-1');
      assert.equal(await page.$eval('#workflow-panel', (node) => node.getAttribute('aria-labelledby')), 'step-1');
      await page.keyboard.press('End');
      assert.equal(await page.$eval(`${tab}[aria-selected="true"]`, (node) => node.id), 'step-3');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.$eval(`${tab}[aria-selected="true"]`, (node) => node.id), 'step-0');
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.$eval(`${tab}[aria-selected="true"]`, (node) => node.id), 'step-3');
      await page.keyboard.press('Home');
      assert.equal(await page.$eval(`${tab}[aria-selected="true"]`, (node) => node.id), 'step-0');
      await clickControl(`${tab}:nth-child(3)`);
      await page.waitForFunction(() => document.querySelector('#step-2')?.getAttribute('aria-selected') === 'true');
      assert.equal(await page.$eval('#workflow-panel strong', (node) => node.textContent.trim()),
        await page.$eval(`${tab}:nth-child(3)`, (node) => node.textContent.trim()), 'Selecting a stage must update its visible panel.');
      const detail = '.lp-capabilities li:first-child details';
      assert.equal(await page.$eval(detail, (node) => node.open), true);
      await clickControl(`${detail} summary`);
      assert.equal(await page.$eval(detail, (node) => node.open), false, 'Capabilities must collapse on request.');
      await page.focus(`${detail} summary`);
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval(detail, (node) => node.open), true, 'Capabilities must reopen from the keyboard.');
    }
  }
  assert.equal(new Set(heroAnimationSignatures).size, launchProducts.length, 'Each product hero must have its own animation pattern.');

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await waitForRoute('/');
  assert.deepEqual(await page.$$eval('#our-products .product-ecosystem-card', (links) => links.map((link) => ({
    name: link.querySelector('.product-ecosystem-name').textContent.trim(), href: link.getAttribute('href'),
  }))), showcaseProducts, 'The homepage ecosystem must list all six products with uppercase SEISMIC AI last.');
  assert.equal(await page.$('#our-products .lp-card, #our-products .lp-motion-toggle'), null, 'The former large product showcase must be removed.');
  assert.equal(await page.$$eval('#hero a', links => links.some(link => link.textContent.includes('Explore Our New Products'))), false,
    'The highlighted new-products button must be removed from the home hero.');
  assert.ok(await page.$('#hero a[aria-label="See our impact and case studies"]'), 'The existing home hero impact link must remain.');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const route of ['/', ...launchRoutes]) {
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded' });
    await waitForRoute(route);
    assert.equal(await page.$$eval('.lp-surface, #our-products', (surfaces) => surfaces.flatMap((surface) => surface.getAnimations({ subtree: true }))
      .filter((animation) => animation instanceof CSSAnimation && animation.playState === 'running').length), 0,
    `${route} must respect reduced motion.`);
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  for (const route of retiredRoutes) {
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded' });
    await waitForRoute(route);
    assert.equal(await page.title(), 'Page not found | Turbo AI', `${route} must render the error title.`);
    assert.ok(await page.$('main[data-not-found]'), `${route} must render the branded error page.`);
    assert.ok(await page.$('header nav[aria-label="Main navigation"]') && await page.$('footer'),
      `${route} must keep the site navigation and footer.`);
    assert.ok((await page.$eval('meta[name="robots"]', (node) => node.content)).includes('noindex'),
      `${route} must not be indexed.`);
    assert.equal(await page.$('link[rel="canonical"]'), null, `${route} must not inherit a valid page canonical.`);
    assert.ok(!retiredNames.test(await page.content()), `${route} must not expose retired product names or links.`);
    assert.ok(!existsSync(path.resolve('dist', route.slice(1), 'index.html')), `${route} must not have generated product HTML.`);
  }

  // Check the actual dropdown content and one navigation action at both breakpoints.
  const checkProductMenu = async (navigation) => {
    const trigger = `nav[aria-label="${navigation}"] button[aria-label="Products menu"]`;
    await page.waitForSelector(trigger, { visible: true });
    if (navigation === 'Main navigation') await page.hover(trigger);
    else await page.click(trigger);
    await page.waitForSelector(`${trigger}[aria-expanded="true"]`);
    const links = await page.$eval(trigger, button => [...button.parentElement.querySelectorAll('a')]
      .map(link => ({ name: link.textContent.trim(), href: link.getAttribute('href') })));
    assert.deepEqual(links, showcaseProducts, `${navigation} must list all six products with uppercase SEISMIC AI last.`);
    if (navigation === 'Mobile navigation') {
      await page.click(trigger);
      await page.waitForSelector(`${trigger}[aria-expanded="false"]`);
    }
  };
  const checkIndustryMenu = async (navigation) => {
    const trigger = `nav[aria-label="${navigation}"] button[aria-label="Industries We Serve menu"]`;
    await page.waitForSelector(trigger, { visible: true });
    if (navigation === 'Main navigation') await page.hover(trigger);
    else await page.click(trigger);
    await page.waitForSelector(`${trigger}[aria-expanded="true"]`);
    const links = await page.$eval(trigger, (button) => [...button.parentElement.querySelectorAll('a[href^="/industries/"]')]
      .map((link) => ({ label: link.textContent.trim(), href: link.getAttribute('href') })));
    assert.deepEqual(links, industryLinks, `${navigation} must list all 18 industry pages in the requested order.`);
    assert.ok(await page.$eval(trigger, (button) => !!button.parentElement.querySelector('a[href="/industries-we-serve"]')),
      `${navigation} needs a link to the industry overview.`);
  };
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await waitForRoute('/');
  await checkProductMenu('Main navigation');
  assert.equal(await page.$$eval('nav[aria-label="Main navigation"] a', (links) => links.some((link) => link.textContent.trim() === 'All Products')), false,
    'The Products menu must no longer include All Products.');
  assert.equal(await page.$('nav[aria-label="Main navigation"] a[href="/products"]'), null,
    'The Products menu must not link to the removed overview.');
  await page.mouse.move(10, 850);
  await checkIndustryMenu('Main navigation');
  const desktopIndustryTrigger = 'nav[aria-label="Main navigation"] button[aria-label="Industries We Serve menu"]';
  const hoverBridge = await page.$eval(desktopIndustryTrigger, (button) => {
    const rect = button.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.bottom + 8 };
  });
  await page.mouse.move(hoverBridge.x, hoverBridge.y);
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert.equal(await page.$eval(desktopIndustryTrigger, (button) => button.getAttribute('aria-expanded')), 'true',
    'The industry menu must stay open while moving slowly through the gap below its label.');
  await page.hover('nav[aria-label="Main navigation"] a[href="/industries/mining"]');
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert.equal(await page.$eval(desktopIndustryTrigger, (button) => button.getAttribute('aria-expanded')), 'true',
    'The industry menu must stay open while hovering its links.');
  await page.mouse.move(10, 850);
  await page.waitForSelector(`${desktopIndustryTrigger}[aria-expanded="false"]`);
  await page.focus(desktopIndustryTrigger);
  await page.keyboard.press('ArrowDown');
  await page.waitForSelector(`${desktopIndustryTrigger}[aria-expanded="true"]`);
  await page.keyboard.press('Escape');
  await page.waitForSelector(`${desktopIndustryTrigger}[aria-expanded="false"]`);
  await page.hover(desktopIndustryTrigger);
  await page.waitForSelector(`${desktopIndustryTrigger}[aria-expanded="true"]`);
  await page.click('nav[aria-label="Main navigation"] a[href="/industries/mining"]');
  await page.waitForFunction(() => location.pathname === '/industries/mining' && document.querySelector('main h1')?.textContent === 'AI for Mining');

  // Disable JavaScript to ensure the new landing pages and SEO metadata are prerendered.
  const staticPage = await browser.newPage();
  await staticPage.setJavaScriptEnabled(false);
  const sitemap = readFileSync(path.resolve('dist', 'sitemap.xml'), 'utf8');
  assert.ok(!retiredNames.test(sitemap), 'The generated sitemap must exclude retired products.');
  assert.ok(!retiredNames.test(readFileSync(path.resolve('public', 'sitemap.xml'), 'utf8')),
    'The public sitemap must exclude retired products.');
  for (const directory of ['public', 'dist']) {
    for (const filename of readdirSync(directory, { recursive: true }).filter((name) => name.endsWith('.html'))) {
      assert.ok(!retiredNames.test(readFileSync(path.resolve(directory, filename), 'utf8')),
        `${directory}/${filename} must not contain retired product names or links.`);
    }
  }
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  const publicUrls = [...readFileSync(path.resolve('public', 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]));
  assert.deepEqual(sitemapUrls.map((url) => url.pathname).sort(), publicUrls.map((url) => url.pathname).sort(),
    'The public and generated sitemaps must include the same authored pages.');
  assert.equal(new Set(sitemapUrls.map((url) => url.href)).size, sitemapUrls.length, 'Sitemap URLs must be unique.');
  for (const url of sitemapUrls) {
    assert.equal(url.origin, new URL(baseUrl).origin);
    assert.ok(!url.hash && !url.search, `Sitemap must contain clean URLs: ${url}`);
    assert.ok(!['/404', '/404.html', '/products', ...renamedRoutes.map(([old]) => old), '/industries', '/index.php', '/offshore-development'].includes(url.pathname) && !url.pathname.startsWith('/admin'),
      `Sitemap must exclude errors, administration, and redirected URLs: ${url}`);
    const filename = url.pathname === '/image-credits' ? 'image-credits.html' : `${url.pathname.slice(1)}${url.pathname === '/' ? '' : '/'}index.html`;
    assert.ok(existsSync(path.resolve('dist', filename)), `Sitemap points to missing generated content: ${url}`);
  }
  for (const width of [1440, 390]) {
    await staticPage.setViewport({ width, height: 900 });
    for (const route of ['/']) {
      const filePath = route === '/' ? '/index.html' : `${route}/index.html`;
      await staticPage.goto(`http://127.0.0.1:${port}${filePath}`, { waitUntil: 'domcontentloaded' });
      const cards = await staticPage.$$eval('#our-products .product-ecosystem-card', (nodes) => nodes.map((node) => {
        let visible = node.getBoundingClientRect().height > 0;
        for (let element = node; element; element = element.parentElement) {
          const style = getComputedStyle(element);
          visible = visible && Number(style.opacity) > 0 && style.visibility === 'visible' && style.display !== 'none';
        }
        return { name: node.querySelector('.product-ecosystem-name')?.textContent.trim(), visible };
      }));
      assert.deepEqual(cards.map(({ name }) => name), showcaseProducts.map(({ name }) => name));
      assert.ok(cards.every(({ visible }) => visible), `${route} product ecosystem links must remain visible without JavaScript at ${width}px.`);
    }
  }
  for (const { slug, name } of launchProducts) {
    const route = `/products/${slug}`;
    await staticPage.goto(`http://127.0.0.1:${port}${route}/index.html`, { waitUntil: 'domcontentloaded' });
    assert.equal(await staticPage.$eval('main h1', (node) => node.textContent.trim()), name);
    assert.equal(await staticPage.$eval('link[rel="canonical"]', (node) => node.href), `${baseUrl}${route}`);
    assert.equal(await staticPage.$$eval('.lp-capabilities > li', (items) => items.length), 5);
    assert.equal(await staticPage.$eval('.lp-hero-photo', (node) => new URL(node.src).pathname), `/products/${slug}.jpg`);
    assert.equal(await staticPage.$$eval('.lp-capabilities details[open]', (items) => items.length), 5,
      'All capability content must be readable before JavaScript runs.');
  }
  for (const industry of industries.filter(({ city }) => city)) {
    const route = `/industries/${industry.slug}`;
    assert.ok(existsSync(path.resolve('dist', route.slice(1), 'index.html')), `${route} is missing its prerendered HTML.`);
    assert.ok(sitemap.includes(`<loc>${baseUrl}${route}</loc>`), `${route} is missing from the generated sitemap.`);
    // Vite preview uses its SPA fallback for extensionless paths; read the generated file explicitly.
    await staticPage.goto(`http://127.0.0.1:${port}${route}/index.html`, { waitUntil: 'domcontentloaded' });
    assert.equal(await staticPage.title(), `${industry.label} AI Solutions | Turbo AI`);
    assert.equal(await staticPage.$eval('main h1', (node) => node.textContent.trim()), `AI for ${industry.label}`);
    assert.equal(await staticPage.$eval('link[rel="canonical"]', (node) => node.href), `${baseUrl}${route}`);
    const description = await staticPage.$eval('meta[name="description"]', (node) => node.content);
    assert.ok(description.includes(industry.city), `${route} must describe its target market.`);
    const content = await staticPage.$eval('main', (node) => node.textContent);
    assert.ok(content.includes(industry.city), `${route} must include its target market in visible page content.`);
    const relatedLinks = await staticPage.$$eval('nav[aria-label="Related services and products"] a',
      (links) => links.map((link) => link.getAttribute('href')));
    assert.ok(relatedLinks.length > 0, `${route} must link to related capabilities.`);
    for (const href of relatedLinks) {
      assert.ok(existsSync(path.resolve('dist', href.replace(/^\//, ''), 'index.html')), `${route} links to a missing page: ${href}`);
    }
    assert.ok(await staticPage.$('main a[href="#connect"]'), `${route} needs a contact call to action.`);
    assert.ok(await staticPage.$('#connect'), `${route} needs a contact section.`);
  }
  await staticPage.goto(`http://127.0.0.1:${port}/404.html`, { waitUntil: 'domcontentloaded' });
  assert.equal(await staticPage.title(), 'Page not found | Turbo AI');
  assert.ok(await staticPage.$('main[data-not-found]'), 'The static 404 must render the branded error page.');
  assert.ok(await staticPage.$('header nav[aria-label="Main navigation"]'), 'The static 404 needs the normal navigation.');
  assert.ok(await staticPage.$('footer'), 'The static 404 needs the normal footer.');
  assert.ok(await staticPage.$('link[rel="stylesheet"]'), 'The static 404 needs the site stylesheet.');
  assert.ok((await staticPage.$eval('meta[name="robots"]', (node) => node.content)).includes('noindex'), 'The error page must not be indexed.');
  assert.equal(await staticPage.$('link[rel="canonical"]'), null, 'The error page must not inherit a valid page canonical.');
  assert.ok(await staticPage.$('main a[href="/"]'), 'The error page needs a route back to the homepage.');
  await staticPage.close();

  for (const [legacy, destination] of [['/index.php', '/'], ['/offshore-development', '/ai-engineering-software-development'], ...renamedRoutes]) {
    await page.goto(`http://127.0.0.1:${port}${legacy}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction((route) => location.pathname === route, {}, destination);
    await waitForRoute(destination);
    assert.equal(await page.$('[data-not-found]'), null, `${legacy} must route to its relevant replacement page.`);
  }

  await page.goto(`http://127.0.0.1:${port}/products`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => location.pathname === '/' && location.hash === '#our-products');
  await waitForRoute('/');
  assert.ok(await page.$('#our-products'), 'The removed overview must lead visitors to the homepage products section.');

  await page.goto(`http://127.0.0.1:${port}/admin/login`, { waitUntil: 'domcontentloaded' });
  await waitForRoute('/admin/login');
  const setup = await page.$eval('main h1', (node) => node.textContent.trim());
  const mongoConfigured = loadEnv('production', process.cwd(), 'VITE_').VITE_CMS_PROVIDER === 'mongodb';
  if (mongoConfigured) assert.ok(await page.$('input[type="password"]'), 'Configured MongoDB admin must show its protected login form.');
  else if (setup !== 'CMS setup required') throw new Error('Unconfigured admin did not show setup state.');

  for (const width of [320, 390]) {
    await page.setViewport({ width, height: 740, deviceScaleFactor: 1 });
    for (const route of ['/', ...launchRoutes]) {
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'domcontentloaded' });
      await waitForRoute(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
      assert.equal(overflow, false, `${route} must not overflow horizontally at ${width}px.`);
    }
  }

  await page.setViewport({ width: 390, height: 568, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await waitForRoute('/');
  await page.waitForSelector('button[aria-label="Open menu"]');
  await page.click('button[aria-label="Open menu"]');
  await page.waitForSelector('nav[aria-label="Mobile navigation"]');
  await checkProductMenu('Mobile navigation');
  await checkIndustryMenu('Mobile navigation');
  const mobile = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
  if (mobile.width > mobile.viewport + 2) throw new Error(`Mobile horizontal overflow: ${mobile.width}px > ${mobile.viewport}px`);
  const finalLink = 'nav[aria-label="Mobile navigation"] a[href="/industries/data-centres"]';
  await page.$eval(finalLink, (link) => link.scrollIntoView({ block: 'center' }));
  const reachable = await page.$eval(finalLink, (link) => {
    const rect = link.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return centerY > 0 && centerY < innerHeight && link.contains(document.elementFromPoint(centerX, centerY));
  });
  assert.ok(reachable, 'The last industry link must be reachable in the small mobile menu.');
  await page.click(finalLink);
  await page.waitForFunction(() => location.pathname === '/industries/data-centres' && document.querySelector('main h1')?.textContent === 'AI for Data Centres');
  await page.waitForSelector('nav[aria-label="Mobile navigation"]', { hidden: true });
  console.log(`Smoke passed: ${routes.length} public routes without breadcrumbs or animation pause controls, six-product homepage ecosystem and desktop/mobile menus with uppercase SEISMIC AI last, removed hero button, four full-background product photographs with distinct running animations and reduced-motion support, keyboard workflow tabs and collapsible capabilities, static product content, narrow layouts, removed overview and renamed-product redirects, four retired product URLs return branded noindex errors, clean public/generated HTML and sitemaps, three prerendered industry pages with SEO metadata, ${sitemapUrls.length} sitemap URLs, 18 desktop/mobile industry links, branded 404, admin setup, and small-screen mobile navigation.`);
} catch (error) {
  testFailure = error;
  console.error('Smoke assertion failed:', error);
  throw error;
} finally {
  const cleanupFailures = [];
  try {
    if (browser) await browser.close();
  } catch (error) {
    cleanupFailures.push(error);
    const browserProcess = browser?.process();
    if (browserProcess?.pid && browserProcess.exitCode === null) {
      if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(browserProcess.pid), '/f', '/t'], { windowsHide: true, stdio: 'ignore' });
      else browserProcess.kill('SIGTERM');
    }
  } finally {
    // Always tear down the preview this test started, even if Chromium cleanup fails.
    if (process.platform === 'win32' && preview.pid) spawnSync('taskkill', ['/pid', String(preview.pid), '/f', '/t'], { windowsHide: true, stdio: 'ignore' });
    else preview.kill();
  }
  if (profileDirectory) {
    try {
      const resolved = path.resolve(profileDirectory);
      if (!resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith('turbo-ai-smoke-')) throw new Error('Unexpected smoke-test profile directory.');
      await rm(resolved, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    } catch (error) { cleanupFailures.push(error); }
  }
  if (cleanupFailures.length) {
    if (testFailure) console.warn('Additional smoke cleanup failure:', cleanupFailures.map(error => error.message).join('; '));
    else throw new AggregateError(cleanupFailures, 'Smoke passed, but test cleanup failed.');
  }
}
