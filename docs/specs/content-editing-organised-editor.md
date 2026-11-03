---
status: implemented
tests-commit:
  - 5f3cf5ff6e58723c7fd7791c3c8f8fa0ed201fe7
  - 206f0803d5afb332e17f3ca4cf6460af190d5b7a
unlocks:
  - tests/unit/organised-editor.test.ts: the AC-9 shop-page check read src/pages/shop.astro; the shop's markup moved into src/components/pages/ShopPage.astro so the preview can render it (content-editing-preview), and the check reads that file. The criterion is unchanged.
  - tests/unit/organised-editor.test.ts: the AC-10 checks (the "coming in the next update" note, and the structure using SiteSettingsNote) are removed. Site settings itself replaced the note (content-editing-site-settings AC-1), whose tests check the four items instead. AC-10 is superseded.
---

# An editor organised around Star's work

<!-- Technical spec for story-content-editing-organised-editor, from design-organised-editor (with its
mock-ups) and docs-editing-your-site. A plan-feature spec without an id. -->

## Problem

The editor's menu lists Sanity's type names ("Gallery Item", "Written Work", "Comic Series", "Chapter", "Product", "Commission Type"), its labels are developer words ("Slug", "Category"), most fields have no help, and some fields promise things the site doesn't do. Star has to know how the site is built to find anything.

## User stories

- As Star, I want the editor's sections to be Comics, Art, Writing, Shop, Commissions, and Site settings, with plain help text on every field, so that I find what I want to change without knowing how the site is built. (story-content-editing-organised-editor)

## Acceptance criteria

Source: S3.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The editor's menu lists **Comics**, **Art**, **Writing**, **Shop**, **Commissions** and **Site settings**, in that order, and nothing else; each content section lists one kind of item, with its **New …** label (**New series**, **New piece**, **New story**, **New product**, **New commission type**). | test: unit "menu sections"; manual | S3.1; design-organised-editor#flow; docs-editing-your-site |
| AC-2 | Lists are ordered as the site orders them: Comics, Art and Writing newest first; Shop by shop section, then name; Commissions by **Order on the page**. Each item shows its detail: a series' status, a piece's portfolio sections (all, comma-separated), a story's date posted, a product's shop section, a commission type's price range. | test: unit "list order and details"; manual | design-organised-editor#flow, #layout |
| AC-3 | Every field Star sees has the label and help text in the design's tables, in the design's order, and fields the site doesn't use are hidden (their values kept): a piece's web address and "Featured on homepage"; a story's web address and full text; a product's web address, tags and stock. | test: unit "field labels and help" (the text, the order, and that each schema uses it); manual | S3.3; design-organised-editor#sections-and-fields; docs-editing-your-site |
| AC-4 | No label, help text, section name, button label or message uses a developer word: slug, reference, document, schema, array, category, boolean. | test: unit "no developer words" | S3.3; design-organised-editor#layout |
| AC-5 | Required fields say "(required)", or "(choose at least one)" for portfolio sections, in the label. A missing one blocks **Publish**, with its own message on the field. | test: unit "field labels and help", "required messages"; manual | S3.4; design-organised-editor#states-and-errors |
| AC-6 | An item missing required fields shows a box at its top, "Add these before publishing: a title; the picture; at least one portfolio section" (naming what's missing, in form order), and a badge beside **Publish**: "3 things to add before publishing" ("1 thing …" for one). | test: unit "what's missing"; manual | S3.4; design-organised-editor#states-and-errors (mock-up 3) |
| AC-7 | A piece without alt text is warned ("Add alt text so people using screen readers can follow it") and can still be published. | test: unit "required messages" (the rule is a warning); manual | design-organised-editor#states-and-errors |
| AC-8 | Portfolio sections are offered as Original Work, Fan Work, Past Clients, Featured, Work in Progress, keeping their stored values; shop sections as Prints, Stickers, Digital, without "Commission"; a series' status as Ongoing, Complete, On Hiatus, and its **Kind** as Original or Fancomic. | test: unit "option labels" | design-organised-editor#sections-and-fields, #for-the-spec-to-check |
| AC-9 | The shop page heads its sections Prints, Stickers and Digital, in that order, with no "Commission" section and no added "s". | test: unit "shop sections" | design-organised-editor#for-the-spec-to-check |
| AC-10 | Superseded by content-editing-site-settings AC-1, which replaced the note with the four items. Was: **Site settings** opens a note: "Site settings is coming in the next update. It's where you'll open or close commissions, and change your about page, the home page's artist text, and your social links. Until then, ask the person who looks after the site." | test: unit "menu sections"; manual | design-organised-editor#sections-and-fields |
| AC-11 | The editor's "create" menu offers only the five kinds of item, by their **New …** names; a chapter is created only from its series' **Add chapter**. | test: unit "menu sections"; manual | design-organised-editor#layout |
| AC-12 | An empty list says "Nothing here yet. Choose the + button above to add one." | test: unit "menu sections"; manual | design-organised-editor#states-and-errors (mock-up 7; see Risks and decisions) |
| AC-14 | A chapter chosen in its series' **Chapters**, or started with **Add chapter**, opens in a pane to the right of the series (a child of the series' pane, not Sanity's open or create links), headed "Kettle Tales · Chapter 2: The Long Road" ("Kettle Tales · New chapter"; "Untitled series · New chapter" before the series has a title); the open chapter's row is highlighted. | test: unit "chapter beside its series"; manual: `docs/tutorials/publishing-comics.md` step 3 | design-organised-editor#series-and-chapters (lead, 2026-11-02) |
| AC-13 | Star tries the editor on a few real pieces with the lead (at least one chapter, one piece of art, one commission type), and what they find is written down as story changes or new stories. | manual: `docs/tutorials/editing-your-site.md`, then the lead's notes | S3.6; design-organised-editor#trying-it-with-star |

## Scope

- In:
  - `sanity-studio/lib/editor-content.ts` (new): every section, label, help text, option label, message and list detail, with no `sanity` imports, so the site's Vitest can test them (AC-1 to AC-12).
  - `sanity-studio/structure.ts` (new): the menu from those sections, with each list's ordering and **New …** template (AC-1, AC-2, AC-10); a series opens as a pane whose child is the chapter (AC-14).
  - `sanity-studio/components/ChaptersList.tsx`: the series' chapter rows and **Add chapter** open the chapter as the series pane's child, and highlight it (AC-14).
  - `sanity-studio/components/MissingSummary.tsx` (new): the box at the top of an item; `sanity-studio/badges/thingsToAdd.tsx` (new): the badge beside **Publish**; `sanity-studio/components/SiteSettingsNote.tsx` (new) (AC-6, AC-10).
  - The schemas: labels, help text, required rules and messages, hidden fields, option labels, list previews (AC-2 to AC-8). `lib/comic-pages.ts`'s `altTextRule` takes the warning's wording, so pieces use their own (AC-7).
  - `sanity-studio/sanity.config.ts`: the structure, the create menu, the badge, and Sanity's empty-list text (AC-1, AC-6, AC-11, AC-12).
  - `src/lib/shop.ts` (new) and `src/pages/shop.astro`: the shop's sections and headings (AC-9).
  - Tests: `tests/unit/organised-editor.test.ts`; `docs/tutorials/editing-your-site.md` (`runner: manual`).
- Out: Site settings itself (content-editing story 4); the update status at the top right (story 2); **Preview** (story 5); the chapter's form and pages (design-comic-publish-pages, already built).

## APIs and assumptions

- APIs used (checked in the installed `sanity` 5.1.0): `structureTool({ structure })` with `S.list`, `S.listItem`, `S.documentTypeList(type).defaultOrdering(...).initialValueTemplates(...)`, `S.component`; `document.newDocumentOptions` with `creationContext.type`; `document.badges`; a document type's `components.input`; `useValidationStatus`; `defineLocaleResourceBundle` for the `structure` namespace's `panes.document-list-pane.no-documents-of-type.text`.
- Assumptions that could be wrong:
  - Sanity shows a field's validation message when it's empty and the item can't be published, and keeps hidden fields' stored values (both documented behaviour).
  - The **New …** template title is what the list's create button and menu show.
  - Ordering by date descending puts items with no date last.
  - `useValidationStatus` (for the badge) is exported but marked internal in Sanity's types; Sanity's own validation panel uses it. If a Sanity update changes it, the badge stops showing and the box at the top still works (it reads the form's own validation).

## Non-functional requirements

- No new controls of Sanity's own kinds: the box and badge are text, so screen readers read them in place.

## Delivery

- AC-14 was added after the lead's look at the editor (2026-11-02) and the design amendment it led to; its tests were committed failing in the second tests commit.
- Edge cases for the list details and the missing-fields helper were added after mutation testing (`tests/unit/organised-editor-edges.test.ts`), which also removed two checks no input could reach.

- Plan item: epic-content-editing, story 3. Ships before Star is invited (design-sign-in).

## Risks and decisions

- Sanity's list pane has one empty-list message for every list (`no-documents-of-type`), so the design's per-section wording (mock-up 7, "No stories yet. Choose New story to add one.") can't be set per section without replacing Sanity's list. The editor overrides the shared message with one in Star's words (AC-12); the lead decides whether that's enough or the design's wording is worth a custom list.
- Help text is shown as Sanity's field description, under the label, always visible. Where the persona walkthrough of docs-editing-your-site corrected the design's help text against the site (the Art title appears on hover and as the opened picture's heading, not under it; how to mark the picture's focus; cropping; ordering; adding tags), the editor uses the guide's corrected wording, so the editor and the guide agree.
