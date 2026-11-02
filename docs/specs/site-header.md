---
status: draft
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
| AC-2 | On a 1280 × 800 screen, the same pages' header is no taller than 245 px, the title is 88 px (today's `clamp(3.5rem, 8vw, 5.5rem)`), and the subtitle and the links are on one row. | test: e2e "laptop" | #laptops-and-wider-above-768-px |
| AC-3 | Up to 768 px wide, the title and the menu button are on the same row, the subtitle is under the title, the title links to `/`, and the button is 44 × 44 px. | test: e2e "phone layout" | #the-change-option-a-recommended, #layout |
| AC-4 | The menu button opens and closes the menu, setting `aria-expanded`, and the menu panel starts directly under the header. | test: e2e "menu" | #the-change-option-a-recommended; REQ-site-1 |
| AC-5 | With the root font size at 200%, on 390 px and 320 px wide screens, the page doesn't scroll sideways and the menu button is fully on screen. | test: e2e "enlarged text" | #accessibility |
| AC-6 | At every width the header has no background of its own; the torn paper is drawn on a layer that reaches 1.5vw below the header, bottom-aligned, and lets clicks through, so the paper reaches the header's top edge and the tear is its bottom edge. | test: e2e "paper layer"; manual: look at a phone and a laptop | #at-every-width |
| AC-7 | On a 360 × 640 screen, a series page's cover is no taller than a third of the screen and taller than a fifth, and **Start reading** is visible without scrolling. | test: e2e "series cover"; the existing comic-reader AC-15 test | #layout; design-comic-start-reading#layout |

## Scope

- In: `src/layouts/BaseLayout.astro` (header markup and styles), `src/pages/comics/[slug].astro` (cover cap), `tests/e2e/site-header.spec.ts`.
- Out: the reader page (it opens scrolled past the header, design-comic-turn-pages); the footer; the home page's own content.

## Design values

- Up to 768 px: header padding `0.875rem 1rem` above, and `max(2.25rem, 3.5vw)` below the content; title `min(2.5rem, 13vw)`; subtitle `1.0625rem`; the title and subtitle grouped, with the button after them in a wrapping row.
- Above 768 px: today's layout and sizes; `calc(max(2.25rem, 3.5vw) + 5px)` below the content.
- Paper layer: `::before`, `inset: 0 0 -1.5vw 0`, `background: url(Paper_1_Torn.png) no-repeat center bottom / cover`, `z-index: -1`, `pointer-events: none`.

## Delivery

- Plan item: the lead's request for a shorter phone header, widened to laptops at review.

## Risks and decisions

- The header's markup changes (title and subtitle grouped), but the tab order is the same: title, menu button, links.
- The image's transparent strip is 23 of its 300 rows; at laptop widths the image is scaled to the screen's width, so 1.5vw moves it just outside the header. On phones the image is scaled to the header's height, so a few pixels of the strip may remain; it's under the tear and not noticeable.
