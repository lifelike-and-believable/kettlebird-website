---
status: implemented
tests-commit:
  - 7888cf0320d6d947ba5643c6d0afb923c8ea2a3a
  - 3f6d28337bfd44d659fabbc12551e9f483a13328
---

# Publish comic pages and chapters

<!-- Technical spec for story-comic-reader-publish-pages, from design-comic-publish-pages (with its
mock-ups) and docs-publishing-comics. A plan-feature spec without an id. -->

## Problem

Star has no way to add a comic chapter's pages in bulk, in order, with alt text, or to know when publishing would break links fans have shared. The editor (Sanity Studio) has the Chapter type from stories 1 and 2, but only Sanity's default inputs.

## User stories

- As Star, I want pages and chapters I add in the CMS to appear in the reader, in order, after the next deploy, so that new pages reach fans without a developer. (story-comic-reader-publish-pages)

## Acceptance criteria

Source: S5.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | Files are ordered by name with numbers compared as numbers (`page-2` before `page-10`), case-insensitively. | test: unit "natural file order" | S5.2; design-comic-publish-pages#ordering-and-addresses |
| AC-2 | Choosing files with **Upload pages**, or dropping them on the page grid, uploads them as pages appended after existing pages in file-name order. | test: unit "append uploads in order"; manual: tutorial step in the Studio | S5.2; docs-publishing-comics#add-pages |
| AC-3 | PNG, JPEG, TIFF, WebP, and GIF files upload; any other file (PSD, PDF, text) becomes a page tile saying "This isn't an image file" with **Remove**, and is never uploaded. | test: unit "accepted file types" | S5.3; docs-publishing-comics#if-something-goes-wrong |
| AC-4 | An upload that fails leaves its tile saying "Didn't upload" with **Try again**, which retries only that file. | test: unit "upload queue states"; manual | design-comic-publish-pages#states-and-errors |
| AC-5 | While any upload is in progress, the **Publish** action is disabled and labelled "Uploading N of M…"; leaving the page asks the browser's leave prompt. | test: unit "publish label while uploading"; manual | design-comic-publish-pages#flow |
| AC-6 | The **Pages** header shows "N pages need alt text" (or "1 page needs alt text") when any page has empty alt text, and nothing when none do. | test: unit "alt text count and wording" | S5.4; design-comic-publish-pages#layout |
| AC-7 | When published pages would move, be removed, or have a page inserted before them, or a published chapter's number changes, **Publish** first shows "Some page links will change" with the design's wording, naming the first affected page and the chapter, with **Publish anyway** and **Cancel**. Appending pages or adding a chapter shows no warning. | test: unit "link changes between published and draft" | S5.6, S5.7; design-comic-publish-pages#ordering-and-addresses |
| AC-8 | When pages lack alt text, **Publish** first shows the reminder (alone as "Some pages have no alt text", or as a line in the link-change dialog); **Publish anyway** publishes. | test: unit "publish dialog content" | S5.4; design-comic-publish-pages#flow (mock-ups 4 and 10) |
| AC-9 | Two chapters of the same series can't share a number: publishing is blocked with "Chapter 2 already exists in this series. Choose another number." | test: unit "duplicate chapter numbers" | design-comic-publish-pages#states-and-errors |
| AC-10 | A series without a web address can't be published, with "Add a web address so readers can find this comic." | test: unit "schema messages" | design-comic-publish-pages#states-and-errors |
| AC-11 | A series shows its chapters in number order, each "Chapter N: Title · P pages · On the site / Not published yet", with **Add chapter**, which opens a new chapter for that series with the next number filled in. | test: unit "chapter rows and next number"; manual | S5.1; design-comic-publish-pages#layout |
| AC-12 | In an open page, **Previous page** and **Next page** move to the neighbouring page without closing the panel. | manual: tutorial step in the Studio | design-comic-publish-pages#layout |
| AC-13 | Published pages and chapters appear in the reader, in Star's order, after the site's next build. | test: e2e (existing reader tests over fixtures that mirror the CMS shape); command: build | S5.5 |
| AC-15 | Publishing the first chapter of a series that isn't on the site yet publishes the series too, after a dialog saying so ("Kettle Tales isn't on the site yet, so publishing this chapter publishes it too.", **Publish both**), or as a line in the other dialogs. A series without a web address blocks it with the AC-10 message. | test: unit "publishing a new series with its chapter"; manual | design-comic-publish-pages#flow (step 9); docs-publishing-comics#start-a-new-comic |
| AC-14 | A Studio tutorial (`runner: manual`) walks Star's guide end to end in the real editor, and the Studio builds. | command: `npm run build` in `sanity-studio/`; manual: the tutorial | process stage 12 |

## Scope

- In:
  - `sanity-studio/lib/comic-pages.ts` (new): pure functions for AC-1, 3, 4, 5, 6, 7, 8, 9, 11, 15; no `sanity` imports, so the site's Vitest can test them.
  - `sanity-studio/components/PagesInput.tsx` (new): the **Pages** array input: header with count and **Upload pages**, drop zone, upload queue with progress and errors, natural-order append; renders Sanity's default grid for reordering and editing.
  - `sanity-studio/components/PageItemNav.tsx` (new): **Previous page** / **Next page** in the page panel.
  - `sanity-studio/components/ChaptersList.tsx` (new): the series' chapter rows and **Add chapter**.
  - `sanity-studio/actions/publishChapter.tsx` (new): wraps Publish for chapters: upload wait, link-change and alt text dialogs, publishing a new series with it.
  - `sanity-studio/schemas/objects/comicChapter.ts`, `comicSeries.ts`: wire the components, validation messages, initial value template for **Add chapter**.
  - `sanity-studio/sanity.config.ts`: register the action and template.
  - Tests: `tests/unit/comic-pages.test.ts`; `docs/tutorials/publishing-comics.md` (`runner: manual`).
- Out: the editor at `/studio`, the menu layout, and the publish status and **View on site** (content-editing stories 2, 3, 6); **Preview** (content-editing story 5); automatic panel detection (second comic epic); a resize step for very large files (only if the sample check needs it).

## APIs and assumptions

- APIs used (checked in the installed `sanity` 5.1.0 types, `sanity-studio/node_modules/sanity/lib/index.d.ts`): `DocumentActionComponent` and its `dialog` (`DocumentActionDialogProps`), `useDocumentOperation`, `ArrayOfObjectsInputProps` with `renderDefault`, `useClient` (`client.assets.upload`), patch helpers `insert`, `set`, `setIfMissing`, `useFormValue`, `IntentLink`, image array items' `_upload` state.
- Assumptions that could be wrong:
  - Sanity's image pipeline accepts TIFF uploads. Check with the print-resolution sample; if not, TIFF moves to "save as PNG" in the guide, or a conversion step is added.
  - The Studio's default array grid supports drag reordering and keyboard reordering of image items (it does for arrays of objects; confirm for image members in the manual pass).
  - Sanity accepts a custom publish action replacing the default one for one document type.

## Non-functional requirements

- Uploads run at most three at a time, so a batch of print-resolution files doesn't stall the browser.
- Every new control is a Sanity UI component, keyboard operable; warnings use an icon and words.

## Delivery

- Plan item: epic-comic-reader, story 5.
- AC-15 was added after the first tests commit, when the code was checked against Star's guide ("Start a new comic", step 4); its test was committed failing in the second tests commit.

## Risks and decisions

- Studio components can't be tested end to end in CI without a Sanity login, so their logic lives in pure functions with unit tests, and the components are checked by a `runner: manual` tutorial in the real editor before release. This is the first manual tutorial on the project.
- Replacing the chapter's Publish action changes how Star publishes chapters; other document types keep the default.
