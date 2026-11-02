// Site settings in the editor: the four items, their field names and help text, the rules and their
// messages, the summary of what to fix, and the starting values (content-editing-site-settings AC-1 to
// AC-6; design-site-settings). No `sanity` imports, so unit tests and mutation testing can run it.

export const SETTINGS_ITEMS = [
  { type: 'commissionSettings', title: 'Commissions' },
  { type: 'aboutPage', title: 'About page' },
  { type: 'homePage', title: 'Home page' },
  { type: 'contactSettings', title: 'Contact and social links' },
];
export const SETTINGS_TYPES = SETTINGS_ITEMS.map((item) => item.type);
export const isSettingsType = (name: string) => SETTINGS_TYPES.includes(name);

/** The only document actions these items have: no delete, duplicate or unpublish (AC-1). */
export const SETTINGS_ACTIONS = ['publish', 'discardChanges', 'restore'];

type FieldText = { label: string; description: string };
export const SETTINGS_FIELDS: Record<string, Record<string, FieldText>> = {
  commissionSettings: {
    status: { label: 'Commissions are…', description: 'Open or Closed. Changes the banner at the top of your Commissions page, and whether it shows how to order.' },
    note: { label: 'Note when closed', description: 'Shown after "Commissions are closed." exactly as you write it, like "Back in March." Leave empty for no note. Up to 120 characters.' },
  },
  aboutPage: {
    portrait: { label: 'Portrait', description: "A picture of you, or a self-portrait. Shown at the top of the about page, and beside the home page's artist text. To choose what stays in view when it's cropped, choose the picture's Edit button." },
    alt: { label: "Portrait's alt text", description: "What the portrait shows, for people using screen readers. If it's empty, screen readers skip the portrait." },
    bio: { label: 'Hello! (your bio)', description: 'A few paragraphs about you, under the heading Hello! Leave a blank line between paragraphs. Leave empty to leave the section out.' },
    statement: { label: 'The Work (your artist statement)', description: 'What your work is about, under the heading The Work. Leave a blank line between paragraphs. Leave empty to leave the section out.' },
    facts: { label: 'At a glance', description: "Short facts in the about page's side box, in this order. Choose a fact to change it; drag to reorder." },
    factLabel: { label: 'Label', description: 'Like "Based in".' },
    factValue: { label: 'Value', description: 'Like "Vancouver, BC".' },
  },
  homePage: {
    artistText: { label: 'Artist text', description: "A sentence or two about you, under the home page's social links, beside your portrait (from About page). Leave a blank line between paragraphs. Don't mention whether commissions are open: the Commissions page says that, and changes when you do. Leave empty to leave the block out." },
  },
  contactSettings: {
    email: { label: 'Contact email', description: "Where every email button on the site sends people: the footer's Contact, the about page's Get in touch, and the Commissions page's buttons." },
    links: { label: 'Social links', description: "Shown in this order on the home page, in every page's footer, and on the about page. Choose a link to change it; drag to reorder; Remove to take one away." },
    linkName: { label: 'Name', description: 'As it shows on the button, like "Instagram".' },
    linkUrl: { label: 'Link', description: "The page it opens. Copy it from your browser's address bar." },
  },
};

export const MESSAGES = {
  linkNotUrl: "This isn't a web address. Copy the link from your browser's address bar; it starts with https:// (or http://).",
  linkNoName: 'Give this link a name, as it shows on the button.',
  linkNoUrl: 'Add the page this link opens.',
  emailBad: "This doesn't look like an email address.",
  emailEmpty: 'Add the email address people should write to.',
  factPair: 'Fill in both the label and the value, or remove this fact.',
  noteLong: 'Keep the note under 120 characters, so it fits the banner on a phone.',
  altMissing: 'Add alt text so people using screen readers know what the portrait shows.',
};

/** The short form of each message in the summary at the top of an item (AC-4). */
const SHORT: Record<string, string> = {
  [MESSAGES.linkNotUrl]: "the link isn't a web address",
  [MESSAGES.linkNoName]: 'give it a name',
  [MESSAGES.linkNoUrl]: 'add the page it opens',
  [MESSAGES.emailBad]: "this doesn't look like an email address",
  [MESSAGES.emailEmpty]: 'add the email address people should write to',
  [MESSAGES.factPair]: 'fill in both the label and the value',
  [MESSAGES.noteLong]: 'keep it under 120 characters',
};

export const ADD_LABELS = { facts: '+ Add a fact', links: '+ Add a link' };

export const NOTE_LIMIT = 120;

/** A row in a list of facts or links: "Name · Link" (AC-5). */
export function rowTitle(first?: string, second?: string): string {
  return [first, second].filter((part) => part && part.trim()).join(' · ') || 'New';
}

const filled = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

/** A complete http or https address, with no spaces (AC-3). */
export function isWebAddress(value: unknown): boolean {
  if (!filled(value) || /\s/.test(value)) return false;
  return /^https?:\/\/[^/?#]+\.[^/?#]/i.test(value);
}

export function linkMessage(field: 'name' | 'url', link: { name?: string; url?: string } | undefined): string | true {
  const name = link?.name;
  const url = link?.url;
  if (field === 'name') return filled(name) ? true : MESSAGES.linkNoName;
  if (!filled(url)) return MESSAGES.linkNoUrl;
  return isWebAddress(url) ? true : MESSAGES.linkNotUrl;
}

export function factMessage(fact: { label?: string; value?: string } | undefined): string | true {
  const { label, value } = fact ?? {};
  return filled(label) && filled(value) ? true : MESSAGES.factPair;
}

export function emailMessage(email: unknown): string | true {
  if (!filled(email)) return MESSAGES.emailEmpty;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? true : MESSAGES.emailBad;
}

export function noteMessage(note: unknown): string | true {
  return typeof note === 'string' && note.trim().length > NOTE_LIMIT ? MESSAGES.noteLong : true;
}

type Marker = { path: unknown[]; message: string; level: string };
type Keyed = { _key?: string; name?: string; label?: string };

/** One line per problem: a link or fact by its name or label, a field by its name (AC-4). */
export function fixLines(markers: Marker[], value: Record<string, unknown> | undefined, type: string): string[] {
  return markers
    .filter((marker) => marker.level === 'error')
    .map((marker) => {
      const [field, item] = marker.path as [string, { _key?: string } | undefined];
      const short = SHORT[marker.message] ?? marker.message;
      if (item) {
        const entry = (value?.[field] as Keyed[] | undefined)?.find((e) => e._key === item._key);
        const named = field === 'links' ? entry?.name : entry?.label;
        return `${filled(named) ? named.trim() : field === 'links' ? 'A link' : 'A fact'}: ${short}`;
      }
      return `${SETTINGS_FIELDS[type]?.[field]?.label ?? field}: ${short}`;
    });
}

export function fixSummary(lines: string[]): string | null {
  return lines.length ? ['Fix this before publishing:', ...lines.map((line) => `· ${line}`)].join('\n') : null;
}

export function thingsToFix(count: number): string | null {
  if (count <= 0) return null;
  return `${count} ${count === 1 ? 'thing' : 'things'} to fix before publishing`;
}

/** What each item starts with: today's site (AC-6). The site's own fallback (src/lib/site-settings.ts)
 * is the same; a unit test checks they agree. */
export const STARTING_VALUES: Record<string, Record<string, unknown>> = {
  commissionSettings: { status: 'open' },
  aboutPage: {
    facts: [
      { label: 'Pronouns', value: 'they/them' },
      { label: 'Based in', value: 'Vancouver, BC' },
      { label: 'Makes', value: 'Illustration, comics, fiction' },
      { label: 'Loves', value: 'Fantasy, found family, character design' },
    ],
  },
  homePage: {},
  contactSettings: {
    email: 'kettlebirdillustration@gmail.com',
    links: [
      { name: 'Bluesky', url: 'https://bsky.app/profile/kettlebird.bsky.social' },
      { name: 'Tumblr', url: 'https://kettle-bird.tumblr.com' },
      { name: 'Instagram', url: 'https://www.instagram.com/kettlebirdart' },
      { name: 'Ko-fi ☕', url: 'https://ko-fi.com/kettlebirdart' },
    ],
  },
};
