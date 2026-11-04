---
id: tutorial-publishing-stories
status: draft
runner: manual
derived-from:
  - docs-publishing-stories#start-a-new-story: 603c472bb295
  - docs-publishing-stories#paste-your-text: 98330491c394
  - docs-publishing-stories#scene-breaks: 7d9b82fc6411
  - docs-publishing-stories#add-a-chapter-to-a-story: 718c0986048b
  - docs-publishing-stories#if-links-will-change: 167f874b9e6e
  - docs-publishing-stories#remove-a-story: ded2e4a3e306
  - docs-publishing-stories#if-something-goes-wrong: 472393b8667b
---

# Tutorial: put a story in the editor

<!-- docs/tutorials/publishing-stories.md. runner: manual: a person follows it on the deployed editor,
because it needs a signed-in editor and a real clipboard, which CI doesn't have (the paste clean-up
itself is unit-tested with Google Docs and Word clipboard HTML). Before you start: this change is
deployed; you have a Google Doc with a few paragraphs, some italics and bold, a line with "* * *"
on it, and a horizontal line (Insert, Horizontal line). Use the live address,
https://newsite.kettlebird.com until the move to kettlebird.com. Every story you make here is
deleted at the end. Stories don't show on the site yet: the Writing page looks as it does now. -->

You'll paste a one-shot, check its scene breaks, publish it, split it into chapters, add a chapter, see the link warning, and delete the test story.

## Steps

1. Open `/studio`, sign in, and go to **Writing**. Choose **New story** and type the title "Tutorial Story". **Web address** fills in as `tutorial-story`. At the top left is "Help: Start a new story ↗"; choose it, and "Putting stories on the site" opens in a new tab at "Start a new story". Close that tab.
2. Check the form's order: **Title**, **Web address**, **Short description**, **Cover**, **Genres**, **Rating**, **Content notes**, **Status**, **Text**, **Chapters**, **Date posted**, **Link to read it**. **Rating** offers General, Teen, Mature, Explicit and Not rated.
3. Copy everything in the Google Doc, click in **Text**, and paste. Paragraphs, italics and bold come through. The "* * *" line and the horizontal line are each a "Scene break" bar. There are no empty paragraphs between the others. The toolbar offers only **Italic**, **Bold** and **Scene break**.
4. Click at the end of a paragraph, press Enter, type `***`, and press Enter: the line becomes a "Scene break" bar, and the cursor is on a new empty line below it. Click the bar and press Delete to remove it.
5. Leave **Rating** empty and look at the top of the form: the box says to add a rating, and **Rating** says "Choose a rating, or Not rated." Choose **Teen**. Choose **Publish**. The publish note shows and the status at the top right moves on to **Live**; **View on site** opens the Writing page.
6. Under **Chapters** it says "No chapters yet." Choose **Add chapter**. Chapter 1 opens beside the story, titled "Tutorial Story · Chapter 1", with your text in it and the note "Your story's text is now in Chapter 1." The story's **Text** is replaced by "This story has chapters, so its text is in them. To make it a one-shot again, move the text back and remove the chapters." Chapter 1 has "Help: Add a chapter to a story ↗" at the top left, and no **Preview**.
7. In Chapter 1, type the title "Beginning". Leave **Date posted** empty and choose **Publish**: the note goes, and **Date posted** shows today. Under the story's **Chapters**, the row reads "Chapter 1: Beginning · On the site".
8. Choose **Add chapter** again: Chapter 2 opens, with **Chapter** set to 2 and an empty **Text**. Choose **Publish**: it can't publish, and **Text** says "Add the chapter's text." Paste a paragraph, then change **Chapter** to 1: it says "Chapter 1 already exists in this story. Choose another number." Set it back to 2 and publish. The list reads "Chapter 1: Beginning · On the site" then "Chapter 2 · On the site".
9. In Chapter 2, change **Chapter** to 3 and choose **Publish**: "Some links will change" says "You changed chapter 2 to chapter 3…". Choose Cancel, and set it back to 2.
10. On the story, change **Web address** to `tutorial-story-2` and choose **Publish**: "Some links will change" says "You changed Tutorial Story's web address from tutorial-story to tutorial-story-2…". Choose **Publish anyway**.
11. Make a new story, "Tutorial Story Two", choose **Add chapter** before publishing it, paste a paragraph into Chapter 1, and leave the story's **Rating** empty. Chapter 1's **Publish** can't be chosen, and says what the story needs. Choose **Not rated** on the story, then publish Chapter 1: the story is published with it.
12. Delete both test stories: ⋯ next to **Publish**, then **Delete**. For the first: "Delete Tutorial Story and its 2 chapters?", with **Delete** and Cancel. Choose **Delete**: the story and its chapters go from **Writing**. Delete "Tutorial Story Two" the same way.
13. Open the site's Writing page: it looks as it did before you started.

## What you found

A story's text pastes in clean from a document, scene breaks come from symbol lines, horizontal lines and Enter, a one-shot splits into chapters without losing anything, chapters are numbered and checked like comic chapters, and nothing about stories shows on the site yet.
