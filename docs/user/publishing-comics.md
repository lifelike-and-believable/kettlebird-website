---
id: docs-publishing-comics
status: approved
derived-from:
  - design-comic-publish-pages: 9225936f631c
  - story-comic-reader-publish-pages: c43f60cc7f9f
  - design-comic-start-reading#what-star-enters: f8ef076087b9
---

# Publishing comic pages and chapters

<!-- docs/user/publishing-comics.md. For Star (persona-artist): how to put comic pages on the site
with the editor at /studio. Written from design-comic-publish-pages. -->

Everything here happens in the editor: add `/studio` to the end of your site's address and sign in (your getting-started guide covers signing in the first time). **Preview**, **Publish**, and the update status are at the top right of the editor.

When you publish, the site updates on its own, usually within a minute or two. You never need to resize or export your pages for the site; the only thing to check is that their file names sort in reading order (see "Add pages").

## Start a new comic

1. In the editor's menu, choose **Comics**, then **New series**.
2. Type the comic's **Title**. The **Web address** fills itself in from the title; that's the end of the comic's link, like `/comics/moonlit-errands` after your site's address. You can change it now, but once people have shared links, leave it alone.
3. Add a **Cover**, a **Description**, the **Status** (**Ongoing**, **Complete**, or **On Hiatus**), and the **Type** (**Original** or **Fancomic**).
4. Choose **Add chapter** to add the first chapter (below). When you publish, the editor publishes the new comic along with it.

If your comic doesn't have chapters, add one chapter and leave its **Title** empty. Readers won't see a chapter list, and you can add chapters later without breaking anyone's links.

## Add a chapter

1. Open the comic under **Comics** and choose **Add chapter**.
2. The **Chapter** field already has the next number. Use 0 for a prologue.
3. Type the chapter's **Title**: just the name, like "Homeward". The site adds "Chapter 3" for you.

Your comic's **Chapters** list shows each chapter as **On the site** or **Not published yet**. A chapter with no pages stays hidden from readers until you add some.

To move a chapter, change its **Chapter** number. If readers may have shared links to its pages, the editor reminds you before you publish (see "If links will change", below).

## Add pages

1. In the chapter (a new chapter opens straight away; otherwise choose it in the comic's **Chapters** list), choose **Upload pages** and pick your page files, or drag them from your computer anywhere onto the pages.
2. Upload your original files, as they are, even at print resolution: PNG, JPEG, and TIFF files all work. The site makes smaller copies for readers' screens. Photoshop (PSD) and PDF files aren't page images; save those as PNG first.
3. New pages go after the pages already there, in file-name order: name your files so they sort in reading order, like `page-01`, `page-02`. (Numbers sort as numbers, so `page-2` comes before `page-10`.)
4. To change the order, drag a page to its new place.

While files upload, the **Publish** button shows how many are done ("Uploading 4 of 20…") and can't be pressed. Large files take longer; keep the editor open until they finish, and if you try to close it, your browser will ask whether to leave. When **Publish** reads **Publish** again, every upload has finished. Before publishing, check that no page says "Didn't upload" (see "If something goes wrong"); a page that didn't upload won't be published.

## Describe each page

Each page has **Alt text**: a sentence or two about what happens on the page, which screen readers read to people who can't see it, for example "Fox reaches for the kettle on the top shelf and knocks over a jar."

1. Choose a page to open it. It opens over the chapter, with the page large on the left.
2. Type its **Alt text**. Until you do, the panel says "Add alt text so people using screen readers can follow the story. You can still publish."
3. Use **Next page** and **Previous page** to move through the chapter without closing it. Choose **Done** when you've finished.

Below the alt text is **Panels**, marked "Filled in automatically later". You can leave it alone.

The top of the pages shows how many still need alt text ("3 pages need alt text"), and those pages have a yellow "Alt text" mark. You can publish without it, but readers using screen readers won't be able to follow those pages.

## Publish

1. If there's a **Preview** button at the top right, choose it to see the chapter as readers will, then close the preview to come back. (It arrives with a later update to the editor; until then, the button isn't there.)
2. Choose **Publish**.
3. If any pages still need alt text, or published links will change (below), the editor tells you first; choose **Publish anyway** to carry on, or **Cancel** to go back and fix it.
4. The status at the top right shows **Updating the site…**, then **Live** with the time. (Before you publish, it shows when your last change went live.)
5. Choose **View on site** to open the chapter's first page as readers see it.

## If links will change

Readers share links to single pages. Adding pages at the end of a chapter, or adding a new chapter, never changes those links. These do:

- moving a page, or adding one before pages that are already on the site;
- removing a page that's on the site;
- changing a published chapter's **Chapter** number.

When you publish one of these, the editor tells you which pages' links will change. Choose **Publish anyway** if that's what you meant, or **Cancel** to go back. The same message reminds you of any pages without alt text.

## Remove a comic

1. Open the comic under **Comics**.
2. Choose the menu (**⋯**) next to **Publish**, then **Delete**.
3. The editor asks, for example, "Delete Kettle Tales and its 3 chapters?". Choose **Delete comic and chapters**, or **Cancel** to keep it.

The comic, its chapters and their pages come off the site with the next update, and links people have shared to them stop working. This can't be undone.

To remove just one chapter, open it and choose **Delete** from the same menu.

## If something goes wrong

| What you see | What it means | What to do |
|---|---|---|
| "Didn't upload" on a page, with **Try again** | The upload was interrupted, for example by a dropped connection. | Choose **Try again**. The other pages are fine. |
| "This isn't an image file", with **Remove** | A file that isn't a picture was dropped in. | Choose **Remove**, then upload the right file. |
| "Chapter 2 already exists in this series. Choose another number.", and **Publish** greyed out with "Fix the problem above to publish." | Two chapters have the same **Chapter** number. | Change one of them. |
| "Add a web address so readers can find this comic.", and **Publish** greyed out | The comic's **Web address** is empty. | Fill it in; it can be the title, in lower case with dashes. |
| "This isn't an image file" on a PSD or PDF | Those aren't page images. | Save the page as PNG, then upload it. |
| **Didn't go live**: "Your change is saved, but the site didn't update." | Something went wrong on the site's side, not yours. | Nothing; your work is saved, and the person who looks after the site has been told and will fix it. |
