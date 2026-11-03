// The organised editor: its menu, labels, help text, messages and list details, the schemas'
// use of them, and the shop's sections. Criteria: docs/specs/content-editing-organised-editor.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  DEVELOPER_WORDS, EMPTY_LIST, FIELDS, fieldText, HIDDEN, ITEM_NAMES, listDetail, missingSummary, PIECE_ALT_TEXT_WARNING,
  PORTFOLIO_SECTIONS, requiredMessage, SECTIONS, SERIES_KIND, SERIES_STATUS, SHOP_SECTION_OPTIONS,
  thingsToAdd, type ItemType,
} from '../../sanity-studio/lib/editor-content';
import { shopSections, SHOP_SECTIONS } from '../../src/lib/shop';

const SCHEMA_FILES: Record<ItemType, string> = {
  comicSeries: 'sanity-studio/schemas/objects/comicSeries.ts',
  galleryItem: 'sanity-studio/schemas/objects/galleryItem.ts',
  writtenWork: 'sanity-studio/schemas/objects/writtenWork.ts',
  product: 'sanity-studio/schemas/objects/product.ts',
  commissionType: 'sanity-studio/schemas/objects/commissionType.ts',
};
const read = (path: string) => readFileSync(path, 'utf8');

describe('content-editing-organised-editor#AC-1 AC-10 AC-11 AC-12 menu sections', () => {
  it('lists the six sections in order, each content section with its New label (AC-1)', () => {
    expect(SECTIONS.map((s) => s.title)).toEqual(['Comics', 'Art', 'Writing', 'Shop', 'Commissions', 'Site settings']);
    expect(SECTIONS.map((s) => s.type)).toEqual(['comicSeries', 'galleryItem', 'writtenWork', 'product', 'commissionType', undefined]);
    expect(SECTIONS.map((s) => s.newLabel)).toEqual(['New series', 'New piece', 'New story', 'New product', 'New commission type', undefined]);
  });
  it('names each kind of item plainly', () => {
    expect(ITEM_NAMES).toEqual({
      comicSeries: 'Series', comicChapter: 'Chapter', galleryItem: 'Piece', writtenWork: 'Story', product: 'Product', commissionType: 'Commission type',
    });
  });
  it('words the empty list for Star (AC-12)', () => {
    expect(EMPTY_LIST).toBe('Nothing here yet. Choose the + button above to add one.');
  });
  it('builds the menu, the create menu, the badge and the empty text from these (AC-1, AC-6, AC-11, AC-12)', () => {
    const structure = read('sanity-studio/structure.ts');
    const config = read('sanity-studio/sanity.config.ts');
    expect(structure).toMatch(/SECTIONS\.map/);
    expect(config).toMatch(/structureTool\(\{\s*structure/);
    expect(config).toMatch(/newDocumentOptions/);
    expect(config).toMatch(/badges/);
    expect(config).toMatch(/EMPTY_LIST/);
  });
});

describe('content-editing-organised-editor#AC-2 list order and details', () => {
  it('orders lists as the site does', () => {
    const order = Object.fromEntries(SECTIONS.filter((s) => s.type).map((s) => [s.title, s.ordering]));
    expect(order).toEqual({
      Comics: [['_createdAt', 'desc']],
      Art: [['date', 'desc'], ['_createdAt', 'desc']],
      Writing: [['publishDate', 'desc'], ['_createdAt', 'desc']],
      Shop: [['category', 'asc'], ['name', 'asc']],
      Commissions: [['order', 'asc'], ['name', 'asc']],
    });
  });
  it('shows each item\'s detail', () => {
    expect(listDetail('comicSeries', { status: 'hiatus' })).toBe('On Hiatus');
    expect(listDetail('comicSeries', {})).toBeUndefined();
    expect(listDetail('galleryItem', { category: ['original', 'featured'] })).toBe('Original Work, Featured');
    expect(listDetail('galleryItem', { category: ['commission'] })).toBe('Past Clients');
    expect(listDetail('galleryItem', { category: [] })).toBeUndefined();
    expect(listDetail('galleryItem', {})).toBeUndefined();
    expect(listDetail('writtenWork', { publishDate: '2026-10-31' })).toBe('2026-10-31');
    expect(listDetail('writtenWork', { publishDate: '' })).toBeUndefined();
    expect(listDetail('product', { category: 'sticker' })).toBe('Stickers');
    expect(listDetail('product', { category: 'commission' })).toBeUndefined();
    expect(listDetail('commissionType', { priceRange: '$80–150' })).toBe('$80–150');
    expect(listDetail('commissionType', {})).toBeUndefined();
  });
  it('uses the details in each schema\'s list preview', () => {
    for (const [type, file] of Object.entries(SCHEMA_FILES)) expect(read(file), type).toMatch(new RegExp(`listDetail\\('${type}'`));
  });
});

const EXPECTED: Record<ItemType, [string, string, string][]> = {
  comicSeries: [
    ['title', 'Title (required)', "The series' name, as readers see it."],
    ['slug', 'Web address (required)', "Fills itself in from the title. It's the last part of the series' address on the site: kettlebird.com/comics/kettle-tales. Leave it as it is once people may have shared links."],
    ['coverImage', 'Cover', "Shown on the Comics page and the series' own page."],
    ['description', 'Description', 'A sentence or two about the series, shown on its page.'],
    ['status', 'Status', 'Ongoing, Complete, or On Hiatus. Shown as a tag, and in the message at the end of the newest page.'],
    ['type', 'Kind', 'Original or Fancomic, shown as a tag.'],
    ['chapters', 'Chapters', 'In number order. Choose one to open it and its pages.'],
  ],
  galleryItem: [
    ['title', 'Title (required)', "Shown when someone points at the picture, and as the heading when it's opened."],
    ['image', 'Picture (required)', "Upload the original file; the site makes smaller copies. Your portfolio shows square thumbnails: to keep the important part in view, choose the picture's Edit button, then drag the circle over the part that matters."],
    ['altText', 'Alt text', "What the picture shows, for people using screen readers. If it's empty, they hear only the title."],
    ['category', 'Portfolio sections (choose at least one)', 'The sections of your portfolio it appears in: Original Work, Fan Work, Past Clients, Featured, Work in Progress. A piece can be in more than one.'],
    ['description', 'Description', 'Shown when someone opens the picture on your portfolio.'],
    ['tags', 'Tags', "Words shown under the picture when it's opened, like a character's name. Type one, then press Enter."],
    ['date', 'Date', 'When you made it. The portfolio shows newest first; pieces without a date come last.'],
  ],
  writtenWork: [
    ['title', 'Title (required)', "The story's title."],
    ['externalLink', 'Link to read it', "Where the Writing page's Read it button goes, such as the story on AO3."],
    ['excerpt', 'Short description', 'A sentence or two, shown on the Writing page.'],
    ['coverImage', 'Cover', 'Shown beside the story on the Writing page, cropped to a tall rectangle.'],
    ['genre', 'Genres', 'Shown as tags on the Writing page. Type one, then press Enter.'],
    ['publishDate', 'Date posted', 'The Writing page shows newest first.'],
  ],
  product: [
    ['name', 'Name (required)', "The product's name in the shop."],
    ['category', 'Shop section (required)', "Which section of the shop it's listed under: Prints, Stickers, or Digital. Within a section, products are listed by name."],
    ['price', 'Price', 'Shown exactly as you write it, so include the currency: $4, or $4 each.'],
    ['images', 'Pictures', 'The first is the one shown in the shop, cropped square from the centre. Drag a picture to change the order.'],
    ['description', 'Description', 'Shown in the shop under the name.'],
    ['kofiLink', 'Ko-fi link', "Where the shop's Buy button goes, until the site has its own checkout. Without it, there's no Buy button."],
  ],
  commissionType: [
    ['name', 'Name (required)', 'Like "Full colour illustration", shown as the heading.'],
    ['priceRange', 'Price range', 'Shown exactly as you write it, like $80–150.'],
    ['description', "What's included", 'Shown under the name on the Commissions page.'],
    ['exampleImages', 'Examples', 'Pictures of past commissions of this kind. The first three are shown, cropped square from the centre. Drag a picture to change the order.'],
    ['deliveryTime', 'How long it takes', 'Shown as "Est. delivery", like 2–3 weeks.'],
    ['order', 'Order on the page', 'Lower numbers come first on the Commissions page, and in this list. Number them 1, 2, 3; to move one, change the numbers.'],
  ],
};

describe('content-editing-organised-editor#AC-3 AC-5 field labels and help', () => {
  for (const type of Object.keys(EXPECTED) as ItemType[]) {
    it(`gives every ${type} field its label and help, in order`, () => {
      expect(Object.keys(FIELDS[type])).toEqual(EXPECTED[type].map(([name]) => name));
      for (const [name, title, description] of EXPECTED[type]) expect(fieldText(type, name), name).toEqual({ title, description });
    });
    it(`uses that text, in that order, in the ${type} schema, and hides the unused fields`, () => {
      const source = read(SCHEMA_FILES[type]);
      const uses = [...source.matchAll(new RegExp(`fieldText\\('${type}', '(\\w+)'\\)`, 'g'))].map((m) => m[1]);
      expect(uses).toEqual(Object.keys(FIELDS[type]));
      for (const name of HIDDEN[type]) expect(source, name).toMatch(new RegExp(`name: '${name}',[^}]*hidden: true`, 's'));
    });
  }
  it('hides the fields the site doesn\'t use', () => {
    expect(HIDDEN).toEqual({
      comicSeries: [], galleryItem: ['slug', 'featured'], writtenWork: ['slug', 'content'], product: ['slug', 'tags', 'inventory'], commissionType: [],
    });
  });
  it('refuses a field it has no text for', () => {
    expect(() => fieldText('product', 'inventory')).toThrow('No text for product.inventory');
  });
});

describe('content-editing-organised-editor#AC-5 AC-7 required messages', () => {
  it('says what to add and what it\'s for', () => {
    expect(requiredMessage('galleryItem', 'image')).toBe(
      "Add the picture to publish. Upload the original file; the site makes smaller copies. Your portfolio shows square thumbnails: to keep the important part in view, choose the picture's Edit button, then drag the circle over the part that matters.",
    );
    expect(requiredMessage('product', 'category')).toMatch(/^Add a shop section to publish\. Which section/);
    expect(() => requiredMessage('product', 'price')).toThrow("product.price isn't required");
  });
  it('uses the messages in the schemas, and warns about a piece\'s alt text (AC-7)', () => {
    for (const [type, file] of Object.entries(SCHEMA_FILES) as [ItemType, string][]) {
      const source = read(file);
      for (const [name, field] of Object.entries(FIELDS[type])) {
        if (!field.missing) continue;
        // The series' web address keeps the publishing spec's message (comic-publish-pages AC-10).
        if (type === 'comicSeries' && name === 'slug') expect(source).toContain('SERIES_SLUG_MESSAGE');
        else expect(source, `${type}.${name}`).toContain(`requiredMessage('${type}', '${name}')`);
      }
    }
    expect(PIECE_ALT_TEXT_WARNING).toBe('Add alt text so people using screen readers can follow it');
    expect(read(SCHEMA_FILES.galleryItem)).toMatch(/altTextRule\(Rule, PIECE_ALT_TEXT_WARNING\)/);
  });
});

describe('content-editing-organised-editor#AC-6 what\'s missing', () => {
  it('lists what to add in form order', () => {
    expect(missingSummary('galleryItem', ['category', 'title', 'image'])).toBe(
      'Add these before publishing: a title; the picture; at least one portfolio section',
    );
    expect(missingSummary('product', ['category'])).toBe('Add these before publishing: a shop section');
    expect(missingSummary('product', ['price'])).toBeNull();
    expect(missingSummary('writtenWork', [])).toBeNull();
  });
  it('counts them beside Publish', () => {
    expect(thingsToAdd(3)).toBe('3 things to add before publishing');
    expect(thingsToAdd(1)).toBe('1 thing to add before publishing');
    expect(thingsToAdd(0)).toBeNull();
    expect(thingsToAdd(-1)).toBeNull();
  });
});

describe('content-editing-organised-editor#AC-8 option labels', () => {
  it('relabels options, keeping stored values', () => {
    expect(PORTFOLIO_SECTIONS).toEqual([
      { title: 'Original Work', value: 'original' }, { title: 'Fan Work', value: 'fanart' }, { title: 'Past Clients', value: 'commission' },
      { title: 'Featured', value: 'featured' }, { title: 'Work in Progress', value: 'wip' },
    ]);
    expect(SHOP_SECTION_OPTIONS).toEqual([
      { title: 'Prints', value: 'print' }, { title: 'Stickers', value: 'sticker' }, { title: 'Digital', value: 'digital' },
    ]);
    expect(SERIES_STATUS.map((o) => o.title)).toEqual(['Ongoing', 'Complete', 'On Hiatus']);
    expect(SERIES_STATUS.map((o) => o.value)).toEqual(['ongoing', 'complete', 'hiatus']);
    expect(SERIES_KIND).toEqual([{ title: 'Original', value: 'original' }, { title: 'Fancomic', value: 'fancomic' }]);
  });
  it('uses them in the schemas', () => {
    expect(read(SCHEMA_FILES.galleryItem)).toContain('list: PORTFOLIO_SECTIONS');
    expect(read(SCHEMA_FILES.product)).toContain('list: SHOP_SECTION_OPTIONS');
    expect(read(SCHEMA_FILES.comicSeries)).toContain('list: SERIES_STATUS');
    expect(read(SCHEMA_FILES.comicSeries)).toContain('list: SERIES_KIND');
  });
  it('matches the shop\'s own sections', () => {
    expect(SHOP_SECTION_OPTIONS.map(({ title, value }) => ({ value, heading: title }))).toEqual(SHOP_SECTIONS);
  });
});

describe('content-editing-organised-editor#AC-4 no developer words', () => {
  it('finds none in any label, help text, name or message', () => {
    const texts = [
      ...SECTIONS.flatMap((s) => [s.title, s.newLabel ?? '']),
      ...Object.values(ITEM_NAMES),
      ...Object.values(FIELDS).flatMap((fields) => Object.values(fields).flatMap((f) => [f.label, f.help, f.missing ?? ''])),
      ...[PORTFOLIO_SECTIONS, SHOP_SECTION_OPTIONS, SERIES_STATUS, SERIES_KIND].flat().map((o) => o.title),
      EMPTY_LIST, PIECE_ALT_TEXT_WARNING,
    ];
    expect(DEVELOPER_WORDS).toEqual(['slug', 'reference', 'document', 'schema', 'array', 'category', 'boolean']);
    const hits = texts.filter((t) => DEVELOPER_WORDS.some((w) => new RegExp(`\\b${w}`, 'i').test(t)));
    expect(hits).toEqual([]);
  });
});

describe('content-editing-organised-editor#AC-9 shop sections', () => {
  it('heads the shop\'s sections Prints, Stickers, Digital, in that order', () => {
    expect(SHOP_SECTIONS).toEqual([
      { value: 'print', heading: 'Prints' }, { value: 'sticker', heading: 'Stickers' }, { value: 'digital', heading: 'Digital' },
    ]);
    const products = [
      { name: 'B', category: 'digital' }, { name: 'A', category: 'print' }, { name: 'C', category: 'commission' }, { name: 'D' },
      { name: 'E', category: 'print' },
    ];
    expect(shopSections(products)).toEqual([
      { heading: 'Prints', products: [products[1], products[4]] },
      { heading: 'Digital', products: [products[0]] },
    ]);
    expect(shopSections([])).toEqual([]);
  });
  it('uses them on the shop page, with no added "s"', () => {
    // The shop page's markup moved into a component the preview also renders (content-editing-preview).
    const page = read('src/components/pages/ShopPage.astro');
    expect(page).toMatch(/shopSections\(/);
    expect(page).not.toMatch(/CATEGORY_LABELS|\}s<\/h2>/);
  });
});
