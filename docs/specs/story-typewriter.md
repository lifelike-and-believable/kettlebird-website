---
status: implemented
tests-commit: 8b4ab3f9d477fd241f8ddfe0d87faf6eed80eb87
unlocks:
  - tests/e2e/story-text-frame.spec.ts: the sheet's bottom padding is 0, in place of the top padding, at 390 and 1280 pixels (story-text-frame AC-4), because the bottom space moves above the typewriter so the sheet ends inside it (story-typewriter AC-6), as design-story-typewriter, Where it applies, row 1, says.
---

# Stories: the sheet comes out of a typewriter

<!-- Technical spec for design-story-typewriter (approved 2026-11-08, with the lead's decisions: the typewriter
follows the reader; the KETTLEBIRD nameplate; phones too; Star draws the final artwork, and the stand-in ships
until then). Amends story-text-frame (the sheet's bottom padding). A plan-feature spec without an id. -->

## Problem

The story's text sits on a white sheet (story-text-frame). The lead asked for an old office typewriter at the bottom of the page, so that scrolling down looks like the paper coming up out of it (2026-11-08).

## User stories

- As a fan, I want the story's page to look like a page still in the typewriter, coming up out of it as I scroll, without it getting in the way of reading. (design-story-typewriter#personas)
- As Star, I want a little of the studio's character on my writing pages, with nothing new to enter, and my own drawing of the typewriter in place of the stand-in when it's ready. (design-story-typewriter#personas, #the-artwork-from-star)

## Acceptance criteria

Source: design-story-typewriter sections as named. "The sheet" is the story text's element (`.story-text`); "the typewriter" is the drawing's element (`.story-typewriter`), the sheet's last child. "A long text" is a chapter with forty paragraphs added by the test, so the page scrolls as a real chapter does.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The typewriter is in the sheet, after the text, on a one-shot's page and on a chapter page, and on no other page; a story in chapters' own page has none. | test: e2e "where it is" | #the-change |
| AC-2 | It is drawing only: `aria-hidden="true"`, nothing in it can take focus, it takes no taps or clicks (`pointer-events: none`), and the page's accessibility tree is as without it. | test: unit "drawing only"; e2e "drawing only" | #accessibility |
| AC-3 | Its paper slot lines up with the sheet: it is the sheet's width over 0.8, within a pixel, centred on the sheet within a pixel, and as tall as its drawing's proportions make it (13 high for every 100 wide, for the stand-in): about 47, 58, 109 and 146 pixels tall at 320, 390, 700 and 1280 pixels, within 2. | test: e2e "size" | #the-change, #the-artwork-from-star |
| AC-4 | Nothing scrolls sideways at 320, 390, 640 (200% zoom on a 1280-pixel screen), 700 and 1280 pixels; what reaches past the screen's edges is clipped (`overflow-x: clip` on the page's main column, which keeps `sticky` working). | test: e2e "size" | #the-change, #accessibility |
| AC-5 | It follows the reader: with a long text scrolled to its middle, the typewriter's bottom is the screen's bottom, within a pixel, on a phone and a computer. | test: e2e "follows the reader" | #the-change |
| AC-6 | At the end it stays under the last line: scrolled past the text, the typewriter's bottom is the sheet's bottom, the sheet has no bottom padding, the space above it is the sheet's top padding (`clamp(1.5rem, 3vw, 2.5rem)`), and the chapter navigation is below it. | test: unit "sheet"; e2e "at the end" | #the-change |
| AC-7 | Keyboard paging accounts for it: the page's `scroll-padding-bottom` is the typewriter's height, within a pixel. | test: e2e "keyboard paging" | #the-change, #accessibility |
| AC-8 | A ticked story: the typewriter is hidden with the text until **Continue to the story**, then shows; without scripts it shows under **Before you read**. | test: e2e "a ticked story" | #the-change |
| AC-9 | Printing leaves it out. | test: e2e "printing" | #the-change |
| AC-10 | The drawing is the stand-in from the design (`typewriter.svg`, with the KETTLEBIRD nameplate), inline, in one component (`src/components/stories/Typewriter.astro`), so Star's artwork replaces one file. | test: unit "drawing" | #decisions-from-the-lead-2026-11-08, #where-it-applies |
| AC-11 | The pages with it pass the site's accessibility check (axe) on a phone and a computer. | test: e2e "accessibility" | #accessibility |
| AC-12 | `docs/STYLE_GUIDE.md`'s "Story text" entry describes the typewriter, and the Kettlebird design system records it. | test: unit "style guide"; manual: the design system | #where-it-applies |

## Scope

- In: `src/components/stories/StoryText.astro` (the typewriter in the sheet, its styles, the clip and the scroll padding), `src/components/stories/Typewriter.astro` (new: the drawing), `docs/STYLE_GUIDE.md`, the Kettlebird design system (on claude.ai). Tests: `tests/unit/story-typewriter.test.ts`, `tests/e2e/story-typewriter.spec.ts`, and the unlock below.
- Out: the editor, guides and tutorials (they don't describe how the text looks); Star's final artwork (a later change to `Typewriter.astro`, with no design change).

## APIs and assumptions

- `position: sticky` with `bottom: 0` inside the sheet: the typewriter sticks to the screen's bottom while the sheet runs past it, and rests at the sheet's end after.
- `overflow-x: clip` does not make a scroll container, so `sticky` still works under it; supported by every current browser.
- `:has()` selects the page's main column and root only when a typewriter is on the page; supported by every current browser.
- Browsers take `scroll-padding-bottom` off the distance Space and Page Down scroll.

## Non-functional requirements

- No extra download: the drawing is inline, about 4 KB. A few lines of script set the scroll padding from the typewriter's height.

## Delivery

- Plan item: design-story-typewriter (PR 196).

## Risks and decisions

- The sheet's bottom padding moves above the typewriter (its top margin), so the sheet ends inside the machine. story-text-frame's padding test changes with it (the unlock).
- Star's artwork may have other proportions; AC-3's heights are the stand-in's, and change with the artwork.
