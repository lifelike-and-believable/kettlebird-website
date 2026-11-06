---
status: implemented
tests-commit: b888818f3c31894e03bd85432579e29e0cbf2427
unlocks:
  - tests/e2e/comic-page-size.spec.ts: three checks were wrong against the build, and the criteria are unchanged. "The bar at the window's top" measured the bar, which sits 8 px inside the reader's padding; it now measures the reader's top. AC-12 read Big Pages after tabs in the same browser had stored a fan's choice, which the comic's own size must not see; it now clears it first. AC-17 pressed Down to reach Fit the screen from Fit the width, which is above it; it now presses Up.
  - tests/unit/comic-page-size.test.ts: AC-4's sample comic gave its status and kind as plain strings, which the type check refuses; they're now typed as the values they are. The criterion is unchanged.
  - tests/e2e/comic-page-size.spec.ts: AC-15 also checks the button shows in a chapter of one page (Paused), where the bar had no tools to hold it (found by the guides' walkthrough). The criterion is unchanged.
  - tests/unit/comic-page-size.test.ts: AC-1's choice texts for Fit the screen and Fit the height are corrected, as the design's help text was wrong after the lead's decisions: a 1440 × 900 laptop's browser window is about 1440 × 780, where a page is about 390 wide; and Fit the height opens at the bar (the lead, 2026-11-06), so readers don't scroll up. The criterion is unchanged.
  - tests/unit/comic-page-size-edges.test.ts (new): mutation testing showed nothing checked a page whose width isn't known or is 0, or a comic of spreads of different widths, in the pictures' sizes line. Added; the criteria are unchanged.
---

# Comic reader: how pages fit on a computer

<!-- Technical spec for design-comic-page-width (approved 2026-11-06, with the lead's decisions: fit the screen, the
width or the height; the default largest width is each picture's own pixels, in screen pixels, overridable in the
editor; fans choose a size with a compact control on computers, Star's choice the comic's default, kept for every
comic; Fit the height opens at the bar; pairs take the size too). Amends comic-reader-comic-settings (How it reads),
comic-reader-sheet-and-controls (the layout on a computer) and comic-reader-phone-bar (the bar's tools). A
plan-feature spec without an id. -->

## Problem

On a laptop, a comic page is shrunk until it fits the window with the bar and controls: about 470 px wide in a 1440 × 900 window, where lettering drawn for print is small. Star can't choose a bigger page, and fans can't either.

## User stories

- As Star, I want to choose how big my comic's pages show on a computer, so that they're read at a size close to how I drew them. (design-comic-page-width#personas)
- As a fan on a computer, I want to choose whether a page fits my screen, my window's width or its height, so that I read at the size that suits me. (design-comic-page-width#personas)

## Acceptance criteria

Source: design-comic-page-width sections as named. "A computer" is a browser with `(hover: hover) and (pointer: fine)` (Playwright's desktop project); "a touch screen" has `hasTouch` and `isMobile`. Fixture comics: Single Sheets (one page at a time, pages 800 × 1200, a 1600 × 1200 spread at page 3, panels); Open Book (pairs, 800 × 1200 pages); Big Pages (new: **Fit the width**, no largest width, one chapter with pages 600 × 900, 1200 × 1800, a 2400 × 1800 spread and 4000 × 6000); Set Width (new: **Fit the height**, **Largest page width** 1200, pages 800 × 1200). A fan's choice is stored before the page loads (`kb-page-size` in `localStorage`), except in AC-16 to AC-20, which choose it in **Page size**. "The reader's width" is the window less the page's and the reader's side padding (48 px: 1392 in a 1440 window).

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The series schema has **Page size on a computer** (`pageSize`, a string in How it reads, radio: `screen` "Fit the screen", `width` "Fit the width", `height` "Fit the height", each with the design's text; `screen` by default) and **Largest page width** (`largestPageWidth`, a number in How it reads, optional), both with the design's help text; How it reads' description is the design's preview line. | test: unit "fields" | #the-change |
| AC-2 | **Largest page width** accepts a whole number from 400 to 3200 or nothing; 399, 3201, 0, -900, 900.5 and "900px" are refused with "Choose a whole number of pixels between 400 and 3200, or leave it empty." | test: unit "largest page width" | #the-change, #states-and-errors |
| AC-3 | The line under **Largest page width** gives the comic's pictures' widths: one width ("This comic's pages are 800 pixels wide."), a range ("600 to 4000 pixels wide"), and spreads' widths when there are spreads ("and its spread 1600", "and its spreads 1600 to 2400"), followed by "On sharp (high-density) screens, a picture looks sharpest at half its width or less."; with no pages, no line. | test: unit "pictures' sizes" | #the-change |
| AC-4 | The comic's settings are read from Sanity: `pageSize` is `width` or `height` when set so, else `screen`; `largestPageWidth` is kept only when it's a whole number from 400 to 3200. | test: unit "read from Sanity" | #the-change |
| AC-5 | A page's largest width is **Largest page width** (twice it for a spread) or, without one, its picture's width, at most 3200. The chapter's column is the largest width of its widest page that isn't a spread. | test: unit "largest widths" | #the-change |
| AC-6 | Pictures are made at widths 480, 800, 1200, 1600, 2400 and 3200, never wider than the picture itself (a 600-pixel picture is made at 480 and 600). | test: unit "picture widths" | #the-change |
| AC-7 | The reader asks for the picture at the size it shows: its `sizes` gives, on a computer, the page's width in each size (Fit the width: `min(cap, 100vw - 2rem)`; Fit the height: `min(cap, 100vh × the page's shape)`), twice for a spread's cap, and is unchanged with **Fit the screen**, on phones and tablets, and panel by panel; the next page fetched ahead uses the same rule. | test: unit "sizes" | #the-change |
| AC-8 | On a computer, one page at a time, **Fit the width**: Big Pages' 600 × 900 page at 1440 × 900 is 600 × 900, its 1200 × 1800 page 1200 × 1800, its 4000 × 6000 page the reader's width (1392); Set Width (800 × 1200 pictures, **Largest page width** 1200) read at **Fit the width** by a fan's choice is 1200 × 1800, enlarged; Single Sheets read at **Fit the width**: at 1440 × 900 an 800-pixel page is 800 × 1200; at 800 × 700, 699 × 700 and 576 × 360 it's the reader's width; at 2560 × 1440 it's 800. Nothing scrolls sideways. | test: e2e "fit the width" | #the-change |
| AC-9 | **Fit the height** (Set Width): at 1440 × 900 a page is 600 × 900, the bar at the window's top, the page's bottom 60 to 76 px below the window; at 576 × 360 it's 240 × 360. Nothing scrolls sideways. | test: e2e "fit the height" | #the-change |
| AC-10 | **Fit the screen** is today's reader: with it, everything the reader's existing tests check passes unchanged, and **Largest page width** has no effect. | test: e2e "fit the screen" | #the-change |
| AC-11 | Pairs (Open Book, 1440 × 900) take the size: **Fit the width**, each page half the reader's width (696), meeting at the spine (the left page's right edge at the right page's left edge, ± 1); **Fit the height**, each 600 × 900; a spread across both (page 5) the reader's width; at 800 × 700 (one page at a time, as now) the single page by the size. | test: e2e "pairs" | #the-change |
| AC-12 | A spread alone (Single Sheets page 3, Big Pages' spread) in each size: up to its own largest width, within the window less 2rem, centred (± 1), no sideways scrolling; the bar keeps the chapter's width. | test: e2e "a spread alone" | #the-change |
| AC-13 | Big Pages at **Fit the width**: the bar's place and width, and **Back to series**' and **Page size**'s places, are the same on every page of the chapter (± 1), and each page is centred in it; the bar is never narrower than 600 (Set Width at 1440 × 600, its page 400 wide). | test: e2e "the column" | #the-change |
| AC-14 | With a touch screen at 1024 × 768 and 1366 × 1024, and on a phone, the reader is as now and there's no **Page size**, whatever the comic's size or a stored choice. | test: e2e "touch screens" | #the-change |
| AC-15 | **Page size**, on a computer: a 44 × 44 px button (± 1) before **Panel by panel**, a picture only (`aria-hidden`), named "Page size", with `aria-haspopup="menu"` and `aria-expanded`; its name shows under it on hover and keyboard focus, right-aligned, inside the window; the bar is one line (60 px or less) at 700, 1000 and 1440 wide in each size, in a chapter with panels. Without script, it isn't shown. | test: e2e "the button" | #the-change, #accessibility |
| AC-16 | Its menu (`role="menu"`, named "Page size on this computer") has four `menuitemradio`s in order: "Comic's choice: " and the comic's size, then **Fit the screen**, **Fit the width**, **Fit the height**, with the design's notes, one `aria-checked`; and the line "Kept on this computer." | test: e2e "the menu" | #the-change |
| AC-17 | From the keyboard: Enter, Space or Down on the button opens the menu with focus on the checked item; Up and Down move focus without choosing (no change of size); Enter or Space chooses; Escape and Tab close it with focus back on the button; while it's open, Left and Right don't turn the page. A click outside closes it. | test: e2e "the keyboard" | #the-change, #accessibility |
| AC-18 | Choosing applies the size at once, on the same page (and panel), closes the menu, puts focus on the button, scrolls to the bar, and puts "Page size: Fit the height." in the reader's announcement line. | test: e2e "choosing" | #the-change |
| AC-19 | A fan's choice is kept in `localStorage` (`kb-page-size`) and used for every comic and after a reload, set on the page before it first shows (the page's width in the first paint equals its width after load); while it's in use the button has its dot and is named "Page size: Fit the screen, your choice" (with the size chosen); **Comic's choice** removes it. With storage blocked, a choice applies to the page in view only and nothing fails. | test: e2e "kept" | #the-change, #states-and-errors |
| AC-20 | With **Panel by panel** on: the panel view fits the window whatever the size; the menu's last line is "Panel by panel always fits the screen. Your choice applies when it's off."; choosing says "Page size: Fit the height. Applies when Panel by panel is off." and doesn't scroll; turning panel by panel off shows the chosen size. | test: e2e "panel by panel" | #the-change |
| AC-21 | In **Fit the width** and **Fit the height**, each page opens with the bar at the window's top, by **Next**, **Previous** and the arrow keys; after a keyboard turn focus is on the same control on the new page; the edge arrow's button is inside the window on a 1200 × 1800 page at 1280 × 720 with the pointer on the strip; "Loading page…" sits at the top of the page's space; the phone's turn hint isn't shown. | test: e2e "turning and waiting" | #the-change, #accessibility |
| AC-22 | A chapter's preview at **Computer** uses the comic's settings as they are now, published or not, and ignores a fan's choice. | test: unit "preview" | #the-change |
| AC-23 | Star's guide `publishing-comics.md` and the fans' guide `reading-comics.md` say what the design's For the guides lists. | manual: review of the guides | #for-the-guides |
| AC-24 | The page-flip on a page taller than the window turns the part that's in view, in Chrome and Safari on a computer. | manual: on a computer, from the pull request's preview | #the-change |

## Scope

- In:
  - `sanity-studio/lib/comic-pages.ts`: the two fields, the validation, the pictures' sizes line, How it reads' description; the series schema using them.
  - `src/lib/comics/`: the settings in the model and the query (`source.ts`), picture widths, `readerSizes`, the largest widths and the column (a new `page-size.ts`).
  - `src/components/pages/ReaderPage.astro`: **Page size** and its menu, the head script setting the size before the page shows, the sizes' styles (from the design's `proposed.css`), the arrow keys while the menu is open, the edge arrows and loading message.
  - `src/lib/preview/load.ts`: the draft settings in the preview.
  - Fixtures: Big Pages and Set Width in `tests/fixtures/comics.ts`.
  - Guides: `docs/user/publishing-comics.md`, `docs/user/reading-comics.md`.
  - Tests: `tests/unit/comic-page-size.test.ts`, `tests/e2e/comic-page-size.spec.ts`; and the unlocks below.
- Out: phones and tablets; panel by panel's own view; the editor's preview frame; the site header.

## APIs and assumptions

- Sanity's image metadata gives each picture's width and height (already read as `dimensions`).
- The Sanity image CDN won't make an image wider than the original; widths above it aren't asked for.
- `(hover: hover) and (pointer: fine)` is false on phones, tablets and touch laptops used by touch; a touch laptop with a trackpad counts as a computer, which the design accepts.
- `localStorage` may throw (blocked storage, private modes); every read and write is guarded.

## Non-functional requirements

- No layout shift on opening: the stored choice is applied by an inline script in the head before the first paint, as `kb-panels` is.
- Picture weight: pages are asked for at their shown size times the screen's density, never above the picture's width.

## Delivery

- Plan item: design-comic-page-width (PR 165).
- Existing tests whose names or text change, to be recorded under `unlocks:`: the How it reads description check in `tests/unit/comic-settings.test.ts`; `PAGE_WIDTHS` checks, if any, in the comic source tests.

## Risks and decisions

- New pure logic (`page-size.ts`, the pictures' sizes line, the validation, `readerSizes`) is mutation tested.
- The page-flip on a tall page is a manual check (AC-24): headless browsers don't run view transitions the same way.
