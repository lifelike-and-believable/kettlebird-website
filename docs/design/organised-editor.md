---
id: design-organised-editor
status: draft
derived-from:
  - story-content-editing-organised-editor: 854514008232
  - design-cms#decision: 889c200357ba
  - persona-artist#skills-and-tools: 4e28d5374320
  - persona-artist#context-of-use: 8e0657e823c9
---

# An editor organised around Star's work: design

<!-- docs/design/organised-editor.md. Design for story-content-editing-organised-editor. Mock-ups are
in docs/design/mockups/organised-editor/ (PNG images, and mockups.html, the source they are rendered
from with render.mjs). The Comics section's chapter list and pages are designed in
design-comic-publish-pages; this design places them in the menu. -->

## Personas

- persona-artist: Star uses a web editor but not code (#skills-and-tools), and updates the site around an art schedule, often straight after finishing a piece (#context-of-use). So the editor is laid out the way Star thinks about the work (comics, art, writing, shop, commissions, site settings), every field says in plain words what it does on the site, and nothing in it is a developer's tool or term.

## Flow

1. Star opens the editor. The menu on the left lists **Comics**, **Art**, **Writing**, **Shop**, **Commissions**, and **Site settings**, in that order, and nothing else (mock-up 1).
2. Star chooses a section. Its list shows the items in it, newest first, each with a short detail (a comic's status, a piece's portfolio section, a product's kind), and **New …** at the top: **New comic**, **New piece**, **New story**, **New product**, **New commission type**.
3. Star chooses an item, or a **New …** button. The item opens beside the list, every field with its label and help text (mock-up 2).
4. In **Comics**, a comic shows its **Chapters** in number order. Choosing one opens the chapter and its pages (mock-up 1; the chapter itself is design-comic-publish-pages).
5. If something required is missing, **Publish** can't be pressed, and the item lists what to add, with each field's own message beside it (mock-up 3).

## Mock-ups

Low-fidelity. The editor is Sanity Studio; this design sets its menu, the labels, help text and messages, and which fields appear. Source: `mockups/organised-editor/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | The menu, and **Comics**: a comic and its chapters | `mockups/organised-editor/1-comics.png` |
| 2 | **Art**: a piece, with labels and help text | `mockups/organised-editor/2-art-piece.png` |
| 3 | Required fields missing: what to add before publishing | `mockups/organised-editor/3-missing-fields.png` |
| 4 | **Writing**, **Shop** and **Commissions**: their lists and fields | `mockups/organised-editor/4-writing-shop-commissions.png` |
| 5 | **Site settings** before the site-settings update | `mockups/organised-editor/5-site-settings.png` |

## Sections and fields

Each table is the whole section: label as Star sees it, help text, and whether it's required. Fields the site doesn't use are hidden (listed under each table), not deleted, so nothing already entered is lost.

**Comics** (a comic; its chapters and pages are as in design-comic-publish-pages)

| Field | Help text | Required |
|---|---|---|
| Title | The comic's name, as readers see it. | Yes |
| Web address | Fills itself in from the title; it's the end of the comic's link, like /comics/kettle-tales. Changing it later breaks links people have shared. | Yes |
| Cover | Shown on the Comics page and the comic's own page. | |
| Description | A sentence or two about the comic, shown on its page. | |
| Status | Ongoing, Complete, or On Hiatus, shown as a tag and at the end of the newest page. | |
| Type | Original or Fancomic, shown as a tag. | |
| Chapters | Each chapter, in number order. Add chapter starts the next one. | |

**Art** (a piece in the portfolio)

| Field | Help text | Required |
|---|---|---|
| Title | Shown under the picture on your portfolio. | Yes |
| Picture | Upload the original file; the site makes smaller copies. Drag the circle to the part that matters most, so square thumbnails keep it in view. | Yes |
| Alt text | What the picture shows, for people using screen readers. One or two sentences. | |
| Description | Shown when someone opens the picture on your portfolio. | |
| Where it appears on your portfolio | The portfolio's sections: Original Work, Fan Work, Past Clients, Work in Progress, Featured. A piece can be in more than one. | At least one |
| On the home page | Also show it in the home page's gallery. | |
| Tags | Words shown under the picture when it's opened, like a character's name. | |
| Date | When you made it; the portfolio shows newest first. | |

Hidden: the piece's web address (the portfolio has no page per piece).

**Writing** (a story)

| Field | Help text | Required |
|---|---|---|
| Title | The story's title. | Yes |
| Cover | Shown beside the story on the Writing page. | |
| Short description | A sentence or two, shown on the Writing page. | |
| Read on AO3 | The story's AO3 link; the Writing page links to it. | |
| Genres | Shown as tags on the Writing page. | |
| Date posted | The Writing page shows newest first. | |
| Story text | The full story, for reading on the site. The site doesn't show it yet; until it does, readers follow the AO3 link. | |

Hidden: the story's web address (until reading on the site is added, with the writing epic).

**Shop** (a product)

| Field | Help text | Required |
|---|---|---|
| Name | The product's name in the shop. | Yes |
| Pictures | The first is the one shown in the shop. | |
| Price | In dollars, like 12. | |
| Description | Shown in the shop under the name. | |
| Kind | Print, Sticker, or Digital. | |
| How many are left | Leave empty if it doesn't run out. | |
| Ko-fi link | Where the Buy button goes, until the site has its own checkout. | |
| Tags | Words to help people find it. | |

Hidden: the product's web address. The "Commission" product kind is removed: commissions have their own section.

**Commissions** (a commission type)

| Field | Help text | Required |
|---|---|---|
| Name | Like "Full colour illustration". | Yes |
| Price range | Like "$80–150", shown as written. | |
| What's included | Shown under the name on the Commissions page. | |
| Examples | Pictures of past commissions of this kind. | |
| How long it takes | Like "2–3 weeks". | |
| Order on the page | Lower numbers come first. | |

Whether commissions are open is in **Site settings** (story-content-editing-site-settings).

**Site settings** (mock-up 5): until story-content-editing-site-settings is built, it says "Site settings is coming in the next update. It's where you'll open or close commissions, and change your about page, the home page's artist text, and your social links. Until then, ask the person who looks after the site."

## Layout

- The menu's sections are always in the order above. Each section's list shows newest first; **Commissions** shows its types in **Order on the page** order, as the site does.
- Required fields say "Required" (or "Choose at least one") beside the label, before Star has missed them.
- Help text sits under each label, always visible, never behind an icon.
- No field label uses "slug", "reference", "document", "schema", "array", or "type" as a technical word. The words Star sees for things are: comic, chapter, page, piece, story, product, commission type.

## States and errors

- **Missing required fields** (mock-up 3): **Publish** can't be pressed. The item lists what to add ("Add these before publishing: a title; which portfolio section it goes in"), and each field shows its own message, saying what it's for: "Give the piece a title. It's shown under the picture." Saving a draft is always allowed.
- **Empty section:** "No pieces yet. Choose New piece to add one." (worded for each section).
- **Developer tools:** the query tool and any other developer tool appear only to project administrators (the lead), never to Star's Editor role.

## Accessibility

- Labels and help text are real text attached to their fields, so screen readers read the help with the field.
- Required fields are marked in words, not colour alone, and the list of what's missing is announced when **Publish** is tried.
- This design adds no controls of its own beyond Sanity's; its menu and lists are Sanity's, which are keyboard operable.

## Trying it with Star

The story's last criterion: once built, Star tries the editor on a few real pieces with the lead, at least one comic chapter, one piece of art, and one commission type. What they find is written down as changes to this story or new stories before the epic continues.

## For the spec to check

- The Studio's structure tool can set this menu, show each comic's chapters in number order, and list newest first.
- The query tool can be limited to administrators.
- Hiding unused fields keeps their saved values.
- The list of missing required fields can be shown at the top of an item.
- Removing the "Commission" product kind: whether any product uses it now (the dataset is empty, so none should).
