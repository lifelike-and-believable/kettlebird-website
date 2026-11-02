// Site settings for the build: the four published items from Sanity, read once per build, or the
// starting values for the fixture build (KETTLEBIRD_FIXTURES=1) and whenever Sanity can't be reached
// (content-editing-site-settings AC-6; REQ-site-5).
import { sanityClient, urlFor } from './sanity';
import { readSettings, type Picture, type RawSettings, type Settings } from './site-settings';

const TYPES = ['commissionSettings', 'aboutPage', 'homePage', 'contactSettings'];
const QUERY = '*[_id in $ids]';
const PORTRAIT_WIDTH = 640;

/** A Sanity image as a picture, keeping its shape from the asset's id (image-<id>-<w>x<h>-<ext>). */
function picture(image: unknown): Picture | null {
  const ref = (image as { asset?: { _ref?: string } }).asset?._ref ?? '';
  const size = /-(\d+)x(\d+)-/.exec(ref);
  if (!size) return null;
  const [w, h] = [Number(size[1]), Number(size[2])];
  const width = Math.min(PORTRAIT_WIDTH, w);
  return { src: urlFor(image as object).width(width).fit('max').auto('format').url(), width, height: Math.round((h * width) / w) };
}

let cache: Promise<Settings> | undefined;

export function getSettings(): Promise<Settings> {
  cache ??= load();
  return cache;
}

async function load(): Promise<Settings> {
  if (import.meta.env.KETTLEBIRD_FIXTURES === '1' || process.env.KETTLEBIRD_FIXTURES === '1') return readSettings({});
  try {
    const docs: { _type: string }[] = await sanityClient.fetch(QUERY, { ids: TYPES }, { perspective: 'published' });
    const raw: RawSettings = Object.fromEntries(docs.map((d) => [d._type, d as Record<string, unknown>]));
    return readSettings(raw, picture);
  } catch (e) {
    console.warn('[site settings] Could not fetch site settings; using the starting values:', e);
    return readSettings({});
  }
}
