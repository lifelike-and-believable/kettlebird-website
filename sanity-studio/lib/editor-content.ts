// Everything the editor says to Star: its menu, each form's labels and help text, option labels,
// messages and list details. No `sanity` imports, so the site's Vitest can check it against the
// design. Spec: docs/specs/content-editing-organised-editor.md; design: docs/design/organised-editor.md.

export type ItemType = 'comicSeries' | 'galleryItem' | 'portfolioSubfolder' | 'writtenWork' | 'product' | 'commissionType';

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

/** portfolio-folders AC-17: Art's two lists. */
export const ART_LISTS: (Section & { type: ItemType })[] = [
  { title: 'Pieces', type: 'galleryItem', newLabel: 'New piece', ordering: [['date', 'desc'], ['_createdAt', 'desc']] },
  { title: 'Subfolders', type: 'portfolioSubfolder', newLabel: 'New subfolder', ordering: [['_createdAt', 'desc']] },
];

/** What each kind of item is called (Sanity's type titles). */
export const ITEM_NAMES: Record<ItemType | 'comicChapter' | 'storyChapter', string> = {
  comicSeries: 'Series',
  comicChapter: 'Chapter',
  storyChapter: 'Chapter',
  galleryItem: 'Piece',
  portfolioSubfolder: 'Subfolder',
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
  /** Needed only in some cases (a story's, once it has text or chapters), so no "(required)". */
  sometimes?: boolean;
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
      // portfolio-folders AC-24
      help: "Upload the original file; the site makes smaller copies. Pieces show whole; in a subfolder's grid they're cropped square. To keep the important part in view there, choose the picture's Edit button, then drag the circle over the part that matters.",
      missing: 'the picture',
    },
    altText: { label: 'Alt text', help: "What the picture shows, for people using screen readers. If it's empty, they hear only the title." },
    category: {
      label: 'Portfolio sections',
      help: 'The sections of your portfolio it appears in: Original Work, Fan Work, Past Clients, Featured, Work in Progress. A piece can be in more than one.',
      missing: 'at least one portfolio section',
      atLeastOne: true,
    },
    // portfolio-folders AC-20
    subfolders: {
      label: 'Subfolders',
      help: 'Optional. At most one in each section this piece is in. Left as Loose, the piece shows on its own in that section.',
    },
    description: { label: 'Description', help: 'Shown when someone opens the picture on your portfolio.' },
    tags: { label: 'Tags', help: "Words shown under the picture when it's opened, like a character's name. Type one, then press Enter." },
    date: { label: 'Date', help: 'When you made it. The portfolio shows newest first; pieces without a date come last.' },
  },
  // portfolio-folders AC-18, AC-19
  portfolioSubfolder: {
    name: {
      label: 'Name',
      help: 'Shown under its thumbnail, and on the section\'s tab after the section\'s name when it\'s open ("Fan Work: Murderbot").',
      missing: 'a name',
    },
    slug: { label: 'Web address', help: 'Made from the name. Leave it as it is once people may have shared links to it.', missing: 'a web address' },
    section: {
      label: 'Section',
      help: "The Portfolio section it's in. Set when you make it; to move pieces to another section, make a subfolder there.",
      missing: 'a section',
    },
    gridSize: { label: 'Grid size', help: 'How many of its pieces its thumbnail shows, newest first.' },
  },
  writtenWork: {
    title: { label: 'Title', help: "The story's title.", missing: 'a title' },
    slug: {
      label: 'Web address',
      help: "It's the last part of the story's link: kettlebird.com/writing/the-kettles-song. Filled in from the title. Changing it after people have shared links breaks them.",
      missing: 'a web address',
      sometimes: true,
    },
    excerpt: { label: 'Short description', help: 'A sentence or two, shown on the Writing page and when the story is shared.' },
    coverImage: { label: 'Cover', help: 'Shown beside the story on the Writing page and at the top of its page.' },
    genre: { label: 'Genres', help: 'Shown as tags. Type one, then press Enter.' },
    // story-mature-content AC-1.
    mature: {
      label: 'Mature or explicit content',
      help: "Tick it for sex scenes, graphic violence or other strong content. Readers are then asked before the text shows, and the story's card and page say so. Left unticked, readers go straight to the text. It covers the story and all its chapters. Search engines are told too, so it can be left out for people searching with safe search on.",
    },
    contentNotes: { label: 'Content notes', help: 'Anything a reader should know before starting, such as "Mild violence". Shown before the story.' },
    status: { label: 'Status', help: 'For a story in chapters: In progress or Complete.' },
    content: { label: 'Text', help: 'For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead.' },
    chapters: { label: 'Chapters', help: 'For a story in chapters. Each chapter has its own page.' },
    publishDate: { label: 'Date posted', help: 'The Writing page shows newest first.' },
    externalLink: {
      label: 'Link to read it',
      help: "Optional: the story somewhere else, such as AO3. Without text on the site, the Writing page's Read it opens it; with text, it's shown as \"Also on AO3\".",
    },
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
  portfolioSubfolder: [],
  writtenWork: [],
  product: ['slug', 'tags', 'inventory'],
  commissionType: [],
};

/** AC-3, AC-5: the label and help Sanity shows for a field: { title, description }. */
export function fieldText(type: ItemType, name: string): { title: string; description: string } {
  const field = FIELDS[type][name];
  if (!field) throw new Error(`No text for ${type}.${name}`);
  const marker = field.atLeastOne ? ' (choose at least one)' : field.missing && !field.sometimes ? ' (required)' : '';
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
      // In the portfolio's own order, then its subfolders (portfolio-folders AC-21).
      const chosen = item.category;
      const titles = PORTFOLIO_SECTIONS.filter((o) => Array.isArray(chosen) && chosen.includes(o.value)).map((o) => o.title);
      const subs = (Array.isArray(item.subfolderNames) ? item.subfolderNames : []).filter((n): n is string => typeof n === 'string' && n !== '');
      return titles.length ? [titles.join(', '), ...(subs.length ? [subs.join(', ')] : [])].join(' · ') : undefined;
    }
    case 'portfolioSubfolder': {
      // portfolio-folders AC-18: "Fan Work · 2 × 2 · 4 pieces".
      if (typeof item.section !== 'string') return undefined;
      const size = typeof item.gridSize === 'number' ? item.gridSize : 2;
      const count = typeof item.count === 'number' ? item.count : 0;
      return `${sectionTitle(item.section)} · ${size} × ${size} · ${count} ${count === 1 ? 'piece' : 'pieces'}`;
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
export const ITEM_TYPES: ItemType[] = [...SECTIONS.flatMap((s) => (s.type ? [s.type] : [])), 'portfolioSubfolder'];
export const isItemType = (name: string): name is ItemType => (ITEM_TYPES as string[]).includes(name);

// ── Subfolders (portfolio-folders AC-18 to AC-22) ─────────────────────────────

/** AC-18 */
export const GRID_SIZES: { title: string; value: number }[] = [2, 3, 4].map((n) => ({ title: `${n} × ${n}`, value: n }));

/** A section's title, as the portfolio shows it. */
export const sectionTitle = (value: string) => labelOf(PORTFOLIO_SECTIONS, value) ?? value;

const pieces = (count: number) => `${count} ${count === 1 ? 'piece' : 'pieces'}`;

/** AC-18: the end of Grid size's help. */
export function gridHint(name: string, count: number, size: number): string {
  if (count <= 0) return `${name} has no pieces yet.`;
  const cells = size * size;
  const shows = count > cells ? `the newest ${cells}` : count === 1 ? `it, with ${cells - 1} empty cells` : 'them all';
  return `${name} has ${pieces(count)}: ${size} × ${size} shows ${shows}.`;
}

/** AC-19: a published subfolder's section can't change. */
export const sectionLocked = (published: string | undefined, draft: string | undefined) => Boolean(published) && published !== draft;

/** AC-20: one choice per section the piece is in, in the portfolio's order. */
export function subfolderChoices(
  categories: string[],
  subfolders: { _id: string; name: string; section: string }[],
  chosen: string[],
): { section: string; title: string; options: { id: string; name: string }[]; chosen: string | undefined; empty: string | undefined }[] {
  return ['featured', 'original', 'fanart', 'commission', 'wip']
    .filter((section) => categories.includes(section))
    .map((section) => {
      const options = subfolders.filter((s) => s.section === section).map((s) => ({ id: s._id, name: s.name }));
      return {
        section,
        title: sectionTitle(section),
        options,
        chosen: options.find((o) => chosen.includes(o.id))?.id,
        empty: options.length ? undefined : 'Loose (no subfolders yet)',
      };
    });
}

/** AC-20: what stops a piece's subfolders being published, if anything. */
export function subfolderProblems(categories: string[], chosen: { name: string; section: string }[]): string | undefined {
  const outside = chosen.find((s) => !categories.includes(s.section));
  if (outside) {
    const title = sectionTitle(outside.section);
    return `${outside.name} is in ${title}, which this piece isn't in. Tick ${title}, or choose Loose.`;
  }
  const twice = chosen.find((s, i) => chosen.findIndex((t) => t.section === s.section) !== i);
  return twice ? `Choose at most one subfolder in ${sectionTitle(twice.section)}.` : undefined;
}

/** AC-21 */
export const leaveNote = (section: string, name: string) => `If you untick ${section}, this piece also leaves ${name} when you publish.`;

/** AC-22 */
export function deleteMessage(name: string, count: number, section: string): string {
  const stay =
    count <= 0 ? 'It has no pieces.' : count === 1 ? `Its 1 piece stays in ${section}, shown on its own.` : `Its ${count} pieces stay in ${section}, shown on their own.`;
  return `Delete ${name}? ${stay} Its web address stops working: links people shared to it will show Page not found.`;
}
