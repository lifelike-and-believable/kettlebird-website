---
id: story-comic-reader-flip-and-panels-comic-settings
status: approved
derived-from:
  - epic-comic-reader-flip-and-panels#decisions-from-the-lead: 6c4beced64ec
  - epic-comic-reader-flip-and-panels#outcome: c1426bb16011
  - persona-artist#goals: f3044c738f84
  - persona-fan#goals: 2b047e4cae5d
---

# Choose how a comic reads

<!-- docs/product/stories/comic-reader-flip-and-panels/comic-settings.md. Story 6 of epic-comic-reader-flip-and-panels, from the lead's decision of 2026-11-05. -->

As Star, I want to choose for each comic whether a wide screen shows two pages side by side and whether pages turn with the page-flip, so that each comic reads the way it was drawn.

## Acceptance criteria

- Each comic has two settings Star can change in the editor: two pages side by side on a wide screen, and the page-flip. Both are off for a new comic and for every comic that exists today, until Star turns them on.
- With two pages side by side off, the reader shows one page at a time on every screen, as it did before story 1. A page marked as a two-page spread shows alone, using the wide screen's full width; on a narrow screen it is shrunk to fit, as now.
- With two pages side by side on, the comic reads as story 1 describes, and each chapter's choice of which side it opens on applies.
- With the page-flip off, pages change at once, as they did before story 2. With it on, turns play the page-flip as story 2 describes, still skipped under reduced motion (REQ-site-4).
- Turning either setting on or off changes no page's address, so it never asks about shared links. It takes effect when the comic is published.
- When two pages side by side is off for a comic, the editor's choices that only matter for pairs (which side a chapter opens on, and the note about a page left alone before a spread) say so, or are hidden, so Star isn't asked to choose something that has no effect.
- Star can see each setting's effect in **Preview** before publishing.
