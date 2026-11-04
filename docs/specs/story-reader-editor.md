---
status: draft
---

# Stories in the editor

<!-- Technical spec for the editor side of story-story-reader-put-a-story-on-the-site, from
design-story-reader (What Star enters, Flow: Star, States and errors, For the spec to check) and
docs-publishing-stories. The reader side (story and chapter pages, the Writing page, sharing, news,
and Preview of story pages) is a second spec, story-reader-pages, which follows this one. -->

## Problem

Star can't put a story's text on the site: the story item has no text field Star can see, no rating, and no chapters. This spec gives Star everything the guide describes in the editor, so stories can be written and published before fans can read them on the site (the second spec), and nothing a fan sees changes yet.

## User stories

- As Star, I want to paste a story or a chapter into the editor from a document such as Google Docs or Word (or from AO3, when it's back) and have its paragraphs, italics, bold and scene breaks kept, so that putting a story on the site is as quick as copying it. (story-story-reader-put-a-story-on-the-site)

## Acceptance criteria

Source: S3.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A story's form has, in this order, with the design's labels and help text: **Title**, **Web address**, **Short description**, **Cover**, **Genres**, **Rating**, **Content notes**, **Status**, **Text**, **Chapters**, **Date posted**, **Link to read it**. Nothing is hidden any more; the stored `slug` and `content` fields become **Web address** and **Text**, keeping anything already in them. | test: unit "story fields" | design-story-reader#what-star-enters |
| AC-2 | **Rating** offers General, Teen, Mature, Explicit and Not rated (stored `general`, `teen`, `mature`, `explicit`, `notRated`); **Status** offers In progress and Complete (`inProgress`, `complete`). A story with text or chapters can't be published without a web address ("Add a web address so readers can find this story.") or a rating ("Choose a rating, or Not rated."); the box at the top lists what to add, as for other items. | test: unit "story checks" | design-story-reader#what-star-enters, #states-and-errors |
| AC-3 | **Text** (on a story and on a chapter) allows only normal paragraphs with **Italic** and **Bold**, and a **Scene break** block, shown in the editor as a "Scene break" bar. The toolbar offers those three and nothing else. | test: unit "text schema"; manual (tutorial) | S3.1; design-story-reader#what-star-enters |
| AC-4 | Pasting into **Text** keeps paragraphs, italics and bold, and makes a scene break from a horizontal line, a line with only symbols on it (three or more of `*`, `~`, `-`, `#`, `=`, `•`, `·` and spaces, or a single `~`, `#` or `⁂`), or a run of two or more empty lines; a single empty line is dropped; headings and tables become plain paragraphs; pictures are dropped. Checked with Google Docs and Word clipboard HTML. | test: unit "paste" | S3.1; design-story-reader#how-it-works, #for-the-spec-to-check |
| AC-5 | Typing a symbol-only line and pressing Enter turns it into a scene break. | manual (tutorial) | design-story-reader#how-it-works |
| AC-6 | A story's **Chapters** lists its chapters in number order, each "Chapter 2: Over the Ridge · On the site" or "· Not published yet", and **Add chapter**, which opens a chapter beside the story with the next number filled in, as comic chapters do. A chapter has **Chapter** (a whole number, unique in its story: "Chapter 2 already exists in this story. Choose another number."), **Title**, **Text** (required: "Add the chapter's text.") and **Date posted** (filled in when first published, if empty). The pane is titled "The Long Road · Chapter 2: Over the Ridge". | test: unit "chapters"; manual | S3.2; design-story-reader#flow-star, #what-star-enters |
| AC-7 | **Add chapter** on a story that has **Text** and no chapters opens Chapter 1 with that text in it, and empties the story's **Text**; the chapter shows "Your story's text is now in Chapter 1." until it's published. | test: unit "one-shot to chapters"; manual | design-story-reader#how-it-works, #states-and-errors |
| AC-8 | On a story with chapters, **Text** is replaced by "This story has chapters, so its text is in them. To make it a one-shot again, move the text back and remove the chapters." | test: unit "story checks"; manual | design-story-reader#states-and-errors |
| AC-9 | Publishing a chapter whose published number changed, or a story whose published web address changed, first shows the comics' shared-link warning, worded for stories. A new story is published with its first chapter, as a series is. | test: unit "link warnings"; manual | design-story-reader#page-addresses, #flow-star |
| AC-10 | Deleting a story with chapters asks "Delete The Long Road and its 3 chapters?", with **Delete** and Cancel, then deletes the chapters and the story. | test: unit "delete"; manual | design-story-reader#flow-star |
| AC-11 | A story's help link is "Help: Start a new story" (`/help/publishing-stories#start-a-new-story`), a chapter's "Help: Add a chapter to a story" (`#add-a-chapter-to-a-story`). A chapter has the help link without **Preview** (its preview comes with the reader spec). | test: unit "item help" | design-story-reader#flow-star; design-help-links |
| AC-12 | Publishing a chapter shows the publish note and the live status, like other items; **View on site** opens the Writing page until story pages exist. | test: unit "live status" | design-story-reader#flow-star; design-know-when-live |
| AC-13 | The public site is unchanged: the Writing page, news and every other page render as now, and no draft or story text reaches the built site. | test: e2e (existing suites); command: `node scripts/check-no-drafts.mjs` | epic-story-reader |
| AC-14 | A manual tutorial (`docs/tutorials/publishing-stories.md`, `runner: manual`) walks through a one-shot pasted from Google Docs, a story in chapters, splitting a one-shot, and deleting a test story. | manual: the lead or Star | docs-publishing-stories |

## Scope

- In:
  - `sanity-studio/schemas/objects/writtenWork.ts`: the fields of AC-1 and AC-2; `slug` and `content` shown; `rating`, `contentNotes`, `status` added; **Chapters** as a read-only list field.
  - `sanity-studio/schemas/objects/storyChapter.ts` (new); `sanity-studio/schemas/objects/storyText.ts` (new): the shared text type with the scene break.
  - `sanity-studio/lib/stories.ts` (new, pure): field order, ratings, scene-break lines, paste clean-up, chapter rows and messages, the one-shot move, link warnings and the delete dialog.
  - `sanity-studio/lib/comic-pages.ts`: the chapter-list, numbering, link and delete helpers made to take a kind ("series"/"story") so comics and stories share them; comics' wording unchanged.
  - `sanity-studio/components/ChaptersList.tsx`: shared by series and stories; `StoryTextInput.tsx` (new): the paste handler and the Enter rule.
  - `sanity-studio/actions/`: chapter publish checks and the delete action for stories.
  - `sanity-studio/structure.ts`, `sanity.config.ts`: the story pane with its chapter as child, the chapter template, actions, badges.
  - `sanity-studio/lib/editor-content.ts`, `lib/help.ts`, `lib/live-status.ts`, `lib/preview.ts` (chapter not previewable yet).
  - Tests: `tests/unit/story-editor*.test.ts`; `docs/tutorials/publishing-stories.md`.
- Out: everything a fan sees (story-reader-pages); Preview of a story's page or a chapter (the story keeps its current preview, the Writing page).

## APIs and assumptions

Checked 2026-11-04 against the installed packages:

- `@portabletext/block-tools` 5.0.0 `htmlToBlocks` (what the editor uses on paste): italics and bold kept from Google Docs, Word and AO3-style HTML; `<hr>` dropped; typed `* * *` kept as a text block; Google Docs' `<br>` between paragraphs kept as empty blocks. A deserializer rule can turn `<hr>` into a block object.
- Sanity 5.1 `PortableTextInputProps.onPaste` (`OnPasteFn` from `@portabletext/editor` 4.1.3) lets the text input replace what's pasted with its own blocks.
- Sanity 5.1 form components accept `portableText.plugins`; `@portabletext/editor` 4.1.3 exports behaviours (`@portabletext/editor/behaviors`) that can act on Enter. AC-5 is built on one; if that proves unreliable in Sanity's editor, AC-5 falls back to the site's own rule (the reader spec shows symbol-only lines as scene breaks), and the guide's sentence is amended.
- Comic chapters already have: a list with Add chapter (`ChaptersList`), a template with a weak reference strengthened on publish, publish checks with a dialog, and a delete that removes chapters first. Stories reuse these, generalised.

## Non-functional requirements

- No change to what visitors see (AC-13).
- Existing stories keep everything entered; a story without text or chapters needs nothing new to publish.

## Delivery

- Plan item: epic-story-reader, story 3 (editor side). The reader spec builds on this one.

## Risks and decisions

- `slug` and `content` keep their stored names, so nothing already entered is lost; only their labels change.
- Comic and story chapters share code with a "kind" parameter rather than copies, so a fix to one is a fix to both.
- A chapter can't be previewed until story pages exist; its help link still shows.
