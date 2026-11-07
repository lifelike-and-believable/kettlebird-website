// Search engines and link previews on the fixture build, whose address is the staging one
// (https://newsite.kettlebird.com), so the site isn't listed. Criteria: docs/specs/site-search.md.
import { expect, test, type Page } from '@playwright/test';

const SITE = 'https://newsite.kettlebird.com';
const CARD = `${SITE}/assets/images/site-card.jpg`;
const CARD_ALT = 'Kettlebird Creations: illustration, comics and stories by Star Goldberg';
const MAIN = ['/', '/portfolio', '/comics', '/writing', '/shop', '/commissions', '/about', '/news'];
const WORKS = ['/comics/kettle-tales', '/comics/kettle-tales/2/1', '/writing/the-long-road', '/writing/the-long-road/1', '/writing/night-market'];
const PUBLIC = [...MAIN, ...WORKS];

const meta = (page: Page, key: string) => page.locator(`meta[property="${key}"], meta[name="${key}"]`);
const content = async (page: Page, key: string) => {
  await expect(meta(page, key), key).toHaveCount(1);
  return meta(page, key).getAttribute('content');
};
const structured = async (page: Page) => {
  const scripts = page.locator('script[type="application/ld+json"]');
  return Promise.all((await scripts.all()).map(async (s) => JSON.parse((await s.textContent())!)));
};

test('site-search#AC-1 listing: not listed before the move', async ({ page }) => {
  for (const path of [...PUBLIC, '/help', '/comics/kettle-tales/2/1/pages']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]'), path).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]'), path).toHaveAttribute('content', /noindex/);
  }
});

test('site-search#AC-2 robots', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  expect(await res.text()).toBe('User-agent: *\nAllow: /\n');
});

test('site-search#AC-3 AC-4 sitemap and canonical addresses', async ({ page, request }) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  expect(index).toContain(`<loc>${SITE}/sitemap-0.xml</loc>`);
  const list = await (await request.get('/sitemap-0.xml')).text();
  expect(list).not.toMatch(/lastmod|priority|changefreq/);
  const locs = [...list.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const path of PUBLIC) expect(locs, path).toContain(path === '/' ? `${SITE}/` : `${SITE}${path}`);
  for (const loc of locs) {
    expect(loc, loc).not.toMatch(/\/help|\/preview\/|\/pages$|404|\/studio/);
    await page.goto(loc.replace(SITE, ''));
    await expect(page.locator('link[rel="canonical"]'), loc).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), loc).toHaveAttribute('href', loc);
  }
  await page.goto('/no-such-page');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('site-search#AC-5 AC-6 AC-8 preview tags', async ({ page }) => {
  for (const path of PUBLIC) {
    await page.goto(path);
    expect(await content(page, 'og:site_name'), path).toBe('Kettlebird Creations');
    expect(await content(page, 'og:type'), path).toBe(/^\/(comics\/[^/]+\/\d|writing\/)/.test(path) ? 'article' : 'website');
    expect(await content(page, 'og:title'), path).toBeTruthy();
    expect(await content(page, 'og:description'), path).toBeTruthy();
    expect(await content(page, 'og:url'), path).toBe(path === '/' ? `${SITE}/` : `${SITE}${path}`);
    // The fixture build has no covers on the image service and no portfolio pieces, so every page shows the card.
    expect(await content(page, 'og:image'), path).toBe(CARD);
    expect(await content(page, 'og:image:width'), path).toBe('1200');
    expect(await content(page, 'og:image:height'), path).toBe('630');
    expect(await content(page, 'og:image:alt'), path).toBe(CARD_ALT);
    expect(await content(page, 'twitter:card'), path).toBe('summary_large_image');
  }
  await page.goto('/');
  expect(await content(page, 'og:title')).toBe(await page.title());
  expect(await content(page, 'og:description')).toBe(await page.locator('meta[name="description"]').getAttribute('content'));
  await page.goto('/commissions');
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toBe(
    'Commissions are open. Commission artwork from Kettlebird Creations: pricing, examples, and how to order.',
  );
  expect((await page.request.get('/assets/images/site-card.jpg')).status()).toBe(200);
});

test('site-search#AC-9 structured data', async ({ page }) => {
  await page.goto('/');
  const [home] = await structured(page);
  expect(home['@graph'].map((n: { '@type': string }) => n['@type'])).toEqual(['WebSite', 'Person']);
  expect(home['@graph'][1].sameAs.length).toBeGreaterThan(0);
  expect(JSON.stringify(home)).not.toContain('@gmail.com');

  await page.goto('/about');
  expect((await structured(page))[0]['@type']).toBe('ProfilePage');

  await page.goto('/comics/kettle-tales');
  expect((await structured(page))[0]['@graph'].map((n: { '@type': string }) => n['@type'])).toEqual(['ComicSeries', 'BreadcrumbList']);
  await page.goto('/comics/kettle-tales/2/1');
  const crumbs = (await structured(page))[0];
  expect(crumbs['@type']).toBe('BreadcrumbList');
  expect(crumbs.itemListElement.at(-1).item).toBe(`${SITE}/comics/kettle-tales/2/1`);

  await page.goto('/writing/the-long-road');
  expect((await structured(page))[0]['@graph'].map((n: { '@type': string }) => n['@type'])).toEqual(['CreativeWork', 'BreadcrumbList']);
  await page.goto('/writing/the-long-road/1');
  expect((await structured(page))[0]['@type']).toBe('BreadcrumbList');

  for (const path of ['/portfolio', '/comics', '/writing', '/shop', '/commissions', '/news']) {
    await page.goto(path);
    expect(await structured(page), path).toEqual([]);
  }
});

test('site-search#AC-10 adult rating', async ({ page }) => {
  await page.goto('/writing/night-market');
  await expect(page.locator('meta[name="rating"]')).toHaveCount(1);
  await expect(page.locator('meta[name="rating"]')).toHaveAttribute('content', 'adult');
  for (const path of ['/writing/the-kettles-song', '/writing/the-long-road', '/writing/the-long-road/1', '/', '/writing', '/comics/kettle-tales']) {
    await page.goto(path);
    await expect(page.locator('meta[name="rating"]'), path).toHaveCount(0);
  }
});
