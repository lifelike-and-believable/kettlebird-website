---
id: design-portfolio-order
status: draft
derived-from:
  - design-portfolio-folders#the-row-mock-ups-1-2-and-4: 80db0c42fd05
  - design-portfolio-folders#subfolders-mock-ups-2-3-5-and-12: 39a0e23d0971
  - design-portfolio-folders#what-star-does-in-the-editor-mock-ups-7-8-and-9: 9b3c6d5405c2
  - persona-artist#goals: f3044c738f84
  - persona-fan#goals: 2b047e4cae5d
---

# Newest or oldest first in the Portfolio: design

<!-- docs/design/portfolio-order.md. A design amendment from a feature request by the lead (2026-11-09): make the
display order of the pieces in a Portfolio folder or subfolder settable in the editor, newest first or oldest
first. Mock-ups are in docs/design/mockups/portfolio-order/. Frames 1 and 2 are illustrations of the editor,
drawn to show the fields and words, not screenshots; frames 3 to 12 are the fixture build's Portfolio in Preview,
with a row put in the order this design describes and each piece labelled with its date (the labels are for the
mock-ups only: the site shows no dates in the row). The stand-in pictures are cropped because they don't have
the pieces' shapes. -->

## Personas

- persona-artist: presents their work in a way that feels like their own (#goals). Some sections read best newest first (Work in Progress, Featured); others tell a story from the start (a comic's pages, a client's covers in the order they were made). Today every section is newest first and Star can't change it. A section and each of its subfolders have their own setting (the lead's decision, 2026-11-09), so a comic told in order can sit in a section that's newest first.
- persona-fan: arrives to see what's new (#goals). Newest first stays the starting order everywhere, so nothing changes for fans until Star chooses otherwise. In a section Star sets to oldest first, a fan who wants the newest piece finds it at the end of the row (mock-up 11); the site gives no other sign of the order, since the order is Star's way of presenting the work. The editor's text says so, so Star chooses it knowingly.

## The change

This amends design-portfolio-folders, "The row" (**Order**), "Subfolders" (the thumbnail's grid, its place in the row, an open subfolder) and "What Star does in the editor".

### Two settings

- **Each section's order** (mock-up 1): in the editor, **Art** gains a third item, **Portfolio order**, after **Pieces** and **Subfolders**. It's one page, headed "Portfolio order", with the five sections in the Portfolio's order, each a choice of **Newest first** or **Oldest first**. Text under the heading: "The order each Portfolio section shows its pieces in, by their dates. Pieces without a date come last, either way. A subfolder has its own order: its **Order of pieces**. Oldest first suits work that tells a story from the start; fans who come to see what's new will find it at the end of the row." It works like a Site settings item: one page, opened straight away, with **Publish** and **Preview**, and no delete or duplicate.
- **Each subfolder's order** (mock-up 2), independent of its section's (the lead's decision): a subfolder gains **Order of pieces**, after **Grid size**: **Newest first** or **Oldest first**. Help: "The order its pieces show in when it's open, and which of them its thumbnail shows, whatever its section's order. Pieces without a date come last." A new subfolder starts at **Newest first**. Its row in the Subfolders list adds "Oldest first" when it's set: "Fan Work · 2 × 2 · 4 pieces · Oldest first".
- **What's ticked at first:** Portfolio order opens with every section's **Newest first** ticked (its starting values, as the Site settings items have theirs) until Star publishes it. A subfolder made before this change has nothing ticked under **Order of pieces** and shows newest first, as today, until Star chooses.
- **So at first nothing on the site changes:** every section and every subfolder is newest first.

### What the order changes on the site

- **A section's row** (mock-ups 3 to 6, 11): its loose pieces and subfolders by date, in the section's order.
  - Pieces with the same date come in title order (A to Z) in both orders. This is new: today, pieces with the same date keep the order the site receives them in.
  - Pieces with no date come after every dated one in both orders, in title order, as today.
- **A subfolder's place in its section's row** follows the section's order: newest first, it sits where its newest piece would be (today's rule); oldest first, where its oldest piece would be (mock-up 6). A subfolder whose pieces are all undated sits among the undated pieces, by its name. The subfolder's own order doesn't move it.
- **A subfolder's thumbnail** (mock-ups 7, 10) shows the first pieces in the subfolder's own order: newest first, its newest; oldest first, its oldest. A 3 × 3 thumbnail of an oldest-first subfolder of twelve pieces shows the oldest nine (mock-up 10); the count beside its name gives all twelve, as today.
- **An open subfolder** (mock-up 8) shows its pieces in its own order.
- **When a subfolder's order differs from its section's** (mock-up 12), it still sits by its section's rule while its thumbnail starts from its own first piece.
- **The row starts at its first piece,** as today; the arrows scroll along it, and full screen turns through the same pieces in the same order: from a loose piece, the section's loose pieces in the row's order (subfolders' pieces are not among them, as today); in an open subfolder, its pieces in its order. The count ("1 of 4 · Murderbot") counts from the row's first piece.
- **Unchanged:** a shared subfolder link's picture is its newest piece, and a shared Portfolio link's picture is the newest piece in Featured (going-live), whatever the order: a link preview shows the latest work.

### Words

Text that says "newest first" today changes where it would become wrong:

- **Date** (a piece's help, and the guide's table): "When you made it. The portfolio shows newest first; pieces without a date come last." becomes "When you made it. The portfolio puts pieces in date order, newest or oldest first as you choose in **Portfolio order**; pieces without a date come last."
- **Grid size**: "How many of its pieces its thumbnail shows, newest first." becomes "How many of its pieces its thumbnail shows, starting from the first in its order." The rest stays: "Computers show at most 3 × 3, phones 2 × 2."
- **The Grid size hint**: "shows the newest 9" becomes "shows the first 9": "Murderbot has 12 pieces: 3 × 3 shows the first 9."
- **Star's guide** (`docs/user/editing-your-site.md`): a new section, "Portfolio order", after "Subfolders"; in "Subfolders", "a grid of its newest pieces" becomes "a grid of its first pieces", and a row for **Order of pieces** joins the table; Art's opening line lists the third item. **Portfolio order** gets its own help link to the new section.
- **The fans' guide** (`docs/user/viewing-artwork.md`): in "Find a piece", step 2 gains "Most folders show the newest first; Star shows some from the oldest, so a story reads from its start." In "Open a subfolder", "one square of its newest pieces" becomes "one square of its first pieces".
- **Previewing** (`docs/user/previewing.md`): a row for **Art**: **Portfolio order** (the Portfolio, from the top) joins the table.
- The words "newest first" in the Pieces list and the Writing and Comics lines are about the editor's own lists and the other pages, so they stay.

## Mock-ups

Source: `mockups/portfolio-order/mockups.html` (frames 1 and 2) and `mockups/portfolio-order/render.mjs` (all frames).

| # | What it shows | File |
| --- | --- | --- |
| 1 | The editor: Art's Portfolio order, each section's choice (Past Clients set to Oldest first), Preview | `mockups/portfolio-order/1-editor-portfolio-order.png` |
| 2 | The editor: a subfolder's Order of pieces, after Grid size, and its row in the list | `mockups/portfolio-order/2-editor-subfolder-order.png` |
| 3 | Original Work, Newest first (today) | `mockups/portfolio-order/3-original-newest-1280.png` |
| 4 | Original Work, Oldest first | `mockups/portfolio-order/4-original-oldest-1280.png` |
| 5 | Past Clients, Newest first: Book covers where its newest piece would be | `mockups/portfolio-order/5-clients-newest-1280.png` |
| 6 | Past Clients, Oldest first: Shopfront first, Book covers where its oldest piece would be | `mockups/portfolio-order/6-clients-oldest-1280.png` |
| 7 | Book covers set to Oldest first: its thumbnail starts from its oldest piece | `mockups/portfolio-order/7-books-oldest-1280.png` |
| 8 | Book covers open, Oldest first | `mockups/portfolio-order/8-books-oldest-open-1280.png` |
| 9 | On a phone, Original Work Oldest first | `mockups/portfolio-order/9-original-oldest-phone.png` |
| 10 | A 3 × 3 subfolder of twelve pieces, oldest first: its oldest nine | `mockups/portfolio-order/10-books-oldest-3x3-1280.png` |
| 11 | A long row, oldest first: the newest piece at the far end | `mockups/portfolio-order/11-long-row-oldest-1280.png` |
| 12 | Past Clients Newest first with Book covers set to Oldest first | `mockups/portfolio-order/12-subfolder-differs-1280.png` |

## Where it applies

| # | Where | After |
| --- | --- | --- |
| 1 | `sanity-studio/structure.ts`, `sanity-studio/lib/editor-content.ts` (`ART_LISTS`), a new single-page type `portfolioOrder` with its schema | Art lists Pieces, Subfolders and Portfolio order; Portfolio order opens straight away, with its starting values, and only Publish, Discard changes and Restore. |
| 2 | `sanity-studio/schemas/objects/portfolioSubfolder.ts`, `FIELDS.portfolioSubfolder`, `listDetail` | Order of pieces, after Grid size; Grid size's help and hint; the list row. |
| 3 | `FIELDS.galleryItem.date` | The Date help above. |
| 4 | `src/lib/portfolio/folders.ts` (`sortPieces`, `buildFolders`, `gridCells`, `folderTurnOrder`) | Each section's entries sorted in its order (a subfolder by its newest or oldest piece, or its name when undated); each subfolder's own pieces re-sorted in its own order, for its grid, its open row and full screen; ties by title. |
| 5 | `src/lib/queries.ts`, `src/components/pages/PortfolioPage.astro`, `src/pages/portfolio/[folder]/[subfolder].astro`, `src/lib/preview/load.ts` | The Portfolio, a subfolder's page and Preview fetch Portfolio order (drafts in Preview) and each subfolder's order; the subfolder page's link picture stays its newest piece. |
| 6 | Preview (design-preview), `sanity-studio/lib/preview.ts` | Portfolio order is previewable: the Portfolio from the top, with its draft. A subfolder's Preview shows its draft order. |
| 7 | `sanity-studio/lib/help.ts` (`ITEM_HELP`, `ITEM_NAMES`) | Portfolio order's help link, "Help: Portfolio order", to the guide's new section. |
| 8 | `docs/user/editing-your-site.md`, `docs/user/viewing-artwork.md`, `docs/user/previewing.md` | The words above. |
| 9 | `docs/design/portfolio-folders.md` | A note at "The row" (Order) and "Subfolders" that this design adds the choice. |

## States and errors

| Situation | What happens |
| --- | --- |
| Portfolio order never published | Every section Newest first, as today. The page opens with Newest first ticked for each. |
| A subfolder made before this change | Newest first, as today; nothing ticked in the editor until Star chooses. |
| A section with only undated pieces | Title order, in either setting. |
| A subfolder whose pieces are all undated | Among the section's undated pieces, by its name; its own pieces in title order. |
| Pieces with the same date | Title order, A to Z, in both orders. |
| A subfolder's order differs from its section's | It sits by its section's rule; its thumbnail and open row follow its own (mock-up 12). |
| A piece in two sections set differently | Each section places it in its own order. |
| A long row, oldest first | Starts at the oldest piece; the newest is at the far end (mock-up 11). |
| Star changes an order | Preview shows it before publishing; the site shows it with the next update after **Publish**, as everything else (going-live). |

## Accessibility

- The settings are radio choices with visible labels, as Site settings' **Commissions are…**; Portfolio order has a heading naming the page.
- On the site, only the order changes: reading order, focus order and what a screen reader hears follow the row, as today. The site states no order, as today.

## For the spec to check

- The section order: by date, newest or oldest first; undated last by title; same dates by title; Newest first when unset.
- A subfolder's place: by its newest piece in a newest-first section, its oldest in an oldest-first one, by its name when all its pieces are undated.
- A subfolder's own order, independent of its section's: Newest first when unset; its grid, open row and full screen in that order; the link picture stays its newest piece.
- The editor: Art's three items; Portfolio order as a single page with its heading, text, five choices, starting values, actions, Preview and help link; the subfolder's Order of pieces, its help, and the list row; the Date and Grid size help; the hint.
- The guides' changes above.
- Existing tests that name the Date help, Grid size's help, "shows the newest 9", or Art's two lists change.

## Questions for the lead

1. **Where the sections' order is set:** under **Art**, as **Portfolio order** beside Pieces and Subfolders (recommended: it's where Star works on the Portfolio), or in **Site settings** with Commissions, About page, Home page and Contact.
2. **Subfolders' order:** decided, see below.
3. **A subfolder's place in an oldest-first section:** where its oldest piece would be (recommended: the whole row reads oldest to newest), or always where its newest piece would be.
4. **An oldest-first subfolder's thumbnail:** its oldest pieces, the ones it opens with (recommended), or its newest.
5. **Undated pieces:** last in both orders (recommended), or first when oldest first.
6. **No sign of the order on the site** (recommended: the order is Star's presentation, and the editor tells Star that fans find the newest at the end), or a small line under an oldest-first section's tab such as "Oldest first".

## Decisions from the lead (2026-11-09)

- **A subfolder's order is independent of its section's** (question 2): each subfolder has **Newest first** or **Oldest first**, set on its own; there's no "Same as its section". A subfolder sits in its section's row by the section's rule (question 3) and shows its pieces in its own order.

## Persona walkthrough

Run with `rfr-process:persona-walkthrough` for persona-artist and persona-fan on the first draft (2026-11-09). What it found and what changed:

- **Subfolders didn't follow their section:** turning a section to Oldest first left its subfolders newest first. The second draft had subfolders follow their section unless Star chose otherwise; the lead decided a subfolder's order is its own (see the decisions above), so the Portfolio order page now says so, the subfolder's help says "whatever its section's order", and mock-up 12 shows a subfolder set differently from its section.
- **Ties and undated subfolders** weren't defined, and "title order, as today" for ties was wrong (today ties keep the order the site receives them in). Ties are now by title in both orders, said to be new; a subfolder of undated pieces sits by its name.
- **The link-preview picture** would have changed for an oldest-first subfolder. It now stays the newest piece, and Featured's stays its newest.
- **Wording that would be wrong** wasn't all listed: the Date help, the guide's "newest pieces" lines and the fans' guide. They're now listed with their new text, and where the fans' guide sentence goes.
- **Portfolio order as one page** needed its home in the code (single page, help, Preview, the pages that fetch it). Now in "Where it applies", rows 1 and 5 to 7.
- **Defaults in the editor:** Portfolio order opens with Newest first ticked; older subfolders show nothing ticked and follow their section.
- **Preview** wasn't drawn: mock-ups 1 and 2 now show it, with where it opens.
- **The label "Order"** clashed with the commission types' "Order on the page": now **Order of pieces**. Grid size's new help is plainer.
- **Fans can't tell a section's order,** and in a long oldest-first row the newest piece is at the far end (mock-up 11). The editor's text now tells Star this; whether the site should say so is question 6.
- **Mock-ups added:** a 3 × 3 oldest-first thumbnail of twelve (10), a long row (11), a subfolder set differently from its section (12); mock-up 2's Section is now drawn as the choice it is.
- **Not changed:** full screen's **Next** goes along the row, toward newer pieces in an oldest-first section; the row's direction is the order, so the buttons keep their names.
