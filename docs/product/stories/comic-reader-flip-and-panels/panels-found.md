---
id: story-comic-reader-flip-and-panels-panels-found
status: draft
derived-from:
  - epic-comic-reader-flip-and-panels#outcome: c1426bb16011
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - persona-artist#goals: f3044c738f84
---

# Panels found for me

<!-- docs/product/stories/comic-reader-flip-and-panels/panels-found.md. Story 4 of epic-comic-reader-flip-and-panels. -->

As Star, I want the site to find the panels on each page I publish, in reading order, so that panel-by-panel reading works without marking every panel by hand.

## Acceptance criteria

- When Star adds a page, the panels are found without Star doing anything more, and before the page is published.
- Panels are found in reading order: left to right, top to bottom, as Star's pages read.
- Full-page splashes, borderless panels and pages that don't split into panels are handled: a page with no usable panels is shown whole.
- Star's corrections (story 5) are never overwritten by finding the panels again.
- Finding panels never stops a page from being published, and a page with no panels found yet still reads as a whole page.
