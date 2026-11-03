// Unit tests for scripts/check-no-drafts.mjs. Spec: docs/specs/content-editing-preview.md (AC-9).
import { describe, expect, it } from 'vitest';
// @ts-ignore -- a .mjs script without types; astro check may or may not resolve it.
import { findLeaks } from '../../scripts/check-no-drafts.mjs';

describe('content-editing-preview#AC-9 public client', () => {
  it('finds draft ids and the token in built files, and nothing in clean ones', () => {
    const files = {
      'index.html': '<p>Hello</p>',
      'comics/x/index.html': '<script>{"_id":"drafts.abc123"}</script>',
      '_astro/a.js': 'const t="sk-secret-token-value"',
    };
    expect(findLeaks(files, 'sk-secret-token-value')).toEqual([
      'comics/x/index.html: a draft document (drafts.abc123)',
      '_astro/a.js: the preview token',
    ]);
    expect(findLeaks({ 'index.html': '<p>drafts of my work</p>' }, 'tok')).toEqual([]);
    expect(findLeaks({ 'a.html': 'x' }, undefined)).toEqual([]);
  });
});

describe('content-editing-preview#AC-9 public client', () => {
  it('reads published content only, without a token', async () => {
    const { sanityClient } = await import('../../src/lib/sanity');
    expect(sanityClient.config().perspective).toBe('published');
    expect(sanityClient.config().token).toBeUndefined();
  });
});
