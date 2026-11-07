---
id: design-story-import
status: draft
derived-from:
  - story-story-reader-put-a-story-on-the-site: d1c236216e8c
  - design-story-reader#what-star-enters: cb3b54ba7c25
  - design-story-reader#flow-star: 8f4a733f5f05
  - design-story-reader#layout: 97cf455208c8
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Writing from Word documents: design

<!-- docs/design/story-import.md. A design amendment asked for by the lead (2026-11-07): Star puts a story's or a
chapter's writing on the site by uploading it as a file, in place of pasting it into the Text box. The lead's
decisions (2026-11-07): Star will always upload a .docx, one file per chapter for now; later she may upload whole
works with chapter breaks; the documents may have pictures in them; the text box isn't needed. Mock-ups are in
docs/design/mockups/story-import/: PNG images, mockups.html (their source, in the style of the story reader's
mock-ups) and render.mjs. -->

## Personas

- persona-artist: Star writes in Word documents (or Google Docs, downloaded as .docx), one per chapter, sometimes with her own pictures in them. Today she copies each chapter and pastes it into **Text** (design-story-reader, "Flow: Star"); a long chapter is slow to select and copy, a copy can miss the end, and a paste leaves her pictures out. With the document as the one place the writing lives, she uploads it, and to change a word she changes the document and uploads it again.
- persona-fan: reads the chapter on the site, now with Star's pictures where she put them, described for screen readers.

## The change

This amends design-story-reader, "What Star enters", "Flow: Star" and "Layout": a story's and a chapter's **Text** is filled by uploading a Word document, and the text can have pictures.

**Upload a Word document** (mock-ups 1, 2 and 6):
- **Text**, on a one-shot story and on a chapter, is no longer a box to paste or type in. It has a button, **Upload a Word document**, with ".docx, or drop one below", and below it a space that says "No text yet. Drop the chapter's .docx here, or use Upload a Word document." Dropping a .docx on that space does the same (while one is dragged over it, it says "Drop the file here"; a browser doesn't give a dragged file's name until it's dropped).
- **Text**'s help text: on a chapter, "Upload the chapter as a Word document (.docx). Its text and pictures come in as written; to change them, change the document and upload it again." On a one-shot: "For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead."
- On a story with chapters, **Text** shows its note as now (design-story-reader, mock-up 7), with no button: chapters are where the text goes.
- One document at a time, one per chapter (or per one-shot). Whole works with chapter breaks come later (Later, below).
- While a document is read and its pictures added, the note says "Reading The Long Road 3.docx… adding picture 1 of 2." and the button waits (mock-up 2).

**After a document is added** (mock-up 3):
- **Text** shows the chapter as readers will get it, read-only: its paragraphs, italics, bold, scene breaks (as the "Scene break" bar) and pictures, in order. Above it, the button becomes **Upload a new version**, with the file's name and when it was added ("The Long Road 3.docx, added 2:38 pm").
- A note says what came in and what didn't: "Added The Long Road 3.docx: 48 paragraphs, 3 scene breaks and 2 pictures, with its italics and bold. 1 heading came in as a plain paragraph. Check it, then publish." Its middle sentences name only what the document had: headings, tables and footnotes come in as plain paragraphs; text boxes, comments and charts are left out. With tracked changes or Google Docs suggestions: "It had tracked changes, and they came in as if accepted: check them, or accept or reject them in Word and upload it again."
- The note has **Undo this upload**, which puts **Text** and **Pictures** back as they were before, and ✕ to close it; it stays until closed or the item is published.
- **Pictures**, below **Text**, lists each picture in the order it appears, with a **Description** each (mock-up 3). A description is filled in from the picture's alt text in Word (Right-click, Edit Alt Text) when it has one. Until a picture has one, it has a yellow "Description" mark and "Add a description so people using screen readers know what it shows. You can still publish.", and **Pictures** says "1 needs a description", as comic pages ask for alt text (Star's guide to comics, "Describe each page"). A picture marked decorative in Word needs none, and screen readers skip it.
- Nothing goes live until Star publishes; **Preview** shows the chapter as it will be, pictures included.

**A new version** (mock-up 4): uploading into a **Text** that has text asks first: "Replace Chapter 3's text? The Long Road 3 (edited).docx replaces its 48 paragraphs and 2 pictures. Picture descriptions you typed are kept for pictures that are still there. You can undo this until you publish." with **Cancel** (focused first, so Enter by habit changes nothing) and **Replace**. A description is kept for a picture that's the same picture (the same file in the document); a new or changed picture takes its alt text from Word, or needs one.

**What comes through** from a .docx:
- paragraphs, *italics* and **bold**; line breaks within a paragraph (Shift+Enter, in poems and letters), as when pasted;
- a **scene break** from what the paste rules already know (`isSceneBreakLine` in `lib/stories.ts`): a line of three or more of `* ~ - # = • ·` (such as `* * *`, `***`, `---`), a line of only `~`, `#` or `⁂`, or a gap of two or more empty paragraphs; and Word's drawn horizontal line (Insert, Horizontal Line, or an empty paragraph with only a bottom border), which the site turns into a scene break itself, since Word readers leave it out. A document double-spaced with empty paragraphs gets a scene break between every paragraph; the note's count shows it, and the guide says to use Word's line spacing instead;
- **pictures**, where they are in the text, each on its own line between paragraphs (a picture set inside a paragraph's line moves to just after that paragraph). They're added to the editor's picture library like any other image, and shown on the site at the column's width or their own, whichever is smaller (mock-up 7). JPEG, PNG, GIF and WebP pictures come in; others (such as Word's drawings and charts) are left out, and the note says how many;
- headings, tables (their text, row by row) and footnotes (at the end) as plain paragraphs; text boxes, comments, page headers and footers left out.

**When a document can't be added** (mock-up 5), a message above **Text** says why and what to do, and nothing changes; a new message replaces the last:
- not a Word document: "Notes.pdf isn't a Word document. Upload the chapter as a .docx: in Word, File, Save As, Word Document; in Google Docs, File, Download, Microsoft Word (.docx)."
- an older Word file (.doc): "The Long Road 3.doc is an older Word file, which can't be read here. Open it in Word or Google Docs, save or download it as .docx, and upload that."
- a Google Drive shortcut (.gdoc): "The Long Road 3.gdoc is a link to a Google Doc, not the document. In Google Docs, choose File, Download, Microsoft Word (.docx), and upload that."
- a password-locked document: "The Long Road 3.docx is locked with a password. Save an unlocked copy and upload that."
- no words: "The Long Road 3.docx has no words in it, so nothing was added."
- over 50 MB: "The Long Road 3.docx is over 50 MB, too big to read here. Make its pictures smaller in Word (Compress Pictures), or split the chapter."
- a picture that can't be added: the chapter comes in without it, and the message says "Picture 2 in The Long Road 3.docx couldn't be added (it's a kind of picture the site can't show), so the chapter was added without it. Save it in the document as a JPEG or PNG and upload again, or publish without it."
- anything else: "Something went wrong reading The Long Road 3.docx, and nothing was added. Try again."
- more than one file dropped: only the first is added, and the note begins "Only one document at a time: added The Long Road 3.docx."
- The file chooser lists .docx files only; most of these messages come from dropped files.

**Where things go**: the document is read in Star's browser. Its text is kept in **Text**, its pictures in the editor's picture library; the .docx itself isn't kept, only its name and when it was added. The pictures are public on the site once the chapter is published, as comic pages are.

**On the site** (mock-up 7, design-story-reader "Layout"): a picture shows in the text column where it was in the document, at the column's width or its own, whichever is smaller, with space above and below, sized for the screen (phones get a smaller copy). Its description is its alt text; a decorative picture has an empty one. Pictures load as the reader reaches them, so a chapter opens as fast as before.

**Stories already on the site**: their pasted text stays and shows read-only, as above. **Upload a Word document** replaces it, with the same question as a new version. Pasting and typing aren't offered any more.

## Later: whole works with chapter breaks

When Star uploads a whole work (lead, 2026-11-07, for later): a document whose chapters start at a Word heading, or after a page break, could fill a story's chapters, one per chapter, with titles from the headings. That's its own design when it's wanted; this one keeps to one document per chapter, and stores the text so the later split can reuse the same reading.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | A story's and a chapter's **Text** (`sanity-studio/components/StoryTextInput.tsx`) | The upload button and drop space in place of the text box; reading; the read-only text; the note (a status message, with **Undo this upload** and ✕); the replace question; the messages (an alert). |
| 2 | Reading a .docx (`sanity-studio/lib/`) | A Word reader turns the document into the HTML the paste rules read, with Word's horizontal lines as scene breaks and its pictures kept in place; then the same clean-up as a paste. The reader loads only when a document is chosen. |
| 3 | The text's schema (`sanity-studio/schemas/objects/storyText.ts`) and **Pictures** | A picture block in the text (an image with its description and whether it's decorative); **Pictures** lists them with their descriptions, as a view of the same blocks. |
| 4 | The site's story text (`src/lib/stories/text.ts` and the story pages) | Pictures in the column, with alt text, sizes and lazy loading. |
| 5 | **Text**'s help texts | As above. |
| 6 | Star's guide `publishing-stories.md` | Uploading in place of pasting throughout (For the guide). |

## Mock-ups

Low-fidelity, in the style of the story reader's mock-ups. Source: `mockups/story-import/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | A new chapter: **Upload a Word document** and the drop space, no text box | `mockups/story-import/1-new-chapter.png` |
| 2 | Reading the document and adding its pictures | `mockups/story-import/2-reading.png` |
| 3 | After uploading: the note with **Undo this upload**; the chapter read-only, with its pictures and scene breaks; **Pictures** with their descriptions, one missing | `mockups/story-import/3-after-upload.png` |
| 4 | **Upload a new version** on a chapter with text: **Cancel** (focused) or **Replace** | `mockups/story-import/4-new-version.png` |
| 5 | The messages when a document can't be added | `mockups/story-import/5-errors.png` |
| 6 | A one-shot story's **Text** | `mockups/story-import/6-one-shot.png` |
| 7 | The chapter on a phone, with its picture | `mockups/story-import/7-chapter-phone.png` |

## States and errors

| Situation | What happens |
|---|---|
| A chapter or one-shot with no text | **Upload a Word document** and the drop space. |
| A .docx chosen or dropped | Read, pictures added, then the text read-only, the note, and **Pictures**. |
| A chapter with text, a .docx uploaded | The replace question: **Cancel** (focused) or **Replace**. |
| A picture with alt text in Word | Its description, filled in. |
| A picture without | The yellow mark and its line; publishing is allowed. |
| A picture marked decorative in Word | No description needed; screen readers skip it. |
| Tracked changes or suggestions | In as if accepted; the note says so. |
| A picture the site can't show | Left out; the message says which. |
| Not a .docx, a .doc, a .gdoc, locked, no words, over 50 MB, an error | A message saying why and what to do; nothing changes. |
| A mistake | **Undo this upload** until publishing. |
| A story with chapters | No button on the story's **Text**. |
| A story already on the site | Its text read-only; uploading replaces it, after the question. |

## Accessibility

- **Upload a Word document** is a button reached with Tab and opened with Enter or Space; it opens the computer's own file chooser. Dropping a file is an extra, never the only way.
- "Reading …" and the note after an upload are status messages; a message about a document that can't be added is an alert.
- The replace question is a modal dialog named by its question; focus starts on **Cancel**, Escape is **Cancel**, and focus returns to the button.
- Each picture's **Description** is a labelled field ("Description of picture 2"), and the count of missing ones is text, not only colour.
- On the site, every picture has its description as alt text, or an empty one when decorative, and is in the reading order where Star put it.

## For the guide

Star's guide `publishing-stories.md`:
- "Paste your text" becomes "Upload the text": save the chapter as a .docx (from Google Docs: File, Download, Microsoft Word (.docx)); choose **Upload a Word document**, or drop the file on the space below it; what comes through; one document per chapter.
- To change a word or a picture: change the document and upload it again (**Upload a new version**); descriptions you typed are kept for pictures that are still there.
- Pictures: where they appear, giving each a description (in Word with Edit Alt Text, or in **Pictures**), marking decorative pictures in Word, and keeping them JPEG or PNG; and that they're public once published.
- Before uploading: accept or reject tracked changes; use line spacing in place of empty paragraphs.
- "Scene breaks": the ways a document marks one, including Word's horizontal line.
- The passages that say pasting is the way: the intro, "Start a new story" step 5, "Add a chapter to a story" step 3, and the "If something goes wrong" rows.
- Its `summary:` becomes "Starting a story, uploading its text, chapters, and ratings." It's an existing guide, so the help menu and the items' help links need nothing new (the standing decision of 2026-11-03 is for new guides).

## For the spec to check

- **Upload a Word document** and the drop space in place of the text box, on a one-shot and a chapter, not on a story with chapters; the help texts; pasting not offered.
- Sample .docx files kept with the tests, from Word and from Google Docs: italics, bold, Shift+Enter breaks, `* * *`, two empty paragraphs, Word's horizontal line both ways, a heading, a table, a footnote, a text box, a comment, tracked changes and a suggestion, pictures (JPEG, PNG, one inline in a line, one with alt text, one marked decorative, one EMF drawing); each note's wording and counts.
- The same document pasted and uploaded give the same paragraphs, marks and scene breaks.
- Pictures: added to the picture library, placed in order, descriptions from alt text, decorative ones needing none; the count and marks; publishing allowed without.
- A new version: the question, Cancel and Escape changing nothing, Replace replacing, descriptions kept for unchanged pictures.
- **Undo this upload** putting text and pictures back; the note staying until closed or published.
- Each message, with nothing changed; one document at a time.
- The Word reader loading only when a document is chosen.
- The site: pictures in the column, alt text (empty when decorative), sizes and lazy loading; a chapter without pictures as before.
- A story with pasted text: shown read-only, replaced by an upload.

## Decisions at review

Settled by the lead (2026-11-07):
- .docx only, one file per chapter for now; whole works with chapter breaks later;
- pictures kept;
- no text box at all: every change goes through Word, and the editor shows the text read-only;
- pictures on the site at the column's width or their own, whichever is smaller.

## Persona walkthrough

A walkthrough of the first version (any of .docx, .pdf, .md or .txt, into a text box), for persona-artist (2026-11-07), found three blocking problems and twelve misleading ones, all addressed then; those that still apply are carried here: a dragged file's name can't be shown; Word's horizontal lines need the site's own rule; undo after an upload; tracked changes; left-out parts counted in the note; the note staying until closed; a message for each kind of wrong file; Cancel first in the question; a reading state; the guide's other passages.

This version (Word only, no text box, pictures) has yet to be walked through; its findings will be folded in here before review.
