---
status: implemented
tests-commit:
  - 3a9b98404db3819c9b4c0a2f3d3fce8273bccead
unlocks:
  - tests/e2e/site-header.spec.ts: AC-2's laptop limit rose from 245 to 250 px. At the lead's review of the built pages, the tear sat closer to the text on laptops (about 10 px) than on phones (22 px); the padding under the text now keeps 22 px at every width, which makes the 1280 px header 244 px. The design records the change.
  - tests/e2e/site-header.spec.ts: AC-6 expected the paper image at `cover` size on a layer 1.5vw below the header. At the lead's review of the built pages, laptops showed the high ends of the tear, angling it up toward the edges, while phones showed its dipping middle. The image is now at least 160% of the screen's width (`auto max(30vw, 100%)`), on a layer 2.2vw below the header, so every screen shows the middle; the test checks the new values. The design records the change.
  - tests/e2e/site-header.spec.ts: AC-5 checked that the whole page doesn't scroll sideways with text at 200%. The comics page's own "Comics" heading (page content, outside this change) is wider than a 390 px screen at that size, so the test now checks that nothing in the header reaches past the screen, which is what this change controls. The heading is reported separately.
---

# A shorter site header

<!-- Technical spec for design-phone-header (approved, with the laptop and series cover decisions
and the 5 px amendment). A plan-feature spec without an id. -->

## Problem

The site header has a fixed minimum height of 300 px at every width: 36 to 41% of a phone screen and 38% of a 1280 × 800 laptop screen, with empty paper under the content and the paper image's transparent strip below the tear. The series page caps its cover at a fifth of the screen as a workaround.

## User stories

- As a fan arriving on a phone from a social link, I want the art and comics to start near the top of the screen, so that I can see what the site is about straight away. (design-phone-header#personas)

## Acceptance criteria

Source: design-phone-header sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | On 360 × 740, 390 × 844 and 768 × 1024 screens, the header of the home, comics, portfolio, about and series pages is no taller than 130 px. | test: e2e "phone height" | #the-problem, #the-change-option-a-recommended |
| AC-2 | On a 1280 × 800 screen, the same pages' header is no taller than 250 px, the title is 88 px (today's `clamp(3.5rem, 8vw, 5.5rem)`), and the subtitle and the links are on one row. | test: e2e "laptop" | #laptops-and-wider-above-768-px |
| AC-3 | Up to 768 px wide, the title and the menu button are on the same row, the subtitle is under the title, the title links to `/`, and the button is 44 × 44 px. | test: e2e "phone layout" | #the-change-option-a-recommended, #layout |
| AC-4 | The menu button opens and closes the menu, setting `aria-expanded`, and the menu panel starts directly under the header. | test: e2e "menu" | #the-change-option-a-recommended; REQ-site-1 |
| AC-5 | With the root font size at 200%, on 390 px and 320 px wide screens, nothing in the header reaches past the screen (so the header causes no sideways scrolling) and the menu button is fully on screen. | test: e2e "enlarged text" | #accessibility |
| AC-6 | At every width the header has no background of its own; the torn paper is drawn on a layer that reaches 2.2vw below the header, bottom-aligned and centred, at least 160% of the screen's width (`auto max(30vw, 100%)`), and lets clicks through, so the paper reaches the header's top edge, the tear is its bottom edge, and the tear dips toward both edges on every screen. | test: e2e "paper layer"; manual: look at a phone and a laptop | #at-every-width |
| AC-7 | On a 360 × 640 screen, a series page's cover is no taller than a third of the screen and taller than a fifth, and **Start reading** is visible without scrolling. | test: e2e "series cover"; the existing comic-reader AC-15 test | #layout; design-comic-start-reading#layout |

## Scope

- In: `src/layouts/BaseLayout.astro` (header markup and styles), `src/pages/comics/[slug].astro` (cover cap), `tests/e2e/site-header.spec.ts`.
- Out: the reader page (it opens scrolled past the header, design-comic-turn-pages); the footer; the home page's own content.

## Design values

- At every width: `max(2.25rem, calc(22px + 3.1vw))` below the content, which leaves about 22 px between the text and the highest point of the tear at every width, as on phones (the tear's own height is about 3.1vw at this image size).
- Up to 768 px: header padding `0.875rem 1rem` above; title `min(2.5rem, 13vw)`; subtitle `1.0625rem`; the title and subtitle grouped, with the button after them in a wrapping row.
- At every width: the subtitle's line height is 1.25 (it inherited the body's 1.6, which added empty space under it).
- Above 768 px: today's layout and sizes, `2rem` above.
- Paper layer: `::before`, `inset: 0 0 -2.2vw 0`, `background: url(Paper_1_Torn.png) no-repeat center bottom / auto max(30vw, 100%)`, `z-index: -1`, `pointer-events: none`.

## Delivery

- Plan item: the lead's request for a shorter phone header, widened to laptops at review.

## Risks and decisions

- The header's markup changes (title and subtitle grouped), but the tab order is the same: title, menu button, links.
- The tear in the image is high at both ends and dips about a fifth of the way in from each side. At 160% of the screen's width, a screen shows the middle 1,000 of its 1,600 columns, where the tear runs from about row 250 to row 278 of 300 and dips toward both edges. The 22 rows below are transparent: 2.2vw at that size, so the layer reaches 2.2vw below the header. On phones the image is sized by the header's height instead (the `100%` in `max`), which shows a similar slice.
