---
status: implemented
tests-commit: 0ed12675670da365fe69644b805879970134fbfa
unlocks:
  - tests/e2e/portfolio-full-screen.spec.ts: two corrections found by the first run against the build. "the opening" and "turning" looked for the title with a partial match, which also found the screen reader's announcement (it starts with the title); they now match the title exactly. "leaving" used the browser's own exit, and "opening" read the full-screen element, before the browser had finished entering full screen (it does so a moment after the view appears); both now wait for it. The criteria are unchanged.
  - tests/unit/full-screen-edges.test.ts (new): mutation testing showed nothing checked pieces with no category or a picture without an asset, the end of an asset id, `fitted` on its own, an exactly diagonal swipe, or Shift with Up and Down. Added; the criteria are unchanged. Two mutants survive as equivalent: a zero pan limit giving -0 instead of 0, and `dx <= 0` where a turn needs at least 50 px.
---

# Portfolio: full screen

<!-- Technical spec for story-portfolio-full-screen-view-a-piece-full-screen (story 1) and
story-portfolio-full-screen-move-between-pieces-full-screen (story 2) of epic-portfolio-full-screen,
from design-portfolio-full-screen (with its mock-ups) and docs-viewing-artwork. A plan-feature spec
without an id. -->

## Problem

A portfolio piece opens in a dialog with a 1200 px picture under its title and description; on a phone it's small. Fans should be able to see a piece as large and sharp as their screen allows, zoom into its details, and move through the section's pieces without going back to the gallery.

## User stories

- As a fan, I want to open a portfolio piece full screen, at the best size for my screen, and zoom and pan to see its details, so that I can look at Star's art properly, not just as a dialog's picture. (story-portfolio-full-screen-view-a-piece-full-screen)
- As a fan, I want to go to the next or previous piece while full screen, with arrow keys, swipes or on-screen controls, so that I can look through Star's work one piece after another. (story-portfolio-full-screen-move-between-pieces-full-screen)

## Acceptance criteria

Source: S1.n and S2.n are the stories' nth criteria; design and docs sections as named. "The view" is full screen; "the dialog" is the piece's existing dialog.

### Opening and leaving

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A dialog whose piece has a picture has a **Full screen** button (named "Full screen") at the lower right of its picture: labelled on a wide screen, an icon of four corners on a phone. It, or a click or tap on the dialog's picture, opens the view on that piece. A piece without a picture has no **Full screen**. | test: unit "opening"; e2e "opening" | S1.1; design-portfolio-full-screen#how-it-works |
| AC-2 | Opening asks for the browser's full-screen mode on the view. Where the browser has none or refuses, the view covers the window (fixed, the viewport's full height, clear of safe areas) and pushes one history entry with no change of address; Back then closes the view. Either way the page behind doesn't scroll, and pinching zooms the piece, not the page (`touch-action: none` on the view). | test: unit "opening"; e2e "the window-covering view" | S1.2; design-portfolio-full-screen#decisions, #how-it-works |
| AC-3 | **Close**, Escape, the browser's own exit from full screen, or Back (where the view covers the window) closes the view and shows the dialog of the piece last shown, with focus on its **Full screen**. One Escape closes only the view: while the view is open, the dialog's own Escape, Tab trap and outside click do nothing. The dialog's **Close** then returns focus to that piece's card in the gallery, its section's row scrolled to it. | test: unit "leaving"; e2e "leaving" | S1.5, S2.5; design-portfolio-full-screen#how-it-works |

### The picture and zoom

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-4 | The view shows the dialog's picture at once, fitted, then a copy from the image CDN at the fitted size times the device's pixel ratio; past 150% zoom, twice that; past 300%, four times. No request is wider than the original, nor longer than 4,000 px on its longer side. The sharper copy replaces the shown one when it has loaded. | test: unit "picture sizes"; e2e "picture sizes" | S1.3; design-portfolio-full-screen#how-it-works |
| AC-5 | At 100% the piece fits whole and centred: between the bars while they show, in the whole view while they're hidden. The zoom level counts from that fit, and reads "100%". | test: unit "zoom"; e2e "zoom" | S1.2; design-portfolio-full-screen#how-it-works |
| AC-6 | Zoom is by pinching; by double-click or double-tap (to 250% at that point, or back to 100% when zoomed); by the wheel or trackpad at the pointer; by **+** and **−** (×1.5 a step); by the +, = and − keys (and the number pad's); **Fit** and 0 return to 100%. Zoom stays between 100% and the larger of 200% and the zoom at which one picture pixel covers two device pixels. On a wide screen, while zoomed, a corner map shows the whole piece with the part on screen outlined. | test: unit "zoom"; e2e "zoom" | S1.4; design-portfolio-full-screen#how-it-works |
| AC-7 | While zoomed, a drag moves the piece, stopping at its edges; Shift with an arrow key, and Up and Down, move it by a tenth of the view. A drag never turns. | test: unit "moving around"; e2e "moving around" | S1.4, S2.4; design-portfolio-full-screen#decisions |

### Controls

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-8 | The top bar shows the title, the count ("3 of 12 · Original Work" on a wide screen, "3 of 12" on a phone) and **Close** (just ✕ on a phone, named "Close"); **Previous**, **−**, the zoom level, **+**, **Fit** and **Next** are buttons at least 44 by 44 px, **Previous** and **Next** at the sides on a wide screen or a phone held sideways, and in the bottom bar on a phone held upright. Bars are solid near-black. | test: e2e "the bars" | S1.2, S2.1; design-portfolio-full-screen#how-it-works, #accessibility |
| AC-9 | A single click or tap on the piece hides the bars and buttons, 300 ms after it if no second tap follows, and the piece refits to the whole view; a click that ends a drag does nothing. A click or tap, a mouse movement, a key press, or focus on a control brings them back. Hiding is visual only: the controls stay in the accessibility tree. | test: unit "hiding the controls"; e2e "hiding the controls" | design-portfolio-full-screen#decisions, #accessibility |

### Turning

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-10 | **Previous**, **Next**, and the Left and Right arrow keys (at any zoom) turn; so does a swipe while the piece fits, if it's mostly sideways, at least 50 px, and doesn't start within 20 px of the view's left edge. Each piece opens at 100%. Under reduced motion, a turn cuts to the next piece. | test: unit "turning"; e2e "turning" | S2.1, S2.3, S2.4; design-portfolio-full-screen#how-it-works |
| AC-11 | The order is the pieces of the section the piece was opened from, in their gallery order, leaving out pieces without a picture; a piece the preview opened directly counts from its first section. The count counts only those. **Previous** on the first and **Next** on the last can't be used; there's no wrapping. | test: unit "order"; e2e "turning" | S2.2; design-portfolio-full-screen#how-it-works |
| AC-12 | Once the current piece has loaded, its next and previous pieces are fetched, the one in the direction of the last turn first. A turned-to piece that hasn't loaded shows its title and count at once and, after 300 ms, a loading sign; one that fails shows "This piece couldn't load." | test: unit "loading"; e2e "loading" | S2.6; design-portfolio-full-screen#how-it-works, #states-and-errors |

### Accessibility

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-13 | The view is a modal dialog named "Full screen" that keeps focus inside it; **Close** has focus when it opens. A polite live region says "Night Market, 3 of 12." on opening and each turn, then the picture's alt text when it has one; changing the zoom by a button or key says the new level ("250%"). Controls that can't be used are dashed, `aria-disabled`, and skipped by Tab. | test: unit "accessibility" | S1.1, S2.2, S2.3; design-portfolio-full-screen#accessibility |
| AC-14 | The gallery, its cards and the dialog otherwise look, load and behave as before. | manual: review that the existing gallery tests (`gallery-lightbox.test.tsx`, `line-breaks-lightbox.test.tsx`, `portfolio-reflow.spec.ts`) pass with only the reflow check's card count changed | S1.6 |

## Scope

- In:
  - `src/lib/portfolio/full-screen.ts` (new, pure): order and count, words, zoom limits and steps, picture sizes, moving around, swipes, keys, which controls can be used, what to fetch next.
  - `src/components/FullScreenView.tsx` (new): the view. `src/components/GalleryGrid.tsx`: **Full screen** in the dialog, opening and returning, the dialog's keys while the view is open, the card that gets focus back.
  - `src/components/pages/PortfolioPage.astro`: the dialog's **Full screen** button styles.
  - `tests/fixtures/drafts.ts`: published pieces for the portfolio's preview (one with a large picture, one in two sections, one without a picture).
  - Tests: `tests/unit/full-screen.test.ts`, `tests/unit/full-screen-view.test.tsx`, `tests/e2e/portfolio-full-screen.spec.ts`.
- Out: full screen for comic pages and story pictures; downloading or sharing from full screen; a slideshow; anything Star enters.

## APIs and assumptions

- The Fullscreen API (`requestFullscreen`, `fullscreenchange`, `exitFullscreen`). Safari on iPhone has it only for video, so the window-covering view is the normal path there.
- The image CDN (`@sanity/image-url`) serves a picture at a requested width; an asset's original size is in its id (`image-…-3000x2000-jpg`).
- Pointer events for drags, pinches (two pointers) and taps; the `wheel` event for the wheel and trackpad.

## Non-functional requirements

- Opening adds no request before the first frame: the dialog's picture is already loaded.
- No new dependency: zoom and panning are a CSS transform on one image.

## Delivery

- Plan item: epic-portfolio-full-screen, stories 1 and 2. Nothing Star does changes; the live site gains full screen when this merges.

## Risks and decisions

- Tests in a browser use the preview route, as the portfolio reflow test does, because the fixture build's portfolio is empty; the image CDN is answered from a local picture, so sizes and failures can be checked.
- Swipes and pinches are checked through the pure functions they call (`swipeTurn`, zoom steps and limits); Playwright drives the mouse, wheel and keys.
