// Site settings on the site: the starting values, reading the four items Star publishes (with the
// starting values for any that is missing), paragraphs, link colours, and what the Commissions page
// and the about page say (content-editing-site-settings AC-6 to AC-12; design-site-settings).
// No Sanity imports, so unit tests and mutation testing can run it directly.

export interface Link { name: string; url: string }
export interface Fact { label: string; value: string }
export interface Picture { src: string; width: number; height: number }
export interface Settings {
  commissions: { open: boolean; note: string };
  about: { portrait: Picture | null; portraitAlt: string; bio: string[]; statement: string[]; facts: Fact[] };
  home: { text: string[] };
  contact: { email: string; links: Link[] };
}
/** The four published items, by type, as Sanity returns them. */
export type RawSettings = Record<string, Record<string, unknown> | null | undefined>;

const STARTING_EMAIL = 'kettlebirdillustration@gmail.com';

/** What each item starts with: today's site (design-site-settings, starting values). The editor's
 * initial values (sanity-studio/lib/site-settings.ts) are the same; a unit test checks they agree. */
export const STARTING: RawSettings = {
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
    email: STARTING_EMAIL,
    links: [
      { name: 'Bluesky', url: 'https://bsky.app/profile/kettlebird.bsky.social' },
      { name: 'Tumblr', url: 'https://kettle-bird.tumblr.com' },
      { name: 'Instagram', url: 'https://www.instagram.com/kettlebirdart' },
      { name: 'Ko-fi ☕', url: 'https://ko-fi.com/kettlebirdart' },
    ],
  },
};

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
// Stryker disable next-line ArrayDeclaration: equivalent; the filters below drop anything that isn't a fact or link.
const list = (value: unknown): Record<string, unknown>[] => (Array.isArray(value) ? value : []);

/** Plain text in paragraphs: blank lines separate them, and spaces alone are empty (AC-12). */
export function paragraphs(value: unknown): string[] {
  return text(value).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export function readSettings(raw: RawSettings, picture: (image: unknown) => Picture | null = () => null): Settings {
  const item = (type: string) => raw[type] ?? STARTING[type] ?? {};
  const commissions = item('commissionSettings');
  const about = item('aboutPage');
  const contact = item('contactSettings');
  const portrait = about.portrait as { asset?: unknown; alt?: unknown } | undefined;
  return {
    commissions: { open: commissions.status !== 'closed', note: text(commissions.note) },
    about: {
      portrait: portrait?.asset ? picture(portrait) : null,
      portraitAlt: text(portrait?.alt),
      bio: paragraphs(about.bio),
      statement: paragraphs(about.statement),
      facts: list(about.facts).map((f) => ({ label: text(f.label), value: text(f.value) })).filter((f) => f.label && f.value),
    },
    home: { text: paragraphs(item('homePage').artistText) },
    contact: {
      email: text(contact.email) || STARTING_EMAIL,
      links: list(contact.links).map((l) => ({ name: text(l.name), url: text(l.url) })).filter((l) => l.name && l.url),
    },
  };
}

const COLOURS = ['green', 'yellow', 'orange', 'pink'];

/** Link buttons go green, yellow, orange, pink, then repeat (AC-10). */
export function linkColour(index: number): string {
  return COLOURS[index % COLOURS.length];
}

export interface CommissionsView { open: boolean; heading: string; note: string; intro: string; showOrdering: boolean; outro: string }

/** What the Commissions page says, open or closed (AC-7). */
export function commissionsView(s: Settings): CommissionsView {
  if (s.commissions.open) {
    return { open: true, heading: 'Commissions are open.', note: 'Email me to get started.', intro: '', showOrdering: true, outro: '' };
  }
  return {
    open: false,
    heading: 'Commissions are closed.',
    note: s.commissions.note,
    intro: 'These are the kinds of commission I take, for when they open again.',
    showOrdering: false,
    outro: s.contact.links.length
      ? 'Commissions are closed for now. To hear when they open, follow me on the social links at the bottom of the page.'
      : '',
  };
}

/** The about page's Get in touch line (AC-8). */
export function getInTouchText(open: boolean): string {
  return open ? 'For commission inquiries, collaboration ideas, or just to say hi:' : 'To ask about collaborations, or just to say hi:';
}
