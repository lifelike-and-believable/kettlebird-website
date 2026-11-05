// The fixture build never reads the live site's content lists, so the end-to-end tests see the same
// site whatever Star has published (the portfolio's first piece broke them on 2026-11-04).
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/sanity', () => ({
  sanityClient: { fetch: () => Promise.reject(new Error('The fixture build read live content')) },
}));

afterEach(() => { delete process.env.KETTLEBIRD_FIXTURES; });

describe('fixture build content', () => {
  it('lists no art, stories, news, products or commission types', async () => {
    process.env.KETTLEBIRD_FIXTURES = '1';
    const q = await import('../../src/lib/queries');
    for (const list of [q.getAllGalleryItems, q.getFeaturedGalleryItems, q.getAllWrittenWorks, q.getNewsFeed, q.getAllProducts, q.getAllCommissionTypes]) {
      expect(await list(), list.name).toEqual([]);
    }
  });

  it('still reads the live content outside the fixture build', async () => {
    const q = await import('../../src/lib/queries');
    await expect(q.getAllGalleryItems()).rejects.toThrow('The fixture build read live content');
  });
});
