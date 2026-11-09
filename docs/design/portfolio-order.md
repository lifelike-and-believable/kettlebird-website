---
id: design-portfolio-order
status: approved
derived-from:
  - design-portfolio-folders#subfolders-mock-ups-2-3-5-and-12: 52eada92efe7
  - design-portfolio-folders#what-star-does-in-the-editor-mock-ups-7-8-and-9: 9b3c6d5405c2
  - persona-artist#goals: f3044c738f84
  - persona-fan#goals: 2b047e4cae5d
---

# Oldest first in a subfolder: design

<!-- docs/design/portfolio-order.md. A design amendment from a feature request by the lead (2026-11-09): make the
display order of the pieces in a Portfolio subfolder settable in the editor, newest first or oldest first. The
first request covered the top-level folders too; the lead then decided they don't need it (see the decisions).
Mock-ups are in docs/design/mockups/portfolio-order/. Frame 1 is an illustration of the editor, drawn to show the
field and words, not a screenshot; frames 2 to 5 are the fixture build's Portfolio in Preview, with a subfolder
put in the order this design describes and each piece labelled with its date (the labels are for the mock-ups
only: the site shows no dates in the row). The stand-in pictures are cropped because they don't have the pieces'
shapes. -->

## Personas

- persona-artist: presents their work in a way that feels like their own (#goals). Some subfolders tell a story from the start (a comic's pages, a client's covers in the order they were made); today every subfolder is newest first and Star can't change it. Each subfolder gets its own choice.
- persona-fan: arrives to see what's new (#goals). The Portfolio's sections stay newest first, and each subfolder sits where its newest piece would be, as today, so what's new is still at the start of each row. Inside a subfolder Star sets to oldest first, the pieces run from the oldest; the site gives no other sign of the order (the lead's decision), since the order is Star's way of presenting the work.

## The change

This amends design-portfolio-folders, "Subfolders" (the thumbnail's grid and an open subfolder) and "What Star does in the editor". The Portfolio's sections and their rows are unchanged: newest first, with each subfolder where its newest piece would be.

### In the editor

- **A subfolder gains Order of pieces** (mock-up 1), after **Grid size**: **Newest first** or **Oldest first**. Help: "The order its pieces show in when it's open, and which of them its thumbnail shows. Pieces without a date come last."
- A new subfolder starts at **Newest first**. A subfolder made before this change has nothing ticked and shows newest first, as today, until Star chooses; so at first nothing on the site changes.
- Its row in the Subfolders list adds "Oldest first" when it's set: "Fan Work · 2 × 2 · 4 pieces · Oldest first".

### On the site

- **The subfolder's thumbnail** (mock-ups 2 and 4) shows the first pieces in its order: newest first, its newest (as today); oldest first, its oldest. A 3 × 3 thumbnail of an oldest-first subfolder of twelve pieces shows the oldest nine (mock-up 4); the count beside its name gives all twelve, as today.
- **Its place in its section's row** is unchanged: where its newest piece would be, whatever its own order (mock-up 2).
- **Opened** (mock-ups 3 and 5), its row shows its pieces in its order, starting at the first; the arrows scroll along it, and full screen turns through them in the same order, its count ("1 of 4 · Murderbot") counting from the row's first piece.
- **Pieces without a date** come last in both orders, in title order, as today.
- **Pieces with the same date** come in title order (A to Z) in both orders. This is new: today, pieces with the same date keep the order the site receives them in, which would otherwise flip when a subfolder is set to oldest first. It applies to the sections' rows too.
- **Unchanged:** a shared subfolder link's picture is its newest piece, whatever its order, so a link preview shows the latest work. A subfolder's Preview shows its draft order, as it shows its other drafts.

### Words

Text that says "newest" about a subfolder changes where it would become wrong:

- **Grid size**: "How many of its pieces its thumbnail shows, newest first." becomes "How many of its pieces its thumbnail shows, starting from the first in its order." The rest stays: "Computers show at most 3 × 3, phones 2 × 2."
- **The Grid size hint**: "shows the newest 9" becomes "shows the first 9": "Murderbot has 12 pieces: 3 × 3 shows the first 9."
- **Date** (a piece's help, and the guide's table): "When you made it. The portfolio shows newest first; pieces without a date come last." becomes "When you made it. The portfolio shows newest first, except in a subfolder set to oldest first; pieces without a date come last."
- **Star's guide** (`docs/user/editing-your-site.md`), "Subfolders": "a grid of its newest pieces" becomes "a grid of its first pieces", and a row for **Order of pieces** joins the table.
- **The fans' guide** (`docs/user/viewing-artwork.md`), "Open a subfolder": "one square of its newest pieces" becomes "one square of its first pieces", and step 1 gains "Its pieces run newest first, or from the oldest where Star has chosen that, so a story reads from its start."

## Mock-ups

Source: `mockups/portfolio-order/mockups.html` (frame 1) and `mockups/portfolio-order/render.mjs` (all frames).

| # | What it shows | File |
| --- | --- | --- |
| 1 | The editor: a subfolder's Order of pieces, after Grid size, and its row in the list | `mockups/portfolio-order/1-editor-subfolder-order.png` |
| 2 | Past Clients, newest first as today; Book covers set to Oldest first: where its newest piece would be, its thumbnail from its oldest | `mockups/portfolio-order/2-books-oldest-1280.png` |
| 3 | Book covers open, Oldest first | `mockups/portfolio-order/3-books-oldest-open-1280.png` |
| 4 | A 3 × 3 subfolder of twelve pieces, Oldest first: its oldest nine | `mockups/portfolio-order/4-books-oldest-3x3-1280.png` |
| 5 | On a phone, Book covers open, Oldest first | `mockups/portfolio-order/5-books-oldest-open-phone.png` |

## Where it applies

| # | Where | After |
| --- | --- | --- |
| 1 | `sanity-studio/schemas/objects/portfolioSubfolder.ts`, `FIELDS.portfolioSubfolder`, `listDetail` | Order of pieces, after Grid size; the list row. |
| 2 | `FIELDS.portfolioSubfolder.gridSize`, `gridHint`, `FIELDS.galleryItem.date` | The help and hint above. |
| 3 | `src/lib/portfolio/folders.ts` (`sortPieces`, `buildFolders`, `gridCells`, `folderTurnOrder`), the Portfolio's query | Ties by title; each subfolder's pieces in its own order for its grid, its open row and full screen; its place by its newest piece. |
| 4 | `src/pages/portfolio/[folder]/[subfolder].astro` | The link picture stays the subfolder's newest piece. |
| 5 | `docs/user/editing-your-site.md`, `docs/user/viewing-artwork.md` | The words above. |
| 6 | `docs/design/portfolio-folders.md` | A note at "Subfolders" that this design adds the choice. |

## States and errors

| Situation | What happens |
| --- | --- |
| A subfolder made before this change | Newest first, as today; nothing ticked in the editor until Star chooses. |
| A subfolder whose pieces are all undated | Its pieces in title order, in either setting; its place in the row by its first piece's title among the undated pieces, as today. |
| Pieces with the same date | Title order, A to Z, in both orders. |
| An oldest-first subfolder with more pieces than cells | Its thumbnail shows its oldest; the count gives them all (mock-up 4). |
| Star changes the order | Preview of the subfolder shows it before publishing; the site shows it with the next update after **Publish**, as everything else (going-live). |

## Accessibility

- **Order of pieces** is a radio choice with a visible label, as **Grid size**.
- On the site, only the order inside a subfolder changes: reading order, focus order and what a screen reader hears follow the row, as today. The site states no order, as today.

## For the spec to check

- A subfolder's order: Newest first when unset; its grid, open row and full screen in its order; undated last by title; same dates by title.
- Its place in the section's row by its newest piece, whatever its order; the sections' rows otherwise unchanged except ties by title.
- The link picture stays its newest piece.
- The editor: Order of pieces after Grid size, its choices, starting value and help; the list row; the Grid size and Date help; the hint.
- The guides' changes above.
- Existing tests that name Grid size's help, the Date help, or "shows the newest 9" change.

## Decisions from the lead (2026-11-09)

1. **The sections don't get an order setting.** They stay newest first; the first draft's **Portfolio order** page under Art is dropped.
2. **A subfolder's order is its own,** Newest first or Oldest first.
3. **A subfolder's place in its section's row** stays where its newest piece would be.
4. **An oldest-first subfolder's thumbnail** shows its oldest pieces.
5. **Undated pieces** come last in both orders.
6. **No sign of the order on the site.**

## Persona walkthrough

Run with `rfr-process:persona-walkthrough` for persona-artist and persona-fan on the first draft (2026-11-09), which also had a **Portfolio order** page for the sections. What it found and what changed:

- **Subfolders didn't follow their section** when a section turned oldest first. The lead then decided subfolders have their own order and the sections none, so the question is gone.
- **Ties and undated subfolders** weren't defined, and "title order, as today" for ties was wrong (today ties keep the order the site receives them in). Ties are now by title in both orders, said to be new; an undated subfolder keeps today's place.
- **The link-preview picture** would have changed for an oldest-first subfolder. It now stays the newest piece.
- **Wording that would be wrong** wasn't all listed: the Date help, the guide's "newest pieces" lines and the fans' guide. They're now listed with their new text and where it goes.
- **Defaults in the editor:** a subfolder made before this change shows nothing ticked and stays newest first.
- **The label "Order"** clashed with the commission types' "Order on the page": now **Order of pieces**. Grid size's new help is plainer.
- **Fans can't tell a subfolder's order;** the lead decided the site gives no sign (decision 6). With the sections newest first, what's new stays at the start of each row.
- **Mock-ups added:** a 3 × 3 oldest-first thumbnail of twelve (4), a subfolder set to oldest first in a newest-first section (2), and a phone (5); the editor's Section is now drawn as the choice it is.
- The findings about a **Portfolio order** page (its home in the code, its Preview, long oldest-first rows) went with the page.
