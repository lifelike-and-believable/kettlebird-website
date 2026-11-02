// Know when it's live: the status, its wording and times, View on site, the build info, the
// removal record, and the 15-minute check. Criteria: docs/specs/content-editing-know-when-live.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CONTENT_TYPES, DIDNT_GO_LIVE_EXPLANATION, formatWhen, LATEST_QUERY, liveStatus, NOTE_AFTER_PUBLISH, SITE_STATUS_ID, viewOnSitePath, type StatusInput,
} from '../../sanity-studio/lib/live-status';
// @ts-expect-error: a plain .mjs script with no types
import { issueBody, minutesBehind, TYPES } from '../../scripts/live-check.mjs';

const TZ = 'America/Toronto'; // Eastern Standard Time (UTC-5) from 1 Nov 2026
const at = (iso: string) => new Date(iso);
const base: StatusInput = {
  latest: { _type: 'comicChapter', _updatedAt: '2026-11-02T18:00:00Z', seriesSlug: 'kettle-tales', number: 2 },
  removedAt: null,
  pending: 1,
  build: { contentReadAt: '2026-11-02T17:00:00Z', builtAt: '2026-11-02T17:01:00Z' },
  now: at('2026-11-02T18:01:00Z'),
  timeZone: TZ,
};

describe('content-editing-know-when-live#AC-4 AC-7 AC-8 live status', () => {
  it('is updating until a build has read the latest change', () => {
    expect(liveStatus(base)).toEqual({ kind: 'updating', label: 'Updating the site…' });
    expect(liveStatus({ ...base, pending: 3 })).toEqual({ kind: 'updating', label: 'Updating the site… (3 changes)' });
  });
  it('is slow after 5 minutes and failed after 15, counted from the latest change', () => {
    expect(liveStatus({ ...base, now: at('2026-11-02T18:05:00Z') }).kind).toBe('updating');
    expect(liveStatus({ ...base, now: at('2026-11-02T18:05:01Z') })).toEqual({ kind: 'slow', label: 'Still updating, taking longer than usual…' });
    expect(liveStatus({ ...base, now: at('2026-11-02T18:15:00Z') }).kind).toBe('slow');
    expect(liveStatus({ ...base, now: at('2026-11-02T18:15:01Z') })).toEqual({ kind: 'failed', label: "Didn't go live" });
  });
  it('is live once a build read the content after the latest change, with the build time and the page', () => {
    const build = { contentReadAt: '2026-11-02T18:00:30Z', builtAt: '2026-11-02T19:41:00Z' };
    expect(liveStatus({ ...base, build })).toEqual({ kind: 'live', label: 'Live · 2:41 pm', viewPath: '/comics/kettle-tales/2/1' });
    expect(liveStatus({ ...base, build: { ...build, contentReadAt: '2026-11-02T18:00:00Z' } }).kind).toBe('live');
  });
  it('says removed when the latest change was a removal', () => {
    const build = { contentReadAt: '2026-11-02T19:00:00Z', builtAt: '2026-11-02T20:02:00Z' };
    expect(liveStatus({ ...base, removedAt: '2026-11-02T18:30:00Z', build })).toEqual({ kind: 'removed', label: 'Removed from the site · 3:02 pm' });
    expect(liveStatus({ ...base, removedAt: '2026-11-02T17:30:00Z', build }).kind).toBe('live');
    expect(liveStatus({ ...base, removedAt: '2026-11-02T18:00:00Z', build }).kind).toBe('live');
    expect(liveStatus({ ...base, latest: null, removedAt: '2026-11-02T18:30:00Z', build }).kind).toBe('removed');
    expect(liveStatus({ ...base, removedAt: '2026-11-02T18:30:00Z', now: at('2026-11-02T18:31:00Z') }).kind).toBe('updating');
  });
  it("can't check without the site's file, and never says live without it", () => {
    expect(liveStatus({ ...base, build: null })).toEqual({ kind: 'offline', label: "Can't check the site right now" });
    expect(liveStatus({ ...base, error: true, build: { contentReadAt: '2026-11-02T19:00:00Z', builtAt: '2026-11-02T19:00:00Z' } }).kind).toBe('offline');
  });
  it('says nothing before anything is published', () => {
    expect(liveStatus({ ...base, latest: null })).toEqual({ kind: 'none', label: '' });
  });
  it('words the note after Publish and the failure explanation as the design does', () => {
    expect(NOTE_AFTER_PUBLISH).toBe("Published. Updating the site; the status at the top right says when it's live.");
    expect(DIDNT_GO_LIVE_EXPLANATION).toBe(
      "Your change is saved, but the site didn't update. The person who looks after the site is told automatically and will fix it. You don't need to do anything, and you can keep working; publishing more is fine. Wait until this says Live before telling people it's up.",
    );
  });
  it('wires the status into every screen, the note after Publish, and the removal record', () => {
    const config = readFileSync('sanity-studio/sanity.config.ts', 'utf8');
    expect(config).toMatch(/navbar/);
    expect(config).toMatch(/LiveStatus/);
    expect(config).toMatch(/withPublishNote/);
    const status = readFileSync('sanity-studio/components/LiveStatus.tsx', 'utf8');
    expect(status).toMatch(/aria-live="polite"/);
    expect(status).toMatch(/\/build-info\.json/);
    expect(status).toMatch(/15_?000/);
    expect(status).toMatch(/useRemovalRecord\(\)/);
  });
});

describe('content-editing-know-when-live#AC-5 times', () => {
  const now = at('2026-11-02T20:00:00Z'); // 3:00 pm in Toronto
  it('shows today, yesterday, or a date, in the given time zone', () => {
    expect(formatWhen('2026-11-02T19:41:00Z', now, TZ)).toBe('2:41 pm');
    expect(formatWhen('2026-11-02T05:05:00Z', now, TZ)).toBe('12:05 am');
    expect(formatWhen('2026-11-02T04:59:00Z', now, TZ)).toBe('Yesterday, 11:59 pm');
    expect(formatWhen('2026-10-31T16:00:00Z', now, TZ)).toBe('31 Oct, 12:00 pm');
    expect(formatWhen(at('2026-11-02T19:41:00Z'), now, TZ)).toBe('2:41 pm');
  });
});

describe('content-editing-know-when-live#AC-6 view on site', () => {
  it('opens the page of the latest change', () => {
    const c = (o: object) => ({ _type: '', _updatedAt: '', ...o });
    expect(viewOnSitePath(c({ _type: 'comicChapter', seriesSlug: 'kettle-tales', number: 0 }))).toBe('/comics/kettle-tales/0/1');
    expect(viewOnSitePath(c({ _type: 'comicChapter', number: 1 }))).toBe('/comics');
    expect(viewOnSitePath(c({ _type: 'comicChapter', seriesSlug: 'kettle-tales' }))).toBe('/comics/kettle-tales');
    expect(viewOnSitePath(c({ _type: 'comicSeries', slug: 'kettle-tales' }))).toBe('/comics/kettle-tales');
    expect(viewOnSitePath(c({ _type: 'comicSeries' }))).toBe('/comics');
    expect(viewOnSitePath(c({ _type: 'galleryItem' }))).toBe('/portfolio');
    expect(viewOnSitePath(c({ _type: 'writtenWork' }))).toBe('/writing');
    expect(viewOnSitePath(c({ _type: 'product' }))).toBe('/shop');
    expect(viewOnSitePath(c({ _type: 'commissionType' }))).toBe('/commissions');
    expect(viewOnSitePath(c({ _type: 'sanity.imageAsset' }))).toBe('/');
  });
});

describe('content-editing-know-when-live#AC-3 latest change', () => {
  it('counts only the site\'s content types, and the removal record', () => {
    expect(CONTENT_TYPES).toEqual(['comicSeries', 'comicChapter', 'galleryItem', 'writtenWork', 'product', 'commissionType']);
    expect(TYPES).toEqual(CONTENT_TYPES);
    expect(SITE_STATUS_ID).toBe('siteStatus');
    expect(LATEST_QUERY).toMatch(/\*\[_id == \$statusId\]\[0\]\._updatedAt/);
    expect(LATEST_QUERY).toMatch(/_updatedAt > \$since/);
    expect(LATEST_QUERY).toMatch(/"seriesSlug": series->slug\.current, number/);
    const schema = readFileSync('sanity-studio/schemas/objects/siteStatus.ts', 'utf8');
    expect(schema).toMatch(/name: 'siteStatus'/);
    expect(schema).toMatch(/name: 'lastRemoval'/);
    const record = readFileSync('sanity-studio/actions/recordRemoval.tsx', 'utf8');
    expect(record).toMatch(/lastRemoval/);
    expect(record).toMatch(/'disappear'/);
  });
});

describe('content-editing-know-when-live#AC-2 build info', () => {
  it('reads Sanity live and publishes an uncached build-info.json', () => {
    expect(readFileSync('src/lib/sanity.ts', 'utf8')).toMatch(/useCdn: false/);
    const integration = readFileSync('src/integrations/build-info.ts', 'utf8');
    expect(integration).toMatch(/astro:build:start/);
    expect(integration).toMatch(/now\(\)/);
    expect(integration).toMatch(/build-info\.json/);
    expect(readFileSync('astro.config.mjs', 'utf8')).toMatch(/buildInfo\(\)/);
    const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const rule = vercel.headers.find((h: { source: string }) => h.source === '/build-info.json');
    expect(rule?.headers).toContainEqual({ key: 'Cache-Control', value: 'no-store' });
  });
});

describe('content-editing-know-when-live#AC-9 behind check', () => {
  it('measures how far the site is behind the latest change', () => {
    expect(minutesBehind({ lastChangeAt: '2026-11-02T18:00:00Z', contentReadAt: '2026-11-02T18:00:30Z', now: at('2026-11-02T19:00:00Z') })).toBe(0);
    expect(minutesBehind({ lastChangeAt: '2026-11-02T18:00:00Z', contentReadAt: '2026-11-02T18:00:00Z', now: at('2026-11-02T19:00:00Z') })).toBe(0);
    expect(minutesBehind({ lastChangeAt: '2026-11-02T18:00:00Z', contentReadAt: '2026-11-02T17:00:00Z', now: at('2026-11-02T18:20:30Z') })).toBe(20);
    expect(minutesBehind({ lastChangeAt: null, contentReadAt: '2026-11-02T17:00:00Z', now: at('2026-11-02T18:20:00Z') })).toBe(0);
  });
  it('writes an issue the lead can act on', () => {
    const body = issueBody({ lastChangeAt: '2026-11-02T18:00:00Z', contentReadAt: '2026-11-02T17:00:00Z', builtAt: '2026-11-02T17:01:00Z', behind: 20, site: 'https://kettlebird-website.vercel.app' });
    expect(body).toBe([
      `The site hasn't picked up a change published 20 minutes ago, so Star's editor says "Didn't go live".`,
      '',
      '- Latest change in Sanity: 2026-11-02T18:00:00Z',
      '- Content the live site was built from: 2026-11-02T17:00:00Z (built 2026-11-02T17:01:00Z)',
      "- The site's build info: https://kettlebird-website.vercel.app/build-info.json",
      '',
      'Check the latest builds at https://vercel.com/lifelikedevteam/kettlebird-website/deployments, fix or redeploy, and this issue closes itself once the site catches up.',
      'If no build started at all, check the Sanity webhook "Rebuild site" and the Vercel deploy hook "Sanity publish".',
    ].join('\n'));
  });
  it('runs every 15 minutes and opens or closes one site-not-live issue', () => {
    const wf = readFileSync('.github/workflows/site-live.yml', 'utf8');
    expect(wf).toMatch(/cron: '\*\/15 \* \* \* \*'/);
    expect(wf).toMatch(/site-not-live/);
    expect(wf).toMatch(/issues: write/);
  });
});
