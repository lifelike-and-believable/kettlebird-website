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
// A two-page spread: one wide picture (docs/specs/comic-reader-spread-and-flip.md).
const spread = (label: string, altText?: string) => ({ image: page(label, 1600, 1200), altText, spread: true });
// Panels, in percent of the picture, found by the site (docs/specs/comic-reader-panels.md).
const box = (x: number, y: number, width: number, height: number) => ({ x, y, width, height });
const panelled = <T extends object>(pg: T, ...panels: ReturnType<typeof box>[]) => ({ ...pg, panels, panelsBy: 'site' as const });

export const FIXTURE_SERIES: ComicSeries[] = [
  {
    slug: 'kettle-tales',
    title: 'Kettle Tales',
    description: 'A fox and a kettle set out across the hills.',
    status: 'ongoing',
    type: 'original',
    // How it reads (docs/specs/comic-reader-comic-settings.md): on, for the reading tutorial's pairs.
    twoUp: true,
    pageFlip: true,
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
  // Pairs on a wide screen (comic-reader-spread-and-flip): chapter 1 opens on the right and has a
  // spread at page 5, leaving page 4 alone; chapter 2 opens on the left and ends with a pair.
  // Pages 1 to 3 of chapter 1 have panels (comic-reader-panels, comic-reader-panels-two-up).
  {
    slug: 'open-book',
    title: 'Open Book',
    description: 'Facing pages and a spread.',
    status: 'ongoing',
    type: 'original',
    twoUp: true,
    pageFlip: true,
    chapters: [
      {
        number: 1,
        title: 'Facing Pages',
        pages: [
          panelled(p('OB 1-1', 'A door opens.'), box(5, 3, 90, 45), box(5, 52, 90, 45)),
          // A pair with panels on both pages (comic-reader-panels-two-up).
          panelled(p('OB 1-2', 'A hall of mirrors.'), box(5, 3, 90, 45), box(5, 52, 90, 45)),
          panelled(p('OB 1-3', 'The fox sees itself.'), box(5, 3, 43, 45), box(52, 3, 43, 45), box(5, 52, 90, 45)),
          p('OB 1-4', 'A window.'),
          spread('OB 1-5 spread', 'The whole valley below.'),
          p('OB 1-6', 'Night falls.'),
        ],
      },
      {
        number: 2,
        title: 'Left First',
        openOn: 'left',
        pages: [p('OB 2-1', 'Morning.'), p('OB 2-2', 'Breakfast.'), p('OB 2-3', 'The road.'), p('OB 2-4', 'A bridge.')],
      },
    ],
  },
  // One page at a time with the page-flip (comic-reader-comic-settings): a spread shows alone.
  {
    slug: 'single-sheets',
    title: 'Single Sheets',
    description: 'One page at a time.',
    status: 'ongoing',
    type: 'original',
    twoUp: false,
    pageFlip: true,
    chapters: [
      {
        number: 1,
        pages: [
          panelled(p('SS 1', 'A lamp.'), box(5, 3, 90, 45), box(5, 52, 90, 45)),
          p('SS 2', 'A window.'),
          panelled(spread('SS 3 spread', 'The whole town.'), box(3, 5, 45, 90), box(52, 5, 45, 90)),
          panelled(p('SS 4', 'A door.'), box(5, 3, 43, 45), box(52, 3, 43, 45), box(5, 52, 90, 45)),
        ],
      },
    ],
  },
];
