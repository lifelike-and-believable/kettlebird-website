// Site settings: the four items in the editor, their rules and messages, and what the site shows from
// them. Criteria: docs/specs/content-editing-site-settings.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  commissionsView, getInTouchText, linkColour, paragraphs, readSettings, STARTING, type RawSettings,
} from '../../src/lib/site-settings';
import {
  ADD_LABELS, emailMessage, factMessage, fixLines, fixSummary, isSettingsType, isWebAddress, linkMessage, MESSAGES,
  noteMessage, rowTitle, SETTINGS_ACTIONS, SETTINGS_FIELDS, SETTINGS_ITEMS, SETTINGS_TYPES, STARTING_VALUES, thingsToFix,
} from '../../sanity-studio/lib/site-settings';
import { CONTENT_TYPES, viewOnSitePath } from '../../sanity-studio/lib/live-status';
import { TYPES } from '../../scripts/live-check.mjs';

const read = (path: string) => readFileSync(path, 'utf8');
const LINKS = [
  { name: 'Bluesky', url: 'https://bsky.app/profile/kettlebird.bsky.social' },
  { name: 'Tumblr', url: 'https://kettle-bird.tumblr.com' },
  { name: 'Instagram', url: 'https://www.instagram.com/kettlebirdart' },
  { name: 'Ko-fi ☕', url: 'https://ko-fi.com/kettlebirdart' },
];
const FACTS = [
  { label: 'Pronouns', value: 'they/them' },
  { label: 'Based in', value: 'Vancouver, BC' },
  { label: 'Makes', value: 'Illustration, comics, fiction' },
  { label: 'Loves', value: 'Fantasy, found family, character design' },
];

describe('content-editing-site-settings#AC-1 menu', () => {
  it('lists the four items, in order, as singletons with only Publish, Discard changes and Restore', () => {
    expect(SETTINGS_ITEMS).toEqual([
      { type: 'commissionSettings', title: 'Commissions' },
      { type: 'aboutPage', title: 'About page' },
      { type: 'homePage', title: 'Home page' },
      { type: 'contactSettings', title: 'Contact and social links' },
    ]);
    expect(SETTINGS_TYPES).toEqual(['commissionSettings', 'aboutPage', 'homePage', 'contactSettings']);
    expect(isSettingsType('aboutPage')).toBe(true);
    expect(isSettingsType('galleryItem')).toBe(false);
    expect(SETTINGS_ACTIONS).toEqual(['publish', 'discardChanges', 'restore']);
  });
  it('wires the items into the menu, the config and the schemas, and drops the note', () => {
    const structure = read('sanity-studio/structure.ts');
    expect(structure).toMatch(/SETTINGS_ITEMS/);
    expect(structure).toMatch(/\.documentId\(/);
    expect(structure).not.toMatch(/SiteSettingsNote/);
    const config = read('sanity-studio/sanity.config.ts');
    expect(config).toMatch(/isSettingsType/);
    expect(config).toMatch(/SETTINGS_ACTIONS/);
    expect(config).toMatch(/ThingsToFixBadge/);
    const schemas = read('sanity-studio/schemas/index.ts');
    for (const type of ['commissionSettings', 'aboutPage', 'homePage', 'contactSettings']) expect(schemas).toMatch(new RegExp(type));
    expect(read('sanity-studio/lib/editor-content.ts')).not.toMatch(/SITE_SETTINGS_NOTE/);
  });
});

describe('content-editing-site-settings#AC-2 AC-5 fields', () => {
  it("uses the design's names and help text", () => {
    expect(SETTINGS_FIELDS.commissionSettings.status).toEqual({
      label: 'Commissions are…',
      description: 'Open or Closed. Changes the banner at the top of your Commissions page, and whether it shows how to order.',
    });
    expect(SETTINGS_FIELDS.commissionSettings.note).toEqual({
      label: 'Note when closed',
      description: 'Shown after "Commissions are closed." exactly as you write it, like "Back in March." Leave empty for no note. Up to 120 characters.',
    });
    expect(SETTINGS_FIELDS.aboutPage.portrait.label).toBe('Portrait');
    expect(SETTINGS_FIELDS.aboutPage.portrait.description).toBe("A picture of you, or a self-portrait. Shown at the top of the about page, and beside the home page's artist text. To choose what stays in view when it's cropped, choose the picture's Edit button.");
    expect(SETTINGS_FIELDS.aboutPage.alt).toEqual({ label: "Portrait's alt text", description: "What the portrait shows, for people using screen readers. If it's empty, screen readers skip the portrait." });
    expect(SETTINGS_FIELDS.aboutPage.bio.label).toBe('Hello! (your bio)');
    expect(SETTINGS_FIELDS.aboutPage.statement.label).toBe('The Work (your artist statement)');
    expect(SETTINGS_FIELDS.aboutPage.facts.label).toBe('At a glance');
    expect(SETTINGS_FIELDS.homePage.artistText.label).toBe('Artist text');
    expect(SETTINGS_FIELDS.homePage.artistText.description).toMatch(/^A sentence or two about you, under the home page's social links, beside your portrait \(from About page\)\./);
    expect(SETTINGS_FIELDS.contactSettings.email).toEqual({
      label: 'Contact email',
      description: "Where every email button on the site sends people: the footer's Contact, the about page's Get in touch, and the Commissions page's buttons.",
    });
    expect(SETTINGS_FIELDS.contactSettings.links.label).toBe('Social links');
    expect(SETTINGS_FIELDS.contactSettings.links.description).toBe("Shown in this order on the home page, in every page's footer, and on the about page. Choose a link to change it; drag to reorder; Remove to take one away.");
  });
  it('labels the add buttons and rows as the mock-ups do', () => {
    expect(ADD_LABELS).toEqual({ facts: '+ Add a fact', links: '+ Add a link' });
    expect(rowTitle('Instagram', 'https://www.instagram.com/kettlebirdart')).toBe('Instagram · https://www.instagram.com/kettlebirdart');
    expect(rowTitle('Instagram', undefined)).toBe('Instagram');
    expect(rowTitle(undefined, 'https://x.example')).toBe('https://x.example');
    expect(rowTitle(undefined, undefined)).toBe('New');
    for (const file of ['aboutPage', 'contactSettings']) expect(read(`sanity-studio/schemas/objects/${file}.ts`)).toMatch(/AddItemButton|arrayFunctions/);
  });
});

describe('content-editing-site-settings#AC-3 rules', () => {
  it('accepts only complete http or https addresses with no spaces', () => {
    for (const ok of ['https://ko-fi.com/kettlebirdart', 'http://example.com', 'https://bsky.app/profile/kettlebird.bsky.social']) expect(isWebAddress(ok), ok).toBe(true);
    for (const bad of ['instagram kettlebirdart', 'www.instagram.com/x', 'kettlebird@gmail.com', 'mailto:a@b.com', 'https://', 'https://exa mple.com', 'ftp://x.com', '', undefined]) expect(isWebAddress(bad), String(bad)).toBe(false);
  });
  it("gives the design's messages", () => {
    expect(linkMessage('url', { name: 'Instagram', url: 'instagram kettlebirdart' })).toBe("This isn't a web address. Copy the link from your browser's address bar; it starts with https:// (or http://).");
    expect(linkMessage('url', { name: 'Instagram' })).toBe('Add the page this link opens.');
    expect(linkMessage('name', { url: 'https://x.example' })).toBe('Give this link a name, as it shows on the button.');
    expect(linkMessage('name', { name: '  ', url: 'https://x.example' })).toBe('Give this link a name, as it shows on the button.');
    expect(linkMessage('url', { name: 'Bluesky', url: 'https://bsky.app' })).toBe(true);
    expect(linkMessage('name', { name: 'Bluesky', url: 'https://bsky.app' })).toBe(true);
    expect(emailMessage('')).toBe('Add the email address people should write to.');
    expect(emailMessage('  ')).toBe('Add the email address people should write to.');
    expect(emailMessage('kettlebird at gmail')).toBe("This doesn't look like an email address.");
    expect(emailMessage('a@b')).toBe("This doesn't look like an email address.");
    expect(emailMessage('kettlebirdillustration@gmail.com')).toBe(true);
    expect(factMessage({ label: 'Based in' })).toBe('Fill in both the label and the value, or remove this fact.');
    expect(factMessage({ value: 'Vancouver' })).toBe('Fill in both the label and the value, or remove this fact.');
    expect(factMessage({ label: 'Based in', value: 'Vancouver, BC' })).toBe(true);
    expect(noteMessage('x'.repeat(120))).toBe(true);
    expect(noteMessage('x'.repeat(121))).toBe('Keep the note under 120 characters, so it fits the banner on a phone.');
    expect(noteMessage(undefined)).toBe(true);
    expect(MESSAGES.altMissing).toBe('Add alt text so people using screen readers know what the portrait shows.');
  });
});

describe('content-editing-site-settings#AC-4 summary', () => {
  it('lists each problem, naming the link or fact it belongs to, and counts them', () => {
    const value = { email: 'x', links: [{ _key: 'a', name: 'Instagram', url: 'instagram kettlebirdart' }, { _key: 'b', url: 'https://x.example' }] };
    const lines = fixLines([
      { path: ['links', { _key: 'a' }, 'url'], message: MESSAGES.linkNotUrl, level: 'error' },
      { path: ['links', { _key: 'b' }, 'name'], message: MESSAGES.linkNoName, level: 'error' },
      { path: ['email'], message: MESSAGES.emailBad, level: 'error' },
      { path: ['portrait'], message: MESSAGES.altMissing, level: 'warning' },
    ], value, 'contactSettings');
    expect(lines).toEqual([
      "Instagram: the link isn't a web address",
      'A link: give it a name',
      "Contact email: this doesn't look like an email address",
    ]);
    expect(fixSummary(lines)).toBe("Fix this before publishing:\n· Instagram: the link isn't a web address\n· A link: give it a name\n· Contact email: this doesn't look like an email address");
    expect(fixSummary([])).toBeNull();
    expect(thingsToFix(1)).toBe('1 thing to fix before publishing');
    expect(thingsToFix(3)).toBe('3 things to fix before publishing');
    expect(thingsToFix(0)).toBeNull();
    const facts = fixLines([{ path: ['facts', { _key: 'f' }], message: MESSAGES.factPair, level: 'error' }], { facts: [{ _key: 'f', label: 'Based in' }] }, 'aboutPage');
    expect(facts).toEqual(['Based in: fill in both the label and the value']);
    const note = fixLines([{ path: ['note'], message: MESSAGES.noteLong, level: 'error' }], {}, 'commissionSettings');
    expect(note).toEqual(['Note when closed: keep it under 120 characters']);
    expect(read('sanity-studio/sanity.config.ts')).toMatch(/FixSummary/);
  });
});

describe('content-editing-site-settings#AC-6 starting values', () => {
  it("start with today's site, and the editor starts with the same", () => {
    const s = readSettings({});
    expect(s.commissions).toEqual({ open: true, note: '' });
    expect(s.about).toEqual({ portrait: null, portraitAlt: '', bio: [], statement: [], facts: FACTS });
    expect(s.home).toEqual({ text: [] });
    expect(s.contact).toEqual({ email: 'kettlebirdillustration@gmail.com', links: LINKS });
    expect(readSettings(STARTING)).toEqual(s);
    expect(STARTING_VALUES).toEqual({
      commissionSettings: { status: 'open' },
      aboutPage: { facts: FACTS },
      homePage: {},
      contactSettings: { email: 'kettlebirdillustration@gmail.com', links: LINKS },
    });
  });
  it('uses each published item on its own, and the starting values for any that is missing', () => {
    const s = readSettings({ commissionSettings: { status: 'closed', note: 'Back in March.' }, contactSettings: { email: 'star@example.com', links: [] } });
    expect(s.commissions).toEqual({ open: false, note: 'Back in March.' });
    expect(s.contact).toEqual({ email: 'star@example.com', links: [] });
    expect(s.about.facts).toEqual(FACTS);
    expect(readSettings({ aboutPage: { bio: 'Hi.' } }).about.facts).toEqual([]);
    expect(readSettings({ contactSettings: { links: LINKS } }).contact.email).toBe('kettlebirdillustration@gmail.com');
  });
});

describe('content-editing-site-settings#AC-12 text', () => {
  it('splits paragraphs on blank lines and treats spaces as empty', () => {
    expect(paragraphs('One.\n\nTwo,\nstill two.\n \n\nThree.')).toEqual(['One.', 'Two,\nstill two.', 'Three.']);
    expect(paragraphs('   ')).toEqual([]);
    expect(paragraphs(undefined)).toEqual([]);
    expect(paragraphs(42)).toEqual([]);
    const s = readSettings({
      commissionSettings: { status: 'closed', note: '   ' },
      aboutPage: { bio: ' ', statement: 'Work.', facts: [{ label: ' ', value: ' ' }, { label: 'Makes', value: ' Comics ' }], portrait: { asset: { _ref: 'x' }, alt: '  ' } },
      homePage: { artistText: '\n\n' },
      contactSettings: { links: [{ name: 'Bluesky', url: 'https://bsky.app' }, { name: ' ', url: ' ' }] },
    }, () => ({ src: 'p.png', width: 1, height: 1 }));
    expect(s.commissions.note).toBe('');
    expect(s.about.bio).toEqual([]);
    expect(s.about.statement).toEqual(['Work.']);
    expect(s.about.facts).toEqual([{ label: 'Makes', value: 'Comics' }]);
    expect(s.about.portrait).toEqual({ src: 'p.png', width: 1, height: 1 });
    expect(s.about.portraitAlt).toBe('');
    expect(s.home.text).toEqual([]);
    expect(s.contact.links).toEqual([{ name: 'Bluesky', url: 'https://bsky.app' }]);
  });
});

describe('content-editing-site-settings#AC-7 AC-8 commissions view and about view', () => {
  it('says open or closed as the design does', () => {
    const open = commissionsView(readSettings({}));
    expect(open).toEqual({ open: true, heading: 'Commissions are open.', note: 'Email me to get started.', intro: '', showOrdering: true, outro: '' });
    const closed = commissionsView(readSettings({ commissionSettings: { status: 'closed', note: 'Back in March.' } }));
    expect(closed).toEqual({
      open: false,
      heading: 'Commissions are closed.',
      note: 'Back in March.',
      intro: 'These are the kinds of commission I take, for when they open again.',
      showOrdering: false,
      outro: 'Commissions are closed for now. To hear when they open, follow me on the social links at the bottom of the page.',
    });
    const noLinks = commissionsView(readSettings({ commissionSettings: { status: 'closed' }, contactSettings: { email: 'a@b.co', links: [] } }));
    expect(noLinks.outro).toBe('');
    expect(noLinks.note).toBe('');
    expect(getInTouchText(true)).toBe('For commission inquiries, collaboration ideas, or just to say hi:');
    expect(getInTouchText(false)).toBe('To ask about collaborations, or just to say hi:');
  });
});

describe('content-editing-site-settings#AC-10 links', () => {
  it('colours links green, yellow, orange, pink, then repeats', () => {
    expect([0, 1, 2, 3, 4, 5, 8].map(linkColour)).toEqual(['green', 'yellow', 'orange', 'pink', 'green', 'yellow', 'green']);
  });
});

describe('content-editing-site-settings#AC-13 live status', () => {
  it('counts the four items as changes and opens their pages', () => {
    for (const type of ['commissionSettings', 'aboutPage', 'homePage', 'contactSettings']) expect(CONTENT_TYPES).toContain(type);
    expect(TYPES).toEqual(CONTENT_TYPES);
    const c = (type: string) => viewOnSitePath({ _type: type, _updatedAt: '' });
    expect(c('commissionSettings')).toBe('/commissions');
    expect(c('aboutPage')).toBe('/about');
    expect(c('homePage')).toBe('/');
    expect(c('contactSettings')).toBe('/');
  });
});
