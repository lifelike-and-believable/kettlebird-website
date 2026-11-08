---
id: design-portfolio-folders
status: draft
derived-from:
  - epic-portfolio-folders#outcome: 0a70fc8bd1ef
  - epic-portfolio-folders#decisions-from-the-lead-2026-11-08: e4efe797da18
  - story-portfolio-folders-browse-the-folders: a8fb25e025c8
  - story-portfolio-folders-open-a-subfolder: 5ed224b1ccb6
  - story-portfolio-folders-put-pieces-in-subfolders: a33252fee277
  - design-arrows#the-change: 5c138b2911e2
  - design-portfolio-full-screen#how-it-works: a1a71c5c3e3f
  - design-organised-editor#sections-and-fields: 20d25885468d
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-artist#goals: f3044c738f84
  - persona-commission-client#goals: 94a5f248cb6c
---

# The portfolio as folders, with subfolders: design

<!-- docs/design/portfolio-folders.md. Design for epic-portfolio-folders, stories 1 to 3, from Star's original
concept (mock-up 0) and the lead's choices (2026-11-08, in the epic). Mock-ups are in
docs/design/mockups/portfolio-folders/: PNG images, mockups.html (their source, built from the site's own fonts,
colours, paper and arrow buttons, with Star's real pieces) and render.mjs. 0-star-concept.jpg is Star's concept;
6-today-laptop.png is a screenshot of the page today. -->

## Personas

- persona-fan: arrives from a social post, usually on a phone, and decides within seconds (#skills-and-tools). Today a piece is a 200-pixel square crop in a band that is mostly empty kraft (mock-up 6). Here a piece fills the phone's width when it's 16:9 and stands at its own shape at 480 pixels tall on a computer (mock-ups 1 and 4). A fan who came for one fandom opens its subfolder and sees only that (mock-ups 3 and 5), and can share its address.
- persona-commission-client: compares artists from examples (#goals). Subfolders in Past Clients (a client, or a kind of job) and Fan Work (a fandom) let them find the kind of piece they want without scrolling past the rest.
- persona-artist: Star drew this page (mock-up 0) and wants the work shown in their own style (#goals). In the editor Star makes a subfolder once (name, folder, grid size) and ticks it on each piece (mock-up 7); nothing needs a developer.

## Decisions from the lead (2026-11-08)

From the epic: the arrows stay the site's (design-arrows); the "Portfolio" title and subtitle stay; Featured stays the top folder; the filter buttons go; any folder can have subfolders; **INDEX** shows only inside a subfolder; a subfolder belongs to one folder, so a piece can be in a subfolder in one folder and loose in another; a subfolder has its own address; Star chooses each subfolder's grid size; the widest pieces are taken to be 16:9.

## How it works

### The page (mock-ups 1 and 4)

- The header, title "Portfolio" and subtitle as today. The filter buttons and the pink "Index" label above them go.
- One folder per Portfolio section that has pieces, in the order today: Featured, Original Work, Fan Work, Past Clients, Work in Progress.
- **A folder** is kraft paper (the band's colour and texture today) with a **tab** at its top edge: the same kraft, slightly rounded top corners and sloped sides, the folder's name in DM Mono (the site's typewriter face), 2.6rem on a computer and 1.35rem on a phone. Tabs alternate sides: Featured's on the right, the next on the left, and so on. Each folder overlaps the one above it a little, with a faint shadow along its top edge, so the page reads as a stack of folders. The torn-paper seam and the highlighter labels of today go.

### The row (mock-ups 1, 2 and 4)

- A folder's pieces sit in one row, each **at its own shape** (no square crop), all at the row's height, with a thin paper-coloured edge and a soft shadow, as in Star's concept.
- **The row's height** is set by the widest pieces, taken to be 16:9: it's 9/16 of the row's width, but never more than 480 pixels. On a 390-pixel phone that's about 200 pixels, so a 16:9 piece fills the width and a portrait piece shows beside part of the next (mock-up 4); on a computer it's 480 pixels, as in Star's concept (mock-up 1). A piece wider than 16:9 is shown at the row's height and is wider than the screen on a phone; the row scrolls to it.
- The row runs to the folder's edges, so pieces at either end are cut off, showing there's more.
- **Order:** newest first by date, as today. A subfolder takes the place of its newest piece among the loose pieces.
- **Arrows:** the site's arrow buttons (design-arrows, 44 pixels, ink on beige, dashed when they can't be used), one at each end of the row. On a computer they sit over the row's ends, vertically centred; on a phone they sit under the row, at its left and right, so the pieces keep the full width. Each moves the row by most of its width. Touch, trackpad and the keyboard scroll the row too, as today.
- **Pictures** are fetched at the row's height for the screen (and twice that on sharp screens), and those off screen load as they come near.
- Choosing a piece opens its dialog, as today, and full screen from there (design-portfolio-full-screen).

### Subfolders (mock-ups 2, 3 and 5)

- **A subfolder's thumbnail** is a square at the row's height: a grid of its newest pieces, each cropped to fill its cell, at the grid size Star chose (2 × 2, 3 × 3 or 4 × 4), with the subfolder's name under the grid in DM Mono. A subfolder with fewer pieces than cells shows paper-coloured empty cells for the rest. A subfolder with no published pieces doesn't show.
- **Opening a subfolder:** choosing its thumbnail shows its pieces in the folder's row, in place of the folder's top level; the folder's tab reads the subfolder's name ("Murderbot"), and a pink **INDEX** tab appears beside it (mock-up 3). Choosing **INDEX** goes back to the folder's top level. At the top level there's no **INDEX** tab.
- Opening a subfolder changes only that folder; the page doesn't move.
- **Its address:** each subfolder has one, `/portfolio/<folder>/<subfolder>` (for example `/portfolio/fan-work/murderbot`), built ahead of time like every page. Choosing a thumbnail changes the address without reloading the page, so the browser's Back button goes back to the folder's top level, and sharing or bookmarking the address opens the Portfolio with that subfolder open, scrolled to its folder. **INDEX** goes back to `/portfolio`.
- **Full screen** from a piece in an open subfolder turns through that subfolder's pieces. From a loose piece at a folder's top level, it turns through that folder's loose pieces, in the row's order.

### What Star does in the editor (mock-up 7)

- **Art** lists **Pieces** (today's list) and **Subfolders**, a new list. A subfolder has:
  - **Name** (required): shown under its thumbnail and on the folder's tab when it's open. Its address comes from it.
  - **Folder** (required): one of the Portfolio sections (Featured, Original Work, Fan Work, Past Clients, Work in Progress).
  - **Grid size**: 2 × 2, 3 × 3 or 4 × 4; 2 × 2 at first.
  - Its row in the list shows its folder, grid size and how many pieces it has: "Fan Work · 2 × 2 · 6 pieces".
- A piece gains **Subfolders**, after **Portfolio sections**: optional, at most one subfolder in each section the piece is in, chosen from that section's subfolders. Left empty in a section, the piece is loose there. The help text: "Optional. At most one in each section this piece is in. Left empty in a section, the piece sits loose there."
- Taking a piece out of a section takes it out of that section's subfolder; the editor says so before publishing ("Removing Fan Work also takes this piece out of Murderbot.").
- Deleting a subfolder leaves its pieces loose in its folder; the editor says how many pieces it holds first. Renaming a subfolder renames it everywhere, and its address follows the new name.
- **Preview** of a subfolder shows the Portfolio with it open (design-preview).

## Mock-ups

Built from the site's own fonts, colours, paper and arrow buttons, with Star's real pieces (four from the live site, four of the site's own pictures). Pieces repeat to fill the example subfolders; the real subfolders are Star's to make. Source: `mockups/portfolio-folders/mockups.html`.

| #   | What it shows                                                                                            | File                                                    |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 0   | Star's original concept                                                                                  | `mockups/portfolio-folders/0-star-concept.jpg`          |
| 1   | On a computer: title and subtitle, then Featured and Original Work at 480 pixels, tabs alternating sides | `mockups/portfolio-folders/1-folders-laptop.png`        |
| 2   | Fan Work's top level: two subfolders (2 × 2 and 3 × 3) and a loose piece                                 | `mockups/portfolio-folders/2-subfolders-laptop.png`     |
| 3   | Murderbot open: its name on the tab, **INDEX** beside it, its address, what a screen reader hears        | `mockups/portfolio-folders/3-subfolder-open-laptop.png` |
| 4   | On a phone: a 16:9 piece fills the width; the arrows sit under the row                                   | `mockups/portfolio-folders/4-folders-phone.png`         |
| 5   | On a phone, a subfolder open                                                                             | `mockups/portfolio-folders/5-subfolder-open-phone.png`  |
| 6   | Today, for comparison                                                                                    | `mockups/portfolio-folders/6-today-laptop.png`          |
| 7   | The editor (illustration): Art's Subfolders list, a subfolder's fields, a piece's Subfolders field       | `mockups/portfolio-folders/7-editor.png`                |

## Where it applies

| #   | Where                                                                                                                            | After                                                                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/components/GalleryGrid.tsx`, `src/components/pages/PortfolioPage.astro`                                                     | Folders with tabs; rows at the row's height with pieces at their own shape; subfolder thumbnails; **INDEX**; no filter; arrows as above. |
| 2   | `src/pages/portfolio/[folder]/[subfolder].astro` (new)                                                                           | One page per subfolder, the Portfolio with it open; canonical address its own, in the sitemap (design-site-search).                      |
| 3   | `src/lib/queries.ts` and a new pure module for the folders' contents                                                             | Subfolders read with their pieces; rows built (order, which pieces go in a grid, loose pieces).                                          |
| 4   | `src/lib/portfolio/full-screen.ts`                                                                                               | The turn order from an open subfolder, or from a folder's loose pieces.                                                                  |
| 5   | The editor: `sanity-studio/schemas` (a new subfolder type; the piece's Subfolders), `lib/editor-content.ts`, the **Art** section | As "What Star does in the editor".                                                                                                       |
| 6   | The preview route                                                                                                                | A subfolder's Preview.                                                                                                                   |
| 7   | Star's guide `editing-your-site.md`; the fans' guide `viewing-artwork.md`                                                        | As For the guides.                                                                                                                       |
| 8   | `docs/product/requirements/portfolio.md`                                                                                         | REQ-portfolio-2 retired; REQ-portfolio-1 and -3 updated (epic, Changes to the requirements).                                             |
| 9   | `docs/STYLE_GUIDE.md` and the Kettlebird design system                                                                           | The folder, its tab and the subfolder thumbnail.                                                                                         |

## States and errors

| Situation                                           | What happens                                                                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| A section with no pieces                            | No folder.                                                                                                                  |
| No pieces at all                                    | The page's empty message, as today.                                                                                         |
| A folder with only subfolders                       | Its row shows their thumbnails.                                                                                             |
| A subfolder with fewer pieces than cells            | Paper-coloured empty cells for the rest.                                                                                    |
| A subfolder with no published pieces                | Not shown; its address shows **Page not found**.                                                                            |
| A piece wider than 16:9                             | At the row's height, wider than the screen on a phone; the row scrolls to it.                                               |
| A subfolder's address after it's renamed or deleted | **Page not found**, with a link to the Portfolio.                                                                           |
| Without scripts                                     | Folders and rows show; a subfolder's thumbnail is a link to its address, which shows it open, and **INDEX** is a link back. |
| A piece in Featured and in Fan Work's Murderbot     | Loose in Featured; in Murderbot in Fan Work.                                                                                |

## Accessibility

- Each folder is a region named by its folder's name; when a subfolder is open, by "Fan Work: Murderbot".
- A subfolder's thumbnail is a link named "Murderbot, 6 pieces"; its grid pictures are decorative (`alt=""`).
- Opening a subfolder announces "Fan Work: Murderbot, 6 pieces." and moves focus to its first piece; **INDEX**, a link named "Index: back to Fan Work", returns focus to the subfolder's thumbnail.
- Every piece keeps its alt text; the arrows keep their names and their "can't be used" state (design-arrows).
- At 200% zoom and on 320-pixel screens nothing scrolls sideways but the rows; tabs wrap their words rather than run off the screen.
- The tab's text is ink on kraft (above 4.5:1); **INDEX** is ink on the site's magenta, as the label today.

## For the guides

- `editing-your-site.md` (Star's; existing, so the help menu needs nothing new): a new section, "Subfolders", saying what a subfolder is and where it shows; how to make one (**Art**, **Subfolders**, +, name, folder, grid size, **Publish**); how to put a piece in it (the piece's **Subfolders**); that a piece can be loose in one section and in a subfolder in another; renaming and deleting; and that the address follows the name, so a shared link to a renamed subfolder stops working.
- `viewing-artwork.md` (fans'): the folders, rows and arrows; subfolders, **INDEX** and Back; full screen in a subfolder.

## For the spec to check

- The folders: order, tabs alternating, no filter buttons, title and subtitle unchanged.
- The row's height: 9/16 of its width, at most 480 pixels; pieces at their own shape at that height; the arrows' places on a phone and a computer.
- Subfolder thumbnails: grid sizes, newest pieces, empty cells, names, their place in the order.
- Opening and closing: the tab's name, **INDEX** shown only when open, the address, Back, a shared address, without scripts.
- Full screen's order from a subfolder and from loose pieces.
- The editor: the subfolder type and its fields, the piece's Subfolders field and its limits, the messages when removing a section or deleting a subfolder, Preview.
- Accessibility as above; the axe check.
- The sitemap includes subfolder addresses (design-site-search).

## Decisions at review

Proposed, for the lead to confirm or change:

1. **Row height:** 9/16 of the row's width, at most 480 pixels (Star's concept).
2. **Arrows' places:** over the row's ends on a computer; under the row on a phone, so the pieces keep the full width.
3. **Grid sizes:** 2 × 2, 3 × 3 or 4 × 4, with 2 × 2 at first; the newest pieces fill the grid; empty cells are paper-coloured.
4. **Order:** a subfolder sits where its newest piece would, among the loose pieces.
5. **The tab when open:** the subfolder's name alone ("Murderbot"), with **INDEX** beside it; the screen reader hears "Fan Work: Murderbot".
6. **Addresses:** `/portfolio/<folder>/<subfolder>`, from the folder's and subfolder's names; renaming a subfolder changes its address.
7. **Full screen** from a loose piece turns through the folder's loose pieces only, skipping subfolders.

## Persona walkthrough

To come.
