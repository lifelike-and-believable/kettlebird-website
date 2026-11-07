// Pictures from Word documents in the editor: alt text from Word, re-saving, matching a new version's pictures with
// the last upload's, the alt text count, undo, and unused pictures. Pure. Spec: docs/specs/story-import-word.md
// AC-9, AC-12, AC-13, AC-15, AC-16, AC-18.

/** What's kept for a picture in the text, besides the picture itself. */
export interface PictureSettings {
  hash: string;
  alt?: string;
  decorative: boolean;
  /** Alt text is Word's (shown "alt text from Word"). */
  fromWord: boolean;
  /** Word's description and decorative mark at the last upload, to see if Word's changed. */
  wordAlt?: string;
  wordDecorative: boolean;
  /** Star changed Alt text or Decorative in the editor. */
  edited: boolean;
}

export const WIDEST = 3200;

const AUTOMATIC = /description (automatically generated|generated with (very )?high confidence)\s*$/i;
const FILE_NAME = /^[^\n\\/]+\.(jpe?g|png|gif|webp|bmp|tiff?|heic|emf|wmf|svg)$/i;

/** AC-9: Word's description as alt text, unless it's Word's automatic kind, a file name, or nothing. */
export function altFromWord(descr: string | undefined): string | undefined {
  const alt = descr?.trim();
  if (!alt || AUTOMATIC.test(alt) || FILE_NAME.test(alt)) return undefined;
  return alt;
}

/** AC-12: at most 3200 wide, keeping the picture's shape. */
export function resaveSize(width: number, height: number): { width: number; height: number } {
  if (width <= WIDEST) return { width, height };
  return { width: WIDEST, height: Math.round((height * WIDEST) / width) };
}

/** AC-12: JPEG and WebP stay as they are; PNG and GIF become PNG. */
export function resaveType(type: string): string {
  return type === 'image/jpeg' || type === 'image/webp' ? type : 'image/png';
}

/** The picture's data's SHA-256, in hex: the same picture has the same hash (AC-15). */
export async function pictureHash(data: Uint8Array): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data as Uint8Array<ArrayBuffer>);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** AC-15: a new version's pictures, keeping what was set for the same pictures (by data, in order of use). */
export function matchPictures(
  previous: PictureSettings[],
  incoming: { hash: string; wordAlt?: string; wordDecorative: boolean }[],
): { pictures: PictureSettings[]; kept: number; fresh: number } {
  const left = [...previous];
  let kept = 0;
  const pictures = incoming.map((next): PictureSettings => {
    const at = left.findIndex((p) => p.hash === next.hash);
    const fromWord = (): PictureSettings => {
      const alt = altFromWord(next.wordAlt);
      return { hash: next.hash, alt, decorative: next.wordDecorative, fromWord: !!alt, wordAlt: next.wordAlt, wordDecorative: next.wordDecorative, edited: false };
    };
    if (at < 0) return fromWord();
    const [was] = left.splice(at, 1);
    kept += 1;
    if (was.wordAlt !== next.wordAlt || was.wordDecorative !== next.wordDecorative) return fromWord();
    return { ...was };
  });
  return { pictures, kept, fresh: incoming.length - kept };
}

/** AC-13: how many pictures have neither alt text nor Decorative. */
export function needsAlt(pictures: { alt?: string; decorative?: boolean }[]): number {
  return pictures.filter((p) => !p.decorative && !p.alt?.trim()).length;
}

export function altCountLine(missing: number): string {
  if (missing === 0) return 'Every picture has alt text or is decorative.';
  return missing === 1 ? '1 needs alt text' : `${missing} need alt text`;
}

export const altLabel = (number: number) => `Alt text for picture ${number}`;
export const DECORATIVE_LABEL = 'Decorative: screen readers skip it';
export const ALT_MARK = 'Alt text';
export const FROM_WORD = 'alt text from Word';
export const ALT_MISSING_LINE = 'Add alt text so people using screen readers know what it shows, or tick Decorative. You can still publish.';

/** AC-16: what Undo puts back, as text, so its pictures aren't references. */
export function undoSnapshot(content: unknown[] | undefined, upload: Record<string, unknown> | undefined): string {
  // A reference is kept as `assetRef`, so the snapshot holds no `_ref` the editor or a search could take for one.
  return JSON.stringify({ content: content ?? [], upload: upload ?? null }, (k, v) => (k === '_ref' ? undefined : k === 'asset' && v?._ref ? { assetRef: v._ref } : v));
}

const restore = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(restore);
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([k, v]) => {
      const ref = k === 'asset' && v && typeof v === 'object' ? (v as { assetRef?: string }).assetRef : undefined;
      return [k, ref ? { _type: 'reference', _ref: ref } : restore(v)];
    });
    return Object.fromEntries(entries);
  }
  return value;
};

export function undoFrom(snapshot: string | undefined): { content: unknown[]; upload?: Record<string, unknown> } | undefined {
  if (!snapshot) return undefined;
  try {
    const value = JSON.parse(snapshot) as { content?: unknown[]; upload?: Record<string, unknown> | null };
    return { content: restore(value.content ?? []) as unknown[], upload: value.upload ?? undefined };
  } catch {
    return undefined;
  }
}

type Blockish = { _type?: string; edited?: boolean; image?: { asset?: { _ref?: string } } };

/** AC-16: whether alt text or Decorative was changed since the upload, so Undo asks first. */
export function editedSince(content: Blockish[] | undefined): boolean {
  return (content ?? []).some((b) => b._type === 'storyPicture' && b.edited === true);
}

/** AC-18: the picture assets a text uses, each once. */
export function pictureAssets(content: Blockish[] | undefined): string[] {
  const ids = (content ?? []).filter((b) => b._type === 'storyPicture').map((b) => b.image?.asset?._ref);
  return [...new Set(ids.filter((id): id is string => !!id))];
}

/** AC-18: discarded pictures, and those the published version used that the new one doesn't, that nothing refers to. */
export function unusedPictures(input: { discarded: string[]; before: string[]; after: string[]; referenced: Set<string> }): string[] {
  const after = new Set(input.after);
  const candidates = [...new Set([...input.discarded, ...input.before])];
  return candidates.filter((id) => !after.has(id) && !input.referenced.has(id));
}
