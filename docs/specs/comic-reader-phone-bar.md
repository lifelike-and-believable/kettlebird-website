---
status: implemented
tests-commit: 1e1aca2406328c36cdef4827eb06605e880b9a18
unlocks:
  - tests/e2e/comic-reader-phone-bar.spec.ts: three checks were wrong against the build, and the criteria are unchanged. AC-4 looked for the words with getByText, which also finds the hidden name label holding the same words; it now checks the words' own span. AC-8 matched calc() exactly as written, but the browser writes its terms in its own order (calc(-12.5rem + 100svh)) and scoped styles put an attribute between .reader__page and .is-spread; it now allows both, and also reads the stylesheets' text to check each svh declaration follows its 100vh fallback, which the browser's style rules can't show.
---

# Comic reader: the reader bar on phones

<!-- Technical spec for design-comic-reader-phone-bar (approved 2026-11-06, with the lead's decisions: pictures
only on phones, and Star draws the two pictures, which replace the interim ones when they come). Amends the
reader bar of comic-reader-sheet-and-controls and comic-reader-panels. A plan-feature spec without an id. -->

## Problem

On a phone, the reader bar's **Panel by panel** and **All pages** don't fit beside **Back to series**, so the bar takes three lines; and the page area is sized from `100vh`, which on iPhone Safari is taller than the visible screen. Together they put the reader's controls under Safari's address bar.

## User stories

- As a fan reading on a phone, I want **Next** on the screen with the page, so that I can turn pages without scrolling for the button each time. (design-comic-reader-phone-bar#personas)

## Acceptance criteria

Source: design-comic-reader-phone-bar sections as named. "Phone widths" are 320 × 568, 393 × 659 and 430 × 739. The fixture comic Single Sheets has panels; Kettle Tales has none.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | At phone widths, in a chapter with panels, **Panel by panel** and **All pages** are each 44 × 44 px (± 1), show no words (the words are in the button but take no more than 1 × 1 px), and are on the first line of the bar with **Back to series**, together at its right: **Panel by panel** first, 16 px apart, **All pages**' right edge at the bar's right edge. | test: e2e "pictures only" | #the-change |
| AC-2 | Their accessible names are "Panel by panel" (a button with `aria-pressed`) and "All pages in this chapter" (a link), and each button's text content still holds its words ("Panel by panel", "All pages"). The pictures are `aria-hidden`. | test: e2e "names" | #the-change, #accessibility |
| AC-3 | On keyboard focus and on hover, at phone widths, each button shows its name ("Panel by panel", "All pages in this chapter") in a label under the button, right-aligned with it, fully inside the viewport, with no sideways scrolling; the label is `aria-hidden` and doesn't show otherwise. | test: e2e "names on focus and hover" | #the-change, #accessibility |
| AC-4 | At 699 px wide the buttons are pictures only; at 700 px they show their words, as today. | test: e2e "the 700 px line" | #the-change |
| AC-5 | With text at 200% (393 × 659), the two buttons stay on one line together, **All pages**' right edge at the bar's right edge, and nothing scrolls sideways. | test: e2e "enlarged text" | #states-and-errors |
| AC-6 | In a chapter without panels, **All pages** alone is at the bar's right on the first line; without a script, likewise (**Panel by panel** isn't shown). | test: e2e "one button" | #states-and-errors |
| AC-7 | At each phone width, with panel by panel off and on, in a chapter with panels and one without, the four controls end inside the viewport once the reader has opened. | test: e2e "controls on the screen" | #the-change, #for-the-spec-to-check |
| AC-8 | The page area (`.reader__page`), the pair of pages (`.reader__book` with pairs) and a spread shown alone are sized from `100svh` (`calc(100svh - 12.5rem)`), each after a `100vh` fallback; the reader's `min-height` stays `100vh`. | test: e2e "small viewport" (the page's own style rules) | #the-change |
| AC-9 | **Panel by panel**'s picture, at every width, is the redrawn one: a page outline with three panels, all outlined (no filled shape), the top one drawn heavier. | test: e2e "the picture" | #decisions-at-review |
| AC-10 | The fans' guide says what the two pictures look like on a phone, in **Read panel by panel** and **See all the pages in a chapter**, that pointing at either picture on a computer shows its name, and what to say with voice control. | manual: review of `docs/user/reading-comics.md` | #for-the-guide |
| AC-11 | Everything the reader's existing tests check passes unchanged. | manual: review that the existing tests pass unchanged | #for-the-spec-to-check |

## Scope

- In:
  - `src/components/pages/ReaderPage.astro`: the two buttons in one group (`.reader__tools`), their words in a visually hidden span under 700 px, a name label (`.reader__tool-tip`) in each, the redrawn picture, the phone styles, and `100svh` sizing.
  - `docs/user/reading-comics.md`: the lines the design names.
  - Tests: `tests/e2e/comic-reader-phone-bar.spec.ts`.
- Out: Star's drawings of the two pictures (they replace the interim ones when they come, in their own change); the controls under the page; the site header.

## APIs and assumptions

- `svh` is supported by Safari 15.4+, Chrome 108+ and Firefox 101+; older browsers ignore the declaration and keep the `100vh` one before it.
- A visually hidden span (clipped to 1 px, not `display: none`) stays in the accessibility tree, so the name is unchanged for every screen reader.
- Headless Chromium has no toolbars, so `100svh` equals `100vh` there; AC-8 checks the style rules themselves, and AC-7 checks the layout at the visible sizes.

## Non-functional requirements

- No script added; the change is markup and styles.

## Delivery

- Plan item: design-comic-reader-phone-bar (PR 161).

## Risks and decisions

- The Safari figures are a model (iOS 18, iPhone 15); real devices and in-app browsers weren't checked. The lead can check on an iPhone from the pull request's preview.
- There is no new pure logic, so nothing new for mutation testing.
