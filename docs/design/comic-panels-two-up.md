---
id: design-comic-panels-two-up
status: draft
derived-from:
  - design-comic-panels#decisions: ace7e1b001af
  - design-comic-panels#flow-a-fan: c81bc4915a90
  - design-comic-panels#the-panel-view-reader: f40b7f9e2817
  - design-comic-panels#states-and-errors: 065f4c45926d
  - design-comic-panels#accessibility: 939d94d8c7e4
  - design-comic-spread-and-flip#how-it-works: c145d0b6b751
  - persona-fan#context-of-use: 38883e5abc09
---

# Panel by panel with two pages side by side: design

<!-- docs/design/comic-panels-two-up.md. A design amendment asked for by the lead (2026-11-06), after testing
panel-by-panel reading: on a laptop showing two pages side by side, the Panel by panel button wasn't there.
The lead decided panel by panel should be offered with one or two pages showing, and that turning it on
switches the reader to one page at a time. Mock-ups are in docs/design/mockups/comic-panels-two-up/ (PNG
images, and mockups.html, the source they are rendered from with render.mjs, using the placeholder pages of
design-comic-panels' mock-ups). -->

## Personas

- persona-fan: reads in short sessions, often on a phone, but also on a laptop or a tablet held sideways (#context-of-use). Comics with two pages side by side show them that way on any wide screen, so a fan on a laptop never sees **Panel by panel**, and a fan who turned it on with a phone finds it missing there.

## The change

design-comic-panels decided "Panel by panel is for one page at a time": with two pages side by side, the button isn't shown (#decisions, #states-and-errors). This design replaces that decision:

- **Panel by panel is offered with one or two pages showing.** In a chapter where at least one page has panels, the button is in the reader bar beside **All pages** on any screen, wide or narrow (mock-up 1).
- **Turning it on switches to one page at a time.** The reader shows the page the fan is on, zoomed into its first panel, exactly as panel by panel works on a narrow screen (design-comic-panels#the-panel-view-reader): the panel fits the page area for one page, with its 4% margin, and nothing else of the page shows (mock-up 2). On a pair, "the page the fan is on" is the left-hand one, the first in reading order.
- **Reading goes page by page.** After page 4's last panel, **Next** turns to page 5 at its first panel, then page 6, and so on: the left page's panels, then the right page's (mock-ups 3 and 4). The turn between pages is the narrow page-flip used for one page at a time, when the comic has the page-flip on. A two-page spread drawn as one picture is stepped through on its single picture, as now.
- **Turning it off goes back to two pages side by side,** showing the pair that holds the page the fan was on (mock-up 5). On page 5, the fan sees pages 4 and 5.
- **The choice is remembered** in that browser, as now (`kb-panels`), so a fan who reads panel by panel on a phone finds it on a laptop too.
- Everything else about panel by panel is unchanged: the bar's words, the controls' names, swipes and arrow keys, pinch-zoom, **First**, **Newest**, **All pages** and links opening at a page's first panel, the page's address and history entry, and announcements.

## Mock-ups

The reader at a laptop's 1280 × 800, as it opens, scrolled past the site's header. Placeholder pages from design-comic-panels' mock-ups. Source: `mockups/comic-panels-two-up/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Two pages side by side, with **Panel by panel** in the bar | `mockups/comic-panels-two-up/1-two-up-button.png` |
| 2 | Panel by panel on: one page at a time, at page 4's first panel | `mockups/comic-panels-two-up/2-panel-view-one-page.png` |
| 3 | The reading order across a pair: page 4's panels 1 to 5, then page 5's (numbered here for clarity) | `mockups/comic-panels-two-up/3-reading-order.png` |
| 4 | After page 4's last panel, **Next** opens page 5 at its first panel | `mockups/comic-panels-two-up/4-next-page.png` |
| 5 | Panel by panel off, on page 5: back to pages 4 and 5 side by side | `mockups/comic-panels-two-up/5-back-to-two-up.png` |

## States and errors

| Situation | What happens |
|---|---|
| Two pages side by side, panel by panel off | **Panel by panel** shows, not pressed; pages pair as now. |
| Panel by panel on, on a wide screen | One page at a time, as on a narrow screen; the bar reads "… · Page 4 of 12 · panel 1 of 5". |
| Panel by panel turned off on a page that pairs | The pair holding that page shows; the bar reads "… · Pages 4–5 of 12". |
| Panel by panel turned off on a page that shows alone in pairs (the first page, when the comic opens on the right; a spread) | That page shows alone, as the pairing rules already place it (design-comic-spread-and-flip#how-it-works). |
| The window is resized while panel by panel is on | Nothing changes: it stays one page at a time. |
| A chapter with no panels on any page | No **Panel by panel**, on any screen, as now. |
| No script | Whole pages, paired as now; no **Panel by panel**. |

## Accessibility

- Unchanged from design-comic-panels#accessibility: the toggle button (`aria-pressed`), "Panel by panel. Panel 1 of 5." when it's switched on, "Panel 3 of 5." at each step, and the page's description on arrival.
- Switching it off with two pages side by side announces "Pages 4 and 5", in place of "Whole page", since the view then shows two.

## For the guide

The fans' guide `reading-comics.md`, **Read panel by panel**:
- Its line "Panel by panel isn't offered when the reader shows two pages side by side; it's there again whenever you're on one page at a time" becomes: with two pages side by side, choosing **Panel by panel** shows one page at a time, and choosing it again goes back to two pages.
- Its opening "When the reader shows one page at a time, as it does on a phone" no longer limits where the button is.

## For the spec to check

- With two pages side by side (1280 × 800, a comic with pairs on), **Panel by panel** shows in a chapter with panels and not in one without.
- Turning it on shows one page at a time at the left-hand page's first panel; **Next** steps through that page's panels, then the right-hand page's, then the next pair's.
- Turning it off on the right-hand page shows the pair that holds it; on a page that shows alone, that page alone.
- The choice is remembered across a reload at that width, and from a narrow window to a wide one.
- Resizing the window with panel by panel on keeps one page at a time.
- Switching it off with two pages announces "Pages 4 and 5".
- Everything already checked for panel by panel at one page at a time passes unchanged.

## Decisions at review

None open: the lead decided both parts of this design (2026-11-06): panel by panel is offered with one or two pages showing, and it switches to one page at a time.

## Persona walkthrough

To be run before review.
