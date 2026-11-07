---
status: draft
tests-commit: 5bb80574355c4052cc92792b92c329f835d50c68
unlocks:
  - tests/unit/story-editor.test.ts: the one-shot's Text help and the story-with-chapters note now speak of uploading a Word document (story-import-word AC-1, AC-2), as design-story-import says; pasting and typing are gone.
  - tests/unit/organised-editor.test.ts: the one-shot's Text help, as above.
  - tests/unit/organised-editor.test.ts: "no developer words" now lets "Word document" through, as the design's help text says it (story-import-word AC-1): it's Star's word for her files, not the editor's "document". The criterion is unchanged.
  - tests/e2e/story-pictures.spec.ts: AC-26 looked for the full-screen view by a `role` attribute, which a `dialog` element has without one; it now finds the `dialog`, once it shows. The criterion is unchanged.
  - tests/fixtures/word/make-docx.mjs, word-chapter.docx, edited.docx: the maker escaped a table cell's picture as text, and wrote line breaks in alt text as spaces where Word writes `&#xA;`; both now as Word saves them. Four short paragraphs were added near the end of the Word sample, so its scene breaks (4 in 20 paragraphs) are below the "a lot of scene breaks" warning, as the test expected. The criteria are unchanged.
  - tests/unit/story-import.test.ts: jsdom is loaded as story-editor.test.ts loads it, as it has no types here, and a sample picture's type is typed as the value it is, which the type check asks for. The criteria are unchanged.
  - tests/unit/story-import.test.ts: AC-27's "guide" check was missing from the tests commit; added. The criterion is unchanged.
  - tests/unit/help.test.ts: the guide's summary is now "Starting a story, uploading its text, chapters, and ratings." (story-import-word AC-27, the design's For the guide). The criterion is unchanged.
  - tests/unit/story-import.test.ts: a sample picture in AC-11 now has its document number (pictures carry it, so the note can name the right picture when one fails to upload). The criterion is unchanged.
  - tests/unit/story-import.test.ts: AC-15's checks now count a same picture whose alt text changed in Word as taking Word's new alt text (`changed`), not as keeping its own, and AC-14 checks the question's wording for it; both criteria are reworded to say so (found by code review: the question said "keeps its alt text" for a picture that didn't).
  - tests/unit/story-import-edges.test.ts (new): edge cases found by code review and mutation testing, with small documents built in the test: bottom borders set to nil or none, paragraphs deleted with track changes on, italics and bold from paragraph styles and what styles are based on, drop caps, tables in cells and pictures left out of tables once each, older Word's shape templates, picture types and targets, notes, unreadable documents, the first line, and the pure helpers' corners. AC-6, AC-8 and AC-18 are reworded to name what they now check.
  - tests/unit/story-editor-edges.test.ts: the paste rules' schema now has the picture block too (story-import-word AC-3, AC-8), as the editor's Text type does.
---

# Stories: writing from Word documents

<!-- Technical spec for design-story-import (approved 2026-11-07, with the lead's decisions: .docx only, one file per
chapter for now; pictures kept; no text box, the editor shows the text read-only; pictures on the site at the
column's width or their own, whichever is smaller; no stories to carry over). Amends story-reader-editor (AC-3,
AC-4, AC-5, AC-7, AC-8: the text box, pasting and typing go) and story-reader-pages (AC-4: pictures in the text).
A plan-feature spec without an id. -->

## Problem

Star writes in Word documents, one per chapter, some with her own pictures. Today she copies each chapter and pastes it into **Text**: a long chapter is slow to select, a copy can miss the end, and her pictures are left out. Fans never see the pictures she put in.

## User stories

- As Star, I want to upload a chapter's Word document and have its text, italics, bold, scene breaks and pictures come in, so that my document stays the one place my writing lives. (design-story-import#personas)
- As a fan, I want to see Star's pictures where she put them, described for screen readers, so that I read the chapter as she made it. (design-story-import#personas)

## Acceptance criteria

Source: design-story-import sections as named. "The sample documents" are the .docx files in `tests/fixtures/word/`, made by `tests/fixtures/word/make-docx.mjs` in the shapes Word and Google Docs save (listed under Delivery). Picture numbers count the pictures that came in, in the text's order, unless a criterion says otherwise.

### The editor

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | **Text** on a one-shot and on a chapter has the button **Upload a Word document**, the line ".docx, or drop one below", and, while it's empty, a drop space: "No text yet. Drop the chapter's .docx here, or use Upload a Word document." ("…the story's .docx…" on a one-shot); while a file is dragged over it, "Drop the file here". There's no box to paste or type in. The help texts are the design's: on a chapter "Upload the chapter as a Word document (.docx). Its text and pictures come in; Word's layout and picture sizes don't. To change them, change the document and upload it again."; on a story "For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead." | test: unit "texts"; manual (tutorial) | #upload-a-word-document |
| AC-2 | On a story with chapters, **Text** has no button, and its note is "This story has chapters, so its text is in them. To make it a one-shot again, remove its chapters and upload the whole story here." | test: unit "texts"; manual | #no-stories-to-carry-over-and-splitting-a-one-shot |
| AC-3 | The text's schema (`storyText`) keeps paragraphs with **Italic** and **Bold**, and scene breaks, and adds a picture block, `storyPicture`: `image` (an image), `alt` (**Alt text**, a string), `decorative` (**Decorative**, a boolean), and hidden `fromWord` (whether **Alt text** is Word's), `wordAlt` and `wordDecorative` (what Word said at the last upload), `hash` (the picture's data's SHA-256, hex) and `edited` (set when Star changes **Alt text** or **Decorative**). A story and a chapter have a hidden `textUpload`: `fileName`, `addedAt` (ISO time), `note` (the note's lines), `noteClosed`, `previous` (what Undo puts back, as JSON text, so its pictures aren't references) and `discarded` (picture asset ids no longer used). | test: unit "schema" | #where-it-applies (4), #after-a-document-is-added |
| AC-4 | A file is checked before it's read, by its name and size, and a problem gives the design's message: not a Word document ("Notes.pdf isn't a Word document. Upload the chapter as a .docx: in Word, File, Save As, Word Document; in Google Docs, File, Download, Microsoft Word (.docx)."), `.doc`, `.gdoc`, over 50 MB (52,428,800 bytes). A file named `.docx` in any letter case passes. | test: unit "file checks" | #when-a-document-cant-be-added |
| AC-5 | Reading a file that's locked with a password (an encrypted document, which starts with the compound-file signature `D0 CF 11 E0`), that has no words and no pictures, or that can't be read at all (not a zip, no `word/document.xml`, broken XML) gives the design's message for it, and nothing changes. | test: unit "reading problems" | #when-a-document-cant-be-added |
| AC-6 | From the sample documents, the reader brings in: paragraphs; italics and bold (including from a character style that is italic or bold); Shift+Enter breaks as line breaks within the paragraph; a scene break for a symbol line (`* * *`, `***`, `---`, `~`, `⁂`), for two or more empty paragraphs together, and for Word's horizontal line both ways (an `o:hr` shape, and an empty paragraph with only a bottom border); headings as plain paragraphs; a table's rows as paragraphs, cells joined with " · "; footnotes and endnotes at the end, numbered in order, "[1] …", with "[1]" left where each was. It leaves out text boxes (and what's in them), comments, page headers and footers. Tracked insertions and Google Docs suggestions come in, deletions don't, as if accepted, and a paragraph deleted whole leaves no empty line. A bottom border set to nil or none isn't a line. Italics and bold also come from a paragraph's style and from what a style is based on. A drop cap starts the paragraph after it. | test: unit "reading Word" | #what-comes-through-from-a-docx |
| AC-7 | The reader's paragraphs, marks and scene breaks go through the paste rules (`pasteHtml`, `cleanPastedBlocks`): the same chapter as clipboard HTML and as a .docx gives the same blocks. | test: unit "same as pasting" | #for-the-spec-to-check |
| AC-8 | Pictures come in where they are, each its own block just after the paragraph it was in (before it, when the paragraph has no text); a picture beside the text (anchored), inside a paragraph with text, or sharing a paragraph with another picture counts as moved. JPEG, PNG, GIF and WebP come in; a picture inside a text box or a table, and a Word drawing or chart, is left out and counted once, by where it was (older Word's shape templates aren't counted); an EMF, WMF or TIFF picture can't be added (its message, AC-11). A picture with a crop in Word is marked cropped. A picture used twice comes in twice, as two blocks with the same picture data. | test: unit "pictures" | #what-comes-through-from-a-docx |
| AC-9 | A picture's **Alt text** is Word's description (`wp:docPr` `descr`), trimmed, marked from Word; Word's automatic alt text (ending "Description automatically generated", or "Description generated with high confidence" or "very high confidence", in any case) and a description that's only a file name (`IMG_2041.jpg`) are left empty. **Decorative** is ticked for a picture Word marked decorative (`adec:decorative val="1"`). | test: unit "alt text" | #after-a-document-is-added |
| AC-10 | The first line with text is left out when, ignoring case, spaces and punctuation, it is the chapter's label ("Chapter 3: Over the Ridge"), "Chapter 3", the chapter's title, or, on a one-shot, the story's title; as a heading or a paragraph. Nothing else is left out. | test: unit "first line" | #after-a-document-is-added |
| AC-11 | The note after an upload has the design's lines, in this order, only those that apply: "Only one document at a time: added The Long Road 3.docx." in place of the first line's start when several were dropped; "Added The Long Road 3.docx: 48 paragraphs, 3 scene breaks and 3 pictures, with its italics and bold." (singulars for one; a part with none left out; "with its italics", "with its bold" or nothing); the first line left out; headings ("2 headings came in as plain paragraphs: "Morning" and "The Ridge"."); tables ("1 table came in as plain paragraphs, one per row."); footnotes ("2 footnotes came in at the end, numbered."); moved pictures; pictures left out, by where (text box, table, drawing or chart); each cropped picture; alt text from Word ("1 alt text came from Word: check it."); tracked changes; many scene breaks (at least 3, and more than one for every 5 paragraphs); each picture that couldn't be added ("Picture 2 in The Long Road 3.docx couldn't be added (it's a drawing made in Word, which the site can't show), so the chapter was added without it. …", numbered among the document's pictures, with the reason for EMF and WMF, TIFF, or a failed upload); and last "Check the chapter, then publish." | test: unit "the note" | #after-a-document-is-added, #when-a-document-cant-be-added |
| AC-12 | Before it's uploaded, a picture is re-saved in the browser through a canvas, at most 3200 pixels wide (keeping its shape), which drops what the file carries about where it was taken: JPEG as JPEG, PNG and GIF as PNG, WebP as WebP. | test: unit "re-saving"; manual (a phone photo with a location, checked after upload) | #what-comes-through-from-a-docx |
| AC-13 | **Pictures** lists the text's pictures in order, "Picture 1" and so on, each with **Alt text** ("Alt text for picture 2"), "alt text from Word" while it's Word's, and **Decorative** ("Decorative: screen readers skip it"); a picture with neither has the mark "Alt text" and "Add alt text so people using screen readers know what it shows, or tick Decorative. You can still publish."; the list's heading line is "1 needs alt text", "2 need alt text", or "Every picture has alt text or is decorative." Publishing isn't stopped. | test: unit "alt text needed"; manual | #after-a-document-is-added |
| AC-14 | Uploading into a **Text** that has text first asks, in a dialog named by its question: "Replace Chapter 3's text?" ("Replace the story's text?" on a one-shot), "Now: The Long Road 3.docx, added 2:38 pm: 48 paragraphs, 3 pictures." (or "added 5 November" on an earlier day; without an upload, "Now: 48 paragraphs, 3 pictures."; no pictures, no pictures part), "New: The Long Road 3 (edited).docx: 51 paragraphs, 3 pictures; 2 keep their alt text, 1 is new." (and "1 takes Word's new alt text" for a same picture whose alt text changed in Word), then "Anything changed in the editor since the last upload (alt text, Decorative) is kept for pictures that are still there. You can undo this until you publish."; **Cancel** first and focused, Escape cancelling, then **Replace**. The document is read before asking, and nothing is uploaded until **Replace**. | test: unit "the question"; manual | #a-new-version |
| AC-15 | In a new version, a picture is the same picture when its data's hash is the same; the nth use of a picture takes the settings of the nth use before. A same picture keeps its **Alt text**, **Decorative** and where its alt text came from, unless Word's alt text or decorative mark changed since the last upload, when Word's wins (counted as taking Word's new alt text, not as keeping its own). A picture with new data takes Word's. | test: unit "same pictures" | #a-new-version |
| AC-16 | Above the text, the upload line: "The Long Road 3.docx, added 2:38 pm, not published yet · Undo this upload"; once the published version has this upload, whatever's changed since, "The Long Road 3.docx, added 2:38 pm" and no undo. **Undo this upload** puts **Text** and the upload line back as they were, pictures and their settings included; if a picture's **Alt text** or **Decorative** was changed since, it first asks "Undo this upload? Alt text you've typed since will go too." with **Cancel** and **Undo**. It's kept with the item, so it's there after closing the note or reloading; one upload back. Publishing drops what Undo would put back, and **Add chapter** moves the upload line without it. Alt text "changed since" means since this upload. | test: unit "undo"; manual | #after-a-document-is-added |
| AC-17 | While reading, the note is "Reading The Long Road 3.docx…", then "Reading The Long Road 3.docx… adding picture 1 of 2.", and the button is disabled; a file dropped meanwhile, or while the text can't be changed, is ignored. The Word reader and the zip library load only when a document is chosen or dropped (a separate chunk of the editor's build). | test: unit "texts"; manual (the editor's network panel) | #upload-a-word-document |
| AC-18 | Pictures replaced or undone are recorded in `discarded`; when the item is published or deleted, each discarded picture, and each picture its published version used that the new one doesn't, is deleted from the picture library if nothing refers to it and no draft's Undo copy holds it, once the publish or delete has reached the dataset (a cancelled Delete, or a Publish stopped by validation, removes nothing). Deleting a story with its chapters does the same for all of them. Pictures in use stay. | test: unit "unused pictures"; manual | #where-things-go |
| AC-19 | **Add chapter** on a one-shot moves its text and its upload line into Chapter 1, as it moves the text now. | test: unit "one-shot to chapters" | #no-stories-to-carry-over-and-splitting-a-one-shot |
| AC-20 | Accessibility in the editor: **Upload a Word document** is a button (Tab, Enter, Space) opening the file chooser, which lists .docx files only (`accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"`); the reading line and the note are status messages (`role="status"`); a message about a file that can't be added is an alert (`role="alert"`) and replaces the last; the questions are modal dialogs, focus returning to the button. | manual (tutorial) | #accessibility |

### The site

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-21 | The stories query fetches a picture block's alt text, decorative mark, and its image's asset and size; the site's model has a picture block (`storyPicture`: address, widths, width, height, alt). Its alt is **Alt text** when there is some, empty when decorative, else "Picture". | test: unit "site pictures" | #on-the-site |
| AC-22 | In the text's HTML a picture is in reading order where it was, an `img` with its alt, `width` and `height`, `loading="lazy"`, `decoding="async"`, a `srcset` at 480, 800, 1200 and 1600 pixels wide that are smaller than the picture, plus the picture's own width when under 1600, and `sizes` of the column's width or the picture's, whichever is smaller. A picture that isn't decorative is inside a button named "Show full screen: " and its alt; a decorative one isn't a button. A text without pictures is as now. | test: unit "story html" | #on-the-site |
| AC-23 | On a story's page, at 1280 × 800 and at 390 × 844 (a phone), a 2400-wide picture is the column's width, a 300-wide one 300 wide, both centred, with their shape; each takes its shape from its `width` and `height` (`aspect-ratio`), so its space is kept while it loads; a decorative one has an empty alt; nothing scrolls sideways. | test: e2e "pictures in the column" | #on-the-site |
| AC-24 | Clicking a picture, or Enter or Space on it, opens it full screen, as large as the window allows, in a modal dialog named by its alt text; Escape or its **Close** button closes it, with focus back on the picture. | test: e2e "full screen" | #on-the-site, #accessibility |
| AC-25 | On a Mature story, pictures are hidden with the text until **Continue to the story**. | test: e2e "hidden until continue" | #on-the-site |
| AC-26 | The page passes the site's accessibility check (axe) with pictures in the text. | test: e2e "accessibility" | #accessibility |

### The guide and the tutorial

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-27 | Star's guide `publishing-stories.md` says what the design's For the guide lists, its `summary:` is "Starting a story, uploading its text, chapters, and ratings.", and nothing in it says to paste. | test: unit "guide"; manual: review of the guide | #for-the-guide |
| AC-28 | The manual tutorial `docs/tutorials/publishing-stories.md` walks through uploading a one-shot and a chapter from the sample documents, adding alt text, a new version, **Undo this upload**, a wrong file, and splitting a one-shot. | manual: the lead or Star | #for-the-spec-to-check |

## Scope

- In:
  - `sanity-studio/lib/word/` (new, pure): `read-docx.ts` (the Word reader: a .docx to the paste rules' HTML, its pictures and what the note needs), `upload.ts` (the reader's HTML through `pasteHtml` with pictures kept, the first line, the counts), `messages.ts` (every text: help, drop space, reading line, the note, file and reading messages, the question, the upload line), `pictures.ts` (alt text from Word, re-save size and type, matching pictures, the alt text count, undo, unused pictures).
  - `sanity-studio/lib/word/cleanup.ts` (new): removing unused pictures once a publish or delete has reached the dataset, used by `actions/unusedPictures.tsx` and a story's Delete in `actions/deleteSeries.tsx`.
  - `sanity-studio/lib/story-paste.ts` and `lib/stories.ts`: the picture block kept by the clean-up; the story-with-chapters note.
  - `sanity-studio/schemas/objects/storyText.ts` (the picture block), `writtenWork.ts` and `storyChapter.ts` (`textUpload`).
  - `sanity-studio/components/StoryTextInput.tsx` (the upload, the read-only text, **Pictures**, the line, the note, the questions), and a small re-save helper using a canvas.
  - `sanity-studio/actions/`: removing unused pictures on publish and delete; Add chapter moving `textUpload`.
  - The site: `src/lib/stories/source.ts`, `model.ts`, `text.ts`, `StoryText.astro`, and the full-screen view for story pictures.
  - Fixtures: the sample documents and their maker; a fixture story with pictures in `tests/fixtures/stories.ts`.
  - Guides: `docs/user/publishing-stories.md`; `docs/tutorials/publishing-stories.md`.
  - Tests: `tests/unit/story-import.test.ts`, `tests/unit/story-import-site.test.ts`, `tests/e2e/story-pictures.spec.ts`, and the unlocks below.
- Out: whole works split into chapters (design, Later); pasting and typing; other file types; Google Docs links.

## APIs and assumptions

- A .docx is a zip of XML parts (Office Open XML): `word/document.xml`, `word/styles.xml`, `word/footnotes.xml`, `word/endnotes.xml`, `word/_rels/document.xml.rels`, and `word/media/*`. The zip is read with `fflate` (0.8.2, about 8 kB for unzipping, added to the editor and the site's dev dependencies); the XML with the browser's `DOMParser` (jsdom's in tests).
- Headings are paragraphs whose style's name (from `styles.xml`) is "heading 1" to "heading 9", "Title" or "Subtitle", or that have an outline level; style ids aren't relied on, as they're translated in other languages.
- Word saves a decorative picture with the `adec:decorative` extension (Word 365); Google Docs saves alt text in `descr` and has no decorative mark.
- An encrypted .docx is a compound file, not a zip, so it can't be read without the password.
- Sanity's `client.assets.upload('image', blob)` returns an asset with its id and size; an identical file returns the same asset.
- The browser's canvas drops a picture's metadata when it encodes; GIFs keep their first frame.

## Non-functional requirements

- The reader runs in Star's browser; a 50 MB document is read without freezing the editor for more than a moment (the reading line shows first).
- The Word reader is a separate chunk, loaded on first use.
- Pictures on the site are fetched at the size shown, lazily, with their space reserved.

## Delivery

- Plan item: design-story-import (PR 171).
- Sample documents (`tests/fixtures/word/`): `word-chapter.docx` (Word's shapes: a title first line as a heading, italics, bold, a bold character style, Shift+Enter, `* * *`, two empty paragraphs, both horizontal lines, a heading, a table, a footnote and an endnote, a text box with a picture, a comment, a tracked insertion and deletion, a page header; pictures: a JPEG with alt text, alone; a PNG beside the text with Word's automatic alt text; a cropped PNG; a decorative PNG; the JPEG used again; one with a file name for alt text; a Word drawing; a chart; an EMF), `gdocs-chapter.docx` (Google Docs' shapes: italics, bold, `***`, a suggestion, two inline pictures, one with alt text), `spacing.docx` (double spacing made with empty paragraphs), `pictures-only.docx`, `empty.docx`, `locked.docx`, `broken.docx`, and `edited.docx` (`word-chapter.docx` with a paragraph added, one picture re-encoded and one alt text changed in Word).
- Existing tests whose criteria this changes, recorded under `unlocks:` with the tests commit: `tests/unit/story-editor.test.ts` and `tests/unit/organised-editor.test.ts` (the one-shot's **Text** help and the story-with-chapters note).
- Fixtures: The Long Road's chapter 3 gets a 2400 × 1600 picture, a 300 × 200 one and a decorative one; Night Market (Mature) a picture.

## Risks and decisions

- The sample documents are made by a script in the shapes Word and Google Docs save, not saved by those apps; the tutorial (AC-28) uploads one of Star's own documents too.
- A decorative picture isn't a button on the site: it's skipped by screen readers, and a button there would be read out.
- Pictures are uploaded after the question, not as they're read (the design says "as they're read"), so **Cancel** leaves nothing behind.
- A draft discarded with **Discard changes** can leave its upload's pictures in the library; that's rare and harmless, and not cleaned up.
- Publishing drops the upload's Undo copy just before it publishes, so a Publish that validation then stops also loses Undo for that upload; the text itself is unchanged.
- The removal of unused pictures waits up to two minutes for a publish or delete to reach the dataset; one that takes longer leaves its pictures, to be removed at the item's next publish (discarded ones) or not at all (a slow delete).
- New pure logic (`sanity-studio/lib/word/`) is mutation tested.
