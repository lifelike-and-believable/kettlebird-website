// Pictures from Word documents on the site: the query, the model and the text's HTML.
// Criteria: docs/specs/story-import-word.md AC-21, AC-22.
import { describe, expect, it } from 'vitest';
import { pictureAlt, type StoryPicture } from '../../src/lib/stories/model';
import { fromSanity, STORIES_QUERY } from '../../src/lib/stories/source';
import { pictureSizes, pictureWidths, STORY_COLUMN, storyHtml } from '../../src/lib/stories/text';

const raw = (over: Record<string, unknown> = {}) => ({
  _type: 'storyPicture',
  _key: 'p1',
  image: { _type: 'image', asset: { _ref: 'image-abc123-2400x1600-jpg' } },
  dimensions: { width: 2400, height: 1600 },
  alt: 'A map of the valley',
  decorative: false,
  ...over,
});

describe('story-import-word#AC-21 site pictures', () => {
  it('fetches a picture block\'s alt text, mark, image and size, in a story and its chapters', () => {
    const projection = 'content[]{ ..., _type == "storyPicture" => { _key, _type, alt, decorative, image, "dimensions": image.asset->metadata.dimensions } }';
    expect(STORIES_QUERY.split(projection)).toHaveLength(3);
  });

  it('turns a stored picture into the model', () => {
    const story = fromSanity({ _id: 'a', title: 'A', content: [raw()], chapters: [{ number: 1, content: [raw({ _key: 'p2', decorative: true, alt: undefined })] }] });
    const picture = story.text[0] as StoryPicture;
    expect(picture).toMatchObject({ _type: 'storyPicture', _key: 'p1', width: 2400, height: 1600, alt: 'A map of the valley', decorative: false });
    expect(picture.src).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/.+\/abc123-2400x1600\.jpg\?w=800&auto=format$/);
    expect(picture.srcset?.split(', ').map((s) => s.split(' ')[1])).toEqual(['480w', '800w', '1200w', '1600w']);
    expect(story.chapters[0].text[0]).toMatchObject({ _type: 'storyPicture', decorative: true, alt: undefined });
  });

  it('drops a picture without an image or a size, and keeps other blocks as they are', () => {
    const para = { _type: 'block', children: [{ _type: 'span', text: 'x' }] };
    const story = fromSanity({ _id: 'a', title: 'A', content: [raw({ image: {} }), raw({ dimensions: undefined }), para, { _type: 'sceneBreak' }] });
    expect(story.text).toEqual([para, { _type: 'sceneBreak' }]);
  });

  it('makes pictures no wider than they are', () => {
    expect(pictureWidths(2400)).toEqual([480, 800, 1200, 1600]);
    expect(pictureWidths(1600)).toEqual([480, 800, 1200, 1600]);
    expect(pictureWidths(1000)).toEqual([480, 800, 1000]);
    expect(pictureWidths(480)).toEqual([480]);
    expect(pictureWidths(300)).toEqual([300]);
    const small = fromSanity({ _id: 'a', title: 'A', content: [raw({ image: { asset: { _ref: 'image-s-300x200-png' } }, dimensions: { width: 300, height: 200 } })] }).text[0] as StoryPicture;
    expect(small.src).toContain('?w=300&');
    expect(small.srcset?.split(', ').map((s) => s.split(' ')[1])).toEqual(['300w']);
  });

  it('gives alt text, empty when decorative, else "Picture"', () => {
    expect(pictureAlt({ alt: ' A map ', decorative: false })).toBe('A map');
    expect(pictureAlt({ alt: 'A map', decorative: true })).toBe('');
    expect(pictureAlt({ decorative: true })).toBe('');
    expect(pictureAlt({ alt: '  ', decorative: false })).toBe('Picture');
    expect(pictureAlt({})).toBe('Picture');
  });
});

describe('story-import-word#AC-22 story html', () => {
  const picture = (over: Partial<StoryPicture> = {}): StoryPicture => ({
    _type: 'storyPicture',
    _key: 'p',
    src: 'https://cdn.test/a.jpg?w=800',
    srcset: 'https://cdn.test/a.jpg?w=480 480w, https://cdn.test/a.jpg?w=800 800w',
    width: 2400,
    height: 1600,
    alt: 'A map & a "road"',
    decorative: false,
    ...over,
  });
  const p = (text: string) => ({ _type: 'block', children: [{ _type: 'span', text }] });

  it('sizes a picture to the column or its own width, whichever is smaller', () => {
    expect(STORY_COLUMN).toBe('min(100vw - 2rem, 45rem)');
    expect(pictureSizes(2400)).toBe('min(2400px, 100vw - 2rem, 45rem)');
    expect(pictureSizes(300)).toBe('min(300px, 100vw - 2rem, 45rem)');
  });

  it('puts a picture where it was, in a button that opens it full screen', () => {
    expect(storyHtml([p('Before.'), picture(), p('After.')])).toBe(
      '<p>Before.</p>' +
        '<button type="button" class="story-picture" data-story-picture aria-label="Show full screen: A map &amp; a &quot;road&quot;">' +
        '<img src="https://cdn.test/a.jpg?w=800" srcset="https://cdn.test/a.jpg?w=480 480w, https://cdn.test/a.jpg?w=800 800w" ' +
        'sizes="min(2400px, 100vw - 2rem, 45rem)" width="2400" height="1600" loading="lazy" decoding="async" alt="A map &amp; a &quot;road&quot;">' +
        '</button>' +
        '<p>After.</p>',
    );
  });

  it('names a picture without alt text "Picture", and shows a decorative one plainly', () => {
    expect(storyHtml([picture({ alt: undefined, srcset: undefined })])).toBe(
      '<button type="button" class="story-picture" data-story-picture aria-label="Show full screen: Picture">' +
        '<img src="https://cdn.test/a.jpg?w=800" sizes="min(2400px, 100vw - 2rem, 45rem)" width="2400" height="1600" loading="lazy" decoding="async" alt="Picture">' +
        '</button>',
    );
    expect(storyHtml([picture({ decorative: true })])).toBe(
      '<img class="story-picture story-picture--decorative" src="https://cdn.test/a.jpg?w=800" srcset="https://cdn.test/a.jpg?w=480 480w, https://cdn.test/a.jpg?w=800 800w" ' +
        'sizes="min(2400px, 100vw - 2rem, 45rem)" width="2400" height="1600" loading="lazy" decoding="async" alt="">',
    );
  });

  it('keeps scene breaks off the edges next to pictures', () => {
    expect(storyHtml([{ _type: 'sceneBreak' }, picture({ decorative: true }), { _type: 'sceneBreak' }])).toMatch(/^<img [^>]+>$/);
  });
});
