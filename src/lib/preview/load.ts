// Loads what a preview page shows: published content, with this item's draft in place of its
// published version (and, for a chapter of a never-published series, the series' draft too).
// From Sanity with the preview token, or from tests/fixtures/drafts.ts in the fixture build.
// Spec: docs/specs/content-editing-preview.md (AC-3, AC-4, AC-5, AC-8, AC-10).
import { createClient, type SanityClient } from '@sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import type { TypeCard } from '../../components/settings/CommissionsContent.astro';
import { commissionTypeCards } from '../commission-cards';
import { readerPages, type ComicSeries, type ReaderPage } from '../comics/model';
import { fromSanity, type SanitySeries } from '../comics/source';
import type { CommissionType, GalleryItem, Product, WrittenWork } from '../queries';
import { readSettings, type RawSettings, type Settings } from '../site-settings';
import { picture } from '../site-settings-source';
import { overlay, previewChanges, type PreviewChanges } from './changes';
import { partSelector } from './parts';
import { isPreviewKind, PORTFOLIO_SECTION_TITLES, previewTarget, type PreviewKind, type RawDoc } from './targets';

export interface PreviewInfo {
  /** "the Commissions page", for "Preview of …". */
  name: string;
  /** Lines for the yellow line. */
  notes: string[];
  /** The element to scroll to, if not the top. */
  anchor?: string;
  /** Changed fields and the selector of the part that shows each. */
  outlined: { field: string; selector: string }[];
  /** Shown instead of the page when it can't be shown. */
  message?: string;
}

export type PreviewModel =
  | { page: 'commissions'; settings: Settings; types: TypeCard[] }
  | { page: 'about'; settings: Settings }
  | { page: 'home'; settings: Settings }
  | { page: 'series'; series: ComicSeries }
  | { page: 'reader'; entry: ReaderPage }
  | { page: 'portfolio'; items: GalleryItem[]; focusId: string; openId?: string }
  | { page: 'writing'; works: WrittenWork[] }
  | { page: 'shop'; products: Product[] }
  | { page: 'message' };

/** Where the preview gets its documents. */
export interface PreviewSource {
  isValid(url: URL): Promise<boolean>;
  /** The published document, if there is one. */
  published(id: string): Promise<RawDoc | undefined>;
  /** The draft (drafts.<id>), if there is one. */
  draft(id: string): Promise<RawDoc | undefined>;
  /** Every published document of these types. */
  publishedOfType(types: string[]): Promise<RawDoc[]>;
  /** A series' published chapters, with their pages' sizes. */
  chapters(seriesId: string): Promise<RawDoc[]>;
}

const SETTINGS_TYPES = ['commissionSettings', 'aboutPage', 'homePage', 'contactSettings'];
const ref = (value: unknown) => (value as { _ref?: string } | undefined)?._ref;

function settingsFrom(docs: RawDoc[]): Settings {
  const raw: RawSettings = Object.fromEntries(docs.map((d) => [d._type, d]));
  return readSettings(raw, picture);
}

function outlinedParts(kind: PreviewKind, id: string, changes: PreviewChanges): PreviewInfo['outlined'] {
  return changes.outlined.flatMap((field) => {
    const selector = partSelector(kind, field, id);
    return selector ? [{ field, selector }] : [];
  });
}

function seriesFrom(series: RawDoc, chapters: RawDoc[]): ComicSeries {
  const raw = { ...series, chapters: [...chapters].sort((a, b) => Number(a.number ?? 0) - Number(b.number ?? 0)) };
  return fromSanity(raw as unknown as SanitySeries);
}

/** The preview for /preview/<kind>/<id>, or undefined for Page not found. */
export async function loadPreview(
  kind: string,
  id: string,
  url: URL,
  source: PreviewSource,
): Promise<{ model: PreviewModel; info: PreviewInfo } | undefined> {
  if (!isPreviewKind(kind) || !(await source.isValid(url))) return undefined;
  const [published, draft] = await Promise.all([source.published(id), source.draft(id)]);
  const current = draft ?? published;
  if (!current || current._type !== kind) return undefined;
  const item: RawDoc = { ...current, _id: id };

  const page = Number(url.searchParams.get('page')) || undefined;
  const opened = url.searchParams.get('opened') === '1';
  let context: Parameters<typeof previewChanges>[2] = {};
  let series: RawDoc | undefined;
  if (kind === 'comicChapter') {
    const seriesId = ref(item.series);
    if (seriesId) {
      const [pubSeries, draftSeries] = await Promise.all([source.published(seriesId), source.draft(seriesId)]);
      series = pubSeries ?? (draftSeries && { ...draftSeries, _id: seriesId });
      if (!pubSeries && draftSeries) context = { ...context, seriesUnpublished: true };
    }
  }
  const changes0 = previewChanges(published, { ...item, _id: draft?._id ?? id });
  const target = previewTarget(item, { series, page, opened, firstChanged: changes0.outlined[0] });
  const base = { name: target.name, anchor: target.anchor };
  if (target.message) {
    return { model: { page: 'message' }, info: { ...base, notes: [], outlined: [], message: target.message } };
  }

  let model: PreviewModel;
  switch (kind) {
    case 'commissionSettings':
    case 'aboutPage':
    case 'homePage':
    case 'contactSettings':
    case 'commissionType': {
      const docs = await source.publishedOfType(kind === 'commissionType' ? [...SETTINGS_TYPES, 'commissionType'] : SETTINGS_TYPES);
      const all = overlay(docs, item);
      const settings = settingsFrom(all.filter((d) => SETTINGS_TYPES.includes(d._type)));
      if (target.page === 'commissions') {
        const types = all.filter((d) => d._type === 'commissionType') as unknown as CommissionType[];
        types.sort((a, b) => Number((a as unknown as RawDoc).order ?? 0) - Number((b as unknown as RawDoc).order ?? 0));
        model = { page: 'commissions', settings, types: commissionTypeCards(types) };
      } else model = { page: target.page as 'about' | 'home', settings };
      break;
    }
    case 'comicSeries':
      model = { page: 'series', series: seriesFrom(item, await source.chapters(id)) };
      break;
    case 'comicChapter': {
      const chapters = overlay(await source.chapters(series!._id), item);
      const others = chapters.filter((c) => c._id !== id && c.number === item.number);
      if (others.length) context = { ...context, duplicateNumber: Number(item.number) };
      const comic = seriesFrom(series!, chapters);
      const entries = readerPages(comic).filter((e) => e.chapter.number === item.number);
      const pageNumber = Math.min(Math.max(page ?? 1, 1), entries.length);
      model = { page: 'reader', entry: entries[pageNumber - 1] };
      break;
    }
    case 'galleryItem': {
      const items = overlay(await source.publishedOfType(['galleryItem']), item) as unknown as GalleryItem[];
      const sections = ((item.category as string[] | undefined) ?? []).slice(1);
      context = { ...context, otherSections: sections.map((s) => PORTFOLIO_SECTION_TITLES[s] ?? s) };
      model = { page: 'portfolio', items, focusId: id, openId: opened ? id : undefined };
      break;
    }
    case 'writtenWork':
      model = { page: 'writing', works: overlay(await source.publishedOfType(['writtenWork']), item) as unknown as WrittenWork[] };
      break;
    case 'product':
      model = { page: 'shop', products: overlay(await source.publishedOfType(['product']), item) as unknown as Product[] };
      break;
  }
  const changes = previewChanges(published, { ...item, _id: draft?._id ?? id }, context);
  return { model: model!, info: { ...base, notes: changes.notes, outlined: outlinedParts(kind, id, changes) } };
}

// ── Sanity ─────────────────────────────────────────────────────────────────

const NOT_DRAFT = '!(_id in path("drafts.**"))';
const PAGE_PROJECTION = 'pages[]{ _key, asset, altText, "dimensions": asset->metadata.dimensions }';
const COVER_PROJECTION = 'coverImage{ asset, hotspot, "dimensions": asset->metadata.dimensions }';
const project = (type: string | undefined) =>
  type === 'comicChapter' ? `{ ..., "pages": ${PAGE_PROJECTION} }` : type === 'comicSeries' ? `{ ..., "coverImage": ${COVER_PROJECTION} }` : '';

/** Reads with the preview token. Called only when a preview is requested, never at build time. */
export function sanitySource(token: string, projectId: string, dataset: string): PreviewSource {
  const client: SanityClient = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token, perspective: 'raw' });
  const one = async (docId: string) => {
    const type = await client.fetch<string | null>('*[_id == $docId][0]._type', { docId });
    if (!type) return undefined;
    return (await client.fetch<RawDoc | null>(`*[_id == $docId][0]${project(type)}`, { docId })) ?? undefined;
  };
  return {
    isValid: async (url) => (await validatePreviewUrl(client, url.toString())).isValid,
    published: (id) => one(id),
    draft: (id) => one(`drafts.${id}`),
    publishedOfType: (types) => client.fetch<RawDoc[]>(`*[_type in $types && ${NOT_DRAFT}]`, { types }),
    chapters: (seriesId) =>
      client.fetch<RawDoc[]>(
        `*[_type == "comicChapter" && series._ref == $seriesId && ${NOT_DRAFT}] | order(number asc) { ..., "pages": ${PAGE_PROJECTION} }`,
        { seriesId },
      ),
  };
}

// ── Fixtures ───────────────────────────────────────────────────────────────

/** The fixture build's documents (tests/fixtures/drafts.ts), with a fixed key. */
export function fixtureSource(fixtures: { key: string; published: RawDoc[]; drafts: RawDoc[] }): PreviewSource {
  const byId = (docs: RawDoc[], docId: string) => docs.find((d) => d._id === docId);
  return {
    isValid: async (url) => url.searchParams.get('sanity-preview-secret') === fixtures.key,
    published: async (id) => byId(fixtures.published, id),
    draft: async (id) => byId(fixtures.drafts, `drafts.${id}`),
    publishedOfType: async (types) => fixtures.published.filter((d) => types.includes(d._type)),
    chapters: async (seriesId) => {
      // Fixture series carry their published chapters inline; drafts of chapters are documents.
      const series = byId(fixtures.published, seriesId) ?? byId(fixtures.drafts, `drafts.${seriesId}`);
      const inline = ((series?.chapters as RawDoc[] | undefined) ?? []).map((c, i) => ({ ...c, _id: `${seriesId}-chapter-${i}`, _type: 'comicChapter' }));
      return inline;
    },
  };
}
