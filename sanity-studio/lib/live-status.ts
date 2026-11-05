// Know when it's live: what the editor's top bar says about the latest change, its times, and where
// View on site goes (content-editing-know-when-live AC-4 to AC-8). No `sanity` imports, so the unit
// tests and mutation testing can run it directly.

/** The kinds of item that appear on the site; a change to any of them starts a site build. */
export const CONTENT_TYPES = [
  'comicSeries', 'comicChapter', 'galleryItem', 'writtenWork', 'product', 'commissionType',
  // A story's chapters (story-reader-editor AC-12).
  'storyChapter',
  // Site settings' four items (content-editing-site-settings AC-13).
  'commissionSettings', 'aboutPage', 'homePage', 'contactSettings',
];

/** The hidden item that records the time of the latest removal (AC-3). */
export const SITE_STATUS_ID = 'siteStatus';

export const NOTE_AFTER_PUBLISH = "Published. Updating the site; the status at the top right says when it's live.";
export const DIDNT_GO_LIVE_EXPLANATION =
  "Your change is saved, but the site didn't update. The person who looks after the site is told automatically and will fix it. You don't need to do anything, and you can keep working; publishing more is fine. Wait until this says Live before telling people it's up.";

const MINUTE = 60_000;
const SLOW_AFTER = 5 * MINUTE;
const FAILED_AFTER = 15 * MINUTE;

/** The latest published change, as the editor's query returns it. */
export interface Change {
  _type: string;
  _updatedAt: string;
  slug?: string;
  seriesSlug?: string;
  number?: number;
  /** A chapter's story's web address (story-reader-pages AC-12). */
  storySlug?: string;
  /** A story: whether it has a page on the site (text or chapters). */
  hasPage?: boolean;
}
/** The site's /build-info.json. */
export interface BuildInfo { contentReadAt: string; builtAt: string }
export interface StatusInput {
  latest: Change | null;
  removedAt: string | null;
  /** Changes made since the site last read the content. */
  pending: number;
  build: BuildInfo | null;
  now: Date;
  /** The site's file couldn't be read. */
  error?: boolean;
  timeZone?: string;
}
export type StatusKind = 'none' | 'updating' | 'slow' | 'failed' | 'live' | 'removed' | 'offline';
export interface Status { kind: StatusKind; label: string; viewPath?: string }

const time = (at: string | Date) => new Date(at).getTime();

export function liveStatus({ latest, removedAt, pending, build, now, error, timeZone }: StatusInput): Status {
  if (!latest && !removedAt) return { kind: 'none', label: '' };
  if (error || !build) return { kind: 'offline', label: "Can't check the site right now" };
  const removal = Boolean(removedAt && (!latest || time(removedAt) > time(latest._updatedAt)));
  const changedAt = time(removal ? (removedAt as string) : (latest as Change)._updatedAt);
  if (time(build.contentReadAt) >= changedAt) {
    const when = formatWhen(build.builtAt, now, timeZone);
    if (removal) return { kind: 'removed', label: `Removed from the site · ${when}` };
    return { kind: 'live', label: `Live · ${when}`, viewPath: viewOnSitePath(latest as Change) };
  }
  const waited = now.getTime() - changedAt;
  if (waited > FAILED_AFTER) return { kind: 'failed', label: "Didn't go live" };
  if (waited > SLOW_AFTER) return { kind: 'slow', label: 'Still updating, taking longer than usual…' };
  return { kind: 'updating', label: pending > 1 ? `Updating the site… (${pending} changes)` : 'Updating the site…' };
}

const dayOf = (at: Date, timeZone?: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);

/** "2:41 pm" today, "Yesterday, 2:41 pm", or "31 Oct, 2:41 pm", in the given time zone (AC-5). */
export function formatWhen(at: string | Date, now: Date, timeZone?: string): string {
  const date = new Date(at);
  const clock = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true })
    .format(date)
    .replace(/\s/g, ' ')
    .toLowerCase();
  const day = dayOf(date, timeZone);
  if (day === dayOf(now, timeZone)) return clock;
  const [y, m, d] = dayOf(now, timeZone).split('-').map(Number);
  if (day === new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10)) return `Yesterday, ${clock}`;
  const date_ = new Intl.DateTimeFormat('en-GB', { timeZone, day: 'numeric', month: 'short' }).format(date);
  return `${date_}, ${clock}`;
}

const PAGES: Record<string, string> = {
  galleryItem: '/portfolio',
  writtenWork: '/writing',
  // Until story pages exist (story-reader-editor AC-12).
  storyChapter: '/writing',
  product: '/shop',
  commissionType: '/commissions',
  commissionSettings: '/commissions',
  aboutPage: '/about',
  homePage: '/',
  contactSettings: '/',
};

/** The page View on site opens for the latest change (AC-6). */
export function viewOnSitePath(change: Change): string {
  if (change._type === 'comicChapter') {
    if (!change.seriesSlug) return '/comics';
    return change.number === undefined ? `/comics/${change.seriesSlug}` : `/comics/${change.seriesSlug}/${change.number}/1`;
  }
  if (change._type === 'comicSeries') return change.slug ? `/comics/${change.slug}` : '/comics';
  // A story's page or a chapter's, once it has one (story-reader-pages AC-12).
  if (change._type === 'writtenWork' && change.slug && change.hasPage) return `/writing/${change.slug}`;
  if (change._type === 'storyChapter' && change.storySlug && change.number !== undefined) return `/writing/${change.storySlug}/${change.number}`;
  return PAGES[change._type] ?? '/';
}

/** The editor's query: the latest published change, the removal record, and the changes since a time. */
export const LATEST_QUERY = `{
  "latest": *[_type in $types && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
    _type, _updatedAt, "slug": slug.current, "seriesSlug": series->slug.current, number,
    "storySlug": story->slug.current,
    "hasPage": count(content) > 0 || count(*[_type == "storyChapter" && story._ref == ^._id && count(content) > 0]) > 0
  },
  "removedAt": *[_id == $statusId][0]._updatedAt,
  "pending": count(*[_type in $types && !(_id in path("drafts.**")) && _updatedAt > $since])
}`;
