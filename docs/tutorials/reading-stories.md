---
id: tutorial-reading-stories
status: draft
runner: manual
derived-from:
  - docs-publishing-stories#start-a-new-story: 495b769709a1
  - docs-publishing-stories#add-a-chapter-to-a-story: 656607209cf4
  - docs-publishing-stories#mature-content-and-content-notes: d452557d2f4f
  - docs-publishing-stories#check-it-then-publish: 5cc9188892d4
---

# Tutorial: read a story on the site

<!-- docs/tutorials/reading-stories.md. runner: manual: a person follows it on the deployed site, with a
screen reader and the browser's reader mode, which CI can't drive (the pages themselves are checked by
tests/e2e/stories.spec.ts against the fixture stories). Before you start: in the editor, publish a test
one-shot with content notes and a scene break, a test story In progress with three chapters,
and a test story with **Mature or explicit content** ticked (docs/tutorials/publishing-stories.md shows how). Use the live address,
https://newsite.kettlebird.com until the move to kettlebird.com. Delete the test stories at the end. -->

You'll find stories on the Writing page, read a one-shot and a story in chapters, meet a mature story's question, share a chapter, and check the news page, by keyboard and with a screen reader.

## Steps

1. Open `/writing`. The story in chapters is first, with **Read** and "In progress · 3 chapters". The one-shot has **Read**; the ticked story's card has the tag **Mature or explicit**; a story that's only elsewhere still has **Read it →**.
2. Choose the one-shot's **Read**. The title is at the top, then the cover, the tags and the short description, then **Before you read** with the notes, then the text in one column. Italics and bold are as written, and the scene break is a centred ⁂. At the end are **Back to Writing** and, if the story has a link, **Also on …**.
3. On a phone (or a narrow window, 360 px), the page doesn't scroll sideways. Zoom the text to 200%: it still reads.
4. Turn on the browser's reader mode: the story's text is there, without the site's header and footer.
5. Open the story in chapters. Under **Before you read** are **Start reading** and **Read the newest chapter**, then **Chapters**: three chapters, each with its date. Choose **Start reading**.
6. On Chapter 1, use only the keyboard: Tab to **Next chapter** at the end and press Enter. On Chapter 2, **Previous chapter**, **Chapters** and **Next chapter** are at the top and the end. On Chapter 3, the end says "That's the newest chapter. More to come."
7. With a screen reader (VoiceOver or NVDA), on a chapter page: the headings list has the chapter's title as the only level 1 heading and **Before you read**; the landmarks list has two navigations, "Chapters" and "Chapters, end of chapter"; a scene break is read as "Scene break".
8. Open the ticked story. Its tags include **Mature or explicit**. Only **Before you read** shows, with "This story has mature or explicit content." and **Continue to the story**. Choose it: the text appears, and the screen reader starts reading at the text. Open the ticked story again: it shows the text straight away.
9. In a private window, with JavaScript turned off in the browser's settings, open the ticked story: the box shows and the text is under it.
10. Copy a chapter's address and paste it into a message on a social site or chat app (without sending it): the preview shows the story's title and the chapter, its description, and its cover or the site's logo.
11. Open `/news`. The story in chapters has entries for its later chapters, such as "Test story · Chapter 3", each linking to that chapter.
12. Open `/writing/<the story's web address>/9`: **Page not found**, with **Back to …** your story and **Writing**.
13. Delete the test stories in the editor.

## What you found

Stories read comfortably on a phone and a computer, by keyboard and with a screen reader; chapters link in order; a mature story asks once; links shared from the site show the story; and nothing breaks when an address is wrong.
