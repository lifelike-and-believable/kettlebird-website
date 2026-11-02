---
id: design-organised-editor
status: approved
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
2. Star chooses a section. Its list shows **New …** at the top (**New series**, **New piece**, **New story**, **New product**, **New commission type**), then the items, each with a short detail:
   - a series' status;
   - a piece's portfolio sections, all of them, separated by commas;
   - a story's date posted;
   - a product's shop section;
   - a commission type's price range.
3. Star chooses an item, or a **New …** button. The item opens beside the list, with every field's label and help text, and **Publish** at the bottom, where Sanity puts it (mock-ups 1, 2, 4, 5 and 6).
4. In **Comics**, a series shows its **Chapters** in number order. Choosing one opens the chapter and its pages beside the series, so the series stays in view (mock-ups 1 and 9; the chapter itself is in design-comic-publish-pages). **Add chapter** starts a chapter that already belongs to the series, in the same place. See "Series and chapters".
5. If something required is missing, **Publish** can't be pressed. The item lists what to add, and each field shows its own message (mock-up 3).

## Mock-ups

Low-fidelity. The editor is Sanity Studio; this design sets its menu, the labels, the help text and messages, and which fields appear. Each form shows every field Star sees, in order. Source: `mockups/organised-editor/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | The menu, and **Comics**: a series, its details and its chapters | `mockups/organised-editor/1-comics.png` |
| 2 | **Art**: a piece | `mockups/organised-editor/2-art-piece.png` |
| 3 | Required fields missing: what to add before publishing | `mockups/organised-editor/3-missing-fields.png` |
| 4 | **Writing**: a story | `mockups/organised-editor/4-writing.png` |
| 5 | **Shop**: a product | `mockups/organised-editor/5-shop.png` |
| 6 | **Commissions**: a commission type | `mockups/organised-editor/6-commissions.png` |
| 7 | An empty section | `mockups/organised-editor/7-empty-section.png` |
| 8 | **Site settings** before the site-settings update | `mockups/organised-editor/8-site-settings.png` |
| 9 | A chapter open beside its series: Comics › Kettle Tales › Chapter 2 | `mockups/organised-editor/9-chapter-beside-series.png` |

## Sections and fields

Each table is the whole form, in order: the label as Star sees it, its help text, and whether it's required. A field the site doesn't use is hidden, not deleted, so nothing already entered is lost. Each hidden field is listed under its table, and comes back when the site starts using it.

**Comics** (a series; its chapters and pages are as in design-comic-publish-pages) (mock-up 1)

| Field | Help text | Required |
|---|---|---|
| Title | The series' name, as readers see it. | Yes |
| Web address | Fills itself in from the title. It's the last part of the series' address on the site: kettlebird.com/comics/kettle-tales. Leave it as it is once people may have shared links. | Yes |
| Cover | Shown on the Comics page and the series' own page. | |
| Description | A sentence or two about the series, shown on its page. | |
| Status | Ongoing, Complete, or On Hiatus. Shown as a tag, and in the message at the end of the newest page. | |
| Kind | Original or Fancomic, shown as a tag. | |
| Chapters | In number order. Choose one to open it beside the series. | |

**Art** (a piece in the portfolio) (mock-up 2)

| Field | Help text | Required |
|---|---|---|
| Title | Shown under the picture on your portfolio. | Yes |
| Picture | Upload the original file; the site makes smaller copies. To keep the important part in view in square thumbnails, choose the picture's Edit button and mark it. | Yes |
| Alt text | What the picture shows, for people using screen readers. If it's empty, screen readers hear only the title. | No, but a missing one is marked, as for comic pages |
| Portfolio sections | The sections of your portfolio it appears in: Original Work, Fan Work, Past Clients, Work in Progress, Featured. A piece can be in more than one. | At least one |
| Description | Shown when someone opens the picture on your portfolio. | |
| Tags | Words shown under the picture when it's opened, like a character's name. | |
| Date | When you made it. The portfolio shows newest first; pieces without a date come last. | |

Hidden: the piece's web address (the portfolio has no page per piece), and "Featured on homepage" (the home page has no gallery). The portfolio's **Featured** section is unaffected.

**Writing** (a story) (mock-up 4)

| Field | Help text | Required |
|---|---|---|
| Title | The story's title. | Yes |
| Link to read it | Where the Writing page's Read it button goes, such as the story on AO3. | |
| Short description | A sentence or two, shown on the Writing page. | |
| Cover | Shown beside the story on the Writing page. | |
| Genres | Shown as tags on the Writing page. | |
| Date posted | The Writing page shows newest first. | |

Hidden: the story's web address and its full text (the site doesn't show stories itself yet; both come back with the writing epic).

**Shop** (a product) (mock-up 5)

| Field | Help text | Required |
|---|---|---|
| Name | The product's name in the shop. | Yes |
| Shop section | Which section of the shop it's listed under: Prints, Stickers, or Digital. Within a section, products are listed by name. | Yes |
| Price | Shown exactly as you write it, so include the currency: $4, or $4 each. | |
| Pictures | The first is the one shown in the shop. | |
| Description | Shown in the shop under the name. | |
| Ko-fi link | Where the shop's Buy button goes, until the site has its own checkout. Without it, there's no Buy button. | |

Hidden: the product's web address, tags, and "how many are left" (the shop doesn't use them yet; they come back with the shop epic). The "Commission" shop section is removed: commissions have their own menu section.

**Commissions** (a commission type) (mock-up 6)

| Field | Help text | Required |
|---|---|---|
| Name | Like "Full colour illustration", shown as the heading. | Yes |
| Price range | Shown exactly as you write it, like $80–150. | |
| What's included | Shown under the name on the Commissions page. | |
| Examples | Pictures of past commissions of this kind. The first three are shown. | |
| How long it takes | Shown as "Est. delivery", like 2–3 weeks. | |
| Order on the page | Lower numbers come first on the Commissions page, and in this list. | |

Whether commissions are open is in **Site settings** (story-content-editing-site-settings); until that's built, the Commissions page always says they're open.

**Site settings** (mock-up 8): until story-content-editing-site-settings is built, it says "Site settings is coming in the next update. It's where you'll open or close commissions, and change your about page, the home page's artist text, and your social links. Until then, ask the person who looks after the site." This is a note in the editor, for Star; visitors never see it.

## Layout

- The menu's sections are always in the order above.
- **Comics**, **Art** and **Writing** list newest first. **Shop** lists by name within each shop section, as the shop does. **Commissions** lists in **Order on the page** order, as the site does.
- **Publish** is at the bottom of the open item (Sanity's place for it), with the status from design-know-when-live at the top right.
- Required fields say "Required" (or "Choose at least one") beside the label, before Star has missed them.
- Help text sits under each label, always visible.
- No label or help text uses a developer's word: not "slug", "reference", "document", "schema", "array", "category", or "boolean". The words for things are series, chapter, page, piece, story, product, and commission type, and "Kind" for a series' Original or Fancomic.
- Sanity's own menus that create or find items ("Create new", search) offer only the same six kinds of item, with the same names.

## Series and chapters

Added after the lead's look at the editor (2026-11-02): with Sanity's default menu, Chapter appeared as its own entry above Comic Series, as if chapters were separate from their series. The organised menu (above) already removes the Chapter entry. This keeps the link between a chapter and its series in view while Star works on it (mock-up 9):

- A chapter is opened from its series: choosing a chapter in the series' **Chapters**, or **Add chapter**, opens it in a pane to the right of the series, as a child of the series' pane. (Sanity's general "open this item" and "create" links, which the first build used, open a chapter on its own instead; the chapter rows and **Add chapter** must not use them.) The panes read, left to right, **Comics**, the series, then the chapter, so the series stays on screen.
- The series' pane stays its whole form, with its own **Publish** at the bottom; mock-up 9 is cropped to the fields that matter here. The open chapter's row is highlighted in the series' **Chapters**.
- The chapter's pane is headed with the series' name and the chapter: "Kettle Tales · Chapter 2: The Long Road" (a new chapter: "Kettle Tales · New chapter"; a series with no title yet: "Untitled series · New chapter"). The heading follows the series' and the chapter's current titles.
- Choosing another chapter replaces the one on the right; closing it leaves the series open. Deleting the open chapter closes its pane; the series stays open, and the chapter leaves its **Chapters**.
- Publishing a chapter that also publishes a new series (design-comic-publish-pages) updates the series' pane beside it straight away, so both show they're on the site.
- On a narrow screen, Sanity shows fewer panes side by side and collapses the ones on the left. The chapter's heading keeps the series' name in view, and going back (Sanity's back arrow, or choosing the collapsed series pane) returns to the series with the chapter's row still highlighted.
- A chapter is still never listed on its own in the menu or in "Create new". If Star finds a chapter through Sanity's search, it opens on its own, headed with the chapter and its series' name under it. Its **Series** field names the series; choosing it opens the series beside the chapter, so Star can get back to it.

## States and errors

- **Missing required fields** (mock-up 3): **Publish** can't be pressed. The item lists everything to add ("Add these before publishing: a title; the picture; at least one portfolio section"), and each field shows its own message, saying what it's for. Saving a draft is always allowed.
- **Missing alt text** on a piece: marked on the field ("Add alt text so people using screen readers can follow it"), but publishing is allowed, as for comic pages.
- **Empty section** (mock-up 7): "No stories yet. Choose New story to add one.", worded for each section.
- **Developer tools:** the query tool appears only to project administrators (the lead), never to Star's Editor role (design-sign-in).

## Accessibility

- Labels and help text are real text attached to their fields, so screen readers read the help with the field.
- Required fields are marked in words, not colour alone, and the list of what's missing is announced when **Publish** is tried.
- The menu and lists are Sanity's, which are keyboard operable; this design adds no controls of its own.

## Trying it with Star

The story's last criterion: once built, Star tries the editor on a few real pieces with the lead. That's at least one comic chapter, one piece of art, and one commission type. What they find is written down as changes to this story, or as new stories, before the epic continues.

## For the spec to check

- The structure tool can set this menu, list each section in its order, and show a series' chapters in number order.
- **Add chapter** creates a chapter for that series (design-comic-publish-pages already uses an initial value template for this).
- "Create new" and search can be limited to the six kinds of item, with these names.
- The query tool can be limited to administrators by role.
- Hidden fields keep their saved values.
- A summary of what's missing can be shown at the top of an item, and "N things to add" beside **Publish**.
- The stored values of the portfolio sections stay as they are ("original", "fanart", "commission", "featured", "wip"); only their labels change, to the portfolio's own: Original Work, Fan Work, Past Clients, Featured, Work in Progress.
- Removing the "Commission" shop section: the dataset is empty, so no product uses it; `shop.astro` stops listing it.

## Persona walkthrough

A walkthrough for persona-artist (2026-11-01) opened each mock-up and checked the help text against what the site actually shows. Everything it found is addressed above.

It flagged as blocking that Writing, Shop and Commissions had no form mock-ups. Mock-ups 4 to 7 now show every form and the empty state.

It found help text that promised things the site doesn't do. Those fields are now hidden until the site uses them:
- "On the home page" (there's no home gallery);
- the shop's tags and stock;
- the story text.

It also found:
- "Featured" with two meanings: there is now one, the portfolio section.
- A price that showed without its currency: the help text now says to write it.
- "Kind" not being required, though it picks the shop section: now **Shop section**, required.
- Missing alt text going unwarned: now warned.
- "comic" and "series" both used: now "series", as the approved designs and the guide use.
- The word "Type" breaking its own rule: now "Kind".
- Technical help for the web address: it now shows the full address.
- The examples limit and the "Est. delivery" wording, which the help text now states.
- Text and mock-ups disagreeing: the picture is now in the missing list, list details are defined for every section, and **Publish** has one place.

It also listed the Sanity behaviour above for the spec to check.
