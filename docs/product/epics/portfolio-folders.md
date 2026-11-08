---
id: epic-portfolio-folders
status: approved
derived-from:
  - requirements-portfolio#REQ-portfolio-1: 20b0305c93fb
  - requirements-portfolio#REQ-portfolio-2: bb6500e04b36
  - requirements-portfolio#REQ-portfolio-3: 89d1e8f7decb
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
  - persona-commission-client#goals: 94a5f248cb6c
---

# The portfolio as folders, with subfolders

<!-- docs/product/epics/portfolio-folders.md. From the lead's request to revisit the Portfolio page with
Star's original concept (2026-11-08, docs/design/mockups/portfolio-folders/0-star-concept.jpg). Lead's
choices (2026-11-08): arrows stay as the site's other arrows (design-arrows), to revisit with Star later
for the whole site; the "Portfolio" title and its subtitle stay, for consistency across the site; Featured
stays the top folder; the filter buttons go; any folder can have subfolders; INDEX shows only inside a
subfolder. Then (2026-11-08): a subfolder belongs to one folder; a subfolder has its own address; Star
chooses each subfolder's grid size; the widest pieces are taken to be 16:9. -->

## Outcome

The Portfolio page looks like Star's concept: each section is a kraft-paper file folder with a tab, and its pieces show large, at their own shape, in a strip that fills the folder. Star can gather pieces in any folder into subfolders, such as the fandoms in Fan Work or the clients in Past Clients. A subfolder shows in its folder as one thumbnail gathering a few of its pieces into a grid; opening it shows its pieces in the folder, with the subfolder's name on the tab and a pink **INDEX** tab that goes back to the folder's top level.

## Personas

- persona-fan: arrives from a social post, usually on a phone, and wants to see more of Star's art (#goals). Today the pieces are small square crops in mostly empty bands; large pictures at their own shape show the art as Star made it. A fan who follows one fandom can open its subfolder and see only those pieces.
- persona-commission-client: compares artists from examples of similar work (#goals). Subfolders in Past Clients (one per client or kind of job) and in Fan Work (one per fandom) let them find the kind of piece they want.
- persona-artist: Star designed this page (the concept) and wants the work presented in their own style (#goals). Star makes subfolders and puts pieces in them in the editor, as they choose a piece's sections now, without a developer.

## Stories

Each is written as its own story file, and approved, before work on it starts. Written stories show their id.

1. **Browse the folders** (`story-portfolio-folders-browse-the-folders`). As a fan, I want to look through the Portfolio's folders with each piece shown large and uncropped, so that I see Star's art as they made it.
2. **Open a subfolder** (`story-portfolio-folders-open-a-subfolder`). As a fan, I want to open a subfolder, such as one fandom in Fan Work, and see only its pieces, then go back to the whole folder, so that I can follow what I came for.
3. **Put pieces in subfolders** (`story-portfolio-folders-put-pieces-in-subfolders`). As Star, I want to make subfolders in a folder and put pieces in them, in the editor, so that the Portfolio groups my work the way I think of it.

## Changes to the requirements

- REQ-portfolio-2 (the category filter) goes: the folders are the page, one scroll apart, and **INDEX** goes back up from a subfolder.
- REQ-portfolio-3 (scrolling a section) stays, with larger pictures at their own shape and the site's arrows (design-arrows).
- REQ-portfolio-1 gains subfolders: a folder shows its subfolders and its pieces not in a subfolder.

## Dependencies

- **The full-screen view** (epic-portfolio-full-screen) moves through "the pieces of the section the piece was opened from, as filtered". With the filter gone, that becomes the pieces of the folder, or of the subfolder when one is open. A design question for story 2.
- **The editor** (design-organised-editor): **Art** gains subfolders as items of their own, and a piece's fields gain the subfolders it's in; the "Portfolio sections" field stays.
- **Star's guide** `editing-your-site.md` and the fans' guide `viewing-artwork.md` change with it; both are existing guides.
- **The Portfolio's link preview** (design-site-search): the first piece in Featured, unchanged.

## Out of scope

- The arrow style (stays as design-arrows for now; the lead and Star may revisit arrows across the site later).
- The page title and subtitle (unchanged).
- The **Featured** section itself (it stays the top folder, decided 2026-11-06 and again 2026-11-08).
- Subfolders inside subfolders (one level only).
- Sorting pieces by hand, and tags as filters.
- The site header in the concept image, which shows an older menu.

## Decisions from the lead (2026-11-08)

1. **A subfolder belongs to one folder.** A piece in several folders can be in a subfolder in one and loose in another: a Murderbot piece sits in Fan Work's Murderbot subfolder and loose in Featured.
2. **A subfolder has its own address**, so a fan can share or bookmark it, and the browser's Back button leaves it.
3. **Star chooses each subfolder's grid size** for its thumbnail, from a few options (such as 2 × 2 and 3 × 3). So a subfolder is an item Star creates in the editor, with its name, its folder and its grid size, rather than a name typed on each piece.
4. **The widest pieces are taken to be 16:9.** A folder's row is as tall as a 16:9 piece needs to fill the screen's width on a phone; taller pieces are narrower at the same height.

## Open questions

1. How are subfolders ordered among a folder's loose pieces (by their newest piece, or by name), and which pieces fill a grid (the newest)? Design questions for stories 1 and 2.
2. How tall is a row on a computer (Star's concept is about 480 pixels at 1380 wide)? A design question for story 1.
