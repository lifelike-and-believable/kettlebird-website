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
works with chapter breaks; the documents may have pictures in them; no text box; pictures at the column's width or
their own, whichever is smaller. Mock-ups are in docs/design/mockups/story-import/: PNG images, mockups.html (their
source, in the style of the story reader's mock-ups) and render.mjs. Checked against Sanity Studio 5.1. -->

## Personas

- persona-artist: Star writes in Word documents (or Google Docs, downloaded as .docx), one per chapter, sometimes with her own pictures in them. Today she copies each chapter and pastes it into **Text** (design-story-reader, "Flow: Star"); a long chapter is slow to select and copy, a copy can miss the end, and a paste leaves her pictures out. With the document as the one place the writing lives, she uploads it, and to change a word she changes the document and uploads it again.
- persona-fan: reads the chapter on the site, often on a phone, now with Star's pictures where she put them, described for screen readers.

## The change

This amends design-story-reader, "What Star enters", "Flow: Star" and "Layout": a story's and a chapter's **Text** is filled by uploading a Word document, it can have pictures, and the editor no longer has a box to type in.

### Upload a Word document (mock-ups 1, 2 and 6)

- **Text**, on a one-shot story and on a chapter, has a button, **Upload a Word document**, with ".docx, or drop one below", and below it a space that says "No text yet. Drop the chapter's .docx here, or use Upload a Word document." Dropping a .docx on that space does the same (while one is dragged over it, it says "Drop the file here"; a browser doesn't give a dragged file's name until it's dropped). There's no box to paste or type in.
- **Text**'s help text: on a chapter, "Upload the chapter as a Word document (.docx). Its text and pictures come in; Word's layout and picture sizes don't. To change them, change the document and upload it again." On a one-shot: "For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead."
- On a story with chapters, **Text** has no button: chapters are where the text goes.
- One document at a time, one per chapter (or per one-shot). Whole works with chapter breaks come later (Later, below).
- While a document is read and its pictures added, the note says "Reading The Long Road 3.docx… adding picture 1 of 2." and the button waits (mock-up 2).

### After a document is added (mock-ups 3 and 8)

- **Text** shows the chapter as readers will get it, read-only: its paragraphs, italics, bold, scene breaks (as the "Scene break" bar) and pictures, in order.
- Above it: **Upload a new version**, and a line with the file's name and when it was added, "The Long Road 3.docx, added 2:38 pm, not published yet · Undo this upload". "not published yet" goes when the item is published. **Undo this upload** puts **Text** and **Pictures** back as they were before the upload, including alt text typed since (it says so if there is any: "Undo this upload? Alt text you've typed since will go too."). It's there until the item is published, kept with the item, so closing the note or leaving the page doesn't lose it; one upload back.
- A note says what came in and what didn't, naming what the document had:
  - "Added The Long Road 3.docx: 48 paragraphs, 3 scene breaks and 3 pictures, with its italics and bold."
  - a first line that repeats the chapter's title (or "Chapter 3"), as a heading or a paragraph, is left out: "Its first line, "Chapter 3: Over the Ridge", was left out, as the chapter's title shows it."
  - other headings, tables and footnotes come in as plain paragraphs: "2 headings came in as plain paragraphs: "Morning" and "The Ridge"."
  - pictures that moved: "1 picture that sat beside the text now sits below its paragraph."; pictures left out (in text boxes or tables, or Word drawings and charts): "1 picture in a text box was left out."; a picture cropped in Word: "Picture 2 is cropped in Word, so the whole picture came in. In Word, choose Compress Pictures, Delete cropped areas, and upload again."
  - alt text from Word: "1 alt text came from Word: check it."
  - tracked changes or Google Docs suggestions: "It had tracked changes, and they came in as if accepted: check them, or accept or reject them in Word and upload it again."
  - many scene breaks (more than one for every five paragraphs): "That's a lot of scene breaks: the document may use empty paragraphs for spacing. Use Word's line spacing instead, and upload it again."
  - It ends "Check the chapter, then publish." and has ✕ to close it; it stays until closed or the item is published.
- **Pictures**, below **Text**, lists each picture where it appears (a picture used twice is listed twice), with **Alt text** and **Decorative** (mock-up 3):
  - **Alt text** is filled in from the picture's alt text in Word (Right-click, Edit Alt Text, or View Alt Text) when it has some, marked "alt text from Word". Word's own automatic alt text ("… Description automatically generated") and alt text that's only a file name don't count: they're left empty, to write.
  - **Decorative**, ticked for a picture that only decorates (a divider, a flourish), so screen readers skip it. It's ticked already for a picture marked decorative in Word. Google Docs and older Word can't mark one; ticking it here does the same.
  - Until a picture has alt text or is decorative, it has a yellow "Alt text" mark and "Add alt text so people using screen readers know what it shows, or tick Decorative. You can still publish.", and **Pictures** says "1 needs alt text", as comic pages ask for alt text (Star's guide to comics, "Describe each page"). The words are the comic pages' words, and Word's.
- If one picture can't be added, the chapter comes in without it, and the message about it shows with the note (mock-up 8).
- Nothing goes live until Star publishes; **Preview** shows the chapter as it will be, pictures included.

### A new version (mock-up 4)

Uploading into a **Text** that has text asks first, saying what's there and what's coming, so a wrong file stands out: "Replace Chapter 3's text? Now: The Long Road 3.docx, added 2:38 pm: 48 paragraphs, 3 pictures. New: The Long Road 3 (edited).docx: 51 paragraphs, 3 pictures; 2 keep their alt text, 1 is new. Anything changed in the editor since the last upload (alt text, Decorative) is kept for pictures that are still there. You can undo this until you publish." with **Cancel** (focused first, so Enter by habit changes nothing) and **Replace**.

**Which picture is the same picture**: one with exactly the same picture data as before (Word renames its picture files on every save, so names don't count). A same picture keeps what was set for it in the editor, unless its alt text in Word has changed since the last upload, when Word's new alt text wins (the document is where the writing lives). A changed picture, such as one re-saved by Google Docs, counts as new: it takes its alt text from Word, or needs some, and the question's counts show it. A picture used twice keeps each place's settings in order.

### What comes through from a .docx

- paragraphs, *italics* and **bold**; line breaks within a paragraph (Shift+Enter, in poems and letters), as when pasted;
- a **scene break** from what the paste rules already know (`isSceneBreakLine` in `lib/stories.ts`): a line of three or more of `* ~ - # = • ·` (such as `* * *`, `***`, `---`), a line of only `~`, `#` or `⁂`, or a gap of two or more empty paragraphs; and Word's drawn horizontal line (Insert, Horizontal Line, or an empty paragraph with only a bottom border), which the site turns into a scene break itself, since Word readers leave it out;
- **pictures**, where they are in the text, each on its own line between paragraphs: a picture set inside a paragraph's line, beside the text, or side by side with another moves to just after its paragraph, and the note counts it. JPEG, PNG, GIF and WebP pictures come in; Word's drawings and charts, and pictures inside text boxes or tables, are left out and counted. Each is re-saved in the browser before it's uploaded, at most 3200 pixels wide, which also removes what the picture file carries about where it was taken;
- headings, tables (each row as a paragraph, its cells joined with " · ") and footnotes (at the end, numbered, with the number left where the footnote was, as "[1]") as plain paragraphs; text boxes, comments, page headers and footers left out.

### When a document can't be added (mock-up 5)

A message above **Text** says why and what to do, and nothing changes; a new message replaces the last:
- not a Word document: "Notes.pdf isn't a Word document. Upload the chapter as a .docx: in Word, File, Save As, Word Document; in Google Docs, File, Download, Microsoft Word (.docx)."
- an older Word file (.doc): "The Long Road 3.doc is an older Word file, which can't be read here. Open it in Word or Google Docs, save or download it as .docx, and upload that."
- a Google Drive shortcut (.gdoc): "The Long Road 3.gdoc is a link to a Google Doc, not the document. In Google Docs, choose File, Download, Microsoft Word (.docx), and upload that."
- a password-locked document: "The Long Road 3.docx is locked with a password. Save an unlocked copy and upload that."
- no words: "The Long Road 3.docx has no words in it, so nothing was added."
- over 50 MB: "The Long Road 3.docx is over 50 MB, too big to read here. Make its pictures smaller in Word (Compress Pictures), or split the chapter."
- a picture that can't be added: the chapter comes in without it: "Picture 2 in The Long Road 3.docx couldn't be added (it's a drawing made in Word, which the site can't show), so the chapter was added without it. Save it in the document as a picture (JPEG or PNG) and upload again, or publish without it."
- anything else: "Something went wrong reading The Long Road 3.docx, and nothing was added. Try again."
- more than one file dropped: only the first is added, and the note begins "Only one document at a time: added The Long Road 3.docx."
- The file chooser lists .docx files only; most of these messages come from dropped files.

### Where things go

- The document is read in Star's browser. Its text is kept in **Text**; its pictures are uploaded to the editor's picture library as they're read, before publishing, where anyone with a picture's exact link could open it (no one is given the link until the chapter is published). The .docx itself isn't kept, only its name and when it was added.
- Pictures that no chapter uses any more (after a new version, an undo, or deleting the chapter) are removed from the library when the chapter is next published or deleted, so they don't build up.
- The pictures are public on the site once the chapter is published, as comic pages are.

### On the site (mock-up 7, design-story-reader "Layout")

- A picture shows in the text column where it was in the document, at the column's width or its own, whichever is smaller (the lead, 2026-11-07), with space above and below. It keeps its space while it loads (its width and height are known), so the text doesn't jump; it's fetched at the size the screen needs (480, 800, 1200 or 1600 pixels wide, at the screen's density), and loads as the reader nears it.
- Its alt text is its **Alt text**; a decorative picture has an empty one, so screen readers skip it; a picture with neither is "Picture", so screen readers still say a picture is there. Alt text isn't shown on the page.
- Tapping or clicking a picture shows it full screen, as artwork does, so a map or a letter in a picture can be read on a phone.
- Mature and Explicit stories keep their text, pictures included, hidden until **Continue to the story**.

### No stories to carry over, and splitting a one-shot

No stories are on the site yet (the lead, 2026-11-07: the one test story will be uploaded again), so nothing pasted needs carrying over: pasting and typing simply go. Star's Word documents are where her writing lives; the editor holds what was uploaded from them, plus the alt text and Decorative set for pictures.

**Add chapter** on a one-shot moves its text into Chapter 1, as now. To split it, Star uploads each chapter's document into its own chapter, replacing Chapter 1's text with Chapter 1's document. To make a story a one-shot again, she removes its chapters and uploads the whole story into the story's **Text**. The notes that said "move the text back" say this.

## Later: whole works with chapter breaks

When Star uploads a whole work (lead, 2026-11-07, for later): a document whose chapters start at a Word heading, or after a page break, could fill a story's chapters, one per chapter, with titles from the headings. That's its own design when it's wanted; this one keeps to one document per chapter, and keeps the reading of a document separate from where its text goes, so the later split can reuse it.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | A story's and a chapter's **Text** (`sanity-studio/components/StoryTextInput.tsx`) | The upload button and drop space in place of the text box (a read-only view that still shows pictures and scene breaks); reading; the note (a status message, ✕); the upload line with **Undo this upload** (kept with the item until publishing); the replace question; the messages (an alert); the notes for a story with chapters. |
| 2 | Reading a .docx (`sanity-studio/lib/`) | A Word reader turns the document into the HTML the paste rules read, with Word's horizontal lines as scene breaks, pictures kept in place, and the counts the note needs; then the clean-up, which today keeps only paragraphs and scene breaks (`cleanPastedBlocks`) and keeps pictures too. The reader loads only when a document is chosen. |
| 3 | Pictures (`sanity-studio/lib/`, the picture library) | Re-saved at most 3200 wide, uploaded, matched with the last upload's pictures by their data; unused ones removed when the item is published or deleted. |
| 4 | The text's schema (`sanity-studio/schemas/objects/storyText.ts`) and **Pictures** | A picture block in the text (an image, its alt text, Decorative, and where its alt text came from); **Pictures** lists them, editing those blocks' alt text and Decorative. |
| 5 | The site's stories (`src/lib/stories/source.ts`, `model.ts`, `text.ts`, `StoryText.astro`) | The query fetching pictures' sizes and addresses; pictures in the HTML, with alt text, width and height, sizes and lazy loading; full screen on tap. |
| 6 | **Text**'s help texts, and the story's notes (`sanity-studio/lib/stories.ts`) | As above. |
| 7 | Star's guide `publishing-stories.md` | Uploading in place of pasting throughout (For the guide). |

## Mock-ups

Low-fidelity, in the style of the story reader's mock-ups. Source: `mockups/story-import/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | A new chapter: **Upload a Word document** and the drop space, no text box | `mockups/story-import/1-new-chapter.png` |
| 2 | Reading the document and adding its pictures | `mockups/story-import/2-reading.png` |
| 3 | After uploading: the upload line with **Undo this upload**; the note; the chapter read-only; **Pictures** with alt text from Word, one missing, one decorative | `mockups/story-import/3-after-upload.png` |
| 4 | **Upload a new version**: the question with what's there and what's coming | `mockups/story-import/4-new-version.png` |
| 5 | The messages when a document can't be added | `mockups/story-import/5-errors.png` |
| 6 | A one-shot story's **Text** | `mockups/story-import/6-one-shot.png` |
| 7 | The chapter on a phone, with its picture | `mockups/story-import/7-chapter-phone.png` |
| 8 | Added, but one picture couldn't be: the message and the note | `mockups/story-import/8-picture-left-out.png` |

## States and errors

| Situation | What happens |
|---|---|
| A chapter or one-shot with no text | **Upload a Word document** and the drop space. |
| A .docx chosen or dropped | Read, pictures added, then the text read-only, the note, and **Pictures**. |
| A chapter with text, a .docx uploaded | The replace question with both versions' counts: **Cancel** (focused) or **Replace**. |
| A picture with alt text in Word | Its alt text, marked "from Word". |
| Word's automatic alt text, or a file name | Left empty, to write. |
| A picture without alt text | The yellow mark and its line; publishing is allowed; on the site, "Picture". |
| A decorative picture (in Word, or ticked) | No alt text needed; empty alt text on the site. |
| A picture that moved, was left out, or is cropped | Counted in the note; a cropped one's whole picture came in, with how to fix it. |
| Tracked changes or suggestions | In as if accepted; the note says so. |
| Many scene breaks | The note says the document may use empty paragraphs for spacing. |
| Not a .docx, a .doc, a .gdoc, locked, no words, over 50 MB, an error | A message saying why and what to do; nothing changes. |
| A mistake | **Undo this upload** until publishing, even after leaving the page. |
| A story with chapters | No button on the story's **Text**; each chapter has its own. |

## Accessibility

- **Upload a Word document** is a button reached with Tab and used with Enter or Space; it opens the computer's own file chooser. Dropping a file is an extra, never the only way.
- "Reading …" and the note after an upload are status messages; a message about a document that can't be added is an alert.
- The replace question is a modal dialog named by its question; focus starts on **Cancel**, Escape is **Cancel**, and focus returns to the button.
- Each picture's **Alt text** is a labelled field ("Alt text for picture 2"), and **Decorative** a labelled checkbox; the count of missing alt text is text, not only colour.
- On the site: every picture has its alt text, an empty one when decorative, or "Picture"; it's in the reading order where Star put it; opening it full screen works from the keyboard as artwork's does; and its space is kept while it loads.

## For the guide

Star's guide `publishing-stories.md`:
- "Paste your text" becomes "Upload the text": save the chapter as a .docx (from Google Docs: File, Download, Microsoft Word (.docx)); choose **Upload a Word document**, or drop the file on the space below it; what comes through, and what doesn't (Word's layout and picture sizes); one document per chapter.
- To change a word or a picture: change the document and upload it again (**Upload a new version**). Keep your Word documents: they're where the writing lives.
- Pictures: where they appear; alt text (in Word with Edit Alt Text, or in **Pictures**), Word's automatic alt text not counting; **Decorative**; Compress Pictures and Delete cropped areas before uploading; JPEG or PNG; a few pictures per chapter, for readers on phones; that they're uploaded when the document is read and public once the chapter is published.
- Before uploading: accept or reject tracked changes; use line spacing in place of empty paragraphs; the chapter's title as the first line is fine (it's left out).
- "Scene breaks": the ways a document marks one, including Word's horizontal line; to remove one, delete it in the document and upload again.
- "Add a chapter to a story": splitting a one-shot by uploading each chapter's document, and making a story a one-shot again.
- The passages that say pasting is the way: the intro, "Start a new story" step 5, "Add a chapter to a story" step 3, and the "If something goes wrong" rows.
- Its `summary:` becomes "Starting a story, uploading its text, chapters, and ratings." It's an existing guide, so the help menu and the items' help links need nothing new (the standing decision of 2026-11-03 is for new guides).

## For the spec to check

- **Upload a Word document** and the drop space in place of the text box, on a one-shot and a chapter, not on a story with chapters; the read-only text with pictures and scene breaks; the help texts; pasting not offered.
- Sample .docx files kept with the tests, from Word and from Google Docs: italics, bold, Shift+Enter breaks, `* * *`, two empty paragraphs, Word's horizontal line both ways, a first line repeating the chapter's title, headings, a table, a footnote, a text box (with a picture), a comment, tracked changes and a suggestion, double spacing with empty paragraphs, pictures (JPEG, PNG, one inline, one beside the text, one cropped, one with alt text, one with Word's automatic alt text, one marked decorative, one used twice, one Word drawing); each note's wording and counts.
- The same document pasted and uploaded give the same paragraphs, marks and scene breaks.
- Pictures: re-saved at most 3200 wide without location data; in the library, in order; alt text from Word, automatic alt text dropped; Decorative from Word and ticked; the count and marks; publishing allowed without.
- A new version: the question's counts; Cancel and Escape changing nothing; Replace replacing; same pictures (by data) keeping their settings, unless Word's alt text changed; a re-encoded picture counting as new.
- **Undo this upload**: putting text and pictures back, warning about typed alt text, kept after closing the note and reloading, gone after publishing.
- Unused pictures removed when publishing or deleting, and only those.
- Each message, with nothing changed; one document at a time; the partial-picture case.
- The Word reader and writer loading only when used.
- The site: pictures in the column, alt text (empty when decorative, "Picture" without), width and height, sizes and lazy loading, full screen on tap and from the keyboard, inside a Mature story's hidden text; a chapter without pictures as before.
- Splitting a one-shot by uploads, and making a story a one-shot again.

## Decisions at review

Settled by the lead (2026-11-07):
- .docx only, one file per chapter for now; whole works with chapter breaks later;
- pictures kept;
- no text box at all: every change goes through Word, and the editor shows the text read-only;
- pictures on the site at the column's width or their own, whichever is smaller;
- no stories to carry over: the one test story will be uploaded again.

## Persona walkthrough

Two walkthroughs, both 2026-11-07.

The first, of an earlier version (any of .docx, .pdf, .md or .txt, into a text box), for persona-artist, found three blocking problems and twelve misleading ones, all addressed then; those that still apply are carried here: a dragged file's name can't be shown; Word's horizontal lines need the site's own rule; undo after an upload; tracked changes; left-out parts counted in the note; the note staying until closed; a message for each kind of wrong file; Cancel first in the question; a reading state; the guide's other passages.

The second, of this version (Word only, no text box, pictures), for persona-artist and persona-fan, read it against the story reader's design, Star's guides, and the editor's and site's code. It found two blocking problems, twelve misleading ones and six slower ones for Star, and seven for fans. Addressed above:
- **Blocking:**
  - with no text box, a typo in a story put up by pasting couldn't be fixed without the right document (no stories are on the site yet, the lead said, so none were pasted; Star's documents are the source);
  - a one-shot couldn't be split into chapters as the guide says (now by uploading each chapter's document; the guide and notes say how).
- **Misleading:**
  - **Undo this upload** was lost when the note was closed (now on the upload line, kept with the item until publishing, warning about typed alt text);
  - what "the same picture" is, and which alt text wins (now by picture data; Word's changed alt text wins; counts in the question);
  - Word's automatic alt text passing as written (now left empty);
  - no way to mark a decorative picture outside recent Word (now a checkbox);
  - what a picture with no alt text gets on the site (now "Picture");
  - the question didn't help spot a wrong file (now both versions' names and counts);
  - pictures uploaded before publishing, cropped-out parts, location data and leftovers (now said, re-saved without location data, cropping flagged, unused pictures removed);
  - pictures that moved or were left out were silent (now counted, and the help text no longer says "as written");
  - a first line repeating the chapter's title (now left out); flattened headings named;
  - many scene breaks from double spacing (now warned);
  - "Description" against comics' "Alt text" (now "Alt text" throughout);
  - "added 2:38 pm" beside "Live" (now "not published yet").
- **Slower:** mock-ups for the decorative state and a left-out picture; the clean-up keeping pictures; the editor's read-only view.
- **For fans:** the site's query, model and HTML named; alt text rules; space kept while loading, sizes and lazy loading, also in hidden Mature text; full screen on tap; footnote markers and table rows; picture weight (re-saved at most 3200 wide, and the guide's advice); the mock-up no longer shows alt text as a caption.
