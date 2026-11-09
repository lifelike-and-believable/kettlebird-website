---
status: implemented
tests-commit: 362569318d6db7983925156b692cf66a219e373a
unlocks:
  - tests/unit/portfolio-folders.test.ts: rowHeight's cap is 240 (AC-1, amending portfolio-folders AC-3); rowHeight(427) and rowHeight(1280) are 240.
  - tests/e2e/portfolio-folders.spec.ts: the row and the subfolder thumbnail are 240 pixels on a computer and pictures are asked for at h=240 (AC-1, AC-2); the tab's corners are 14 pixels (AC-3).
  - tests/e2e/portfolio-folders.spec.ts ("the row"), tests/e2e/arrows.spec.ts (site-arrows AC-9): the arrows' checks run at 800 pixels wide, since at 1280 the fixture's Original Work now fits in one 240-pixel row and nothing scrolls; what they check is unchanged.
  - tests/unit/portfolio-folders-editor.test.ts, tests/unit/organised-editor.test.ts: Grid size's help gains "Computers show at most 3 × 3, phones 2 × 2." (AC-6).
---

# Smaller folders on a computer

<!-- Technical spec for design-portfolio-size (approved 2026-11-09, option A as proposed: rows at most 240 pixels and
the phone's tabs at every width; one rule for every width; subfolder grids at most 3 × 3 on a computer with their
count; detail read in the dialog and full screen; phones unchanged). Amends portfolio-folders AC-3 (the row's cap)
and AC-8 (the grid's cap and the count). A plan-feature spec without an id. -->

## Problem

On a computer the Portfolio's rows are 480 pixels tall and its tabs 2.6rem, so on a 1920 × 1200 screen one folder fills the screen. The lead asked for them at about half the size.

## User stories

- As a fan on a computer, I want to see several of the Portfolio's folders at once, so that I can see what's there before choosing where to look. (design-portfolio-size#personas)
- As a commission client, I want to scan the folders quickly and open a piece to judge its detail. (design-portfolio-size#personas)

## Acceptance criteria

Source: design-portfolio-size sections as named. "Computer" is a viewport 640 pixels wide or wider; "phone" is narrower.

| #    | Criterion                                                                                                                                                                                                                                                                                                                                                                                                                                 | Verified by                                              | Source             |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------ |
| AC-1 | `rowHeight(width)` is `min(round(width × 9 / 16), 240)` (today's cap was 480). On the page a folder's row is that tall for its own width at every viewport: 219 pixels at 390 × 844 (unchanged), 240 at 768, 1280 and 1920. (Amends portfolio-folders AC-3.)                                                                                                                                                                              | test: unit "row height"; e2e "the row"                   | #the-change        |
| AC-2 | Pieces are requested for the row's height: at 1280 × 800 on a 1× screen, the image service is asked for `h=240` (today 480); the `sizes` attribute uses the 240-pixel cap.                                                                                                                                                                                                                                                                | test: e2e "pictures"                                     | #the-change        |
| AC-3 | A folder's tab at every width: DM Mono 1.35rem, padding 0.4rem 1.2rem 0.35rem, top corners 14 pixels (`::before`), perspective 70 pixels; an open tab's perspective 220 pixels. On a computer an open tab stays 1.35rem; on a phone, 1.15rem as today. INDEX is 1.1rem with padding 0.35rem 1rem 0.3rem at every width. The tabs rise 2.25rem above the folder's edge and overlap it by 0.05rem; the space above the first tab is 3.4rem. | test: e2e "tabs" (computed styles at 1280 and 390)       | #the-change        |
| AC-4 | On a computer a folder's body has padding 1.5rem above and 3rem below its row (today 2rem and 4.4rem); a phone's is unchanged.                                                                                                                                                                                                                                                                                                            | test: e2e "tabs"                                         | #the-change        |
| AC-5 | A subfolder's name is 0.85rem with its count ("Book covers · 2") at every width. Its grid shows at most 3 × 3 on a computer (a 4 × 4 subfolder shows its newest 9 pieces in 3 × 3) and at most 2 × 2 on a phone, as today. `gridCells(pieces, size, phone)` caps at 3 on a computer and 2 on a phone. (Amends portfolio-folders AC-8.)                                                                                                    | test: unit "grid"; e2e "subfolders"                      | #the-change        |
| AC-6 | Grid size's help in the editor ends with "Computers show at most 3 × 3, phones 2 × 2.", and `editing-your-site.md` says so in the Grid size row.                                                                                                                                                                                                                                                                                          | test: unit "editor"                                      | #where-it-applies  |
| AC-7 | Unchanged: the arrows (44 pixels; over the row's ends from 640 pixels, under it below), the pieces' edge and shadow, the order, the fixed sides, full screen and the dialog. At 320 pixels and with text at 200% at 1920, nothing scrolls sideways but the rows, and the page passes the axe check.                                                                                                                                       | test: e2e "reflow and axe" (portfolio-folders, as today) | #states-and-errors |
| AC-8 | `docs/design/portfolio-folders.md` notes, at "The page", "The row", "Subfolders" and decision 1, that design-portfolio-size changes the sizes; `docs/STYLE_GUIDE.md` "Portfolio folders" gives the new sizes; the Kettlebird design system records them.                                                                                                                                                                                  | test: unit "documents"; manual: the design system        | #where-it-applies  |

## Scope

- In: `src/lib/portfolio/folders.ts` (`rowHeight`, `gridCells`); `src/components/GalleryGrid.tsx` (the pictures' `sizes`; the grid at most 3 × 3 on a computer, 2 × 2 on a phone, as CSS does today); `src/components/pages/PortfolioPage.astro` (the sizes); `sanity-studio/lib/editor-content.ts` (`FIELDS.portfolioSubfolder.gridSize.help`); `docs/user/editing-your-site.md`; `docs/design/portfolio-folders.md`; `docs/STYLE_GUIDE.md`; the design system artifact.
- Tests: `tests/unit/portfolio-size.test.ts`, `tests/e2e/portfolio-size.spec.ts` (new), and the unlocks below.
- Out: removing 4 × 4 from the editor; the arrows; full screen.

## APIs and assumptions

- CSS container query units (`cqw`) for the row's height, as today; the browser picks the picture from the `srcset` of heights 240, 480 and 960 by the `sizes` width.

## Non-functional requirements

- A computer downloads smaller pictures than today (about half the height).
- `rowHeight` and `gridCells` stay mutation tested.

## Delivery

- Plan item: design-portfolio-size (PR 198).

## Risks and decisions

- Existing tests that name the old sizes are unlocked: `tests/unit/portfolio-folders.test.ts` (`rowHeight` at 853 and 1280; `gridCells` with a 4 × 4 on a computer); `tests/e2e/portfolio-folders.spec.ts` (the 480-pixel row and thumbnail, `h=480`, the tab's 22-pixel corners); `tests/unit/portfolio-folders-editor.test.ts` (Grid size's help).
