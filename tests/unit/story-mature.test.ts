// Mature or explicit content, in place of ratings: the field, the publish checks, no old ratings left, the site's
// reading of it, the tag and the guide. Criteria: docs/specs/story-mature-content.md.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fieldText, FIELDS, HIDDEN } from '../../sanity-studio/lib/editor-content';
import { storyNeeds, WEB_ADDRESS_MESSAGE } from '../../sanity-studio/lib/stories';
import { MATURE_LINE, MATURE_TAG } from '../../src/lib/stories/model';
import { fromSanity, isMature, STORIES_QUERY } from '../../src/lib/stories/source';

const read = (path: string) => readFileSync(path, 'utf8');

describe('story-mature-content#AC-1 fields', () => {
  it('has Mature or explicit content where Rating was, with the design\'s help text', () => {
    expect(Object.keys(FIELDS.writtenWork).slice(4, 7)).toEqual(['genre', 'mature', 'contentNotes']);
    expect(Object.keys(FIELDS.writtenWork)).not.toContain('rating');
    expect(fieldText('writtenWork', 'mature')).toEqual({
      title: 'Mature or explicit content',
      description:
        "Tick it for sex scenes, graphic violence or other strong content. Readers are then asked before the text shows, and the story's card and page say so. Left unticked, readers go straight to the text. It covers the story and all its chapters. Search engines are told too, so it can be left out for people searching with safe search on.",
    });
  });

  it('stores it as a boolean, unticked at first, with no old rating field', () => {
    const schema = read('sanity-studio/schemas/objects/writtenWork.ts');
    expect(schema).toMatch(/name: 'mature',\s*type: 'boolean',[^}]*initialValue: false/s);
    expect(schema).not.toMatch(/name: 'rating'/);
    expect(schema).not.toMatch(/RATINGS|RATING_MESSAGE/);
    expect(HIDDEN.writtenWork).toEqual([]);
    expect(read('sanity-studio/schemas/objects/storyChapter.ts')).not.toMatch(/name: 'mature'/);
  });
});

describe('story-mature-content#AC-2 publish checks', () => {
  it('asks only for a web address', () => {
    expect(storyNeeds({ hasText: true, hasChapters: false, slug: 'a' })).toEqual([]);
    expect(storyNeeds({ hasText: false, hasChapters: true })).toEqual([WEB_ADDRESS_MESSAGE]);
    expect(read('sanity-studio/lib/stories.ts')).not.toMatch(/RATING_MESSAGE|RATINGS|Choose a rating/);
    for (const file of ['sanity-studio/lib/story-checks.ts', 'sanity-studio/actions/publishStory.tsx']) {
      expect(read(file), file).not.toMatch(/rating/i);
    }
  });
});

describe('story-mature-content#AC-3 no old ratings left', () => {
  it('has no one-off change and no rating rule left, the test story being deleted', () => {
    expect(existsSync('sanity-studio/migrations/mature-from-rating')).toBe(false);
    expect(read('sanity-studio/lib/stories.ts')).not.toMatch(/matureFromRating|rating/i);
  });
});

describe('story-mature-content#AC-4 source', () => {
  it('reads mature, and no rating', () => {
    expect(STORIES_QUERY).toMatch(/\bmature\b/);
    expect(STORIES_QUERY).not.toMatch(/\brating\b/);
  });

  it('counts a story as ticked only when mature is true', () => {
    expect(isMature({ mature: true })).toBe(true);
    for (const raw of [{}, { mature: false }, { mature: 'yes' as unknown as boolean }, { rating: 'explicit' } as { mature?: boolean }]) {
      expect(isMature(raw), JSON.stringify(raw)).toBe(false);
    }
    expect(fromSanity({ _id: 'a', title: 'A', mature: true }).mature).toBe(true);
    expect(fromSanity({ _id: 'a', title: 'A' }).mature).toBe(false);
  });
});

describe('story-mature-content#AC-5 AC-6 tag and line', () => {
  it('words it one way everywhere', () => {
    expect(MATURE_TAG).toBe('Mature or explicit');
    expect(MATURE_LINE).toBe('This story has mature or explicit content.');
  });

  it('keeps the tag colours: beige on the card, yellow on the page', () => {
    expect(read('src/components/pages/WritingPage.astro')).toMatch(/\.tag--mature \{ background: var\(--color-beige\); \}/);
    expect(read('src/components/pages/StoryPage.astro')).toMatch(/\.tag--mature \{ background: var\(--color-yellow\); \}/);
    for (const file of ['src/components/pages/WritingPage.astro', 'src/components/pages/StoryPage.astro', 'src/components/stories/BeforeYouRead.astro']) {
      expect(read(file), file).not.toMatch(/rating/i);
    }
  });

  it('keeps the remembered Continue', async () => {
    const { GATE_STORAGE_KEY } = await import('../../src/lib/stories/model');
    expect(GATE_STORAGE_KEY).toBe('kb-continue-rated');
  });
});

describe('story-mature-content#AC-10 guide', () => {
  it('no longer mentions ratings in Star\'s guide, and says what the box does', () => {
    const guide = read('docs/user/publishing-stories.md');
    expect(guide).toContain('summary: "Starting a story, uploading its text, and chapters."');
    expect(guide).not.toMatch(/\brat(ing|ings|ed)\b/i);
    for (const words of ['**Mature or explicit content**', '## Mature content and content notes', 'This story has mature or explicit content.']) {
      expect(guide, words).toContain(words);
    }
    for (const tutorial of ['docs/tutorials/publishing-stories.md', 'docs/tutorials/reading-stories.md']) {
      expect(read(tutorial), tutorial).not.toMatch(/\bRating\b|Rated (General|Teen)|rated Mature/);
    }
  });
});
