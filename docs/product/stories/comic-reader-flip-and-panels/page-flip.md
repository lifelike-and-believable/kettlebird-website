---
id: story-comic-reader-flip-and-panels-page-flip
status: draft
derived-from:
  - epic-comic-reader-flip-and-panels#outcome: c1426bb16011
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
---

# Page-flip

<!-- docs/product/stories/comic-reader-flip-and-panels/page-flip.md. Story 2 of epic-comic-reader-flip-and-panels. -->

As a fan, I want turning a page to look like turning a page in a printed comic, so that reading on the site feels like reading Star's book.

## Acceptance criteria

- Turning forward or back shows the page turning over, on a wide screen (a spread) and on a narrow one (a single page).
- The turn is quick enough not to slow reading, and a second turn during the animation isn't lost.
- When the system asks for reduced motion, pages change without the animation (REQ-site-4).
- The page that appears is the same as without the animation: same address, same focus and announcements, and the next pages are still loaded ahead.
- A turn never leaves half a page or a blank page showing if the next image is slow to load.
