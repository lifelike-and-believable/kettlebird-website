// Fixture stories for tests and the fixture build (KETTLEBIRD_FIXTURES=1). Spec: docs/specs/story-reader-pages.md.
import type { Story, StoryImage, StoryPicture, TextBlock } from '../../src/lib/stories/model';

function cover(label: string): StoryImage {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">` +
    `<rect width="100%" height="100%" fill="#e8dcc0"/>` +
    `<text x="50%" y="50%" font-family="sans-serif" font-size="40" text-anchor="middle" fill="#2b2b2b">${label}</text></svg>`;
  return { src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, width: 500, height: 700 };
}

let k = 0;
const p = (...parts: (string | [string, ...string[]])[]): TextBlock => ({
  _type: 'block',
  _key: `b${k++}`,
  style: 'normal',
  children: parts.map((part) => (typeof part === 'string' ? { _type: 'span', text: part, marks: [] } : { _type: 'span', text: part[0], marks: part.slice(1) })),
});
const brk: TextBlock = { _type: 'sceneBreak', _key: 'brk' };
/** A picture from a Word document (docs/specs/story-import-word.md), as the site's model has it. */
function picture(label: string, width: number, height: number, alt?: string, decorative = false): StoryPicture {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="#b8c9a3"/>` +
    `<text x="50%" y="50%" font-family="sans-serif" font-size="${Math.round(height / 6)}" text-anchor="middle" fill="#2b2b2b">${label}</text></svg>`;
  return { _type: 'storyPicture', _key: `pic-${label}`, src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, width, height, alt, decorative };
}

export const FIXTURE_STORIES: Story[] = [
  {
    id: 'story-song',
    slug: 'the-kettles-song',
    title: "The Kettle's Song",
    description: 'A kettle that sings at midnight.',
    cover: cover("The Kettle's Song"),
    genres: ['Fantasy', 'Cozy'],
    mature: false,
    contentNotes: 'Mild peril.\nA very loud kettle.',
    link: 'https://archiveofourown.org/works/1',
    date: '2026-10-01',
    text: [
      p('The kettle began to sing at ', ['midnight', 'em'], ', as it always did.'),
      p('Nobody in the house ', ['ever', 'strong'], ' slept through it.'),
      brk,
      p('In the morning, the fox came back.\nShe brought bread.'),
      p('* * *'),
      p('And that <was> the end & the beginning.'),
    ],
    chapters: [],
  },
  {
    id: 'story-road',
    slug: 'the-long-road',
    title: 'The Long Road',
    description: 'A fox walks home the long way.',
    genres: ['Adventure'],
    mature: false,
    status: 'inProgress',
    date: '2026-09-01',
    text: [],
    chapters: [
      // Out of order on purpose: the site sorts by number.
      { number: 2, title: 'Over the Ridge', date: '2026-10-20', text: [p('The ridge was steep.')] },
      { number: 1, title: 'Setting Out', date: '2026-09-01', text: [p('She left at dawn.')] },
      {
        number: 3,
        date: '2026-11-01',
        text: [
          p('Rain, all day.'),
          picture('Map', 2400, 1600, 'A map of the valley'),
          p('Mira drew the ridge on the back of a letter.'),
          picture('Sketch', 300, 200, 'A small sketch'),
          picture('Flourish', 600, 80, undefined, true),
          p('Then they slept.'),
        ],
      },
      // No text: not shown anywhere on the site.
      { number: 4, title: 'Not Written Yet', text: [] },
    ],
  },
  {
    id: 'story-market',
    slug: 'night-market',
    title: 'Night Market',
    description: 'What is sold after dark.',
    genres: ['Horror'],
    mature: true,
    contentNotes: 'Violence.',
    date: '2026-08-01',
    text: [p('The stalls opened at midnight.'), picture('Lantern', 800, 1000, 'A lantern')],
    chapters: [],
  },
  {
    id: 'story-finished',
    slug: 'finished-tale',
    title: 'Finished Tale',
    genres: [],
    mature: false,
    contentNotes: 'Grief.',
    status: 'complete',
    date: '2026-07-01',
    text: [],
    chapters: [
      { number: 1, date: '2026-07-01', text: [p('It began.')] },
      { number: 2, title: 'Last', date: '2026-07-01', text: [p('It ended.')] },
    ],
  },
  {
    // Only elsewhere: no text, so no page.
    id: 'story-elsewhere',
    slug: 'elsewhere-tale',
    title: 'Elsewhere Tale',
    description: 'Read it on Tumblr.',
    genres: ['Poetry'],
    mature: false,
    link: 'https://kettlebird.tumblr.com/post/1',
    date: '2026-06-01',
    text: [],
    chapters: [],
  },
];
