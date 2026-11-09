---
id: design-portfolio-size
status: draft
derived-from:
  - design-portfolio-folders#the-page-mock-ups-1-and-4: e84941da8657
  - design-portfolio-folders#the-row-mock-ups-1-2-and-4: b0271524ba50
  - design-portfolio-folders#subfolders-mock-ups-2-3-5-and-12: f0f2d070d6cf
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
  - persona-commission-client#goals: 94a5f248cb6c
---

# Smaller folders on a computer: design

<!-- docs/design/portfolio-size.md. A design amendment from a change request by the lead (2026-11-09): on the
Portfolio, the tabs and thumbnails are quite large on a desktop; on a 1920 × 1200 27-inch display they could be
half their size. Mock-ups are in docs/design/mockups/portfolio-size/: screenshots of the fixture build's Portfolio
in Preview, today and with the options' styles added, made by render.mjs. The stand-in pictures are cropped in
the mock-ups because they don't have the pieces' shapes; on the site every piece is whole. The fixture has no
Featured folder; on the site Featured comes first. -->

## Personas

- persona-fan: on a large screen today, a 480-pixel row and 2.6rem tabs fill the screen with one folder (mock-up 1); a fan sees one row and part of the next. At about half the size, three folders show at once on 1920 × 1200 (mock-up 2), so a fan sees what's in the Portfolio before choosing where to look. Each piece is smaller, about 7 cm tall on the lead's 27-inch screen and about 4.6 cm on a tablet, so lettering in a piece (a comic's caption, a price list) is no longer readable in the row: a fan opens the piece for that, as they do on a phone today.
- persona-commission-client: compares artists from examples (#goals). Seeing more folders at once helps them scan; judging detail takes a click into the piece's dialog or full screen, which are unchanged.
- persona-artist: Star's concept had large folders; the lead found them too large on a desktop (2026-11-09). The look stays Star's (kraft, tabs on fixed sides with their slant, pieces whole); only the sizes change, to the ones phones already use. Star hasn't seen this change yet.

## The change

This amends design-portfolio-folders, "The page", "The row" and "Subfolders".

**One rule for every width (option A, proposed):**

- **Rows:** 9/16 of the row's width, at most **240 pixels** (today 480). A phone up to 427 pixels wide is unchanged (a 390-pixel phone's row is still 219 pixels, mock-ups 8 and 9); wider than that, every screen gets 240. There's no step at 640 pixels: the row grows smoothly to 240 and stays there.
- **Tabs:** the phone's tab at every width. Its name in DM Mono 1.35rem (today 2.6rem on a computer), padding 0.4rem 1.2rem 0.35rem, top corners 14 pixels, its paper tilted with a 70-pixel perspective (an open tab's, 220 pixels), so the slant is the one phones have today. It rises 2.25rem above its folder's edge and overlaps the edge by 0.05rem. Its contact line and shadow are unchanged.
- **Open tab and INDEX:** on a computer the open tab keeps the 1.35rem of a closed tab ("Past Clients: Book covers", mock-up 5; a long name fits on one line, mock-up 11); on a phone it stays 1.15rem, as today. INDEX is 1.1rem with padding 0.35rem 1rem 0.3rem at every width (about 30 pixels tall, above the 24-pixel minimum target).
- **Subfolder thumbnails:** a square at the row's height, as today, so 240 pixels on a computer. The name under the grid is 0.85rem with the count, "Book covers · 9", at every width (today the count shows only on phones). The grid shows at most **3 × 3** on a computer (below the name, a 4 × 4 cell would be about 52 pixels; a 3 × 3 cell is about 70, mock-up 10) and at most 2 × 2 on a phone, as today. Grid size's help in the editor gains "Computers show at most 3 × 3, phones 2 × 2."
- **Folders:** padding 1.5rem above the row and 3rem below it on a computer (today 2rem and 4.4rem); the space above the first tab is 3.4rem. Phones keep theirs.
- **Unchanged:** the arrows (44 pixels, over the row's ends from 640 pixels wide, under it below), the pieces' 3-pixel edge and shadow, the row's side padding, the order, the fixed sides, the colours, full screen and the dialog.
- **Pictures:** fetched for the row's height, so a computer asks for about 240 pixels tall (480 on a sharp screen) instead of 480 (960).

**Option B, a middle step:** rows at most 320 pixels, tabs 1.75rem, INDEX 1.4rem, tab corners 16 pixels, subfolder names 1rem, on screens 640 pixels and wider; phones unchanged. Two folders at once on 1920 × 1200 (mock-ups 3 and 6). It keeps a step at 640 pixels (a 639-pixel window's row is 359 pixels, a 640-pixel one's 320).

## Mock-ups

Screenshots of the fixture build's Portfolio in Preview, with the option's styles added. Source: `mockups/portfolio-size/render.mjs`.

| # | What it shows | File |
| --- | --- | --- |
| 1 | Today at 1920 × 1200: one folder fills the screen | `mockups/portfolio-size/1-today-1920.png` |
| 2 | Option A at 1920 × 1200: three folders at once | `mockups/portfolio-size/2-option-a-1920.png` |
| 3 | Option B at 1920 × 1200 | `mockups/portfolio-size/3-option-b-1920.png` |
| 4 | Today, a subfolder open (Past Clients: Book covers) | `mockups/portfolio-size/4-today-open-1920.png` |
| 5 | Option A, a subfolder open, with INDEX | `mockups/portfolio-size/5-option-a-open-1920.png` |
| 6 | Option B, a subfolder open | `mockups/portfolio-size/6-option-b-open-1920.png` |
| 7 | Option A on a 1280 × 800 laptop | `mockups/portfolio-size/7-option-a-1280.png` |
| 8 | A 390-pixel phone today | `mockups/portfolio-size/8-today-phone.png` |
| 9 | The same phone with option A: the same | `mockups/portfolio-size/9-option-a-phone.png` |
| 10 | Option A, a 3 × 3 subfolder of nine pieces, with its count | `mockups/portfolio-size/10-option-a-3x3-1920.png` |
| 11 | Option A, a long open tab | `mockups/portfolio-size/11-option-a-long-tab-1920.png` |
| 12 | Option A on a 768 × 1024 tablet | `mockups/portfolio-size/12-option-a-tablet-768.png` |
| 13 | Option A at 1920 × 1200 with text at 200% | `mockups/portfolio-size/13-option-a-200-percent-1920.png` |

## Where it applies

| # | Where | After |
| --- | --- | --- |
| 1 | `src/components/pages/PortfolioPage.astro` | The sizes above. |
| 2 | `src/lib/portfolio/folders.ts` (`rowHeight`: at most 240), `src/components/GalleryGrid.tsx` (the pictures' `sizes`; the grid's cap of 3 × 3 on a computer) | The row and grid rules. |
| 3 | `sanity-studio/lib/editor-content.ts` (Grid size's help) and `docs/user/editing-your-site.md` | "Computers show at most 3 × 3, phones 2 × 2." |
| 4 | `docs/design/portfolio-folders.md` | A note at "The page", "The row", "Subfolders" and decision 1 that this design changes the sizes. |
| 5 | `docs/STYLE_GUIDE.md` ("Portfolio folders") and the Kettlebird design system (`row-height`, `folder-tab`, `subfolder-name`, `radius-tab`, SubfolderThumbnail) | The new sizes. |

## States and errors

| Situation | What happens |
| --- | --- |
| A phone up to 427 pixels wide | Unchanged: the row 9/16 of its width. |
| A large phone held sideways, a tablet, a laptop, a desktop | Rows 240 pixels; arrows under the row below 640 pixels wide, over its ends from 640. |
| A 4 × 4 subfolder on a computer | Its newest 9 pieces in a 3 × 3 grid, with its count. |
| A long subfolder name or open tab | Wraps, as today; at the smaller size it wraps less often (mock-up 11). |
| A piece wider than 16:9 | Whole at the row's height, as today; the row scrolls along it. |
| Text at 200% | The tabs and names grow and wrap; nothing scrolls sideways but the rows (mock-up 13). |

## Accessibility

- Contrast is unchanged: ink on the kraft is about 6:1 and ink on INDEX's pink about 5.9:1, both above 4.5:1, the bar for text this size (1.35rem and 1.1rem are under WCAG's large-text size).
- Targets: the arrows stay 44 pixels; INDEX is about 30 pixels tall; subfolder thumbnails and pieces are 240 pixels.
- Region names, announcements and focus are unchanged.

## For the spec to check

- `rowHeight(width)` is `min(round(width × 9 / 16), 240)`; the row's height on the page is the same for its own width; pictures are requested for it.
- Tabs: 1.35rem, padding, corners 14 pixels, perspective 70 pixels (open 220) at every width; INDEX 1.1rem; the open tab 1.35rem from 640 pixels wide, 1.15rem below.
- Subfolder names 0.85rem with the count at every width; at most 3 × 3 from 640 pixels wide, 2 × 2 below; Grid size's help.
- Folder padding from 640 pixels wide.
- Existing tests that name the old sizes change: portfolio-folders AC-3 ("at 1280 wide the row is 480 px"); `tests/unit/portfolio-folders.test.ts` (`rowHeight` at 853 and 1280); `tests/e2e/portfolio-folders.spec.ts` (the 480-pixel row, the `h=480` picture, the 480-pixel thumbnail, the tab's 22-pixel corners); `tests/unit/portfolio-folders-editor.test.ts` (Grid size's help).

## Decisions at review

Proposed, for the lead to confirm or change:

1. **Option A:** about half: rows at most 240 pixels and the phone's tabs at every width.
2. **One rule for every width,** so laptops (mock-up 7) and tablets (mock-up 12) get it too, with no step at 640 pixels. The alternative, option B, is two thirds on computers only.
3. **Subfolder grids at most 3 × 3 on a computer,** with the count shown at every width. The alternative is to keep 4 × 4 on a computer with 52-pixel cells. With the cap, 4 × 4 in the editor shows as 3 × 3 on a computer; it could be removed from the editor later.
4. **Detail in the row:** lettering in a piece isn't readable in the row on a computer, as on a phone today; the dialog and full screen show it.
5. **Phones unchanged.**

## Persona walkthrough

Run with `rfr-process:persona-walkthrough` for persona-fan, persona-artist and persona-commission-client on the first draft (2026-11-09). What it found and what changed:

- **4 × 4 and 3 × 3 grids at 240 pixels** were too small and not shown. Grids are now at most 3 × 3 on a computer, with the count at every width; mock-up 10 shows a 3 × 3 grid (decision 3).
- **A step at 640 pixels:** the first draft shrank rows only from 640 pixels wide, so a 639-pixel window had a 359-pixel row and a 640-pixel one 240. Option A is now one rule for every width (decision 2); option B keeps the step and says so. A tablet now has a mock-up (12).
- **Detail:** lettering in pieces is no longer readable in the row; the design now says so and leaves it to the dialog and full screen (decision 4).
- **The tab's geometry** wasn't given: the tab now uses the phone's padding, corners, perspective and offsets, named above, so its slant is the phones' slant.
- **INDEX and the open tab** had no sizes or target: now 1.1rem (about 30 pixels tall) and 1.35rem on a computer.
- **`rowHeight` and the breakpoint:** with one rule, `rowHeight` caps at 240 for every width; the pictures are requested for it.
- **The tests to change** are now listed, and design-portfolio-folders gets notes where its sizes change, decision 1 included.
- **Claims:** the size of a piece is given for both a 27-inch screen and a tablet; "three folders" is from the fixture, which has no Featured folder (on the site, Featured, Original Work and Fan Work would show); the accessibility line now separates contrast from text size. Star hasn't seen the change.
- **Missing mock-ups** added: a 3 × 3 grid (10), a long open tab (11), a tablet (12), text at 200% (13), and the phone before and after (8, 9).
