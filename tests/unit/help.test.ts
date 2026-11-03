// Help pages built from Star's guides, and the editor's Help menu and item links.
// Criteria: docs/specs/content-editing-help-links.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { addressProblem, GUIDE_NAMES, loadGuides, outline, renderGuide } from '../../src/lib/help/guides';
import { HELP_MENU, ITEM_HELP, newTabName } from '../../sanity-studio/lib/help';
import { PREVIEWABLE_TYPES } from '../../sanity-studio/lib/preview';

const read = (name: string) => readFileSync(`docs/user/${name}.md`, 'utf8');
const guides = loadGuides(read);
const byName = Object.fromEntries(guides.map((g) => [g.name, g]));

describe('content-editing-help-links#AC-1 guides', () => {
  it('builds the six guides in the order Star needs them, and not the fans\' guide', () => {
    expect(GUIDE_NAMES).toEqual(['getting-started', 'editing-your-site', 'publishing-comics', 'site-settings', 'previewing', 'going-live']);
    expect(guides.map((g) => g.name)).toEqual([...GUIDE_NAMES]);
    expect(GUIDE_NAMES).not.toContain('reading-comics');
  });

  it('takes each guide\'s title from its heading and its summary from its front matter (AC-3)', () => {
    expect(guides.map((g) => [g.title, g.summary])).toEqual([
      ["Getting started with your site's editor", 'Your invitation, signing in, and finding your way around.'],
      ['Editing your art, writing, shop and commissions', 'Adding, changing and removing pieces, stories, products and commission types.'],
      ['Publishing comic pages and chapters', 'Starting a comic, adding chapters and pages, and publishing them.'],
      ['Commissions, your about page, the home page and your links', "Opening and closing commissions, and the text on your site's pages."],
      ['See it before you publish', 'Previewing a change on its page, on a computer and a phone.'],
      ['When your change is live', 'What the status at the top right means after you publish.'],
    ]);
  });
});

describe('content-editing-help-links#AC-2 rendering', () => {
  const md = [
    '---', 'id: docs-x', 'summary: "A guide."', '---', '', '# A guide', '', '<!-- A note for whoever maintains it. -->', '',
    'Some **bold** text.', '', '## First part', '', 'Text.', '', '### A smaller part', '', '## Second: part, too', '', 'More.',
  ].join('\n');

  it('reads the title, summary and ## sections with GitHub\'s ids', () => {
    const o = outline(md);
    expect(o.title).toBe('A guide');
    expect(o.summary).toBe('A guide.');
    expect(o.sections).toEqual([{ id: 'first-part', title: 'First part' }, { id: 'second-part-too', title: 'Second: part, too' }]);
    expect(o.ids).toEqual(expect.arrayContaining(['a-guide', 'first-part', 'a-smaller-part', 'second-part-too']));
  });

  it('leaves out the front matter, comments and the title, and gives headings their ids', () => {
    const { html } = renderGuide('x', md, { x: outline(md).ids });
    expect(html).not.toContain('docs-x');
    expect(html).not.toContain('maintains');
    expect(html).not.toContain('<!--');
    expect(html).not.toMatch(/<h1/);
    expect(html).toContain('<h2 id="first-part">First part</h2>');
    expect(html).toContain('<h3 id="a-smaller-part">A smaller part</h3>');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('matches GitHub\'s ids for the real guides\' headings, punctuation included', () => {
    expect(byName['site-settings'].sections.map((s) => s.id)).toContain('open-or-close-commissions');
    expect(byName['site-settings'].sections.map((s) => s.id)).toContain('before-you-start-check-your-quick-facts');
    expect(byName['publishing-comics'].sections.map((s) => s.id)).toEqual([
      'start-a-new-comic', 'add-a-chapter', 'add-pages', 'describe-each-page', 'publish', 'if-links-will-change', 'remove-a-comic', 'if-something-goes-wrong',
    ]);
  });

  it('never shows a guide\'s comments or a link to the editor (AC-6)', () => {
    for (const g of guides) {
      expect(g.html, g.name).not.toContain('<!--');
      expect(g.html, g.name).not.toMatch(/href="[^"]*\/studio/);
    }
  });
});

describe('content-editing-help-links#AC-4 links', () => {
  const known = { a: ['top', 'part-one'], b: ['b-top', 'part-two'] };

  it('turns links to other guides into help addresses', () => {
    const { html } = renderGuide('a', '# Top\n\n## Part one\n\nSee [B](b.md) and [part two](b.md#part-two), or [above](#part-one).', known);
    expect(html).toContain('<a href="/help/b">B</a>');
    expect(html).toContain('<a href="/help/b#part-two">part two</a>');
    expect(html).toContain('<a href="#part-one">above</a>');
  });

  it('fails on a link to a guide that isn\'t built, naming the guide and the link', () => {
    expect(() => renderGuide('a', '# Top\n\nSee [comics](reading-comics.md).', known)).toThrow(/a.*reading-comics\.md.*isn't a help page/);
  });

  it('fails on a link to a section that doesn\'t exist, in another guide or its own', () => {
    expect(() => renderGuide('a', '# Top\n\n[x](b.md#nowhere)', known)).toThrow(/a.*b\.md#nowhere.*no section/);
    expect(() => renderGuide('a', '# Top\n\n[x](#nowhere)', known)).toThrow(/a.*#nowhere.*no section/);
  });

  it('leaves web addresses alone', () => {
    expect(renderGuide('a', '# Top\n\n[Sanity](https://www.sanity.io)', known).html).toContain('<a href="https://www.sanity.io">Sanity</a>');
  });

  it('loads the real guides with every link between them working', () => {
    expect(byName['editing-your-site'].html).toContain('href="/help/site-settings#open-or-close-commissions"');
    expect(byName['getting-started'].html).toContain('href="/help/publishing-comics"');
    expect(() => loadGuides((name) => (name === 'going-live' ? '# Live\n\n[x](previewing.md#nowhere)' : read(name)))).toThrow(/going-live/);
  });
});

describe('content-editing-help-links#AC-5 tables', () => {
  it('wraps a table in a focusable region named by its header cells', () => {
    const { html } = renderGuide('a', '# Top\n\n| What you see | What it means | What to do |\n|---|---|---|\n| a | b | c |', { a: ['top'] });
    expect(html).toMatch(/<div class="help-table" role="region" tabindex="0" aria-label="What you see, what it means, what to do"><table>/);
    expect(html).toMatch(/<\/table><\/div>/);
  });
});

describe('content-editing-help-links#AC-8 help menu', () => {
  it('lists the six guides by title, then All help', () => {
    expect(HELP_MENU).toEqual([
      ...guides.map((g) => ({ text: g.title, path: `/help/${g.name}` })),
      { text: 'All help', path: '/help' },
    ]);
  });

  it('names each link as opening a new tab', () => {
    expect(newTabName('All help')).toBe('All help (opens in a new tab)');
  });
});

describe('content-editing-help-links#AC-9 item help', () => {
  it('gives every item type its section of a guide', () => {
    expect(Object.keys(ITEM_HELP).sort()).toEqual([...PREVIEWABLE_TYPES].sort());
    expect(ITEM_HELP).toEqual({
      comicSeries: { text: 'Help: Start a new comic', path: '/help/publishing-comics#start-a-new-comic' },
      comicChapter: { text: 'Help: Add a chapter', path: '/help/publishing-comics#add-a-chapter' },
      galleryItem: { text: 'Help: Art', path: '/help/editing-your-site#art' },
      writtenWork: { text: 'Help: Writing', path: '/help/editing-your-site#writing' },
      product: { text: 'Help: Shop', path: '/help/editing-your-site#shop' },
      commissionType: { text: 'Help: Commissions', path: '/help/editing-your-site#commissions' },
      commissionSettings: { text: 'Help: Open or close commissions', path: '/help/site-settings#open-or-close-commissions' },
      aboutPage: { text: 'Help: Your about page', path: '/help/site-settings#your-about-page' },
      homePage: { text: 'Help: The home page', path: '/help/site-settings#the-home-page' },
      contactSettings: { text: 'Help: Your contact email and social links', path: '/help/site-settings#your-contact-email-and-social-links' },
    });
  });

  it('uses each section\'s own heading', () => {
    for (const { text, path } of Object.values(ITEM_HELP)) {
      const [name, id] = path.replace('/help/', '').split('#');
      expect(byName[name].sections.find((s) => s.id === id)?.title, path).toBe(text.replace('Help: ', ''));
    }
  });

  it('checks every address against the built guides (AC-10)', () => {
    for (const { path } of [...HELP_MENU, ...Object.values(ITEM_HELP)]) expect(addressProblem(path, guides), path).toBeUndefined();
    expect(addressProblem('/help/reading-comics', guides)).toMatch(/reading-comics/);
    expect(addressProblem('/help/site-settings#nowhere', guides)).toMatch(/nowhere/);
    expect(addressProblem('/elsewhere', guides)).toMatch(/\/elsewhere/);
  });
});
