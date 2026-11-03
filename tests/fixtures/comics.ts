// Fixture comics for tests and the fixture build (KETTLEBIRD_FIXTURES=1).
// Placeholder SVG pages stand in for Star's sample pages until those are provided.
import type { ComicImage, ComicSeries } from '../../src/lib/comics/model';

function page(label: string, width = 800, height = 1200): ComicImage {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="#f4ecd8"/>` +
    `<rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="#2b2b2b" stroke-width="8"/>` +
    `<text x="50%" y="50%" font-family="sans-serif" font-size="56" text-anchor="middle" fill="#2b2b2b">${label}</text>` +
    `</svg>`;
  return { src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, width, height };
}

const p = (label: string, altText?: string) => ({ image: page(label), altText });

export const FIXTURE_SERIES: ComicSeries[] = [
  {
    slug: 'kettle-tales',
    title: 'Kettle Tales',
    description: 'A fox and a kettle set out across the hills.',
    status: 'ongoing',
    type: 'original',
    cover: page('Kettle Tales cover', 500, 700),
    chapters: [
      // Deliberately out of order: the site sorts by number.
      { number: 2, title: 'The Long Road', pages: [p('KT 2-1', 'The fox sets out at dawn.'), p('KT 2-2', 'Rain on the road.')] },
      { number: 1, title: 'The Kettle', pages: [p('KT 1-1', 'A fox looks up at a kettle on a high shelf.'), p('KT 1-2', 'The kettle wobbles.'), p('KT 1-3', 'It falls.')] },
      { number: 3, title: 'Not Ready Yet', pages: [] },
      { number: 4, title: 'Homeward', pages: [p('KT 4-1', 'Home at last.')] },
    ],
  },
  {
    slug: 'one-shot',
    title: 'One Shot',
    description: 'A short fan comic.\nTwo friends, one afternoon.',
    status: 'complete',
    type: 'fancomic',
    chapters: [{ number: 1, pages: [p('OS 1', 'Two friends meet.'), p('OS 2')] }],
  },
  {
    slug: 'paused',
    title: 'Paused',
    status: 'hiatus',
    type: 'original',
    chapters: [{ number: 1, pages: [p('PA 1', 'A single page.')] }],
  },
  {
    slug: 'coming-soon',
    title: 'Coming Soon',
    description: 'Nothing posted yet.',
    status: 'ongoing',
    type: 'original',
    chapters: [],
  },
  {
    title: 'No Address',
    status: 'ongoing',
    type: 'original',
    chapters: [{ number: 1, pages: [p('NA 1', 'Unreachable.')] }],
  },
];
