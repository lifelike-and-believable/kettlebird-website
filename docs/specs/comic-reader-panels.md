---
status: implemented
tests-commit: a20fcf5ce30fd48961ab263d0ad924b0861416ca
unlocks:
  - tests/e2e/comic-panels-edges.spec.ts (new): a screenshot of the build showed that on a comic's newest page, Next (unusable for pages) couldn't step through the page's remaining panels. Added; the criteria are unchanged.
  - tests/unit/comic-panels-edges.test.ts (new): mutation testing showed nothing checked finding panels on an unreadable or blank picture, a dark background, a gutter just too thin or too marked, exactly 12 panels, the 3% and 70% limits, the editor's steps with nothing selected or at the ends of the order, picking outside the order, undoing a confirm, a panel with no width, or a tall panel's frame. Added; the criteria are unchanged.
  - tests/e2e/comic-panels.spec.ts: the AC-12 check measured the picture straight after **Panel by panel** was pressed, while the view's 0.3 s zoom (AC-14) could still be on its first frame, so it failed about one run in fifteen. It now waits for the picture to grow. The criteria are unchanged.
---

# Comic reader: panels

<!-- Technical spec for story-comic-reader-flip-and-panels-read-panel-by-panel (story 3),
story-comic-reader-flip-and-panels-panels-found (story 4) and
story-comic-reader-flip-and-panels-correct-the-panels (story 5) of epic-comic-reader-flip-and-panels,
which go live together, from design-comic-panels (with its mock-ups), docs-publishing-comics ("Panels")
and docs-reading-comics ("Read panel by panel"). Builds on comic-reader-spread-and-flip and
comic-reader-comic-settings (implemented). A plan-feature spec without an id. -->

## Problem

On a phone, a comic page's small panels and lettering mean pinching and zooming. Fans should be able to step through a page panel by panel, and Star shouldn't have to mark every panel by hand to make that work.

## User stories

- As a fan on a phone, I want to step through a page one panel at a time, each panel enlarged to fit my screen, and switch back to the whole page whenever I like, so that I can read small panels without pinching and zooming. (story-comic-reader-flip-and-panels-read-panel-by-panel)
- As Star, I want the site to find the panels on each page I publish, in reading order, so that panel-by-panel reading works without marking every panel by hand. (story-comic-reader-flip-and-panels-panels-found)
- As Star, I want to see the panels the site found on a page and fix any that are wrong by working on the page itself, so that panel-by-panel reading follows my layout. (story-comic-reader-flip-and-panels-correct-the-panels)

## Acceptance criteria

Source: S3.n, S4.n and S5.n are the stories' nth criteria; design and docs sections as named.

### Panels on a page

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A page stores its panels (`panels`, each `x`, `y`, `width`, `height` in percent of the picture, in reading order) and who set them (`panelsBy`: `site` or `star`; missing means never looked at). A page with `panelsBy: site` and no panels was found to have none; with `star` and none, Star chose to show it whole. The site reads both; a page with no usable panels reads whole. | test: unit "page panels" | S4.3, S5.3; design-comic-panels#how-it-works |

### Finding panels (story 4)

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-2 | `findPanels` takes a small copy of a page (pixels, width, height) and cuts it recursively: into rows wherever a light gutter (at least 0.6% of the page's height, at least 97% of its pixels near the page's background) runs right across a piece, then into columns wherever one runs right down it, until no piece splits; outer margins are trimmed. Panels come out in the order of the cuts: top to bottom, and left to right within a row. A tall panel beside two stacked ones is three panels. | test: unit "finding panels" | S4.2; design-comic-panels#how-it-works |
| AC-3 | No usable panels (none, one covering most of the page, more than 12, or any under 3% of the page) gives an empty list: the page shows whole. A picture that can't be read gives "failed". | test: unit "finding panels" | S4.3 |
| AC-4 | In the editor, panels are found on each page as it uploads (a few pages at a time), only for pages Star hasn't set (`panelsBy` not `star`), and saved with `panelsBy: site`. The tile says "Finding panels…", then "5 panels", "Shown whole" or "Couldn't look for panels". A replaced picture's panels are found again if they were the site's; Star's are kept, with "The picture changed. Check that your panels still match." | test: unit "editor words"; manual: tutorial-publishing-comics | S4.1, S4.4; design-comic-panels#flow-star, #states-and-errors |
| AC-5 | **Publish** reads "Finding panels on 3 pages…" and can't be pressed while panels are being found, for at most 20 seconds from the first; then it works again. A page published without its panels says "Panels found after publishing. Publish again to use them." when they're found. | test: unit "publishing waits" | S4.5; design-comic-panels#how-it-works |
| AC-6 | A chapter with pages never looked at says "12 pages have no panels yet. Find them, then check them before you publish." with **Find panels**, then "Finding panels: 4 of 12 done." while it works. | test: unit "editor words" | S4.1; design-comic-panels#how-it-works |

### Correcting panels (story 5)

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-7 | The page panel's **Panels** section, under **Two-page spread**, draws the picture with each panel as a numbered box and the design's status line: "5 panels, found by the site. Check that they match your page." (with **They're right**), "5 panels, set by you.", "Finding panels…", "No panels found: this page shows whole. Draw panels on it if it has some.", "Shown whole: panel by panel shows this page as one.", "Couldn't look for panels on this page. Draw them, or leave it whole." | test: unit "editor words" | S5.1; design-comic-panels#what-star-enters |
| AC-8 | Every change is a step of a pure panel editor: move (dragged or by arrow keys, 1%), resize (handles, or Shift with an arrow key: Right and Down grow, Left and Up shrink), draw (a drag on the picture; a box under 3% of the page isn't kept, with "That box was too small to be a panel."), **Add panel** (a box in the middle), **Remove** (and Delete), **Earlier** and **Later** (and [ and ]), **Set the reading order** (click or Enter on each box; **Finish order** keeps the rest after in their old order; **Cancel** or Escape undoes it), **Show this page whole**, **They're right**, and **Undo** (Ctrl+Z, ⌘Z) back to when the page was opened. Boxes stay inside the picture. Any change or **They're right** sets `panelsBy: star`. **Find panels again** is offered only while `panelsBy` is `site`. **Set the reading order** and **Show this page whole** can't be used with no boxes. | test: unit "panel editor" | S5.2, S5.3, S5.6; design-comic-panels#flow-star, #accessibility |
| AC-9 | Each box is a button named "Panel 2 of 5" (", selected" when selected), in reading order, and a polite status line says what changed ("Panel 2 moved earlier. Now panel 1 of 5."). | test: unit "panel editor" | S5.6; design-comic-panels#accessibility |
| AC-10 | Changes are saved like any other edit and go live when the chapter is published; finding panels never changes a page whose `panelsBy` is `star`. | test: unit "editor words" (the rule); manual: tutorial-publishing-comics | S5.5, S4.4 |

### Reading panel by panel (story 3)

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-11 | When the reader shows one page at a time (a narrow screen, or any screen in a comic with two pages side by side off), the reader bar has **Panel by panel** (a toggle button, `aria-pressed`), beside **All pages**, on every page of a chapter where at least one page has panels. It isn't shown with two pages side by side, or without a script. The choice is remembered in that browser (`localStorage` `kb-panels`). | test: e2e "the button", "remembered" | S3.1; design-comic-panels#flow-a-fan, #states-and-errors |
| AC-12 | Panel by panel on, the page area shows the current panel scaled to fit, centred, with a margin of 4% of the page's width in the page area's colour; nothing else of the page shows. The bar reads "… · Page 4 of 12 · panel 2 of 5", or "· whole page" on a page without panels, and keeps two lines on a phone, so the page area and controls don't move. | test: unit "panel frame"; e2e "the panel view" | S3.2; design-comic-panels#the-panel-view-reader, #layout |
| AC-13 | **Next**, swipes and the arrow keys step to the next panel; after a page's last panel, to the next page at its first panel; **Previous** back, and from a page's first panel to the page before at its last panel. A page without panels is one step. **First**, **Newest**, **All pages** and links open a page at its first panel. The controls' full names say "Next panel" and "Previous panel" when the step is within the page, "Next page" and "Previous page" otherwise. Each step replaces the history entry, with the panel in it, so a refresh keeps the panel and Back leaves the page. While pinch-zoomed, swipes and keys don't step. | test: unit "panel steps"; e2e "stepping", "across pages" | S3.2–S3.5; design-comic-panels#flow-a-fan, #page-addresses |
| AC-14 | Moving between panels pans and zooms in about 0.3 s, never more than 0.4 s; under reduced motion, at once. A page turn from a last panel plays the page-flip only when the comic has it on. | test: e2e "motion" | S3.6; design-comic-panels#the-panel-view-reader |
| AC-15 | A screen reader hears the page as now, then "Panel 1 of 5." (or the panel it opens at); each step "Panel 3 of 5."; switching on "Panel by panel. Panel 2 of 5."; switching off "Whole page". | test: unit "announcements"; e2e "announcements" | S3.5; design-comic-panels#accessibility |
| AC-16 | In a chapter's preview, panel by panel works as for fans, and **Next** carries on to the chapter's next page and stops at its last panel. | test: e2e "in the preview" | S5.4; design-comic-panels#flow-star |

## Scope

- In:
  - `sanity-studio/lib/panels.ts` (new, pure): `findPanels`, the panel editor's steps, the editor's words. `sanity-studio/components/PanelsTool.tsx` (new, shown by `PageItemNav.tsx`): the drawing area and the section; `findOnPage.ts` (new): reading a page's picture into a canvas; `lib/upload-store.ts`: which pages are being looked at. `sanity-studio/components/PagesInput.tsx`: finding panels after upload, tile captions, the older-pages banner. `sanity-studio/actions`: **Publish** waiting.
  - `sanity-studio/schemas/objects/comicChapter.ts`: `panels` and `panelsBy`, kept out of the plain form; tile captions.
  - `src/lib/comics/model.ts`, `source.ts`: `panels` and `panelsBy` on a page. `src/lib/comics/panels.ts` (new, pure): the panel frame, steps, location, names and announcements.
  - `src/components/pages/ReaderPage.astro`: **Panel by panel**, the panel view and its script.
  - `tests/fixtures/comics.ts`, `tests/fixtures/drafts.ts`: pages with panels, a page without, in a comic with pairs off.
  - Tests: `tests/unit/comic-panels.test.ts`, `tests/unit/panel-finding.test.ts`, `tests/e2e/comic-panels.spec.ts`; `docs/tutorials/publishing-comics.md` steps for checking panels (manual).
- Out: finding panels in pages' text balloons; panels for two pages side by side.

## APIs and assumptions

- The editor reads a page's picture through the image CDN at about 400 px wide into a canvas; Sanity's CDN serves images with CORS headers, so `getImageData` works.
- `history.replaceState` keeps the panel in the page's history entry without a new address.
- The reader moves the panel view with a CSS transform on the page's image inside a clipped frame, so no new image is fetched.

## Non-functional requirements

- Finding panels takes under 2 s a page on a modest laptop, at most 3 pages at once.
- The reader's panel view adds no request and works from the page's own data (its panels in a `data-` attribute).

## Delivery

- Plan item: epic-comic-reader-flip-and-panels, stories 3 to 5. Existing pages have no panels until Star chooses **Find panels** on their chapter; until then they read whole.

## Risks and decisions

- `panelsBy` is a separate field so that "found none" and "Star chose whole" are told apart, and so that finding panels can check one field to know it must leave a page alone.
- The finding rule (a light, nearly uniform gutter) misses borderless art by design: such pages read whole, and Star can draw their panels.
- The panel number travels between pages in `sessionStorage` (like the remembered turn), so a page's address never carries a panel.
