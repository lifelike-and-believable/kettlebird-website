// Mature or explicit content, in place of ratings: the field, the publish checks, the one-off change, the site's
// reading of it, the tag and the guide. Criteria: docs/specs/story-mature-content.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fieldText, FIELDS, HIDDEN } from '../../sanity-studio/lib/editor-content';
import { matureFromRating, storyNeeds, WEB_ADDRESS_MESSAGE } from '../../sanity-studio/lib/stories';
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
        "Tick it for sex scenes, graphic violence or other strong content. Readers are then asked before the text shows, and the story's card and page say so. Left unticked, readers go straight to the text. It covers the story and all its chapters.",
    });
  });

  it('stores it as a boolean, unticked at first, and keeps rating hidden', () => {
    const schema = read('sanity-studio/schemas/objects/writtenWork.ts');
    expect(schema).toMatch(/name: 'mature',\s*type: 'boolean',[^}]*initialValue: false/s);
    expect(schema).toMatch(/name: 'rating',[^}]*hidden: true/s);
    expect(schema).not.toMatch(/RATINGS|RATING_MESSAGE/);
    expect(HIDDEN.writtenWork).toEqual(['rating']);
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

describe('story-mature-content#AC-3 one-off change', () => {
  it('ticks the box for Mature and Explicit, and removes every rating', () => {
    expect(matureFromRating({ rating: 'mature' })).toEqual({ setMature: true, unsetRating: true });
    expect(matureFromRating({ rating: 'explicit', mature: false })).toEqual({ setMature: true, unsetRating: true });
    for (const rating of ['general', 'teen', 'notRated', 'spicy', '']) {
      expect(matureFromRating({ rating }), rating).toEqual({ setMature: false, unsetRating: true });
    }
    expect(matureFromRating({ rating: 'teen', mature: true })).toEqual({ setMature: false, unsetRating: true });
  });

  it('changes nothing the second time', () => {
    expect(matureFromRating({ mature: true })).toEqual({ setMature: false, unsetRating: false });
    expect(matureFromRating({})).toEqual({ setMature: false, unsetRating: false });
    expect(matureFromRating({ rating: 'mature', mature: true })).toEqual({ setMature: false, unsetRating: true });
  });

  it('is a migration for stories that uses that rule', () => {
    const migration = read('sanity-studio/migrations/mature-from-rating/index.ts');
    expect(migration).toContain("from 'sanity/migrate'");
    expect(migration).toMatch(/documentTypes: \['writtenWork'\]/);
    expect(migration).toContain('matureFromRating');
  });
});

describe('story-mature-content#AC-4 source', () => {
  it('reads mature and the old rating', () => {
    expect(STORIES_QUERY).toMatch(/\bmature\b/);
    expect(STORIES_QUERY).toMatch(/\brating\b/);
  });

  it('counts a story as ticked when mature is true, or its old rating is Mature or Explicit', () => {
    expect(isMature({ mature: true })).toBe(true);
    expect(isMature({ rating: 'mature' })).toBe(true);
    expect(isMature({ rating: 'explicit' })).toBe(true);
    expect(isMature({ mature: false, rating: 'explicit' })).toBe(true);
    for (const raw of [{}, { mature: false }, { rating: 'teen' }, { rating: 'general' }, { rating: 'notRated' }, { mature: 'yes' as unknown as boolean }]) {
      expect(isMature(raw), JSON.stringify(raw)).toBe(false);
    }
    expect(fromSanity({ _id: 'a', title: 'A', rating: 'explicit' }).mature).toBe(true);
    expect(fromSanity({ _id: 'a', title: 'A' }).mature).toBe(false);
    expect(fromSanity({ _id: 'a', title: 'A', rating: 'teen' })).not.toHaveProperty('rating');
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
