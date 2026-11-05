// End-to-end tests for stories on the site, against the fixture stories (tests/fixtures/stories.ts)
// and the fixture drafts for the preview. Criteria: docs/specs/story-reader-pages.md.
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SITE = 'https://newsite.kettlebird.com';
const KEY = 'fixture-preview-key';
const meta = (page: Page, property: string) => page.locator(`meta[property="${property}"]`);
const card = (page: Page, title: string) => page.locator('.work-card').filter({ has: page.getByRole('heading', { name: title }) });

test('story-reader-pages#AC-2 writing page', async ({ page }) => {
  await page.goto('/writing');
  const titles = await page.locator('.work-card h2').allTextContents();
  expect(titles.map((t) => t.trim())).toEqual(['The Long Road', "The Kettle's Song", 'Night Market', 'Finished Tale', 'Elsewhere Tale']);

  const road = card(page, 'The Long Road');
  await expect(road.getByRole('link', { name: 'Read', exact: true })).toHaveAttribute('href', '/writing/the-long-road');
  await expect(road.getByRole('heading', { name: 'The Long Road' }).getByRole('link')).toHaveAttribute('href', '/writing/the-long-road');
  await expect(road).toContainText('Rated General');
  await expect(road).toContainText('In progress · 3 chapters');

  const song = card(page, "The Kettle's Song");
  await expect(song.getByRole('link', { name: 'Also on AO3' })).toHaveAttribute('href', 'https://archiveofourown.org/works/1');
  await expect(card(page, 'Finished Tale')).not.toContainText('Rated');

  const elsewhere = card(page, 'Elsewhere Tale');
  await expect(elsewhere.getByRole('link', { name: /Read it/ })).toHaveAttribute('href', 'https://kettlebird.tumblr.com/post/1');
  await expect(elsewhere.getByRole('link', { name: 'Read', exact: true })).toHaveCount(0);
  expect((await page.request.get('/writing/elsewhere-tale')).status()).toBe(404);
});

test('story-reader-pages#AC-3 AC-4 AC-5 AC-9 a one-shot', async ({ page }) => {
  await page.goto('/writing/the-kettles-song');
  await expect(page).toHaveTitle("The Kettle's Song · Writing · Kettlebird Creations");
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText("The Kettle's Song");
  const box = page.getByRole('region', { name: 'Before you read' });
  await expect(box).toContainText('Rated Teen');
  await expect(box).toContainText('Mild peril.');
  const article = page.locator('main article');
  await expect(article.locator('em')).toHaveText('midnight');
  await expect(article.getByRole('separator', { name: 'Scene break' })).toHaveCount(2);
  await expect(article).toContainText('And that <was> the end & the beginning.');
  await expect(page.getByRole('link', { name: 'Back to Writing' })).toHaveAttribute('href', '/writing');
  await expect(page.getByRole('link', { name: 'Also on AO3' })).toBeVisible();
  // The box comes before the text.
  expect(await box.evaluate((b) => !!(b.compareDocumentPosition(document.querySelector('main article')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);

  await expect(meta(page, 'og:title')).toHaveAttribute('content', "The Kettle's Song");
  await expect(meta(page, 'og:description')).toHaveAttribute('content', 'A kettle that sings at midnight.');
  await expect(meta(page, 'og:url')).toHaveAttribute('content', `${SITE}/writing/the-kettles-song`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/writing/the-kettles-song`);
});

test('story-reader-pages#AC-7 a story in chapters', async ({ page }) => {
  await page.goto('/writing/the-long-road');
  await expect(page.getByRole('link', { name: 'Start reading' })).toHaveAttribute('href', '/writing/the-long-road/1');
  await expect(page.getByRole('link', { name: 'Read the newest chapter' })).toHaveAttribute('href', '/writing/the-long-road/3');
  const heading = page.getByRole('heading', { level: 2, name: 'Chapters' });
  await expect(heading).toHaveAttribute('id', 'chapters');
  const items = page.locator('ol.chapter-list > li');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0).getByRole('link')).toHaveText('Chapter 1: Setting Out');
  await expect(items.nth(2).getByRole('link')).toHaveText('Chapter 3');
  await expect(page.getByText('Not Written Yet')).toHaveCount(0);
  expect((await page.request.get('/writing/the-long-road/4')).status()).toBe(404);
});

test('story-reader-pages#AC-8 AC-9 chapter pages', async ({ page }) => {
  await page.goto('/writing/the-long-road/2');
  await expect(page).toHaveTitle('Chapter 2: Over the Ridge · The Long Road · Kettlebird Creations');
  await expect(page.locator('h1')).toHaveText('Chapter 2: Over the Ridge');
  await expect(page.getByRole('link', { name: 'The Long Road', exact: true }).first()).toHaveAttribute('href', '/writing/the-long-road');
  for (const name of ['Chapters', 'Chapters, end of chapter']) {
    const nav = page.getByRole('navigation', { name, exact: true });
    await expect(nav.getByRole('link', { name: 'Previous chapter' })).toHaveAttribute('href', '/writing/the-long-road/1');
    await expect(nav.getByRole('link', { name: 'Chapters', exact: true })).toHaveAttribute('href', '/writing/the-long-road#chapters');
    await expect(nav.getByRole('link', { name: 'Next chapter' })).toHaveAttribute('href', '/writing/the-long-road/3');
  }
  await expect(meta(page, 'og:title')).toHaveAttribute('content', 'The Long Road · Chapter 2: Over the Ridge');

  await page.goto('/writing/the-long-road/1');
  await expect(page.getByRole('link', { name: 'Previous chapter' })).toHaveCount(0);

  await page.goto('/writing/the-long-road/3');
  await expect(page.getByRole('link', { name: 'Next chapter' })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Chapters, end of chapter' })).toContainText("That's the newest chapter. More to come.");

  await page.goto('/writing/finished-tale/2');
  await expect(page.getByRole('navigation', { name: 'Chapters, end of chapter' })).toContainText('The end.');
  await expect(page.getByRole('region', { name: 'Before you read' })).toContainText('Not rated');

  // By keyboard: the end's Next chapter is reachable with Tab and opens the next chapter.
  await page.goto('/writing/the-long-road/1');
  const next = page.getByRole('navigation', { name: 'Chapters, end of chapter' }).getByRole('link', { name: 'Next chapter' });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/writing\/the-long-road\/2$/);
});

test('story-reader-pages#AC-6 a Mature story asks first, once per browser', async ({ page }) => {
  await page.goto('/writing/night-market');
  const box = page.getByRole('region', { name: 'Before you read' });
  await expect(box).toContainText('This story is rated Mature.');
  await expect(page.locator('main article')).toBeHidden();
  await box.getByRole('button', { name: 'Continue to the story' }).click();
  await expect(page.locator('main article')).toBeVisible();
  await expect(page.locator('main article')).toBeFocused();
  await expect(box.getByRole('button', { name: 'Continue to the story' })).toHaveCount(0);
  await page.reload();
  await expect(page.locator('main article')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to the story' })).toHaveCount(0);
});

test('story-reader-pages#AC-6 without scripts the text shows', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/writing/night-market');
  await expect(page.locator('main article')).toBeVisible();
  await expect(page.locator('main article')).toContainText('The stalls opened at midnight.');
  await context.close();
});

test('story-reader-pages#AC-10 news', async ({ page }) => {
  await page.goto('/news');
  const link = page.getByRole('link', { name: 'The Long Road · Chapter 3' });
  await expect(link).toHaveAttribute('href', '/writing/the-long-road/3');
});

test('story-reader-pages#AC-11 page not found', async ({ page }) => {
  const response = await page.goto('/writing/the-long-road/9');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'Back to The Long Road' })).toHaveAttribute('href', '/writing/the-long-road');
  await expect(page.getByRole('link', { name: 'Writing', exact: true }).last()).toHaveAttribute('href', '/writing');
});

test('story-reader-pages#AC-12 preview of a story and a chapter', async ({ page }) => {
  await page.goto(`/preview/writtenWork/story-song?sanity-preview-secret=${KEY}`);
  await expect(page.locator('main article')).toContainText('Draft text.');
  await expect(page.getByRole('button', { name: 'Continue to the story' })).toHaveCount(0);
  await page.goto(`/preview/storyChapter/road-2?sanity-preview-secret=${KEY}`);
  await expect(page.locator('h1')).toHaveText('Chapter 2: Over the Ridge');
  await expect(page.locator('main article')).toContainText('The ridge was steeper.');
});

test('story-reader-pages#AC-13 accessibility and reflow', async ({ page }) => {
  for (const path of ['/writing', '/writing/the-kettles-song', '/writing/the-long-road', '/writing/the-long-road/2', '/writing/night-market']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id), path).toEqual([]);
  }
  for (const [width, big] of [[360, false], [320, true]] as const) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ['/writing', '/writing/the-kettles-song', '/writing/the-long-road', '/writing/the-long-road/2']) {
      await page.goto(path);
      if (big) await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${path} ${width}`).toBeLessThanOrEqual(0);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/writing/the-kettles-song');
  const style = await page.locator('main article').evaluate((e) => {
    const s = getComputedStyle(e);
    return { size: s.fontSize, maxWidth: s.maxWidth };
  });
  expect(style.size).toBe('18px');
  expect(style.maxWidth).toMatch(/px$/);
});
