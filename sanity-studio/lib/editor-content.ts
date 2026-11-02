// Everything the editor says to Star: its menu, each form's labels and help text, option labels,
// messages and list details. No `sanity` imports, so the site's Vitest can check it against the
// design. Spec: docs/specs/content-editing-organised-editor.md; design: docs/design/organised-editor.md.

export type ItemType = 'comicSeries' | 'galleryItem' | 'writtenWork' | 'product' | 'commissionType';

export interface Section {
  title: string;
  /** The kind of item the section lists; none for Site settings. */
  type?: ItemType;
  /** The create button's name (AC-1). */
  newLabel?: string;
  /** Sanity orderings: [field, direction] in priority order (AC-2). */
  ordering?: [string, 'asc' | 'desc'][];
}

/** AC-1, AC-2: the menu, in order. */
export const SECTIONS: Section[] = [
  { title: 'Comics', type: 'comicSeries', newLabel: 'New series', ordering: [['_createdAt', 'desc']] },
  { title: 'Art', type: 'galleryItem', newLabel: 'New piece', ordering: [['date', 'desc'], ['_createdAt', 'desc']] },
  { title: 'Writing', type: 'writtenWork', newLabel: 'New story', ordering: [['publishDate', 'desc'], ['_createdAt', 'desc']] },
  { title: 'Shop', type: 'product', newLabel: 'New product', ordering: [['category', 'asc'], ['name', 'asc']] },
  { title: 'Commissions', type: 'commissionType', newLabel: 'New commission type', ordering: [['order', 'asc'], ['name', 'asc']] },
  { title: 'Site settings' },
];

/** What each kind of item is called (Sanity's type titles). */
export const ITEM_NAMES: Record<ItemType | 'comicChapter', string> = {
  comicSeries: 'Series',
  comicChapter: 'Chapter',
  galleryItem: 'Piece',
  writtenWork: 'Story',
  product: 'Product',
  commissionType: 'Commission type',
};

/** AC-12 */
export const EMPTY_LIST = 'Nothing here yet. Choose the + button above to add one.';

export interface FieldText {
  label: string;
  help: string;
  /** How the "what's missing" box names it, for required fields (AC-6). */
  missing?: string;
  /** "(choose at least one)" rather than "(required)" (AC-5). */
  atLeastOne?: boolean;
}

/** AC-3, AC-5: each form's visible fields, in order. Keys are the stored field names. */
export const FIELDS: Record<ItemType, Record<string, FieldText>> = {
  comicSeries: {
    title: { label: 'Title', help: "The series' name, as readers see it.", missing: 'a title' },
    slug: {
      label: 'Web address',
      help: "Fills itself in from the title. It's the last part of the series' address on the site: kettlebird.com/comics/kettle-tales. Leave it as it is once people may have shared links.",
      missing: 'a web address',
    },
    coverImage: { label: 'Cover', help: "Shown on the Comics page and the series' own page." },
    description: { label: 'Description', help: 'A sentence or two about the series, shown on its page.' },
    status: { label: 'Status', help: 'Ongoing, Complete, or On Hiatus. Shown as a tag, and in the message at the end of the newest page.' },
    type: { label: 'Kind', help: 'Original or Fancomic, shown as a tag.' },
    chapters: { label: 'Chapters', help: 'In number order. Choose one to open it and its pages.' },
  },
  galleryItem: {
    title: { label: 'Title', help: "Shown when someone points at the picture, and as the heading when it's opened.", missing: 'a title' },
    image: {
      label: 'Picture',
      help: "Upload the original file; the site makes smaller copies. Your portfolio shows square thumbnails: to keep the important part in view, choose the picture's Edit button, then drag the circle over the part that matters.",
      missing: 'the picture',
    },
    altText: { label: 'Alt text', help: "What the picture shows, for people using screen readers. If it's empty, they hear only the title." },
    category: {
      label: 'Portfolio sections',
      help: 'The sections of your portfolio it appears in: Original Work, Fan Work, Past Clients, Featured, Work in Progress. A piece can be in more than one.',
      missing: 'at least one portfolio section',
      atLeastOne: true,
    },
    description: { label: 'Description', help: 'Shown when someone opens the picture on your portfolio.' },
    tags: { label: 'Tags', help: "Words shown under the picture when it's opened, like a character's name. Type one, then press Enter." },
    date: { label: 'Date', help: 'When you made it. The portfolio shows newest first; pieces without a date come last.' },
  },
  writtenWork: {
    title: { label: 'Title', help: "The story's title.", missing: 'a title' },
    externalLink: { label: 'Link to read it', help: "Where the Writing page's Read it button goes, such as the story on AO3." },
    excerpt: { label: 'Short description', help: 'A sentence or two, shown on the Writing page.' },
    coverImage: { label: 'Cover', help: 'Shown beside the story on the Writing page, cropped to a tall rectangle.' },
    genre: { label: 'Genres', help: 'Shown as tags on the Writing page. Type one, then press Enter.' },
    publishDate: { label: 'Date posted', help: 'The Writing page shows newest first.' },
  },
  product: {
    name: { label: 'Name', help: "The product's name in the shop.", missing: 'a name' },
    category: {
      label: 'Shop section',
      help: "Which section of the shop it's listed under: Prints, Stickers, or Digital. Within a section, products are listed by name.",
      missing: 'a shop section',
    },
    price: { label: 'Price', help: 'Shown exactly as you write it, so include the currency: $4, or $4 each.' },
    images: { label: 'Pictures', help: 'The first is the one shown in the shop, cropped square from the centre. Drag a picture to change the order.' },
    description: { label: 'Description', help: 'Shown in the shop under the name.' },
    kofiLink: { label: 'Ko-fi link', help: "Where the shop's Buy button goes, until the site has its own checkout. Without it, there's no Buy button." },
  },
  commissionType: {
    name: { label: 'Name', help: 'Like "Full colour illustration", shown as the heading.', missing: 'a name' },
    priceRange: { label: 'Price range', help: 'Shown exactly as you write it, like $80–150.' },
    description: { label: "What's included", help: 'Shown under the name on the Commissions page.' },
    exampleImages: { label: 'Examples', help: 'Pictures of past commissions of this kind. The first three are shown, cropped square from the centre. Drag a picture to change the order.' },
    deliveryTime: { label: 'How long it takes', help: 'Shown as "Est. delivery", like 2–3 weeks.' },
    order: { label: 'Order on the page', help: 'Lower numbers come first on the Commissions page, and in this list. Number them 1, 2, 3; to move one, change the numbers.' },
  },
};

/** AC-3: stored fields the site doesn't use yet, hidden but kept. */
export const HIDDEN: Record<ItemType, string[]> = {
  comicSeries: [],
  galleryItem: ['slug', 'featured'],
  writtenWork: ['slug', 'content'],
  product: ['slug', 'tags', 'inventory'],
  commissionType: [],
};

/** AC-3, AC-5: the label and help Sanity shows for a field: { title, description }. */
export function fieldText(type: ItemType, name: string): { title: string; description: string } {
  const field = FIELDS[type][name];
  if (!field) throw new Error(`No text for ${type}.${name}`);
  const marker = field.atLeastOne ? ' (choose at least one)' : field.missing ? ' (required)' : '';
  return { title: field.label + marker, description: field.help };
}

/** AC-5: the message on an empty required field: what to add, and what it's for. */
export function requiredMessage(type: ItemType, name: string): string {
  const field = FIELDS[type][name];
  if (!field?.missing) throw new Error(`${type}.${name} isn't required`);
  return `Add ${field.missing} to publish. ${field.help}`;
}

export interface Option { title: string; value: string }

/** AC-8: stored values unchanged, labels as the portfolio shows them. */
export const PORTFOLIO_SECTIONS: Option[] = [
  { title: 'Original Work', value: 'original' },
  { title: 'Fan Work', value: 'fanart' },
  { title: 'Past Clients', value: 'commission' },
  { title: 'Featured', value: 'featured' },
  { title: 'Work in Progress', value: 'wip' },
];

/** AC-8 */
export const SHOP_SECTION_OPTIONS: Option[] = [
  { title: 'Prints', value: 'print' },
  { title: 'Stickers', value: 'sticker' },
  { title: 'Digital', value: 'digital' },
];

/** AC-8 */
export const SERIES_STATUS: Option[] = [
  { title: 'Ongoing', value: 'ongoing' },
  { title: 'Complete', value: 'complete' },
  { title: 'On Hiatus', value: 'hiatus' },
];

/** AC-8 */
export const SERIES_KIND: Option[] = [
  { title: 'Original', value: 'original' },
  { title: 'Fancomic', value: 'fancomic' },
];

const labelOf = (options: Option[], value: unknown) => options.find((o) => o.value === value)?.title;

/** AC-2: the short detail under an item in its list. */
export function listDetail(type: ItemType, item: Record<string, unknown>): string | undefined {
  switch (type) {
    case 'comicSeries':
      return labelOf(SERIES_STATUS, item.status);
    case 'galleryItem': {
      // In the portfolio's own order.
      const chosen = item.category;
      const titles = PORTFOLIO_SECTIONS.filter((o) => Array.isArray(chosen) && chosen.includes(o.value)).map((o) => o.title);
      return titles.length ? titles.join(', ') : undefined;
    }
    case 'writtenWork':
      return typeof item.publishDate === 'string' && item.publishDate ? item.publishDate : undefined;
    case 'product':
      return labelOf(SHOP_SECTION_OPTIONS, item.category);
    case 'commissionType':
      return typeof item.priceRange === 'string' && item.priceRange ? item.priceRange : undefined;
  }
}

/** AC-6: the box at the top of an item, from its empty required fields in form order. */
export function missingSummary(type: ItemType, missingFields: string[]): string | null {
  const phrases = Object.entries(FIELDS[type])
    .filter(([name, field]) => field.missing && missingFields.includes(name))
    .map(([, field]) => field.missing!);
  return phrases.length ? `Add these before publishing: ${phrases.join('; ')}` : null;
}

/** AC-6: the badge beside Publish. */
export function thingsToAdd(count: number): string | null {
  if (count <= 0) return null;
  return `${count} ${count === 1 ? 'thing' : 'things'} to add before publishing`;
}

/** AC-7 */
export const PIECE_ALT_TEXT_WARNING = 'Add alt text so people using screen readers can follow it';

/** AC-4: words no label, help text or message may use. */
export const DEVELOPER_WORDS = ['slug', 'reference', 'document', 'schema', 'array', 'category', 'boolean'];

/** AC-6: the stored names of required fields that have an error, from Sanity's validation paths. */
export function missingFields(type: ItemType, errorPaths: unknown[][]): string[] {
  const names = new Set(errorPaths.map((path) => path[0]));
  return Object.entries(FIELDS[type]).filter(([name, field]) => field.missing && names.has(name)).map(([name]) => name);
}

/** The kinds of item the editor organises, for the create menu (AC-11). */
export const ITEM_TYPES = SECTIONS.flatMap((s) => (s.type ? [s.type] : []));
export const isItemType = (name: string): name is ItemType => (ITEM_TYPES as string[]).includes(name);
