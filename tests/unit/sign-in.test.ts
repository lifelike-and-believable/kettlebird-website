// The editor at /studio: its settings, the site's headers and routing, and no public link to it.
// Criteria: docs/specs/content-editing-sign-in.md.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { signInProviders, STUDIO_TITLE } from '../../sanity-studio/lib/studio-settings';

const provider = (name: string, title: string) => ({ name, title, url: `https://api.sanity.io/v1/auth/login/${name}` });

describe('content-editing-sign-in#AC-3 AC-4 AC-8 editor settings', () => {
  it('is titled Kettlebird Creations (AC-3)', () => {
    expect(STUDIO_TITLE).toBe('Kettlebird Creations');
  });
  it('offers only Google and E-mail / password, in Sanity\'s order (AC-4)', () => {
    const defaults = [provider('google', 'Google'), provider('github', 'GitHub'), provider('sanity', 'E-mail / password')];
    expect(signInProviders(defaults).map((p) => p.title)).toEqual(['Google', 'E-mail / password']);
    expect(signInProviders([provider('github', 'GitHub')])).toEqual([]);
    expect(signInProviders([])).toEqual([]);
  });
  it('uses the title and the provider filter in the editor\'s config (AC-3, AC-4)', () => {
    const config = readFileSync('sanity-studio/sanity.config.ts', 'utf8');
    expect(config).toMatch(/title:\s*STUDIO_TITLE/);
    expect(config).toMatch(/providers:\s*signInProviders/);
  });
  it('has no query tool (AC-8)', () => {
    const config = readFileSync('sanity-studio/sanity.config.ts', 'utf8');
    const pkg = JSON.parse(readFileSync('sanity-studio/package.json', 'utf8'));
    expect(config).not.toMatch(/visionTool|@sanity\/vision/);
    expect(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })).not.toContain('@sanity/vision');
  });
});

interface Header { key: string; value: string }
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  buildCommand: string;
  rewrites?: { source: string; destination: string }[];
  headers: { source: string; headers: Header[] }[];
};
const headersFor = (source: string) => vercel.headers.find((h) => h.source === source)?.headers ?? [];
const header = (source: string, key: string) => headersFor(source).find((h) => h.key === key)?.value;

describe('content-editing-sign-in#AC-1 AC-2 AC-5 AC-6 site headers and routing', () => {
  it('builds the editor with the site on Vercel (AC-1)', () => {
    expect(vercel.buildCommand).toBe('npm run build:site');
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.scripts['build:site']).toMatch(/build:studio/);
    expect(pkg.scripts['build:studio']).toMatch(/dist\/studio/);
  });
  it('opens the editor at any address under /studio (AC-2)', () => {
    expect(vercel.rewrites).toContainEqual({ source: '/studio/:path*', destination: '/studio/index.html' });
  });
  it('asks search engines not to index the editor (AC-5)', () => {
    for (const source of ['/studio', '/studio/(.*)']) expect(header(source, 'X-Robots-Tag')).toBe('noindex, nofollow');
  });
  it('lets only the site itself frame its pages (AC-6)', () => {
    expect(header('/(.*)', 'X-Frame-Options')).toBe('SAMEORIGIN');
    expect(header('/(.*)', 'Content-Security-Policy')).toBe("frame-ancestors 'self'");
  });
});

const DIST = 'dist';
function publicPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (path === join(DIST, 'studio')) return [];
    return statSync(path).isDirectory() ? publicPages(path) : path.endsWith('.html') ? [path] : [];
  });
}

describe('content-editing-sign-in#AC-7 no link to the editor', () => {
  it.skipIf(!existsSync(DIST))('finds no link to /studio or a Sanity editor in any public page', () => {
    const editorLink = /(?:href|action)\s*=\s*["'][^"']*(?:\/studio(?:[/?#"']|$)|\.sanity\.studio)/i;
    const hits = publicPages(DIST).filter((file) => editorLink.test(readFileSync(file, 'utf8')));
    expect(hits).toEqual([]);
  });
});

describe('content-editing-help-links#AC-6 help pages are unlisted', () => {
  it('tells search engines not to list /help', () => {
    for (const source of ['/help', '/help/(.*)']) expect(header(source, 'X-Robots-Tag'), source).toBe('noindex, nofollow');
  });

  it.skipIf(!existsSync(DIST))('finds no link to /help in any page outside /help', () => {
    const helpLink = /(?:href|action)\s*=\s*["'](?:https?:\/\/[^/"']+)?\/help(?:[/?#"']|$)/i;
    const outside = publicPages(DIST).filter((file) => !/[/\\]help[/\\]/.test(file) && !/[/\\]help\.html$/.test(file));
    expect(outside.length).toBeGreaterThan(0);
    expect(outside.filter((file) => helpLink.test(readFileSync(file, 'utf8')))).toEqual([]);
  });
});
