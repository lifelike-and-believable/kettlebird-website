---
id: story-comic-reader-publish-pages
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - requirements-comics#REQ-comics-3: 1c122b12d909
  - design-cms#decision: 889c200357ba
  - persona-artist#goals: f3044c738f84
  - persona-artist#frustrations: ef88538c418e
---

# Publish pages and chapters

<!-- docs/product/stories/comic-reader/publish-pages.md. Story 5 of epic-comic-reader. Uses the
editor work in the content-editing epic (editor at /studio, publish status) where it exists. -->

As Star, I want pages and chapters I add in the CMS to appear in the reader, in order, after the next deploy, so that new pages reach fans without a developer.

## Acceptance criteria

- In the editor, Star can create a series, add chapters to it with a number and an optional title, and reorder chapters.
- Star can add many pages to a chapter at once by dragging the files in; they are ordered by file name, and Star can drag pages to reorder them.
- Star uploads originals as they are, including print-resolution files, with no resizing step; the site shows them at screen size.
- Each page has an **Alt text** field; a page without it shows a warning in the editor but can still be published.
- After Star publishes, the new pages and chapters appear in the reader, in the order Star set, within a few minutes and without anyone else doing anything.
- Pages already published keep their addresses when Star adds pages to the end of a chapter or adds a new chapter.
- Moving or removing a published page shows Star a warning that links people have shared to later pages in that chapter will change.
