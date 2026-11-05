// Finding a page's panels in the browser: a small copy of its picture from the image CDN, drawn on a
// canvas and read by findPanels (docs/specs/comic-reader-panels.md AC-2 to AC-4).
import { findPanels, type Panel } from '../lib/panels';

/** The image CDN's address for an asset, `width` pixels wide. */
export function assetUrl(ref: string, projectId: string, dataset: string, width: number): string | undefined {
  const m = ref.match(/^image-([a-zA-Z0-9]+)-(\d+x\d+)-([a-z0-9]+)$/);
  return m ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}.${m[3]}?w=${width}` : undefined;
}

export async function findOnPage(src: string | undefined): Promise<Panel[] | 'failed'> {
  if (!src) return 'failed';
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    await img.decode();
    const width = Math.min(400, img.naturalWidth);
    const height = Math.round((img.naturalHeight / img.naturalWidth) * width);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 'failed';
    ctx.drawImage(img, 0, 0, width, height);
    return findPanels(ctx.getImageData(0, 0, width, height).data, width, height);
  } catch {
    return 'failed';
  }
}

/** Panels as Sanity stores them: each with a key and its type. */
export function storedPanels(panels: Panel[]) {
  return panels.map((p, i) => ({
    _type: 'panel',
    _key: `p${i}${Math.random().toString(36).slice(2, 7)}`,
    x: Math.round(p.x * 10) / 10,
    y: Math.round(p.y * 10) / 10,
    width: Math.round(p.width * 10) / 10,
    height: Math.round(p.height * 10) / 10,
  }));
}
