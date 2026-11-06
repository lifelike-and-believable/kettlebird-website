// What the site's pages show from Site settings, rendered with Astro's container API.
// Criteria: docs/specs/content-editing-site-settings.md (AC-7 to AC-11).
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import AboutContent from '../../src/components/settings/AboutContent.astro';
import CommissionsContent from '../../src/components/settings/CommissionsContent.astro';
import HomeArtist from '../../src/components/settings/HomeArtist.astro';
import SiteFooter from '../../src/components/settings/SiteFooter.astro';
import SocialLinks from '../../src/components/settings/SocialLinks.astro';
import { readSettings, type RawSettings } from '../../src/lib/site-settings';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const render = (component: Parameters<AstroContainer['renderToString']>[0], props: Record<string, unknown>) => container.renderToString(component, { props });
const picture = () => ({ src: 'https://cdn.example/portrait.png', width: 600, height: 800 });
const settings = (raw: RawSettings) => readSettings(raw, picture);
const TYPES = [{ name: 'Full colour illustration', priceRange: '$80–150', description: 'One character.', deliveryTime: '2–3 weeks', images: [] }];
const count = (html: string, text: string) => html.split(text).length - 1;

describe('content-editing-site-settings#AC-7 commissions', () => {
  it('open: green banner with Contact me, and the page as now', async () => {
    const html = await render(CommissionsContent, { settings: settings({ contactSettings: { email: 'star@example.com', links: [{ name: 'Bluesky', url: 'https://bsky.app' }] } }), types: TYPES });
    expect(html).toContain('status-banner--open');
    expect(html).toMatch(/Commissions are open\.<\/strong>\s*Email me to get started\./);
    expect(html).toMatch(/class="status-banner__dot" aria-hidden="true"/);
    expect(html).toMatch(/href="mailto:star@example\.com"[^>]*>\s*Contact me/);
    expect(html).toContain('How it works');
    expect(html).toContain('Ready to order?');
    expect(html).toMatch(/Email me to get started\s*<svg/);
    expect(count(html, 'mailto:star@example.com')).toBe(2);
    expect(html).toContain('Full colour illustration');
    expect(html).not.toContain('for when they open again');
    expect(html).not.toContain('Commissions are closed');
  });
  it('closed: orange banner with the note, types and prices, and no way to order', async () => {
    const html = await render(CommissionsContent, { settings: settings({ commissionSettings: { status: 'closed', note: 'Back in March.' } }), types: TYPES });
    expect(html).toContain('status-banner--closed');
    expect(html).toMatch(/Commissions are closed\.<\/strong>\s*Back in March\./);
    expect(html).toContain('These are the kinds of commission I take, for when they open again.');
    expect(html).toContain('Full colour illustration');
    expect(html).toContain('$80–150');
    expect(html).not.toContain('How it works');
    expect(html).not.toContain('Ready to order?');
    expect(html).not.toContain('mailto:');
    expect(html).not.toContain('Contact me');
    expect(html).toContain('Commissions are closed for now. To hear when they open, follow me on the social links at the bottom of the page.');
  });
  it('closed with no links or note: no closing sentence, no note', async () => {
    const html = await render(CommissionsContent, { settings: settings({ commissionSettings: { status: 'closed' }, contactSettings: { email: 'a@b.co', links: [] } }), types: [] });
    expect(html).not.toContain('Commissions are closed for now');
    expect(html).toMatch(/Commissions are closed\.<\/strong>\s*<\/p>/);
  });
});

describe('content-editing-site-settings#AC-8 about', () => {
  it('shows each part Star filled in, in heading order', async () => {
    const html = await render(AboutContent, { settings: settings({
      aboutPage: { portrait: { asset: { _ref: 'image-x' } , alt: 'Star, drawn as a bird with a teapot.' }, bio: "I'm Star.\n\nI draw.", statement: 'Found family.', facts: [{ label: 'Based in', value: 'Vancouver, BC' }] },
      contactSettings: { email: 'star@example.com', links: [{ name: 'Bluesky', url: 'https://bsky.app' }, { name: 'Ko-fi ☕', url: 'https://ko-fi.com/x' }] },
    }) });
    expect(html).toMatch(/<h1[^>]*>About the Artist<\/h1>/);
    expect(html).toMatch(/<img[^>]*src="https:\/\/cdn\.example\/portrait\.png"[^>]*alt="Star, drawn as a bird with a teapot\."/);
    expect(html).toMatch(/<h2[^>]*>Hello!<\/h2>/);
    expect(html).toMatch(/<p[^>]*>I&#39;m Star\.<\/p>\s*<p[^>]*>I draw\.<\/p>/);
    expect(html).toMatch(/<h2[^>]*>The Work<\/h2>/);
    expect(html).toContain('Found family.');
    expect(html).toMatch(/<h2[^>]*>At a glance<\/h2>/);
    expect(html).toMatch(/Based in<\/span>\s*<span class="qf-value"[^>]*>Vancouver, BC/);
    expect(html).toMatch(/>Ko-fi ☕<\/a>/);
    expect(html).toContain('For commission inquiries, collaboration ideas, or just to say hi:');
    expect(html).toMatch(/href="mailto:star@example\.com"/);
    expect(html.indexOf('Hello!')).toBeLessThan(html.indexOf('The Work'));
  });
  it('leaves out what is empty, and changes Get in touch while closed', async () => {
    const html = await render(AboutContent, { settings: settings({ commissionSettings: { status: 'closed' }, aboutPage: { facts: [] } }) });
    expect(html).toMatch(/<h1[^>]*>About the Artist<\/h1>/);
    expect(html).not.toContain('Hello!');
    expect(html).not.toContain('The Work');
    expect(html).not.toContain('At a glance');
    expect(html).not.toContain('quick-facts');
    expect(html).not.toContain('<img');
    expect(html).toMatch(/<h2[^>]*>Get in touch<\/h2>/);
    expect(html).toContain('To ask about collaborations, or just to say hi:');
    expect(html).not.toContain('For commission inquiries');
  });
  it('treats a portrait without alt text as decoration', async () => {
    const html = await render(AboutContent, { settings: settings({ aboutPage: { portrait: { asset: { _ref: 'image-x' } } } }) });
    // An empty alt; Astro writes it as a bare `alt`, which HTML reads as alt="".
    expect(html).toMatch(/<img[^>]*\salt(="")?[\s>]/);
  });
});

describe('content-editing-site-settings#AC-9 home', () => {
  it('shows the artist text with the portrait beside it, or nothing', async () => {
    const html = await render(HomeArtist, { settings: settings({ homePage: { artistText: 'Hi, I am Star.\n\nI make comics.' }, aboutPage: { portrait: { asset: { _ref: 'x' } }, alt: '' } }) });
    expect(html).toMatch(/<p[^>]*>Hi, I am Star\.<\/p>\s*<p[^>]*>I make comics\.<\/p>/);
    expect(html).toMatch(/<img[^>]*src="https:\/\/cdn\.example\/portrait\.png"/);
    const noPortrait = await render(HomeArtist, { settings: settings({ homePage: { artistText: 'Hi.' } }) });
    expect(noPortrait).toContain('Hi.');
    expect(noPortrait).not.toContain('<img');
    expect((await render(HomeArtist, { settings: settings({ homePage: { artistText: '  ' } }) })).trim()).toBe('');
  });
});

describe('content-editing-site-settings#AC-10 AC-11 links and email', () => {
  const links = [1, 2, 3, 4, 5].map((n) => ({ name: `Link ${n}`, url: `https://example.com/${n}` }));
  it('lists the links in order, in a new tab, with colours that repeat', async () => {
    const html = await render(SocialLinks, { links, variant: 'footer' });
    expect([...html.matchAll(/>(Link \d)</g)].map((m) => m[1])).toEqual(['Link 1', 'Link 2', 'Link 3', 'Link 4', 'Link 5']);
    expect(count(html, 'target="_blank"')).toBe(5);
    expect(count(html, 'rel="noopener noreferrer"')).toBe(5);
    expect([...html.matchAll(/data-colour="(\w+)"/g)].map((m) => m[1])).toEqual(['green', 'yellow', 'orange', 'pink', 'green']);
    expect((await render(SocialLinks, { links: [], variant: 'home' })).trim()).toBe('');
  });
  it('the footer uses the contact email, and drops Connect with no links', async () => {
    const html = await render(SiteFooter, { settings: settings({ contactSettings: { email: 'star@example.com', links } }) });
    expect(html).toContain('Connect');
    expect(html).toMatch(/href="mailto:star@example\.com"[^>]*>star@example\.com/);
    const none = await render(SiteFooter, { settings: settings({ contactSettings: { email: 'star@example.com', links: [] } }) });
    expect(none).not.toContain('Connect');
    expect(none).toContain('mailto:star@example.com');
  });
});
