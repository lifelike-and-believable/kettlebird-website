---
id: tutorial-publishing-comics
status: draft
runner: manual
derived-from:
  - docs-publishing-comics#start-a-new-comic: f013c43de03b
  - docs-publishing-comics#add-a-chapter: 6b9730bd5db8
  - docs-publishing-comics#add-pages: 0114dfedb96c
  - docs-publishing-comics#describe-each-page: c096de4c45a0
  - docs-publishing-comics#publish: 0fb6028735a2
  - docs-publishing-comics#if-links-will-change: 9488ad00a0a3
  - docs-publishing-comics#if-something-goes-wrong: c00d73719809
  - docs-publishing-comics#remove-a-comic: 7ccc4082f01b
---

# Tutorial: put a new comic on the site

<!-- docs/tutorials/publishing-comics.md. runner: manual: a person follows it in the real editor
before each release, because the editor needs a Sanity sign-in that CI doesn't have. Use a test
series ("Tutorial Comic") and delete it afterwards. You need four small PNG files named page-1.png,
page-2.png, page-10.png and cover.png, and one text file, notes.txt. -->

You'll start a comic, add a chapter, upload its pages, describe them, and publish, then see the warnings the editor gives before links change.

## Steps

1. Open the editor at `/studio` and sign in. Choose **Comics**, then the + button, **New series**.
2. Type `Tutorial Comic` into **Title**. Choose **Generate** next to **Web address**. You see `tutorial-comic`.
3. Under **Chapters**, you see "No chapters yet." Choose **Add chapter**. A new chapter opens beside the series, headed "Tutorial Comic · New chapter", and its **Chapter** field shows 1.
4. Type `The Kettle` into **Title**.
5. Choose **Upload pages** and pick page-10.png, page-2.png, page-1.png and notes.txt together. While they upload, **Publish** reads "Uploading 1 of 3…" (or similar) and can't be pressed.
6. When the uploads finish, the pages are in the order page-1, page-2, page-10. notes.txt is listed with "This isn't an image file" and **Remove**. Choose **Remove**.
7. The top of **Pages** says "3 pages need alt text", and each page is marked "⚠ Alt text".
8. Open the first page. Type `Fox looks at the kettle.` into **Alt text**. Choose **Next page**: the second page opens without closing the panel. Choose **Previous page**: the first page opens again. Choose **Done**.
9. The top of **Pages** now says "2 pages need alt text".
10. Choose **Publish**. The dialog is headed "Some pages have no alt text", says "2 pages in Chapter 1: The Kettle have no alt text…", and says "Tutorial Comic isn't on the site yet, so publishing this chapter publishes it too." Choose **Publish anyway**.
11. Open **Tutorial Comic**. Under **Chapters** you see "Chapter 1: The Kettle · 3 pages · On the site".
12. Open the chapter again and drag page 3 to the start. Choose **Publish**. The dialog is headed "Some page links will change" and says "You moved page 1 of Chapter 1: The Kettle. Links people have shared to pages 1 to 3 of Chapter 1 will point to different pages." Choose **Cancel**, and nothing is published.
13. Choose **Add chapter** on the series and change its **Chapter** field to 1. The field shows "Chapter 1 already exists in this series. Choose another number." and **Publish** can't be pressed. Delete this chapter.
14. After the site's next build (a minute or two), open `/comics/tutorial-comic`. You see **Chapter 1: The Kettle** (or, for a series with one untitled chapter, **Start reading**), and the reader shows the three pages in the order you published them.
15. Open **Tutorial Comic**, choose the menu next to **Publish**, and choose **Delete**. The dialog asks "Delete Tutorial Comic and its chapter?". Choose **Delete comic and chapters**. The comic and its chapter are gone from **Comic Series** and **Chapter**.

## What you found

Uploads go in file-name order whatever order you pick them in, files that aren't images never upload, **Publish** waits for uploads and reminds you about alt text and changed links before publishing, a new comic is published along with its first chapter, and deleting a comic deletes its chapters.
