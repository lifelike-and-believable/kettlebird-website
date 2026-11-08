---
status: draft
tests-commit: bf3bbd973c060cb93edacc0b99a7cf86410bb180
unlocks:
  - tests/unit/full-screen-view.test.tsx, tests/fixtures/drafts.ts: the pieces gain dates in the order they were listed, since AC-4 puts undated pieces in title order; what the tests check is unchanged.
  - tests/unit/portfolio-section-order.test.tsx: no filter bar (AC-1), and only the five sections show (the editor offers no others); Featured still comes first.
  - tests/unit/arrows-components.test.tsx, tests/e2e/arrows.spec.ts: the carousel's arrows now have the "can't be used" state (AC-5, amending design-arrows item 3). The e2e file opens Book covers' Preview, whose Original Work row starts at its beginning (a piece's Preview scrolls its row to the piece), clicks Scroll right where it clicked Scroll left, and brings the row into view before measuring.
  - tests/unit/organised-editor.test.ts, tests/unit/organised-editor-edges.test.ts, tests/unit/help.test.ts, tests/unit/preview.test.ts: the subfolder type joins the item names, item types, fields, help links and previewable types; the Picture's help is the design's new text (AC-17 to AC-24).
  - tests/e2e/portfolio-folders.spec.ts (this spec's own, after its first run): the subfolder's square is the whole thumbnail, its name inside it under the grid (mock-up 2), so the test measures the thumbnail; Preview never moves focus, so the e2e checks visibility and the component tests check focus (AC-10); the row test starts from Book covers' Preview; the folder's kraft and shadow are on its body, under its tabs.
---

# The portfolio as folders, with subfolders

<!-- Technical spec for story-portfolio-folders-browse-the-folders, story-portfolio-folders-open-a-subfolder and
story-portfolio-folders-put-pieces-in-subfolders (epic-portfolio-folders), from design-portfolio-folders
(approved 2026-11-08, with the lead's decisions at review) and its mock-ups. Amends design-arrows item 3 (the
carousel's arrows gain the "can't be used" state), portfolio-full-screen AC-8 (the turn order and count, now
by folder or subfolder) and REQ-portfolio-1 to -3. A plan-feature spec without an id. -->

## Problem

The Portfolio shows each section as a band of 200-pixel square crops under a filter bar, mostly empty kraft. Star's concept is a stack of kraft file folders with tabs, each piece large and at its own shape, and fandoms (or clients) gathered into subfolders that a fan can open, share and close again. Star has no way to group pieces.

## User stories

- As a fan, I want to look through the Portfolio's folders with each piece shown large and uncropped, so that I see Star's art as they made it. (story-portfolio-folders-browse-the-folders)
- As a fan, I want to open a subfolder, such as one fandom in Fan Work, and see only its pieces, then go back to the whole folder, so that I can follow what I came for. (story-portfolio-folders-open-a-subfolder)
- As Star, I want to make subfolders in a folder and put pieces in them, in the editor, so that the Portfolio groups my work the way I think of it. (story-portfolio-folders-put-pieces-in-subfolders)

## Acceptance criteria

Source: design-portfolio-folders sections as named. "Folder" is a Portfolio section on the page; "section" is the same thing in the editor. The five, in order, with their value, address part and tab side: Featured (`featured`, `featured`, right), Original Work (`original`, `original-work`, left), Fan Work (`fanart`, `fan-work`, right), Past Clients (`commission`, `past-clients`, left), Work in Progress (`wip`, `work-in-progress`, right). "Phone" is a viewport under 640 px wide.

### The page and the rows (story 1)

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The page keeps its title "Portfolio" and subtitle. There's no filter bar and no "Index" label above the folders. One folder per section with at least one published piece, in the order above; each is a region named by its tab, holding its tab (DM Mono, the section's title) on the section's fixed side, whichever sections are present. Sections other than the five don't show. With no pieces at all, the page shows its empty message, as today. | test: unit "folders"; e2e "the page" | #the-page-mock-ups-1-and-4 |
| AC-2 | Each folder and tab has the kraft paper, the tab with top corners rounded 22 px (14 px on a phone) and sides slanting in slightly; folders overlap the one above and have the contact line and upward shadow of the design (`0 -1px 0` at 16% ink; `0 -6px 12px -4px` at 28% ink); the torn-paper seam and highlighter labels are gone. | test: e2e "the page" (computed styles) | #the-page-mock-ups-1-and-4 |
| AC-3 | `rowHeight(width)` is `min(round(width × 9 / 16), 480)`. A folder's row is that tall for its own width; every piece in it is shown whole at that height (width from the asset's own size, no crop), with the paper edge and shadow. At 390 × 844 a 16:9 piece fills the row's width (±2 px); at 1280 wide the row is 480 px. | test: unit "row height"; e2e "the row" | #the-row-mock-ups-1-2-and-4 |
| AC-4 | The row's entries are in order of date, newest first; pieces with no date come after the dated ones, in title order; a subfolder takes the place its newest piece would have among the loose pieces. A piece in a subfolder of a folder isn't also loose in that folder. | test: unit "order" | #the-row-mock-ups-1-2-and-4 |
| AC-5 | The row has the site's two arrow buttons (design-arrows), over its ends on a computer and under it, at left and right, on a phone. Each scrolls the row by 75% of its width. At the start, "Scroll left" can't be used (`aria-disabled="true"`, dashed, skipped by Tab); at the end, "Scroll right"; a row that fits shows both as can't be used. Clicking one that can't be used does nothing. | test: unit "arrows"; e2e "the row" | #the-row-mock-ups-1-2-and-4 |
| AC-6 | A piece's picture is requested at the row's height (twice that on a 2× screen), at its own shape; pictures beyond the first screen load lazily. | test: e2e "pictures" | #the-row-mock-ups-1-2-and-4 |
| AC-7 | Choosing a piece opens its dialog, and full screen from there, as today (portfolio-full-screen). | test: e2e "the row" | #the-row-mock-ups-1-2-and-4 |

### Subfolders on the page (story 2)

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-8 | A subfolder with at least one published piece shows in its folder's row as a link: a square at the row's height holding a grid of its newest pieces (`gridCells`: its grid size squared, the newest first; on a phone at most 2 × 2), each cropped square around its hotspot (the centre if none), with paper-coloured empty cells when it has fewer pieces; under it, its name, and on a phone "Name · count". The link's name is "Murderbot, 4 pieces" and its grid pictures have `alt=""`. A subfolder with no published pieces doesn't show. | test: unit "grid"; e2e "subfolders" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-9 | Choosing a subfolder shows its pieces in its folder's row in place of the top level, scrolled to the start; the tab reads "Fan Work: Murderbot" (`tabLabel`); a link **INDEX**, named "Index: back to Fan Work", shows beside it on the tab's inner side. The region's name is the tab's. Only that folder changes, and the page doesn't scroll. | test: unit "tab"; component "open and close"; e2e "subfolders" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-10 | Opening a subfolder announces "Fan Work: Murderbot, 4 pieces." (polite) and moves focus to its first piece. **INDEX** shows the folder's top level, scrolled to the subfolder's thumbnail, and puts focus on it. At the top level there's no **INDEX**. | test: component "open and close"; e2e "subfolders" | #accessibility |
| AC-11 | One subfolder is open at a time: opening one in another folder returns the first folder to its top level. | test: component "open and close" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-12 | Each subfolder has an address, `/portfolio/<folder part>/<its web address>`, built ahead of time (`subfolderPaths`). It shows the Portfolio with that subfolder open, scrolled to its folder; without scripts, a subfolder's thumbnail is a link to its address and **INDEX** a link to `/portfolio`. A subfolder with no published pieces, or an address that isn't one, is **Page not found**. | test: unit "addresses"; e2e "addresses" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-13 | History (`indexAction`, component): opening a subfolder from the page pushes a history entry with its address; **INDEX** goes back one entry when the entry before is the Portfolio's top level opened in this visit, and otherwise replaces the entry with `/portfolio`. On `popstate` the page shows what the address says (that subfolder open, or every folder at its top level), announcing it as in AC-10 without moving focus, and an open piece dialog closes; full screen's own history entry is its own, as today. In Preview the address never changes. | test: unit "history"; component "history" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-14 | A subfolder's page has the title "Murderbot · Fan Work · Portfolio • Kettlebird Creations", the description "Star's Murderbot pieces, in Fan Work: 4 pieces." (1 piece: "1 piece"), its own canonical address, and as its link preview its newest piece fitted whole in 1200 × 630 on paper (as the Portfolio's, site-search AC-7), with that piece's alt text. Its address is in the sitemap. | test: unit "subfolder page"; e2e "addresses" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-15 | Full screen from a piece in an open subfolder turns through that subfolder's pieces, in its order, and the count reads "3 of 4 · Murderbot"; from a loose piece, through its folder's loose pieces in the row's order, and the count reads "3 of 12 · Fan Work" as today. (Amends portfolio-full-screen AC-8, whose order was every piece in the section.) | test: unit "full screen" | #subfolders-mock-ups-2-3-5-and-12 |
| AC-16 | Folder tabs and subfolder names wrap rather than overflow; at 320 px wide and with text at 200%, nothing on the page scrolls sideways but the rows; an open tab's words on a phone are 1.15rem. The page passes the axe check, at the top level and with a subfolder open, on a phone and a computer. | test: e2e "reflow and axe" | #accessibility |

### The editor (story 3)

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-17 | **Art** opens a list of two, **Pieces** (today's list of `galleryItem`) and **Subfolders** (`portfolioSubfolder`, newest first, "New subfolder"). Nothing else in the menu changes. | test: unit "editor menu" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-18 | A subfolder (`portfolioSubfolder`, item name "Subfolder") has **Name** (required), **Web address** (slug from the name, required, unique among subfolders in the same section), **Section** (required; one of the five, as radio buttons) and **Grid size** (2 × 2, 3 × 3 or 4 × 4 as 2, 3, 4; 2 at first), with the design's help texts; Grid size's help ends with `gridHint` ("Murderbot has 4 pieces: 2 × 2 shows them all." / "… 3 × 3 shows the newest 9."). Its list row reads "Fan Work · 2 × 2 · 4 pieces". | test: unit "subfolder type" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-19 | Once a subfolder is published, its **Section** is read-only, with the help "Set when you make it; to move pieces to another section, make a subfolder there."; a change made another way is refused at publish (`sectionLocked`). | test: unit "subfolder type" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-20 | A piece gains **Subfolders** after **Portfolio sections**: weak references to published subfolders, at most one per section, only in sections the piece is in (`subfolderProblems` gives the error otherwise); the input shows one choice per section the piece is in, with **Loose** and that section's published subfolders, and "Loose (no subfolders yet)" when there are none. Its help: "Optional. At most one in each section this piece is in. Left as Loose, the piece shows on its own in that section." | test: unit "piece subfolders"; manual: the editor | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-21 | When a piece's section is unticked while it has a subfolder in that section, the field shows "If you untick Fan Work, this piece also leaves Murderbot when you publish." until it's published; publishing drops that reference. A piece's list row reads "Fan Work, Featured · Murderbot" (sections, then its subfolders' names). | test: unit "piece subfolders" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-22 | Deleting a subfolder asks "Delete Murderbot? Its 4 pieces stay in Fan Work, shown on their own. Its web address stops working: links people shared to it will show Page not found." (`deleteMessage`); the pieces' references are weak, so delete isn't blocked, and the page treats a reference to a missing subfolder as loose. | test: unit "delete"; unit "order" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-23 | A subfolder is previewable: its Preview shows the Portfolio with it open, drafts included; with no pieces, its folder shows "No pieces in Murderbot yet. Put pieces in it from each piece's Subfolders.". A piece's Preview opens the subfolder it's in within the first of its sections that has one, with the piece in view. | test: unit "preview"; e2e "preview" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |
| AC-24 | The subfolder type has its help link, "Subfolders" → `/help/editing-your-site#subfolders` (`ITEM_HELP`); the Picture field's help is the design's new text, in the editor and in `editing-your-site.md`. | test: unit "help" | #what-star-does-in-the-editor-mock-ups-7-8-and-9 |

### Documents

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-25 | `editing-your-site.md` gains "## Subfolders" and the design's changes (For the guides); `viewing-artwork.md` loses the filter step and explains folders, subfolders, **INDEX**, Back and sharing; `docs/design/arrows.md` item 3 says the carousel has the "can't be used" state; `REQ-portfolio-2` is retired and -1, -3 updated; `STYLE_GUIDE.md` has "### Portfolio folders". | test: unit "documents"; review | #where-it-applies |

## Scope

- In:
  - `src/lib/portfolio/folders.ts` (new, pure): `FOLDERS`, `rowHeight`, `buildFolders` (entries in order, loose pieces, subfolders with their pieces), `gridCells`, `tabLabel`, `subfolderPaths`, `subfolderPath`, `subfolderTitle`, `subfolderDescription`, `indexAction`, `arrowsUsable`, `turnOrder` (by folder or subfolder), `countLabel` (with the subfolder's name).
  - `src/lib/portfolio/full-screen.ts`: `turnOrder` and `countLabel` move to or call `folders.ts`; `openedSection` goes.
  - `src/components/GalleryGrid.tsx`: folders, rows, subfolder thumbnails, open and close, history, arrows' state; no filter. `src/components/pages/PortfolioPage.astro`: the folders' styles; a `subfolder` prop (open at load) and its head (AC-14).
  - `src/pages/portfolio/[folder]/[subfolder].astro` (new); `src/lib/queries.ts` (subfolders, pieces' subfolder references); `src/lib/portfolio-preview.ts` (the subfolder's preview picture).
  - Preview: `src/lib/preview/load.ts`, `targets.ts`, `parts.ts`; `sanity-studio/lib/preview.ts` (`portfolioSubfolder` previewable); `tests/fixtures/drafts.ts` (subfolders and pieces in them).
  - Editor: `sanity-studio/schemas/objects/portfolioSubfolder.ts` (new), `galleryItem.ts` (`subfolders`), `schemas/index.ts`, `structure.ts` (Art's two lists), `lib/editor-content.ts` (`ItemType`, `SECTIONS`, `FIELDS`, `ITEM_NAMES`, list details, `gridHint`, `deleteMessage`, `subfolderProblems`, `sectionLocked`), `lib/help.ts` (`ITEM_HELP`), a Subfolders input component and the delete confirmation.
  - `docs/design/arrows.md`, `docs/product/requirements/portfolio.md`, `docs/STYLE_GUIDE.md`, the two guides, `docs/PROJECT_PLAN.md`; the Kettlebird design system artifact (folder, tab, subfolder thumbnail).
  - Tests: `tests/unit/portfolio-folders.test.ts`, `tests/unit/portfolio-folders-grid.test.tsx` (component), `tests/unit/portfolio-folders-editor.test.ts`, `tests/e2e/portfolio-folders.spec.ts`, and the unlocks.
- Out: subfolders inside subfolders; ordering by hand; tags as filters; the arrows' look; moving a subfolder between sections.

## APIs and assumptions

- Sanity weak references (`weak: true`) let a referenced document be deleted; the reference then resolves to null. The image service's `rect`-free `fit=crop` with `crop=focalpoint` and `fp-x`/`fp-y` crops around a point (as `urlFor(...).fit('crop')` does with a hotspot).
- An asset's id carries its size (`image-…-3000x2000-jpg`), so a piece's width at the row's height needs no request (as full screen's `originalSize`).
- `history.pushState`, `replaceState` and `popstate`; Astro's `getStaticPaths` for the subfolder pages. The fixture build lists no content, so subfolder pages are checked through `subfolderPaths` (unit) and through Preview (e2e), whose fixtures gain subfolders.

## Non-functional requirements

- Row pictures come from a `srcset` of three heights (240, 480, 960), so the browser fetches about the row's height for its screen.
- New pure logic (`folders.ts`, the editor helpers) is mutation tested: 98.8% (250 of 253). The three survivors are equivalent: the sort only reads "less than", and a stray entry in an empty list is dropped as having no picture.

## Delivery

- Plan item: design-portfolio-folders (PR 194). Star makes the subfolders after it's live; until then every piece is loose and the page reads as folders with large pieces.

## Risks and decisions

- The fixture build stays empty; history is tested in jsdom against `window.history`, and the built pages through `subfolderPaths`.
- `featured` (the hidden switch) stays ignored, as site-search decided.
- **INDEX** is `#e88ab9`, a lighter highlighter pink than the mock-ups' `#d9579b`: ink on `#d9579b` is about 3.6:1, enough only for large text, and on a phone **INDEX** is 1.1rem. Ink on `#e88ab9` is about 5.9:1.
- The tabs are in the page's flow, their first line over the folder above; a tab that wraps (at 200% text, or a long name on a phone) pushes its own folder down. Placed absolutely, a tall tab covered the folder above and took its clicks.
- The editor's parts (a subfolder's Section once published, the Grid size line, a piece's Subfolders choice and the note when unticking a section, the publish tidy-up and the delete confirmation) build, and their words and rules are unit tested; they're checked by hand in the editor, which the tests can't sign in to.
- Existing tests that name the filter bar, the 500 × 500 thumbnails, `openedSection` or a turn order through a section's subfoldered pieces are unlocked and listed here with the reason.
