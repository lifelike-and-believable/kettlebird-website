// Edge cases for Site settings' logic, found by mutation testing (stryker).
// Criteria: docs/specs/content-editing-site-settings.md.
import { describe, expect, it } from 'vitest';
import { paragraphs, readSettings, STARTING } from '../../src/lib/site-settings';
import {
  emailMessage, factMessage, fixLines, isWebAddress, linkMessage, MESSAGES, noteMessage, rowTitle, SETTINGS_FIELDS, STARTING_VALUES,
} from '../../sanity-studio/lib/site-settings';

describe('content-editing-site-settings#AC-6 starting values agree', () => {
  it("the site's fallback and the editor's initial values are the same", () => {
    expect(STARTING).toEqual(STARTING_VALUES);
  });
});

describe('content-editing-site-settings#AC-2 every field text', () => {
  it('names and explains every field, including those in the edit dialogs', () => {
    expect(SETTINGS_FIELDS.aboutPage.bio.description).toBe('A few paragraphs about you, under the heading Hello! Leave a blank line between paragraphs. Leave empty to leave the section out.');
    expect(SETTINGS_FIELDS.aboutPage.statement.description).toBe('What your work is about, under the heading The Work. Leave a blank line between paragraphs. Leave empty to leave the section out.');
    expect(SETTINGS_FIELDS.aboutPage.facts.description).toBe("Short facts in the about page's side box, in this order. Choose a fact to change it; drag to reorder.");
    expect(SETTINGS_FIELDS.aboutPage.factLabel).toEqual({ label: 'Label', description: 'Like "Based in".' });
    expect(SETTINGS_FIELDS.aboutPage.factValue).toEqual({ label: 'Value', description: 'Like "Vancouver, BC".' });
    expect(SETTINGS_FIELDS.contactSettings.linkName).toEqual({ label: 'Name', description: 'As it shows on the button, like "Instagram".' });
    expect(SETTINGS_FIELDS.contactSettings.linkUrl).toEqual({ label: 'Link', description: "The page it opens. Copy it from your browser's address bar." });
    expect(SETTINGS_FIELDS.homePage.artistText.description).toBe("A sentence or two about you, under the home page's social links, beside your portrait (from About page). Leave a blank line between paragraphs. Don't mention whether commissions are open: the Commissions page says that, and changes when you do. Leave empty to leave the block out.");
  });
});

describe('content-editing-site-settings#AC-3 AC-5 rule edges', () => {
  it('handles blank and missing parts', () => {
    expect(rowTitle(' ', 'https://x.example')).toBe('https://x.example');
    expect(isWebAddress('see https://x.example')).toBe(false);
    expect(isWebAddress('xhttps://x.example')).toBe(false);
    expect(linkMessage('url', undefined)).toBe(MESSAGES.linkNoUrl);
    expect(linkMessage('name', undefined)).toBe(MESSAGES.linkNoName);
    expect(factMessage(undefined)).toBe(MESSAGES.factPair);
    expect(emailMessage('my email: a@b.co')).toBe(MESSAGES.emailBad);
    expect(emailMessage('a@b.co@c')).toBe(MESSAGES.emailBad);
    expect(emailMessage(' a@b.co ')).toBe(true);
    expect(noteMessage(`${'x'.repeat(118)}      `)).toBe(true);
  });
});

describe('content-editing-site-settings#AC-4 summary edges', () => {
  it('names items, falls back sensibly, and shortens every message', () => {
    const value = { links: [{ _key: 'a', name: ' Instagram ' }], facts: [{ _key: 'f', value: 'Vancouver' }] };
    expect(fixLines([
      { path: ['links', { _key: 'a' }, 'url'], message: MESSAGES.linkNoUrl, level: 'error' },
      { path: ['links', { _key: 'gone' }, 'url'], message: MESSAGES.linkNotUrl, level: 'error' },
      { path: ['facts', { _key: 'f' }], message: MESSAGES.factPair, level: 'error' },
      { path: ['facts', { _key: 'gone' }], message: MESSAGES.factPair, level: 'error' },
      { path: ['email'], message: MESSAGES.emailEmpty, level: 'error' },
      { path: ['mystery'], message: 'Something else.', level: 'error' },
    ], value, 'contactSettings')).toEqual([
      'Instagram: add the page it opens',
      "A link: the link isn't a web address",
      'A fact: fill in both the label and the value',
      'A fact: fill in both the label and the value',
      'Contact email: add the email address people should write to',
      'mystery: Something else.',
    ]);
    expect(fixLines([{ path: ['note'], message: MESSAGES.noteLong, level: 'error' }], undefined, 'unknownType')).toEqual(['note: keep it under 120 characters']);
    expect(fixLines([{ path: ['links', { _key: 'a' }, 'url'], message: MESSAGES.linkNotUrl, level: 'error' }], undefined, 'contactSettings')).toEqual(["A link: the link isn't a web address"]);
  });
});

describe('content-editing-site-settings#AC-12 text edges', () => {
  it('splits on lines of spaces, trims paragraphs, and drops half-filled facts and links', () => {
    expect(paragraphs('One.\n \nTwo.')).toEqual(['One.', 'Two.']);
    expect(paragraphs('One.\n\n   Two.')).toEqual(['One.', 'Two.']);
    const s = readSettings({
      aboutPage: { portrait: { asset: { _ref: 'x' } }, facts: [{ label: 'Based in' }, { value: 'Vancouver' }] },
      contactSettings: { email: 'a@b.co', links: [{ name: 'Bluesky' }, { url: 'https://x.example' }] },
    });
    expect(s.about.portrait).toBeNull();
    expect(s.about.facts).toEqual([]);
    expect(s.contact.links).toEqual([]);
    expect(readSettings({ aboutPage: { facts: 'not a list' } }).about.facts).toEqual([]);
  });
});
