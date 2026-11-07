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

- persona-artist: Star writes in documents (the story names Google Docs and Word; plain text and Markdown files are the lead's request), and today copies each story or chapter and pastes it into **Text** (design-story-reader, "Flow: Star"). A long story is slow to select and copy, and a copy can miss the end. Uploading the file puts the whole of it in at once, by the same rules as a paste where the file allows.

## The change

This amends design-story-reader, "What Star enters" and "Flow: Star": **Text** on a one-shot and on a chapter can be filled from a file as well as by pasting or typing.

**Upload a file** (mock-ups 1, 2 and 6):
- Above each **Text** box, a button, **Upload a file**, with ".docx, .pdf, .md or .txt, or drop one on the box" beside it. Dropping a file on the box does the same; while one is dragged over, the box says "Drop the file here to add its text" (mock-up 2; a browser doesn't give a dragged file's name until it's dropped). The guide says to drop it on the box: dropped anywhere else, the browser may open it instead.
- **Text**'s help text gains "or upload it from a file": "For a one-shot: paste or type the whole story, or upload it from a file. For a story in chapters, add chapters instead." On a chapter: "Paste or type the chapter, or upload it from a file."
- On a story with chapters, where **Text** shows its note (design-story-reader, mock-up 7), there's no button: chapters are where the text goes. Text left in such a story stays visible, as now, to move into a chapter.
- One file at a time; one file fills one **Text** box. A file can't be selected from as a paste can, so for a whole book in one file the guide gives a recipe: upload it into a one-shot's **Text**, choose **Add chapter** (which moves the text into Chapter 1), then cut each later chapter out and paste it into a new chapter. The book's own title and chapter headings come in as plain paragraphs, to delete (Decisions at review, 1, would make this a split instead).
- While a file is read, the note says "Reading The Kettle's Song.docx…" and the button waits; nothing else can be uploaded into that box until it's done (mock-up 8).

**What comes through** is what a paste brings, by the same rules (design-story-reader, "What Star enters"; Star's guide, "Paste your text"):
- A **scene break** comes from what the paste rules already know (`isSceneBreakLine` in `lib/stories.ts`): a line of three or more of `* ~ - # = • ·` (such as `* * *`, `***`, `---`, `~~~`), a line of only `~`, `#` or `⁂`, or a gap of two or more empty paragraphs. A document double-spaced with empty paragraphs gets a scene break between every paragraph, as a paste does; the note's count shows it.
- **.docx** (Word, and Google Docs' File, Download, Microsoft Word): paragraphs, *italics* and **bold**, and scene breaks as above. Word's drawn horizontal line (Insert, Horizontal Line, or a paragraph with only a bottom border) is turned into a scene break by the site's own rule, since the Word reader leaves it out; the spec proves it with files from Word and from Google Docs. Line breaks within a paragraph (Shift+Enter, in poems and letters) are kept, as when pasted. Headings and tables come in as plain paragraphs of their text; footnotes come at the end as plain paragraphs; pictures, text boxes and comments are left out, and the note counts what was. Tracked changes come in as if accepted, and the note says so (see below).
- **.md** (Markdown) is read as Markdown: paragraphs, `*italics*` or `_italics_`, `**bold**`, and scene break lines with an empty line before them (a `---` straight under a line of text makes that line a Markdown heading, which comes in as a plain paragraph). Empty lines don't add up in Markdown, so gaps don't make scene breaks. Headings come in as plain paragraphs; a line starting with `- ` or `> ` is a Markdown list or quote, and loses its `- ` or `>`; links keep their words only.
- **.txt**: when the file has an empty line between its paragraphs, the lines of each paragraph are joined into one (so a file wrapped at a fixed width reads as paragraphs); otherwise each line is a paragraph, as a paste of plain text is. Scene breaks as above. No italics or bold: plain text has none.
- **.txt and .md** are read as UTF-8, or as Windows' own encoding when they aren't UTF-8, so curly quotes and dashes from older Notepad files come through.
- **.pdf**: the words only, in paragraphs worked out from the gaps between lines. Italics, bold and scene breaks don't come through; page numbers and headings repeated on each page come in with the text, and a paragraph that runs over a page is split in two (mock-up 5). A word broken across lines keeps its hyphen ("beau-tiful"), since joining would also join real compounds ("well-known"); the note says to check.

**After a file is added** (mock-ups 3 and 5):
- The text appears in the box, focus goes to the box at the end of the added text, and a note above it says what came in and what didn't:
  - .docx: "Added The Kettle's Song.docx: 48 paragraphs and 3 scene breaks, with its italics and bold. Left out: 2 pictures. 1 heading came in as a plain paragraph. Read it through, then publish." The second and third sentences name only what the file had (pictures, text boxes, comments; headings, tables, footnotes). With tracked changes or Google Docs suggestions: "It had tracked changes, and they came in as if accepted: check them, or accept or reject them in the document first and upload it again."
  - .md: "Added Notes.md: 12 paragraphs and 1 scene break, with its italics and bold."
  - .txt: "Added Notes.txt: 12 paragraphs and 1 scene break."
  - .pdf: "Added The Kettle's Song.pdf: the words only. A PDF doesn't keep italics, bold or scene breaks, so add them back. Also check where each page ended: delete page numbers and headings that repeat, and join any paragraph split in two." (no count, which would include page numbers and split halves.)
- The note has **Undo this upload**, which puts the box back as it was before the file came in, and ✕ to close it. It stays until it's closed or the item is published, so a PDF's checklist stays while Star works through it; **Undo this upload** goes once the text has been edited after the upload. Nothing goes live until Star publishes, as with a paste; **Preview** shows it first.

**When the box already has text** (mock-up 4): a dialog, "This text box already has text. It has 48 paragraphs. Add The Kettle's Song (new).docx after them, or replace them with it?", with **Cancel** (focused first, so Enter by habit changes nothing), **Add at the end** and **Replace the text**. **Add at the end** adds no scene break between the old and new text; Star adds one if wanted. The note counts only what the file added. A box with nothing but empty paragraphs counts as empty, and is filled with no question.

**Undo**: **Undo this upload** in the note, or the editor's own undo (Ctrl+Z or ⌘Z) with focus in the box, takes the upload back out as one step; the document's history has it too.

**When a file can't be added** (mock-up 7), a message above the box says why and what to do, and the box is left as it was. A new message replaces the last one:
- an older Word file (.doc), .rtf or .odt: "The Kettle's Song.doc is an older Word file, which can't be read here. Open it in Word or Google Docs, save or download it as .docx, and upload that." (.rtf and .odt: "…is a … file, which can't be read here…", the same steps.)
- a Google Drive shortcut (.gdoc): "The Kettle's Song.gdoc is a link to a Google Doc, not the document. In Google Docs, choose File, Download, Microsoft Word (.docx), and upload that."
- a Pages file: "The Kettle's Song.pages can't be read here. In Pages, choose File, Export To, Word, and upload that."
- a web page or e-book (.html, .epub, as AO3 downloads are): "The Kettle's Song.epub can't be read here. Open it, copy the text, and paste it into the box."
- a picture: "Fox sketch.png is a picture, not writing."
- any other kind of file: "The Kettle's Song.xyz can't be read here. Upload a .docx, .pdf, .md or .txt file, or paste the text."
- a PDF of scanned pages, with no words in it: "The Kettle's Song.pdf has no words in it, only pictures of pages (it was probably scanned). Upload the document it was made from instead."
- a locked PDF: "The Kettle's Song.pdf is locked with a password. Upload an unlocked copy, or the document it was made from."
- a file with no words: "Draft.docx has no words in it, so nothing was added."
- a file over 20 MB: "The Kettle's Song.docx is over 20 MB, too big to read here. Save a copy without its pictures, or upload the chapter on its own." (for a PDF: "…too big to read here. Upload the document it was made from, or the chapter on its own.")
- anything else going wrong: "Something went wrong reading Notes.md, and nothing was added. Try again, or paste the text instead."
- more than one file dropped at once: only the first is added, and the note begins "Only one file at a time: added The Kettle's Song.docx."
- The file chooser lists .docx, .pdf, .md and .txt files; the messages above mostly come from dropped files.

**Where the file goes**: it's read in Star's browser and only its text is kept, in **Text**, as a paste is. The file itself isn't uploaded or stored anywhere.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | A story's and a chapter's **Text** (`sanity-studio/components/StoryTextInput.tsx`) | **Upload a file**, dropping a file on the box, reading, the replace or add dialog, the notes (a status message, with **Undo this upload** and ✕) and messages (an alert) above the box. Today the input only handles a paste; the spec confirms how Sanity Studio's editor takes text from outside it as one undo step. |
| 2 | The paste rules (`sanity-studio/lib/story-paste.ts`, `lib/stories.ts`) | Each kind of file turned into the HTML the paste rules already read: .docx by a Word reader, .md by a Markdown reader, .txt as a paste of plain text is, .pdf by a PDF reader's words and line gaps; then the same clean-up as a paste. The readers load only when a file is chosen, so the editor isn't slower to open. |
| 3 | **Text**'s help text (`sanity-studio/lib/stories.ts` or the schema) | "or upload it from a file". |
| 4 | Star's guide `publishing-stories.md` | "Upload a file", and the passages that say pasting is the only way (For the guide). |

## Mock-ups

Low-fidelity, in the style of the story reader's editor mock-ups. Source: `mockups/story-import/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | A one-shot's **Text**, empty, with **Upload a file** above the box | `mockups/story-import/1-upload-button.png` |
| 2 | A file dragged over the box: "Drop the file here to add its text" | `mockups/story-import/2-drop.png` |
| 3 | After a Word document: the text, and the note saying what came in and what was left out, with **Undo this upload** | `mockups/story-import/3-after-docx.png` |
| 4 | Uploading into a box that already has text: how much is there; **Cancel** (focused), **Add at the end**, **Replace the text** | `mockups/story-import/4-replace-or-add.png` |
| 5 | After a PDF: the words, and the note saying what to check | `mockups/story-import/5-after-pdf.png` |
| 6 | A chapter's **Text**, with the same button | `mockups/story-import/6-chapter.png` |
| 7 | The messages when a file can't be added, each for its kind of file | `mockups/story-import/7-errors.png` |
| 8 | Reading a long file | `mockups/story-import/8-reading.png` |

## States and errors

| Situation | What happens |
|---|---|
| An empty **Text**, a file chosen or dropped | Its text fills the box; a note says what came in. |
| **Text** with text in it | The dialog: **Add at the end**, **Replace the text**, or **Cancel** (nothing changes). |
| A story with chapters | No **Upload a file** on the story's **Text**; each chapter has its own. |
| .docx, .md, .txt | Paragraphs and scene breaks; italics and bold from .docx and .md. |
| .pdf with words | The words in paragraphs; a note to add back italics, bold and scene breaks, and to check page ends. |
| A .docx with tracked changes | In as if accepted; the note says so. |
| A file being read | "Reading …"; the button waits. |
| .pdf of scanned pages, a locked .pdf, another kind of file, a file with no words, over 20 MB, an error | A message above the box saying why and what to do, for that kind of file; the box unchanged. |
| More than one file dropped | The first is added; the note says only one at a time. |
| A mistake | **Undo this upload**, or Ctrl+Z in the box, takes it back out. |

## Accessibility

- **Upload a file** is a button reached with Tab and opened with Enter or Space; it opens the computer's own file chooser, so it works with a keyboard and a screen reader. Dropping a file is an extra, never the only way.
- The note after a file is added is a status message, read out by a screen reader; an error is an alert.
- The dialog is a modal dialog with its question as its name; focus starts on **Cancel**, Escape is **Cancel**; after **Cancel** focus returns to **Upload a file**, and after adding or replacing it goes into the box, so Ctrl+Z works there.
- "Reading …" is a status message too, and the button is disabled, not hidden, while a file is read.
- The added text is ordinary text in the box, editable as a paste is.

## For the guide

Star's guide `publishing-stories.md`:
- a new section, "Upload a file", after "Paste your text":
  - choose **Upload a file** above **Text**, or drop a file on the box (on the box: elsewhere the browser may open it); .docx, .pdf, .md or .txt;
  - from Google Docs: File, Download, Microsoft Word (.docx), then upload that from your Downloads; .docx keeps the most;
  - what comes through from each kind of file, and that PDFs keep only the words and need checking at page ends;
  - before uploading a Word document with tracked changes or comments, accept or reject them;
  - a document double-spaced with empty paragraphs gets scene breaks between them; use Word's line spacing instead, or delete the extra breaks;
  - adding to a box that already has text: **Add at the end** or **Replace the text**; **Undo this upload**;
  - the messages when a file can't be added;
  - that the file itself isn't kept, only its text;
  - a whole book in one file: upload it into a one-shot, choose **Add chapter**, then cut each later chapter into its own chapter; delete the title and chapter headings that came in as text.
- The passages that say pasting is the only way: the intro ("You put a story up by pasting it in"), "Start a new story" step 5, "Add a chapter to a story" step 3, and the "If something goes wrong" rows "Add the chapter's text." and "Italics are missing after pasting": "paste or upload".
- Its `summary:` ("Starting a story, pasting its text, chapters, and ratings.") becomes "…pasting or uploading its text…". It's an existing guide, so the help menu and the items' help links need nothing new (the standing decision of 2026-11-03 is for new guides).

## For the spec to check

- **Upload a file** on a one-shot's and a chapter's **Text**, not on a story with chapters; the help texts.
- Each kind of file, from sample files kept with the tests: a .docx from Word and one from Google Docs (italics, bold, Word's horizontal line both ways, `* * *`, two empty paragraphs, a Shift+Enter line break, a heading, a table, a footnote, a picture, a text box, a comment, a tracked insertion and deletion, a Google Docs suggestion); a .md (emphasis both ways, bold, `---` after an empty line and straight under text, `~~~`, headings, a `- ` and a `> ` line, a link); a .txt wrapped with empty lines between paragraphs, and one without; a .txt in Windows' own encoding with curly quotes; a .pdf with words (two pages, a paragraph over the page break, page numbers, a hyphenated word); each note's wording and counts.
- The same text from a .docx and from pasting the same document give the same blocks.
- The dialog: its count; Add at the end keeps the text and adds after it, with no scene break added; Replace replaces it; Cancel and Escape change nothing; focus on Cancel first, then into the box or back to the button; a box of only empty paragraphs is filled with no dialog.
- **Undo this upload** and Ctrl+Z each take an upload out in one step; the note stays until closed or published.
- Reading: the status, and a second file not accepted until the first is done.
- Each message: a .doc, .rtf, .odt, .gdoc, .pages, .html, .epub, a picture, another kind; a scanned .pdf, a locked .pdf, a .docx with no words, a file over 20 MB, a broken file; the box unchanged; a new message replacing the last.
- More than one file dropped.
- The readers load only when a file is chosen (the editor's first load doesn't fetch them).
- The file isn't stored: no asset is created.

## Decisions at review

For the lead:
1. **A book in one file**: one file fills one text box, with the guide's recipe (upload into a one-shot, **Add chapter**, then cut chapter by chapter), as proposed; or should a file with chapter headings ("Chapter 1", "Chapter 2: Over the Ridge") be split into the story's chapters, made for Star? The walkthrough thinks one file per book is Star's likeliest case, which favours splitting.
2. **Text already in the box**: ask, as proposed (Add at the end or Replace, with Cancel focused); or always replace?
3. **PDFs**: the words only, with a note, as proposed; or leave PDFs out, so every upload keeps italics and scene breaks? Star always has the document a PDF was made from, except for PDFs downloaded from AO3 (offline for now), which also repeat AO3's title on every page.

## Persona walkthrough

A walkthrough for persona-artist, and persona-fan through the published text (2026-11-07), read the design against the story reader's design, Star's guide and the paste code. Nothing stopped Star on the main path (a .docx into an empty box), but it found three blocking problems, twelve misleading ones and six slower ones. Addressed above:
- **Blocking:**
  - a dragged file's name can't be shown before it's dropped (the box now says "Drop the file here");
  - Word's horizontal lines are likely dropped by a Word reader (now turned into scene breaks by the site's own rule, proved in the spec);
  - undo wouldn't reach the box with focus on the button (focus now goes into the box, and the note has **Undo this upload**).
- **Misleading:**
  - the .txt rule contradicted the paste rule (now one rule, with wrapped files joined);
  - Markdown differs from a paste (now said: scene break lines need an empty line before them, gaps don't count, `- ` and `>` lines lose their marker, and the real scene break rule is given);
  - tracked changes came in silently as accepted (now in the note and the guide);
  - pictures and other left-out parts were silent (now counted in the note);
  - the PDF checklist vanished at the first edit (the note now stays until closed or published);
  - PDFs split paragraphs at page breaks and joining hyphens joins real compounds (now said, and hyphens kept);
  - one message for every unreadable file (now one for each kind, including Google Drive shortcuts, Pages and AO3's downloads);
  - "empty" and "without pictures" wordings, and text encodings (fixed);
  - a book in one file was harder to upload than to paste (now a guide recipe, and Decision 1);
  - the dialog's default destroyed text on Enter (Cancel now first, with a count);
  - no reading state (now mock-up 8);
  - the guide needed more than one new section (now listed);
  - the persona didn't support the file types (softened).
- **Slower:** a mock-up's file name; one message at a time; the notes' roles; double-spaced documents; Google Docs' download steps (all in the design or the guide).
