#!/usr/bin/env node
// After a build: no draft document and not the preview token in any built file.
// Spec: docs/specs/content-editing-preview.md (AC-9). Usage: node scripts/check-no-drafts.mjs [dir...]

/** files: path -> contents. Returns one line per leak. */
export function findLeaks(_files, _token) {
  throw new Error('not implemented');
}
