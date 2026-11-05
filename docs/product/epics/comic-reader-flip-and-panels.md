---
id: epic-comic-reader-flip-and-panels
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - requirements-comics#REQ-comics-2: d738742f9302
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
  - persona-artist#goals: f3044c738f84
---

# Comic reader: page-flip and panels

<!-- docs/product/epics/comic-reader-flip-and-panels.md. The second comic epic; it builds on
epic-comic-reader and starts after that epic ships. -->

## Outcome

Reading a comic on the site feels like reading Star's printed book. On a wide screen, pages show as a two-page spread like an open comic and turn with a page-flip. On a phone, fans can follow a page panel by panel, each panel enlarged to fit the screen. Star gets panel-by-panel reading without marking every panel by hand.

## Personas

- persona-fan: they read mostly on phones, where small panels are hard to read without pinching and zooming, and they want reading on the site to feel like reading the comic.
- persona-artist: Star wants the work presented in a way that feels like their own, and wants new pages online without extra work per page.

## Decisions from the lead

- **A wide page can be a two-page spread** (2026-11-05). Star can mark a single page image as a two-page spread. On a wide screen it covers both pages of the open comic; on a narrow screen it is shrunk to fit the screen, as every page is today, and is never split across a page turn.
- **Spreads pair as Star chooses, per chapter** (2026-11-05). Each chapter either starts with page 1 alone on the right, as in a printed book, or pairs pages from page 1. A page marked as a spread always takes both sides, and the pairing continues after it.
- **Panels are corrected with a visual tool** (2026-11-05). Star sees the page with its panels drawn on it and moves, resizes, adds, removes and reorders them on the picture itself, not by typing numbers into a form.
- **Two pages side by side and the page-flip are Star's choice, per comic** (2026-11-05). Each comic has two settings, both off until Star turns them on: show two pages side by side on a wide screen, and turn pages with the page-flip. With two pages side by side off, a page marked as a two-page spread still uses the wide screen's full width, alone.

## Stories

Proposed; each is written as its own story file, and approved, before work on it starts.

1. **Two-page spread.** As a fan on a wide screen, I want to see two pages side by side, like an open comic, so that spreads and facing pages read the way Star drew them. Narrow screens show one page at a time. A page Star marks as a two-page spread covers both pages on a wide screen and is shrunk to fit on a narrow one.
2. **Page-flip.** As a fan, I want turning a page to look like turning a page in a printed comic, so that reading on the site feels like reading Star's book. When my system asks for reduced motion, pages change without the animation (REQ-site-4).
3. **Read panel by panel.** As a fan on a phone, I want to step through a page one panel at a time, each panel enlarged to fit my screen, and switch back to the whole page whenever I like, so that I can read small panels without pinching and zooming.
4. **Panels found for me.** As Star, I want the site to find the panels on each page I publish, in reading order, so that panel-by-panel reading works without marking every panel by hand.
5. **Correct the panels.** As Star, I want to see the panels the site found on a page and fix any that are wrong (move, resize, add, remove, or reorder them) by working on the page itself, so that panel-by-panel reading follows my layout. A page with no usable panels is shown whole.
6. **Choose how a comic reads.** As Star, I want to choose for each comic whether a wide screen shows two pages side by side and whether pages turn with the page-flip, so that each comic reads the way it was drawn. Both are off until Star turns them on.

## Dependencies

- **epic-comic-reader** ships first; this epic changes how its pages are shown and turned.
- **The editor** is Sanity Studio (concept decision 6, settled by epic-content-editing). Panel regions are stored with each page (`panels[]` on a chapter's pages already exists, empty), and the visual tool for correcting them is built into the editor (stories 4 and 5).
- **Sample pages** with varied panel layouts, including full-page splashes, borderless panels, and two-page spreads, from the lead.

## Out of scope

- **Later plans** (concept decision 8): comments, paid pages, and remembering a reader's place.
- Animated or motion comics.

## Open questions

1. Panel detection runs when a page is published, or when the site is built? A design question; either way Star's corrections must win over detection.

Answered by the lead on 2026-11-05 (see Decisions): whether a chapter's first page sits alone (Star chooses per chapter), and whether a single-image spread is marked (yes, by Star).
