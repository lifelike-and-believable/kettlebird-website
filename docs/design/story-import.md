---
id: design-story-import
status: draft
derived-from:
  - story-story-reader-put-a-story-on-the-site: d1c236216e8c
  - design-story-reader#what-star-enters: cb3b54ba7c25
  - design-story-reader#flow-star: 8f4a733f5f05
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Writing from a file: design

<!-- docs/design/story-import.md. A design amendment asked for by the lead (2026-11-07): Star can upload a
story's or a chapter's writing from a .txt, .md, .pdf or .docx file, as an alternative to pasting it into the
Text box. Mock-ups are in docs/design/mockups/story-import/: PNG images, mockups.html (their source, in the
style of the story reader's editor mock-ups) and render.mjs. -->

## Personas

- persona-artist: Star writes in documents (Word, Google Docs, and plain text or Markdown files), and today copies each story or chapter and pastes it into **Text** (design-story-reader, "Flow: Star"). A long story is slow to select and copy, and a copy can miss the end. Uploading the file puts the whole of it in at once, by the same rules as a paste.

## The change

This amends design-story-reader, "What Star enters" and "Flow: Star": **Text** on a one-shot and on a chapter can be filled from a file as well as by pasting or typing.

**Upload a file** (mock-ups 1, 2 and 6):
- Above each **Text** box, a button, **Upload a file**, with ".docx, .pdf, .md or .txt, or drop one on the box" beside it. Dropping a file on the box does the same; while one is dragged over, the box says "Drop The Kettle's Song.docx to add its text" (mock-up 2).
- **Text**'s help text gains "or upload it from a file": "For a one-shot: paste or type the whole story, or upload it from a file. For a story in chapters, add chapters instead." On a chapter: "Paste or type the chapter, or upload it from a file."
- On a story with chapters, where **Text** shows only its note (design-story-reader, mock-up 7), there's no button: chapters are where the text goes.
- One file at a time; one file fills one **Text** box. A whole book in one file goes in chapter by chapter, as pasting does today (Decisions at review, 1).

**What comes through** is what a paste brings, by the same rules (design-story-reader, "What Star enters"; Star's guide, "Paste your text"):
- **.docx** (Word, and Google Docs' File, Download, Microsoft Word): paragraphs, *italics* and **bold**; a horizontal line, a line of only symbols such as `* * *`, or a gap of two or more empty lines becomes a **Scene break**. Headings and tables come through as plain paragraphs of their text; pictures, comments and tracked changes' deleted text are left out.
- **.md** (Markdown): paragraphs, `*italics*` or `_italics_`, `**bold**`; a `---`, `***` or `* * *` line becomes a scene break. Headings, lists and quotes come through as plain paragraphs of their text; links keep their words only.
- **.txt**: each line, or each paragraph between empty lines, becomes a paragraph; scene break lines and gaps as above. No italics or bold: plain text has none.
- **.pdf**: the words only, in paragraphs worked out from the gaps between lines. Italics, bold and scene breaks don't come through, and page numbers or headings repeated on each page may come in with the text (mock-up 5). Words broken across lines with a hyphen are joined.

**After a file is added** (mock-ups 3 and 5):
- The text appears in the box, and a note above it says what came in: "Added The Kettle's Song.docx: 48 paragraphs and 3 scene breaks. Its italics and bold came through. Read it through, then publish."
- For a PDF the note says what to check: "Added The Kettle's Song.pdf: 51 paragraphs. A PDF keeps only the words: italics, bold and scene breaks don't come through, so add them back, and delete any page numbers or headings that repeat on each page."
- For a .txt: "Added Notes.txt: 12 paragraphs and 1 scene break." (plain text has no italics to mention).
- The note stays until the text is edited or the item is published. Nothing goes live until Star publishes, as with a paste; **Preview** shows it first.

**When the box already has text** (mock-up 4): a dialog, "This text box already has text. Add The Long Road.docx after the text that's there, or replace it?", with **Cancel**, **Add at the end** and **Replace the text** (focused first, being what an upload is usually for, and undoable). An empty box is filled with no question.

**Undo**: the editor's own undo (Ctrl+Z or ⌘Z, or the document's history) takes the added text back out, as for a paste.

**When a file can't be added** (mock-up 7), a message above the box says why and what to do, and the box is left as it was:
- another kind of file (an older Word .doc, Pages, .rtf, .odt, a picture): "The Kettle's Song.doc can't be read here. Open it in Word or Google Docs, save or download it as .docx, and upload that."
- a PDF of scanned pages, with no words in it: "The Kettle's Song.pdf has no words in it, only pictures of pages (it was probably scanned). Upload the document it was made from instead."
- a locked PDF: "The Kettle's Song.pdf is locked with a password. Upload an unlocked copy, or the document it was made from."
- an empty file, or one with only pictures: "Draft.docx is empty, so nothing was added."
- a file over 20 MB: "The Kettle's Song.docx is over 20 MB, too big to read here. If it has pictures in it, save a copy without them."
- anything else going wrong: "Something went wrong reading Notes.md, and nothing was added. Try again, or paste the text instead."
- more than one file dropped at once: only the first is added, and the note says "Only one file at a time: added The Kettle's Song.docx."

**Where the file goes**: it's read in Star's browser and only its text is kept, in **Text**, as a paste is. The file itself isn't uploaded or stored anywhere.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | A story's and a chapter's **Text** (`sanity-studio/components/StoryTextInput.tsx`) | **Upload a file**, dropping a file on the box, the replace or add dialog, the notes and messages above the box. |
| 2 | The paste rules (`sanity-studio/lib/story-paste.ts`, `lib/stories.ts`) | Each kind of file turned into the HTML the paste rules already read: .docx by a Word reader, .md by a Markdown reader, .txt as a paste of plain text is, .pdf by a PDF reader's words and line gaps; then the same clean-up as a paste. The readers load only when a file is chosen, so the editor isn't slower to open. |
| 3 | **Text**'s help text (`sanity-studio/lib/stories.ts` or the schema) | "or upload it from a file". |
| 4 | Star's guide `publishing-stories.md` | "Upload a file" beside "Paste your text" (For the guide). |

## Mock-ups

Low-fidelity, in the style of the story reader's editor mock-ups. Source: `mockups/story-import/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | A one-shot's **Text**, empty, with **Upload a file** above the box | `mockups/story-import/1-upload-button.png` |
| 2 | A file dragged over the box | `mockups/story-import/2-drop.png` |
| 3 | After a Word document: the text, and the note saying what came through | `mockups/story-import/3-after-docx.png` |
| 4 | Uploading into a box that already has text: **Cancel**, **Add at the end**, **Replace the text** | `mockups/story-import/4-replace-or-add.png` |
| 5 | After a PDF: the words, and the note saying what to check | `mockups/story-import/5-after-pdf.png` |
| 6 | A chapter's **Text**, with the same button | `mockups/story-import/6-chapter.png` |
| 7 | The messages when a file can't be added | `mockups/story-import/7-errors.png` |

## States and errors

| Situation | What happens |
|---|---|
| An empty **Text**, a file chosen or dropped | Its text fills the box; a note says what came in. |
| **Text** with text in it | The dialog: **Add at the end**, **Replace the text**, or **Cancel** (nothing changes). |
| A story with chapters | No **Upload a file** on the story's **Text**; each chapter has its own. |
| .docx, .md, .txt | Paragraphs and scene breaks; italics and bold from .docx and .md. |
| .pdf with words | The words in paragraphs; a note to add back italics, bold and scene breaks. |
| .pdf of scanned pages, a locked .pdf, another kind of file, an empty file, over 20 MB, an error | A message above the box saying why and what to do; the box unchanged. |
| More than one file dropped | The first is added; the note says only one at a time. |
| A mistake | The editor's undo takes it back out. |

## Accessibility

- **Upload a file** is a button reached with Tab and opened with Enter or Space; it opens the computer's own file chooser, so it works with a keyboard and a screen reader. Dropping a file is an extra, never the only way.
- The note after a file is added is a status message, read out by a screen reader; an error is an alert.
- The dialog is a modal dialog with its question as its name; focus starts on **Replace the text**, Escape is **Cancel**, and focus returns to **Upload a file** when it closes.
- The added text is ordinary text in the box, editable as a paste is.

## For the guide

Star's guide `publishing-stories.md`, after "Paste your text", a section "Upload a file":
- choose **Upload a file** above **Text**, or drop a file on the box; .docx, .pdf, .md or .txt;
- from Google Docs: File, Download, Microsoft Word (.docx), then upload that;
- what comes through from each kind of file, and that PDFs keep only the words;
- adding to a box that already has text: **Add at the end** or **Replace the text**;
- undo, and the messages when a file can't be added;
- that the file itself isn't kept, only its text;
- one file per text box, so a book in one file goes in chapter by chapter (unless the lead decides otherwise).

## For the spec to check

- **Upload a file** on a one-shot's and a chapter's **Text**, not on a story with chapters; the help texts.
- Each kind of file, from sample files kept with the tests: a .docx from Word and one from Google Docs (italics, bold, a horizontal line, `* * *`, two empty lines, a heading, a table, a picture, a comment, a tracked deletion); a .md (emphasis both ways, bold, `---`, headings, a list, a link); a .txt (lines, empty lines, `* * *`); a .pdf with words (two pages, page numbers, a hyphenated word); the block count and the note.
- The same text from a .docx and from pasting the same document give the same blocks.
- The dialog: Add at the end keeps the text and adds after it; Replace replaces it; Cancel and Escape change nothing; focus.
- Each message: a .doc, a scanned .pdf, a locked .pdf, an empty .docx, a file over 20 MB, a broken file; the box unchanged.
- More than one file dropped.
- The readers load only when a file is chosen (the editor's first load doesn't fetch them).
- The file isn't stored: no asset is created.

## Decisions at review

For the lead:
1. **A book in one file**: one file fills one text box, as proposed, so a story in chapters is uploaded chapter by chapter; or should a file with chapter headings ("Chapter 1", "Chapter 2: Over the Ridge") be split into the story's chapters, made for Star?
2. **Text already in the box**: ask, as proposed (Add at the end or Replace); or always replace?
3. **PDFs**: the words only, with a note, as proposed; or leave PDFs out, so every upload keeps italics and scene breaks, and Star saves PDFs' source documents instead?

## Persona walkthrough

Not yet run; its findings will be folded in here before review.
