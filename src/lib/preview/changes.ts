// What changed between an item's published version and its draft: the parts to outline, and the
// notes for the yellow line. Design: docs/design/preview.md (Flow, States and errors).
// Spec: docs/specs/content-editing-preview.md (AC-3, AC-5). Pure.
import type { RawDoc } from './targets';

export interface PreviewChanges {
  /** Top-level fields that changed, which the page outlines. */
  outlined: string[];
  /** Lines for the yellow line, in order. */
  notes: string[];
}

export interface ChangeContext {
  /** For an art piece: the portfolio section titles it's in, after the first. */
  otherSections?: string[];
  /** For a chapter: its series has never been published. */
  seriesUnpublished?: boolean;
  /** For a story's chapter: its story has never been published (story-reader-pages AC-12). */
  storyUnpublished?: boolean;
  /** For a chapter: another chapter in the series has this chapter's number. */
  duplicateNumber?: number;
}

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt', '_originalId', '_system']);
const ALT_FIELDS = new Set(['alt', 'altText']);

/** A value with alt text removed at any depth (lists become objects keyed by position), to tell alt-text-only changes apart. */
function withoutAlt(value: unknown): unknown {
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([k]) => !ALT_FIELDS.has(k)).map(([k, v]) => [k, withoutAlt(v)]));
  }
  return value;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

type Named = { _key?: string; name?: string };

export function previewChanges(published: RawDoc | undefined, draft: RawDoc, context: ChangeContext = {}): PreviewChanges {
  const outlined: string[] = [];
  const notes: string[] = [];
  let altChanged = false;
  const fields = [...Object.keys(draft), ...Object.keys(published ?? {}).filter((k) => !(k in draft))];
  for (const field of fields) {
    if (SYSTEM_FIELDS.has(field)) continue;
    const before = published?.[field];
    const after = draft[field];
    if (same(before, after)) continue;
    if (published && (ALT_FIELDS.has(field) || same(withoutAlt(before), withoutAlt(after)))) {
      altChanged = true;
      continue;
    }
    if (published && draft._type === 'contactSettings' && field === 'email') {
      notes.push(`Not visible on the page: where the email buttons send people (now ${String(after ?? '')})`);
      continue;
    }
    outlined.push(field);
  }
  if (altChanged) notes.unshift('Not visible on the page: alt text');
  if (published && draft._type === 'contactSettings') {
    const kept = new Set(((draft.links as Named[] | undefined) ?? []).map((l) => l._key));
    for (const link of (published.links as Named[] | undefined) ?? []) {
      if (!kept.has(link._key)) notes.push(`Removed: ${link.name ?? 'a'} link`);
    }
  }
  if (published?.status === 'open' && draft._type === 'commissionSettings' && draft.status === 'closed') {
    notes.push('Removed from the page: How it works, Ready to order? and the commission email buttons');
  }
  if (context.otherSections?.length) notes.push(`Also in: ${context.otherSections.join(', ')}`);
  if (context.seriesUnpublished) notes.push("The series isn't published yet; it's shown as it will be.");
  if (context.storyUnpublished) notes.push("The story isn't published yet; it's shown as it will be.");
  if (context.duplicateNumber !== undefined) {
    notes.push(`Chapter ${context.duplicateNumber} already exists in this series; publishing is blocked until you change one`);
  }
  return { outlined, notes };
}

/** The draft in place of its published version, for the page to render. */
export function overlay(docs: RawDoc[], draft: RawDoc): RawDoc[] {
  const id = draft._id.replace(/^drafts\./, '');
  const doc = { ...draft, _id: id };
  return docs.some((d) => d._id === id) ? docs.map((d) => (d._id === id ? doc : d)) : [...docs, doc];
}
