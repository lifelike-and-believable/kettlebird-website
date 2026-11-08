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
- persona-artist: Star drew this page (mock-up 0) and wants the work shown in their own style (#goals). In the editor Star makes a subfolder once (name, section, grid size; mock-up 7) and chooses it on each piece (mock-up 8); nothing needs a developer.

## Decisions from the lead (2026-11-08)

From the epic: the arrows stay the site's (design-arrows); the "Portfolio" title and subtitle stay; Featured stays the top folder; the filter buttons go; any folder can have subfolders; **INDEX** shows only inside a subfolder; a subfolder belongs to one folder, so a piece can be in a subfolder in one folder and loose in another; a subfolder has its own address; Star chooses each subfolder's grid size; the widest pieces are taken to be 16:9.

At the first look at the mock-ups (2026-11-08): the tabs' corners are rounded a little more, and the folders and tabs have a subtle contact shadow, so each folder stands apart from the one behind it. Then: the tabs keep a slight slant to their sides, as in the first mock-ups, with the rounded corners.

## How it works

### The page (mock-ups 1 and 4)

- The header, title "Portfolio" and subtitle as today. The filter buttons and the pink "Index" label above them go.
- One folder per Portfolio section that has pieces, in the order today: Featured, Original Work, Fan Work, Past Clients, Work in Progress.
- **A folder** is kraft paper (the band's colour and texture today) with a **tab** at its top edge: the same kraft, sides slanting in slightly and top corners rounded (22 pixels on a computer, 14 on a phone; drawn by tilting the tab's paper back a little in perspective, so the slant and the rounding go together), the folder's name in DM Mono (the site's typewriter face), 2.6rem on a computer and 1.35rem on a phone.
- **Each section's tab has a fixed side:** Featured right, Original Work left, Fan Work right, Past Clients left, Work in Progress right. They alternate down the page when every section has pieces; a section with no pieces leaves its neighbours' sides as they are, so a folder never jumps sides when another empties.
- **Shadows:** each folder overlaps the one above it a little. Its top edge and its tab have a thin contact line (`0 -1px 0` at 16% ink) and a soft shadow cast upward onto the folder behind (`0 -6px 12px -4px` at 28% ink); the tab also casts a little to each side. So the page reads as a stack of folders. The torn-paper seam and the highlighter labels of today go.

### The row (mock-ups 1, 2 and 4)

- A folder's pieces sit in one row, each **at its own shape** (no square crop), all at the row's height, with a thin paper-coloured edge and a soft shadow, as in Star's concept.
- **The row's height** is set by the widest pieces, taken to be 16:9: it's 9/16 of the row's width, but never more than 480 pixels. On a 390-pixel phone that's about 200 pixels, so a 16:9 piece fills the width; a portrait piece (3:4) is about 150 by 200 pixels and shows beside part of the next (mock-up 4). On a computer the row is 480 pixels, as in Star's concept (mock-up 1).
- **A piece wider than 16:9** is shown whole at the row's height, so on a phone it's wider than the screen; the row scrolls along it like any other piece (mock-up 13).
- The row runs to the folder's edges, so pieces at either end are cut off, showing there's more.
- **Order:** newest first by date, as today; pieces with no date come last. A subfolder takes the place of its newest piece among the loose pieces.
- **Arrows:** the site's arrow buttons (design-arrows, 44 pixels, ink on beige), one at each end of the row. On a computer they sit over the row's ends, vertically centred; on a phone they sit under the row, at its left and right, so the pieces keep the full width. Each moves the row by most of its width. Touch, trackpad and the keyboard scroll the row too, as today.
- **New: the arrows' "can't be used" state.** At the start of the row the left arrow is dashed and out of reach (design-arrows' "can't be used" look, `aria-disabled`, skipped by Tab); at the end, the right one. A row that fits without scrolling shows both as can't be used. This changes design-arrows' "Where it applies" item 3, where the carousel had no such state; the lead's decision to keep the arrows as the site's is unchanged.
- **Pictures** are fetched at the row's height for the screen (and twice that on sharp screens), and those off screen load as they come near.
- Choosing a piece opens its dialog, as today, and full screen from there (design-portfolio-full-screen).

### Subfolders (mock-ups 2, 3, 5 and 12)

- **A subfolder's thumbnail** is a square at the row's height: a grid of its newest pieces, each cropped to fill its cell around the point Star chose with the picture's hotspot (the circle in the picture's **Edit**; the centre if none), at the grid size Star chose (2 × 2, 3 × 3 or 4 × 4), with the subfolder's name under the grid in DM Mono. A subfolder with fewer pieces than cells shows paper-coloured empty cells for the rest. A subfolder with no published pieces doesn't show.
- **On a phone** the grid shows at most 2 × 2, whatever Star chose: a 3 × 3 cell would be about 60 pixels. The name under it also gives the count, "Book covers · 3", since the grid no longer shows them all (mock-up 12). A long name wraps, on the thumbnail and on the tab.
- **Opening a subfolder:** choosing its thumbnail shows its pieces in the folder's row, in place of the folder's top level, scrolled to the start; the folder's tab reads the subfolder's name ("Murderbot"), and a pink **INDEX** tab appears beside it, on the tab's inner side (mock-up 3). Choosing **INDEX** goes back to the folder's top level, scrolled to the subfolder's thumbnail. At the top level there's no **INDEX** tab.
- **One subfolder open at a time** on the page. Opening a subfolder in another folder closes the open one (its folder goes back to its top level). Opening one changes only those folders; the page doesn't move.
- **Its address:** each subfolder has one, `/portfolio/<folder>/<subfolder>` (for example `/portfolio/fan-work/murderbot`), built ahead of time like every page. The folders' parts are fixed: `featured`, `original-work`, `fan-work`, `past-clients`, `work-in-progress`. The subfolder's part is its **Web address** in the editor, made from its name when it's first made and kept when it's renamed, as a series' is (design-organised-editor), so a renamed subfolder's shared links keep working.
- **History:**
  - Opening a subfolder adds a step to the browser's history, with the subfolder's address.
  - **INDEX** goes back one step when the step before is the Portfolio's top level (so Back afterwards doesn't reopen it); otherwise (the page was opened at the subfolder's address) it replaces the step with `/portfolio`.
  - Back and Forward show what the address says: the subfolder open, or every folder at its top level. If a piece's dialog or full screen is open, Back closes it first, as today; full screen's own step on an iPhone (design-portfolio-full-screen) is unchanged.
  - Sharing or bookmarking a subfolder's address opens the Portfolio with that subfolder open, scrolled to its folder.
- **Its page:** the title is "Murderbot · Fan Work · Portfolio • Kettlebird Creations"; the description, "Star's Murderbot pieces, in Fan Work: 4 pieces."; the link-preview picture is its newest piece, whole, on paper, as a series' cover is (design-site-search). It's in the sitemap.
- **Full screen** from a piece in an open subfolder turns through that subfolder's pieces, and the count reads "3 of 4 · Murderbot". From a loose piece at a folder's top level, it turns through that folder's loose pieces, in the row's order, and the count reads "3 of 12" as today.

### What Star does in the editor (mock-ups 7, 8 and 9)

- **Art** becomes a menu of two lists, **Pieces** (today's list) and **Subfolders** (new), as Comics lists its series and chapters (design-organised-editor).
- **A subfolder** (mock-up 7) has:
  - **Name** (required): shown under its thumbnail and on the section's tab when it's open.
  - **Web address** (required): made from the name, editable, unique within its section; "Leave it as it is once people may have shared links to it."
  - **Section** (required): a choice of the five Portfolio sections. It's set when Star first publishes the subfolder and can't be changed afterwards: "Set when you make it; to move pieces to another section, make a subfolder there." (Changing it would leave its pieces in a subfolder of a section they aren't in.)
  - **Grid size**: 2 × 2, 3 × 3 or 4 × 4; 2 × 2 at first. Its help says how many pieces the subfolder holds: "Murderbot has 4 pieces: 2 × 2 shows them all."
  - Its row in the list shows its section, grid size and how many pieces it has: "Fan Work · 2 × 2 · 4 pieces".
- **A piece** (mock-up 8) gains **Subfolders**, after **Portfolio sections**: one choice for each section the piece is in, offering that section's published subfolders, or **Loose**. A section with none says "Loose (no subfolders yet)". Help: "Optional. At most one in each section this piece is in. Left as Loose, the piece shows on its own in that section."
- **Unticking a section** that the piece has a subfolder in shows, under the field, "If you untick Fan Work, this piece also leaves Murderbot when you publish." The note stays until the piece is published.
- A piece's row in the Pieces list shows its sections and subfolders: "Fan Work, Featured · Murderbot".
- **Deleting a subfolder** (mock-up 9) asks first: "Delete Murderbot? Its 4 pieces stay in Fan Work, shown on their own. Its web address stops working: links people shared to it will show Page not found." The pieces' choices of it are cleared.
- **Preview** of a subfolder shows the Portfolio with it open, drafts included (design-preview). With no pieces yet, the folder says "No pieces in Murderbot yet. Put pieces in it from each piece's Subfolders." (mock-up 10). Preview of a piece in a subfolder opens that subfolder, with the piece in view.
- **Help:** the subfolder type gets its own help link to the guide's "Subfolders" section (`ITEM_HELP`), with its fields' help as above. The **Picture** field's help changes: "Upload the original file; the site makes smaller copies. Pieces show whole; in a subfolder's grid they're cropped square. To keep the important part in view there, choose the picture's Edit button, then drag the circle over the part that matters."
- Changes reach the site with the next update after **Publish**, as everything else (going-live).

## Mock-ups

Built from the site's own fonts, colours, paper and arrow buttons, with Star's real pieces (four from the live site, four of the site's own pictures). Pieces repeat to fill the example subfolders; the real subfolders are Star's to make. Frames 7 to 9 are illustrations of the editor, drawn to show the fields and words, not screenshots. Source: `mockups/portfolio-folders/mockups.html`.

| #   | What it shows                                                                                                      | File                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 0   | Star's original concept                                                                                            | `mockups/portfolio-folders/0-star-concept.jpg`              |
| 1   | On a computer: title and subtitle, then Featured (tab right) and Original Work (tab left) at 480 pixels            | `mockups/portfolio-folders/1-folders-laptop.png`            |
| 2   | Fan Work's top level (tab right): two subfolders (2 × 2 and 3 × 3) and a loose piece; the left arrow can't be used | `mockups/portfolio-folders/2-subfolders-laptop.png`         |
| 3   | Murderbot open: its name on the tab, **INDEX** beside it, its address, what a screen reader hears                  | `mockups/portfolio-folders/3-subfolder-open-laptop.png`     |
| 4   | On a phone: a 16:9 piece fills the width; the arrows sit under the row                                             | `mockups/portfolio-folders/4-folders-phone.png`             |
| 5   | On a phone, a subfolder open                                                                                       | `mockups/portfolio-folders/5-subfolder-open-phone.png`      |
| 6   | Today, for comparison                                                                                              | `mockups/portfolio-folders/6-today-laptop.png`              |
| 7   | The editor: Art's Subfolders list and a subfolder's fields (Name, Web address, Section, Grid size)                 | `mockups/portfolio-folders/7-editor.png`                    |
| 8   | The editor: a piece's Subfolders, one choice per section, and the note when unticking a section                    | `mockups/portfolio-folders/8-piece-subfolders.png`          |
| 9   | The editor: deleting a subfolder                                                                                   | `mockups/portfolio-folders/9-delete-subfolder.png`          |
| 10  | Preview of a subfolder with no pieces yet                                                                          | `mockups/portfolio-folders/10-preview-empty-subfolder.png`  |
| 11  | A subfolder's address after it's deleted, on a phone: Page not found                                               | `mockups/portfolio-folders/11-page-not-found-phone.png`     |
| 12  | A 320-pixel phone: a long name wraps on the tab; a grid capped at 2 × 2 with its count                             | `mockups/portfolio-folders/12-long-name-320.png`            |
| 13  | A piece wider than 16:9 on a phone                                                                                 | `mockups/portfolio-folders/13-wide-piece-phone.png`         |

## Where it applies

| #   | Where                                                                                                                                                                     | After                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/components/GalleryGrid.tsx`, `src/components/pages/PortfolioPage.astro`                                                                                              | Folders with tabs on fixed sides and shadows; rows at the row's height with pieces at their own shape; subfolder thumbnails; **INDEX**; history; no filter. |
| 2   | The carousel's arrows (`FolderCarousel`), `docs/design/arrows.md` item 3                                                                                                  | The "can't be used" state at the row's ends; design-arrows' item 3 amended to say so.                                                                       |
| 3   | `src/pages/portfolio/[folder]/[subfolder].astro` (new)                                                                                                                    | One page per subfolder, the Portfolio with it open; its title, description, link preview and canonical address; in the sitemap (design-site-search).       |
| 4   | `src/lib/queries.ts` and a new pure module for the folders' contents                                                                                                      | Subfolders read with their pieces; rows built (order, undated last, which pieces go in a grid, loose pieces); the folders' address parts.                    |
| 5   | `src/lib/portfolio/full-screen.ts`                                                                                                                                        | The turn order from an open subfolder, or from a folder's loose pieces; the count with the subfolder's name.                                               |
| 6   | The editor: `sanity-studio/schemas` (a new subfolder type; the piece's Subfolders), the Art menu in the structure, `lib/editor-content.ts` (`SECTIONS`, `FIELDS`, `ITEM_NAMES`), `lib/help.ts` (`ITEM_HELP`) | As "What Star does in the editor".                                                                                                                          |
| 7   | The preview route                                                                                                                                                         | A subfolder's Preview, and a piece's in its subfolder.                                                                                                     |
| 8   | Star's guide `editing-your-site.md`; the fans' guide `viewing-artwork.md`                                                                                                 | As For the guides.                                                                                                                                          |
| 9   | `docs/product/requirements/portfolio.md`                                                                                                                                  | REQ-portfolio-2 retired; REQ-portfolio-1 and -3 updated (epic, Changes to the requirements).                                                                |
| 10  | `docs/STYLE_GUIDE.md` and the Kettlebird design system                                                                                                                    | The folder, its tab and shadows, and the subfolder thumbnail.                                                                                               |

## States and errors

| Situation                                                | What happens                                                                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| A section with no pieces                                 | No folder; the other tabs keep their sides.                                                                                                       |
| No pieces at all                                         | The page's empty message, as today.                                                                                                               |
| A folder with only subfolders                            | Its row shows their thumbnails.                                                                                                                   |
| A row that fits without scrolling                        | Both arrows can't be used.                                                                                                                        |
| A subfolder with fewer pieces than cells                 | Paper-coloured empty cells for the rest.                                                                                                          |
| A subfolder with no published pieces                     | Not shown; its address shows **Page not found**. In Preview, the folder says how to fill it (mock-up 10).                                          |
| A piece wider than 16:9                                  | Whole at the row's height, wider than the screen on a phone; the row scrolls along it (mock-up 13).                                               |
| A piece with no date                                     | After the dated pieces.                                                                                                                           |
| A subfolder renamed                                      | Its name changes everywhere; its address stays, so shared links work.                                                                             |
| A subfolder deleted, or its address changed              | Its pieces are loose in its folder; its old address shows **Page not found**, with a link to the Portfolio (mock-up 11).                         |
| A piece taken out of a section                           | It leaves that section's subfolder too, when published; the editor says so first (mock-up 8).                                                     |
| Without scripts                                          | Folders and rows show; a subfolder's thumbnail is a link to its address, which shows it open, and **INDEX** is a link to `/portfolio`.            |
| A piece in Featured and in Fan Work's Murderbot          | Loose in Featured; in Murderbot in Fan Work.                                                                                                      |
| A 320-pixel screen, or text at 200%                      | Tabs wrap their words; grids show at most 2 × 2 with the count under them (mock-up 12); nothing scrolls sideways but the rows.                    |

## Accessibility

- Each folder is a region named by its folder's name; when a subfolder is open, by "Fan Work: Murderbot".
- A subfolder's thumbnail is a link named "Murderbot, 4 pieces"; its grid pictures are decorative (`alt=""`).
- Opening a subfolder announces "Fan Work: Murderbot, 4 pieces." and moves focus to its first piece; **INDEX**, a link named "Index: back to Fan Work", returns focus to the subfolder's thumbnail. After Back or Forward, the change is announced the same way and focus stays where it was.
- Every piece keeps its alt text; the arrows keep their names, and gain the "can't be used" state at the row's ends (`aria-disabled`, skipped by Tab).
- At 200% zoom and on 320-pixel screens nothing scrolls sideways but the rows; tabs wrap their words rather than run off the screen.
- The tab's text is ink on kraft (above 4.5:1); **INDEX** is ink on the site's magenta, as the label today. The shadows carry no meaning.

## For the guides

- `editing-your-site.md` (Star's; existing, so the help menu needs nothing new beyond the subfolder type's link):
  - **Art** now has two lists, **Pieces** and **Subfolders**.
  - A new section, "Subfolders": what a subfolder is and where it shows; how to make one (**Art**, **Subfolders**, +, name, section, grid size, **Publish**); publish the subfolder before choosing it on pieces, since a piece offers only published subfolders; how to put a piece in it (the piece's **Subfolders**); that a piece can be loose in one section and in a subfolder in another; that a subfolder's section can't be changed; renaming (the address stays) and deleting (the pieces stay, loose; shared links stop working); that phones show at most 2 × 2.
  - The **Picture** row's help as above, and the new fields' rows.
- `viewing-artwork.md` (fans'): "Find a piece" loses the filter step (the Index at the top goes) and gains the folders, rows and arrows; subfolders: open one, **INDEX** (the pink tab that goes back to the whole folder), Back, sharing its address; full screen in a subfolder.

## For the spec to check

- The folders: order, each section's fixed tab side, tab corners and shadows, no filter buttons, title and subtitle unchanged.
- The row's height: 9/16 of its width, at most 480 pixels; pieces at their own shape at that height; undated last; the arrows' places on a phone and a computer, and their "can't be used" state.
- Subfolder thumbnails: grid sizes, the 2 × 2 cap and count on a phone, newest pieces, hotspot crops, empty cells, names, their place in the order.
- Opening and closing: the tab's name, **INDEX** shown only when open, one open at a time, the address, history (open adds a step; **INDEX** goes back or replaces; Back and Forward), a shared address, without scripts.
- The subfolder's page: title, description, link preview, sitemap; **Page not found** for a missing one.
- Full screen's order and count from a subfolder and from loose pieces.
- The editor: the Art menu; the subfolder type and its fields (web address unique within its section; section fixed after the first publish); the piece's Subfolders field, its limits and the published-only choices; the note when unticking a section; the delete confirmation; references that let a subfolder be deleted, leaving its pieces loose; Preview; the help link and help texts.
- Accessibility as above; the axe check.

## Decisions at review

Proposed, for the lead to confirm or change:

1. **Row height:** 9/16 of the row's width, at most 480 pixels (Star's concept). On a phone a portrait piece is about 150 by 200 pixels; a taller row (say 260 pixels) makes portrait pieces bigger but crops 16:9 pieces at the sides of the screen.
2. **Arrows' places:** over the row's ends on a computer; under the row on a phone, so the pieces keep the full width.
3. **Grid sizes:** 2 × 2, 3 × 3 or 4 × 4, with 2 × 2 at first; the newest pieces fill the grid; empty cells are paper-coloured; at most 2 × 2 on a phone.
4. **Order:** a subfolder sits where its newest piece would, among the loose pieces.
5. **The tab when open:** the subfolder's name alone ("Murderbot"), with **INDEX** beside it; the screen reader hears "Fan Work: Murderbot". The alternative is "Fan Work: Murderbot" on the tab, which says where you are but is long on a phone.
6. **Addresses:** `/portfolio/<folder>/<subfolder>`, with fixed folder parts and the subfolder's own **Web address**, kept when it's renamed.
7. **Full screen** from a loose piece turns through the folder's loose pieces only, skipping subfolders. The alternative is the loose pieces, then each subfolder's pieces.
8. **The arrows' "can't be used" state** at the row's ends, amending design-arrows item 3.
9. **A subfolder's section** can't be changed after its first publish.

## Persona walkthrough

Run with `rfr-process:persona-walkthrough` for persona-fan, persona-commission-client and persona-artist, on the first draft (2026-11-08). What it found and what changed:

- **Arrows at the row's ends** did nothing and looked usable. They gain the "can't be used" state (decision 8).
- **History** wasn't defined for opening several subfolders, **INDEX**, Back with a dialog open, or a shared address. Now: one subfolder open at a time, and the rules under "History".
- **Preview** of a subfolder and of a piece in one wasn't shown; an empty subfolder would have shown nothing. Now defined, with mock-up 10.
- **Renaming a subfolder broke shared links.** It now has its own **Web address**, kept on rename, and the folders' parts are fixed.
- **The editor screens were missing:** the piece's Subfolders choice, the note when unticking a section, the delete confirmation, and a text box where a choice of five was meant. Mock-ups 8 and 9, and **Section** as a choice; "Section" rather than "Folder", the editor's word.
- **Moving a subfolder to another section** would leave its pieces in a section they aren't in. The section is now fixed after the first publish (decision 9).
- **A piece's Subfolders** could offer an unpublished subfolder; it now offers published ones, and the guide says to publish the subfolder first.
- **Tab sides** alternated by position, so a folder could jump sides when a section emptied, and mock-ups 2, 3 and 5 disagreed. Each section now has a fixed side; the mock-ups match.
- **Counts** disagreed between mock-ups 3 and 7; now 4 pieces throughout.
- **The Picture help** said the portfolio shows square thumbnails; it now says pieces show whole and only subfolder grids are cropped, around the hotspot.
- **The fans' guide** still described the filter; it loses that step and explains **INDEX**.
- **On a phone** a 3 × 3 grid's cells were about 60 pixels; grids are capped at 2 × 2 there, with the count under the name (mock-up 12). A long name and a wide piece now have mock-ups (12 and 13), and so does Page not found (11).
- **The subfolder's page** had no title, description or link preview; now defined. Full screen's count names the subfolder.
- **The help** had no link for the new item type; it gets one in `ITEM_HELP`.
- **Undated pieces** had no place in the order; they come last.
