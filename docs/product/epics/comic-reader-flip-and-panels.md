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

## Stories

Proposed; each is written as its own story file, and approved, before work on it starts.

1. **Two-page spread.** As a fan on a wide screen, I want to see two pages side by side, like an open comic, so that spreads and facing pages read the way Star drew them. Narrow screens show one page at a time.
2. **Page-flip.** As a fan, I want turning a page to look like turning a page in a printed comic, so that reading on the site feels like reading Star's book. When my system asks for reduced motion, pages change without the animation (REQ-site-4).
3. **Read panel by panel.** As a fan on a phone, I want to step through a page one panel at a time, each panel enlarged to fit my screen, and switch back to the whole page whenever I like, so that I can read small panels without pinching and zooming.
4. **Panels found for me.** As Star, I want the site to find the panels on each page I publish, in reading order, so that panel-by-panel reading works without marking every panel by hand.
5. **Correct the panels.** As Star, I want to see the panels the site found on a page and fix any that are wrong (move, resize, add, remove, or reorder them), so that panel-by-panel reading follows my layout. A page with no usable panels is shown whole.

## Dependencies

- **epic-comic-reader** ships first; this epic changes how its pages are shown and turned.
- **CMS comparison (concept decision 6)** decides where panel regions are stored and how Star corrects them (stories 4 and 5).
- **Sample pages** with varied panel layouts, including full-page splashes, borderless panels, and two-page spreads, from the lead.

## Out of scope

- **Later plans** (concept decision 8): comments, paid pages, and remembering a reader's place.
- Animated or motion comics.

## Open questions

1. In a spread, does the first page of a chapter sit alone on the right, like the first page of a printed book?
2. Does a two-page spread that Star drew as one image need to be marked as such, so it is never split across a page turn?
3. Panel detection runs when a page is published, or when the site is built? A design question; either way Star's corrections must win over detection.
