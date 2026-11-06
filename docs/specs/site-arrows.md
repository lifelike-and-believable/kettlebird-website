---
status: implemented
tests-commit: 1068af420ddd5c5b9b8be59b738479b0ded0211d
unlocks:
  - tests/unit/arrows-edges.test.ts (new): mutation testing showed nothing checked the spaces between the arrow's attributes, or that an arrow without a class gets no class attribute at all. Added an exact check of the markup; the criteria are unchanged.
  - tests/e2e/arrows.spec.ts: AC-10 resized the window while the browser was still in full-screen mode, which Chrome refuses; it now leaves full screen first. The criterion is unchanged.
---

# One arrow, one button

<!-- Technical spec for design-arrows (approved 2026-11-06, with the lead's review: no drop shadows,
yellow on hover, and arrows beside words change too). A plan-feature spec without an id. -->

## Problem

The site draws its arrows four ways: sharp SVG triangles in the comic reader's controls, the typed characters ‹ › for the reader's edge arrows and the portfolio carousel, ◀ ▶ in full screen (which iPhones may draw as emoji), and ← → ▾ beside words. None of them follows the style guide.

## User stories

- As a fan moving through comic pages and portfolio pieces, I want the way forward to look the same everywhere, in the site's own style, so that I recognise it on every page. (design-arrows#personas)

## Acceptance criteria

Source: design-arrows sections as named. "Arrow buttons" are the comic reader's four controls, the edge arrows' button, the carousel's two buttons, and full screen's **Previous** and **Next**.

### The shape

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | One module, `src/lib/arrows.ts`, holds every arrow: `next`, `previous`, `first`, `last`, `down` and `up`. In a 24-unit square, `next` is a triangle 10 units wide and 13 tall; `previous` is its mirror; `down` and `up` are the same triangle turned. `first` and `last` are two triangles in a 32 by 24 box, mirrors of each other, at least 5 units apart. Each is drawn with a 3-unit stroke with round joins, filled and stroked in `currentColor`, `aria-hidden="true"` and `focusable="false"`. | test: unit "the shape" | #the-change |
| AC-2 | No control uses a typed arrow. None of ‹ › ◀ ▶ ← → ▾ ▴ ⏮ ⏭ appears in the reader page, the contact sheet, the comic navigation labels, the gallery, full screen, the writing page or the commissions page. Each of their arrows is drawn from `src/lib/arrows.ts`, so every drawn arrow on these pages has the same paths. | test: unit "no typed arrows"; e2e "arrows are drawn" | #the-change, #where-it-applies, #for-the-spec-to-check |

### The button

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-3 | On paper, the comic controls, the edge arrows' button and the carousel's buttons are beige (`#f5f1e8`) with a 3 px solid ink (`#2b2b2b`) border, square corners and no box shadow, at least 44 by 44 px (the comic controls at least 56 px tall). With the pointer over one, it is yellow (`#f4ce6a`); pressed, it has an ink fill with a beige arrow. Neither changes its size or position. A control that can't be used has a dashed border at `rgba(43,43,43,.4)`, its arrow and caption at `rgba(43,43,43,.45)`, and no fill. | test: e2e "on paper" | #the-change |
| AC-4 | In full screen, **Previous** and **Next** are near-black (`#161616`) with a 3 px beige border, beige arrow and caption, and no box shadow. With the pointer over one, it is yellow with an ink arrow; pressed, beige with an ink arrow. On a laptop they stay centred on the screen's height in every state. One that can't be used keeps today's dashed, faded look. | test: e2e "on dark" | #the-change, #where-it-applies |
| AC-5 | The yellow hover applies only where the device can hover (`@media (hover: hover)`): on a touch phone, a tapped carousel arrow stays beige. | test: e2e "phones" | #the-change |
| AC-6 | Keyboard focus on a comic control or a carousel arrow shows a 2 px dark purple (`#4a4063`) outline 2 px outside it; on full screen's **Previous** and **Next**, a 3 px yellow outline. A mouse click on a carousel arrow shows no outline. | test: e2e "focus" | #the-change, #accessibility; REQ-site-4 |
| AC-7 | Arrow buttons change colour over 120 ms; with reduced motion, at once (no transition). No state sets a transform or a translate on them. | test: e2e "motion" | #the-change, #accessibility; REQ-site-4 |

### Where it applies

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-8 | On a laptop, each comic page's edge strip is as today (15% of the page wide, its full height, `aria-hidden`, not a tab stop, turning the page when clicked anywhere) and holds an arrow button in its middle, not shown until the pointer is over the strip, then shown yellow. | test: e2e "edge arrows" | #where-it-applies |
| AC-9 | The carousel's buttons are 44 by 44 px at every width, including a 320 px screen with text at 200%, still named "Scroll left" and "Scroll right", and never marked as unusable. | test: e2e "carousel" | #where-it-applies, #accessibility |
| AC-10 | Full screen's **Previous** and **Next** are at least 56 px wide and grow to show their whole caption. On a phone held upright, when the zoom controls and the two buttons don't fit on one row, the zoom controls sit on a row above them, the bottom bar grows to hold both, and the piece fits above it: on a 320 × 640 screen with text at 200%, nothing in the bottom bar overlaps and no caption overflows its button. | test: unit "the bottom bar"; e2e "full screen, enlarged text" | #where-it-applies, #accessibility |
| AC-11 | Beside words, the arrow is drawn: the contact sheet's chapter links read "Chapter 1" and "Chapter 3" (named "Previous chapter: Chapter 1" and "Next chapter: Chapter 3", as today), **Back to page N** is named and reads "Back to page N", the chapter list's line ends in a drawn triangle pointing down (up when open), and "Read it" and "Email me to get started" end in a drawn arrow, with those words as their names. | test: unit "words"; e2e "words" | #where-it-applies, #accessibility |
| AC-12 | The reader, the contact sheet, the portfolio and full screen otherwise look and behave as before. | manual: review that the existing tests pass with only the arrows' names and looks changed (listed under Delivery) | #other-documents |

## Scope

- In:
  - `src/lib/arrows.ts` (new, pure): the shapes, and the SVG markup for each.
  - `src/components/Arrow.astro` and `src/components/Arrow.tsx` (new): the arrow for Astro pages and React islands.
  - `src/styles/global.css`: the arrow button (`.arrow-btn`, `.arrow-btn--dark`) and the arrow beside words (`.arrow-inline`).
  - `src/components/pages/ReaderPage.astro`: the controls and edge arrows.
  - `src/components/comics/ContactSheet.astro`, `src/lib/comics/navigation.ts`: the chapter links, **Back to page N** and the chapter list.
  - `src/components/GalleryGrid.tsx`, `src/components/pages/PortfolioPage.astro`: the carousel.
  - `src/components/FullScreenView.tsx`, `src/lib/portfolio/full-screen.ts`: **Previous**, **Next** and the phone's bottom bar.
  - `src/components/pages/WritingPage.astro`, `src/components/settings/CommissionsContent.astro`: "Read it" and "Email me to get started".
  - `docs/user/reading-comics.md`: the names without typed arrows (design-arrows#for-the-guide).
  - Tests: `tests/unit/arrows.test.ts`, `tests/unit/arrows-components.test.tsx`, `tests/e2e/arrows.spec.ts`.
- Out: **Close**, the zoom buttons, **All pages**, **Back to series**, the menu button, and arrows in Star's own writing.

## Design values

- `next`: `M8 5.5 L18 12 L8 18.5 Z` in `0 0 24 24`; `previous`: `M16 5.5 L6 12 L16 18.5 Z`; `last`: `M3.5 5.5 L13.5 12 L3.5 18.5 Z M18.5 5.5 L28.5 12 L18.5 18.5 Z` in `0 0 32 24`; `first`: its mirror; `down`: `M5.5 8 L18.5 8 L12 18 Z`; `up`: `M5.5 16 L18.5 16 L12 6 Z`. Stroke 3, `stroke-linejoin="round"`.
- Arrows in buttons: 24 px tall (32 px wide for doubles). Beside words: `0.72em`.
- Full screen's phone bottom bar: 76 px, as today, when one row fits; otherwise the zoom controls sit 80 px up and the bar is 80 px plus the zoom controls' height plus 8 px. One row fits when the zoom controls' width plus twice (the wider side button plus 12 px) is no more than the screen's width.

## Delivery

- Plan item: the lead's design request (2026-11-06), design-arrows.
- Existing tests whose names or looks change, recorded in their specs' `unlocks:`:
  - `tests/unit/comic-navigation.test.ts`: the chapter links' and **Back to page N**'s labels lose their typed arrows (comic-reader-sheet-and-controls AC-7, AC-10).
  - `tests/e2e/comic-sheet-and-controls.spec.ts`: the same names in the browser.
  - `tests/unit/site-settings-pages.test.ts`: "Email me to get started" loses its typed arrow (content-editing-site-settings AC-7).

## Risks and decisions

- One CSS class carries the button's look, so the comic controls, carousel and full screen can't drift apart again. The comic controls' own grid, sizes, captions and labels stay in the reader's styles.
- With text at 200% on a laptop, full screen's side buttons grow wider than the 72 px kept clear for them, so they may cover the edge of a fitted piece; they have a solid backing, and **Previous** and **Next** stay readable.
- Hover can't be tested on a real phone here; Playwright's phone emulation reports no hover, which is what the media query reads.
