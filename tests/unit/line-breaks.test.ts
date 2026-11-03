// tier:fix: returns Star types into a description were ignored on the site. A single return now
// starts a new line and a blank line leaves a gap, as Site settings' text already does.
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ShopPage from '../../src/components/pages/ShopPage.astro';
import WritingPage from '../../src/components/pages/WritingPage.astro';
import CommissionsContent from '../../src/components/settings/CommissionsContent.astro';
import { readSettings } from '../../src/lib/site-settings';
import { oneLine, textLines } from '../../src/lib/text';
import { seriesPreview } from '../../src/lib/comics/sharing';
import type { ComicSeries } from '../../src/lib/comics/model';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const render = (component: Parameters<AstroContainer['renderToString']>[0], props: Record<string, unknown>) => container.renderToString(component, { props });
const TEXT = 'First line.\nSecond line.\n\nNew paragraph.';
// Astro's test rendering adds source attributes to elements, so <br> may carry some.
const SHOWN = /First line\.<br[^>]*>Second line\.<br[^>]*><br[^>]*>New paragraph\./;

describe('line breaks in descriptions', () => {
  it('splits text into lines, keeping one empty line for a blank line', () => {
    expect(textLines(TEXT)).toEqual(['First line.', 'Second line.', '', 'New paragraph.']);
    expect(textLines('Windows\r\nline\rends')).toEqual(['Windows', 'line', 'ends']);
    expect(textLines('\n\n  Trimmed.  \n\n')).toEqual(['Trimmed.']);
    expect(textLines('One.\n\n\n\nTwo.')).toEqual(['One.', '', 'Two.']);
    expect(textLines('Trailing spaces.   \nNext.')).toEqual(['Trailing spaces.', 'Next.']);
    expect(textLines('')).toEqual([]);
    expect(textLines('   ')).toEqual([]);
    expect(textLines(undefined)).toEqual([]);
    expect(textLines(null)).toEqual([]);
  });

  it('shows line breaks in a product\'s description', async () => {
    const html = await render(ShopPage, { products: [{ _id: 'p', name: 'Print', slug: { current: 'print' }, category: 'print', description: TEXT }] });
    expect(html).toMatch(SHOWN);
  });

  it('shows line breaks in a story\'s short description', async () => {
    const html = await render(WritingPage, { works: [{ _id: 'w', title: 'Story', slug: { current: 'story' }, excerpt: TEXT }] });
    expect(html).toMatch(SHOWN);
  });

  it('shows line breaks in what a commission type includes', async () => {
    const html = await render(CommissionsContent, {
      settings: readSettings({}, () => undefined),
      types: [{ name: 'Sketch', priceRange: '$20', description: TEXT, deliveryTime: '1 week', images: [] }],
    });
    expect(html).toMatch(SHOWN);
  });

  it('puts a description on one line in a link preview', () => {
    expect(oneLine(TEXT)).toBe('First line. Second line. New paragraph.');
    expect(oneLine('  Spaced \n  out  ')).toBe('Spaced out');
    const series = { slug: 's', title: 'S', description: TEXT, status: 'ongoing', type: 'original', chapters: [] } as unknown as ComicSeries;
    expect(seriesPreview(series, 'https://example.com').description).toBe('First line. Second line. New paragraph.');
  });
});
