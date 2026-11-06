---
status: implemented
tests-commit: 910decd770676d39bcc1bb0cdaf98f1bfc312184
---

# Comic reader: panel by panel with two pages side by side

<!-- Technical spec for design-comic-panels-two-up (approved 2026-11-06: panel by panel is offered with one
or two pages showing, and turning it on switches to one page at a time). Amends comic-reader-panels AC-11
and its Scope. A plan-feature spec without an id. -->

## Problem

In a comic that shows two pages side by side, a wide screen (a laptop, or a tablet held sideways) never offers **Panel by panel**, so how a fan reads depends on the screen they happen to be on.

## User stories

- As a fan, I want to read panel by panel on any screen, so that I can read the same way wherever I pick the comic up. (design-comic-panels-two-up#personas)

## Acceptance criteria

Source: design-comic-panels-two-up sections as named. The fixture comic Open Book (pairs on, the page-flip on) opens chapter 1 on the right: page 1 alone, pages 2 and 3 a pair, page 4 alone, page 5 a spread, page 6 alone; pages 1, 2 and 3 have panels.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | In a chapter where at least one page has panels, **Panel by panel** is in the reader bar on every screen, including with two pages side by side (1280 × 800, a comic with pairs on). Not in a chapter without panels, and not without a script. | test: e2e "offered with two pages" | #the-change, #states-and-errors |
| AC-2 | Turned on with two pages side by side, the reader shows the page in the address alone, at its first panel, as the one-page reader in every way: its location line ("… Page 2 of 6 · panel 1 of 2"), its controls and their names ("Next panel", then "Next page"), its edge links and end note, a page at a time. With the second page of a pair in the address, that page. Focus stays on **Panel by panel**. | test: e2e "on with two pages" | #the-change, #accessibility |
| AC-3 | **Next**, the arrow keys and swipes go page by page: from page 2's last panel to page 3's first panel, not page 4; **Previous** from page 3's first panel to page 2's last. A turn plays the one-page page-flip (the current page's transition is `kb-page`) when the comic has the page-flip on. | test: e2e "page by page" | #the-change |
| AC-4 | A page loaded or turned to with panel by panel on, on a wide screen, never shows two pages: the other page of the pair is hidden from the moment it is parsed, before the first frame. | test: e2e "before the first frame" | #the-change |
| AC-5 | Turned off with two pages side by side, the reader shows the pair that holds the page (on page 3, pages 2 and 3), or the page alone where pairs place it alone (page 1). The address doesn't change and no history entry is added. A screen reader hears what arriving at that view says: for a pair or a spread, the wide view's announcement ("Chapter 1: Facing Pages, pages 2 and 3 of 6. …"); for a page alone, or one page at a time, "Whole page". Focus stays on **Panel by panel**. | test: unit "switching off"; e2e "off with two pages" | #the-change, #accessibility |
| AC-6 | The choice is remembered in the browser (`kb-panels`) at every width: turned on in a narrow window, it's still on when the window is widened, and after a reload; turned off in a wide window, it's off when it narrows. Resizing while it's on keeps one page at a time. | test: e2e "remembered at any width" | #the-change, #states-and-errors |
| AC-7 | In a chapter with panels, on a wide screen, a page's picture is asked for (its `sizes`) at least twice the width of the page area for one page: `calc((100vh - 12.5rem) * r)` where `r` is twice the picture's width over its height. Chapters without panels ask as before. | test: unit "picture size"; e2e "picture size" | #the-change |
| AC-8 | Everything else checked for panel by panel at one page at a time passes unchanged; comic-reader-panels AC-11 is amended to match AC-1, and its end-to-end test "the button" with it. | manual: review that comic-reader-panels' tests pass with only "the button" changed | #for-the-spec-to-check |

## Scope

- In:
  - `src/lib/comics/panels.ts`: `readerSizes` (the picture's `sizes`) and `panelsOffAnnouncement` (pure).
  - `src/components/pages/ReaderPage.astro`: a script in the head that marks the page one page at a time (`kb-one-page` on `<html>`) when panel by panel is on, before the first frame; the styles, which show the one-page view on a wide screen while it's marked; the script, which offers the button on every screen and picks the one-page links, controls and announcements while it's on.
  - `tests/fixtures/comics.ts`: panels on Open Book's pages 2 and 3.
  - `docs/user/reading-comics.md`, **Read panel by panel**: the lines the design names (#for-the-guide).
  - `docs/specs/comic-reader-panels.md`: AC-11 and the Scope's "Out" line, amended.
  - Tests: `tests/unit/comic-panels-two-up.test.ts`, `tests/e2e/comic-panels-two-up.spec.ts`; `tests/e2e/comic-panels.spec.ts` "the button".
- Out: panel by panel across both pages of a pair at once; finding panels.

## APIs and assumptions

- An inline script in `<head>` runs before the body is parsed, so a class it sets on `<html>` applies to the reader's first frame and to the page-flip's names on arrival.
- The page already carries both views (one page, and the pair) with their own links, controls, headings and announcements; hiding one with styles is enough to switch between them, with no request and no history entry.

## Non-functional requirements

- Switching between one page and two adds no request and is instant.

## Delivery

- Plan item: design-comic-panels-two-up (PR 158).

## Risks and decisions

- **The picture's size in pairs.** `sizes` can't see whether panel by panel is on, and changing it from the script would fetch the picture twice. So in a chapter with panels, a page in a pair is also asked for at twice its area's width: about a quarter more than today at 1280 × 800 (800 px wide instead of 640), only in chapters where panel by panel is offered.
- `localStorage` can't be read (private windows in some browsers): the page opens with pairs, and the button works for that page, as it does today on a narrow screen.
