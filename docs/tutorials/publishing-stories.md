---
id: tutorial-publishing-stories
status: draft
runner: manual
derived-from:
  - docs-publishing-stories#start-a-new-story: 49627f0d95e9
  - docs-publishing-stories#upload-the-text: 316554d06769
  - docs-publishing-stories#pictures: 64b183de135a
  - docs-publishing-stories#scene-breaks: 35ee55c96f0c
  - docs-publishing-stories#add-a-chapter-to-a-story: 656607209cf4
  - docs-publishing-stories#if-links-will-change: 167f874b9e6e
  - docs-publishing-stories#remove-a-story: ded2e4a3e306
  - docs-publishing-stories#if-something-goes-wrong: 15c6ca12de4f
---

# Tutorial: put a story in the editor

<!-- docs/tutorials/publishing-stories.md. runner: manual: a person follows it on the deployed editor,
because it needs a signed-in editor and real files, which CI doesn't have (the Word reader itself is
unit-tested with the sample documents). Before you start: this change is deployed; download the sample
documents word-chapter.docx, gdocs-chapter.docx and edited.docx from the repository's tests/fixtures/word/,
and have one of Star's own chapters as a .docx, with a picture, and a PDF of anything. Use the live address,
https://newsite.kettlebird.com until the move to kettlebird.com. Every story you make here is deleted at the
end. (docs/specs/story-import-word.md AC-28.) -->

You'll upload a one-shot, check what came in and its pictures, add alt text, upload a new version and undo it, try a wrong file, publish, split the story into chapters by uploading each chapter, see the link warning, and delete the test stories.

## Steps

1. Open `/studio`, sign in, and go to **Writing**. Choose **New story** and type the title "Tutorial Story". **Web address** fills in as `tutorial-story`. At the top left is "Help: Start a new story ↗"; choose it, and "Putting stories on the site" opens in a new tab at "Start a new story". Close that tab.
2. Check the form's order: **Title**, **Web address**, **Short description**, **Cover**, **Genres**, **Rating**, **Content notes**, **Status**, **Text**, **Chapters**, **Date posted**, **Link to read it**. **Rating** offers General, Teen, Mature, Explicit and Not rated.
3. **Text** has **Upload a Word document**, ".docx, or drop one below", and the space "No text yet. Drop the story's .docx here, or use Upload a Word document." There's no box to type in. Its help says "For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead." Press Tab until **Upload a Word document** is focused, and press Enter: the computer's file chooser opens, listing .docx files. Choose `gdocs-chapter.docx`.
4. "Reading gdocs-chapter.docx…" shows, then the text, read-only: "The fox came back at *dusk*.", "It was **very** hungry.", a picture, a "Scene break" bar, "Mira fed it. Bread and cheese.", and a picture. The note says "Added gdocs-chapter.docx: 3 paragraphs, 1 scene break and 2 pictures, with its italics and bold.", "1 alt text came from Word: check it.", the tracked changes line, and "Check the story, then publish." Above the text: "gdocs-chapter.docx, added (the time), not published yet · Undo this upload".
5. Under the text, **Pictures** says "1 needs alt text". Picture 1's **Alt text** is "The fox at the door", marked "alt text from Word". Picture 2 is marked "Alt text" with "Add alt text so people using screen readers know what it shows, or tick Decorative. You can still publish." Type "A letter" in Picture 2's **Alt text** ("Alt text for picture 2") and press Tab: the mark goes and **Pictures** says "Every picture has alt text or is decorative."
6. Drop `edited.docx` on the text. The question "Replace the story's text?" shows what's there now (gdocs-chapter.docx, 3 paragraphs, 2 pictures) and what's coming, with **Cancel** focused. Press Escape: nothing changes. Drop it again and choose **Replace**: "Adding picture 1 of 6…" counts up, then the note lists the headings, the table, the footnotes, the moved picture, the pictures left out, the cropped picture, the alt texts from Word, the tracked changes, and "Picture 7 in edited.docx couldn't be added (it's a drawing made in Word…)". Its first line, "Chapter 3: Over the Ridge", isn't left out (this is a one-shot called Tutorial Story).
7. Choose **Undo this upload**: it asks "Undo this upload? Alt text you've typed since will go too." (you typed "A letter"). Choose **Undo**: the gdocs text and its two pictures are back, Picture 2's alt text "A letter" included, and the line says gdocs-chapter.docx again, without **Undo this upload**. Reload the page: it's the same.
8. Drop the PDF: "… isn't a Word document. Upload the story as a .docx: …" shows as an alert, and nothing changes. Close the note with ✕: it goes, and the upload line stays.
9. Leave **Rating** empty and look at the top of the form: the box says to add a rating, and **Rating** says "Choose a rating, or Not rated." Choose **Teen**. Choose **Publish**. The publish note shows and the status at the top right moves on to **Live**; the upload line loses "not published yet" and **Undo this upload**. **View on site** opens the story's page: the pictures are in the column, as wide as it or their own width if smaller; tap one to see it full screen, and press Escape. On a phone, the same.
10. Under **Chapters** it says "No chapters yet." Choose **Add chapter**. Chapter 1 opens beside the story, titled "Tutorial Story · Chapter 1", with your text in it and the note "Your story's text is now in Chapter 1." The story's **Text** is replaced by "This story has chapters, so its text is in them. To make it a one-shot again, remove its chapters and upload the whole story here.", with no upload button. Chapter 1 shows the upload line "gdocs-chapter.docx, added …". Chapter 1 has "Help: Add a chapter to a story ↗" at the top left, and no **Preview**.
11. In Chapter 1, type the title "Over the Ridge" and set **Chapter** to 3, then back to 1. Upload Star's own chapter document with **Upload a new version**: the question is "Replace Chapter 1's text?". Choose **Replace**, and check the text and its picture against the document. Give the picture alt text. Then change the title to "Beginning". Leave **Date posted** empty and choose **Publish**: the note goes, and **Date posted** shows today. Under the story's **Chapters**, the row reads "Chapter 1: Beginning · On the site".
12. Choose **Add chapter** again: Chapter 2 opens, with **Chapter** set to 2 and an empty **Text** whose help is "Upload the chapter as a Word document (.docx). …". Choose **Publish**: it can't publish, and **Text** says "Add the chapter's text." Upload `word-chapter.docx` with **Title** "Over the Ridge" and **Chapter** 3 set first: the note's second line is "Its first line, "Chapter 3: Over the Ridge", was left out, as the chapter's title shows it." Then change **Chapter** to 1: it says "Chapter 1 already exists in this story. Choose another number." Set it back to 2, clear the title, and publish. The list reads "Chapter 1: Beginning · On the site" then "Chapter 2 · On the site".
13. In Chapter 2, change **Chapter** to 3 and choose **Publish**: "Some links will change" says "You changed chapter 2 to chapter 3…". Choose Cancel, and set it back to 2.
14. On the story, change **Web address** to `tutorial-story-2` and choose **Publish**: "Some links will change" says "You changed Tutorial Story's web address from tutorial-story to tutorial-story-2…". Choose **Publish anyway**.
15. Make a new story, "Tutorial Story Two", choose **Add chapter** before publishing it, upload `gdocs-chapter.docx` into Chapter 1, and leave the story's **Rating** empty. Chapter 1's **Publish** can't be chosen, and says what the story needs. Choose **Not rated** on the story, then publish Chapter 1: the story is published with it.
16. Delete both test stories: ⋯ next to **Publish**, then **Delete**. For the first: "Delete Tutorial Story and its 2 chapters?", with **Delete** and Cancel. Choose **Delete**: the story and its chapters go from **Writing**. Delete "Tutorial Story Two" the same way.
17. Open the site's Writing page: it looks as it did before you started. A few seconds after the deletes, the test stories' pictures are gone from the editor's picture library (**Media**, if it's installed, or ask the lead to check).

## What you found

A story's text uploads clean from a Word document, pictures and all, with a note of what came in and what didn't; scene breaks come from symbol lines, horizontal lines and gaps; a wrong file says what to do; a new version keeps alt text and can be undone until publishing; a one-shot splits into chapters by uploading each chapter; chapters are numbered and checked like comic chapters.
