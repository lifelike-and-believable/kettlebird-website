---
id: design-comic-publish-pages
status: approved
derived-from:
  - story-comic-reader-publish-pages: c43f60cc7f9f
  - design-comic-start-reading#what-star-enters: f8ef076087b9
  - design-cms#decision: 889c200357ba
  - persona-artist#skills-and-tools: 4e28d5374320
  - persona-artist#frustrations: ef88538c418e
---

# Publish pages and chapters: design

<!-- docs/design/comic-publish-pages.md. Design for story-comic-reader-publish-pages. Mock-ups are in
docs/design/mockups/comic-publish-pages/ (PNG images, and mockups.html, the source they are rendered
from). The editor is Sanity Studio at /studio (story-content-editing-sign-in); its menu and the
publish status come from the content-editing epic and are shown here as they will look. -->

## Flow

1. Star opens **Comics** in the editor's menu and chooses a series, or **New series**, which asks for the **Title** and fills in the **Web address** from it (mock-ups 1 and 6).
2. The series shows its details and a **Chapters** list in number order, each marked **On the site** or **Not published yet**. Star chooses a chapter, or **Add chapter** (mock-up 1).
3. A new chapter opens with the next chapter number already filled in, in its **Chapter** field. Star types the **Title**, or leaves it empty for a comic without chapters (mock-up 6).
4. Star chooses **Upload pages** at the top of **Pages**, or drags a batch of files anywhere onto the page grid. Each file becomes a page; the new pages go after any pages already there, in file-name order (mock-up 2).
5. While files upload, **Publish** waits: it reads "Uploading 4 of 20…" and can't be pressed until every upload has finished or failed. If Star tries to close the tab, the browser asks whether to leave while uploads are in progress.
6. Star drags pages to reorder them if needed (mock-up 2 shows one being moved). Each page shows its number, a thumbnail, and its file name.
7. The chapter header shows how many pages still need alt text ("3 pages need alt text"). Star opens a page to add its **Alt text**, and moves through pages with **Previous page** and **Next page** in the page panel without closing it (mock-up 3). Pages without alt text show a yellow "Alt text" mark in the grid; Star can still publish.
8. Star chooses **Preview** to see the chapter in the reader before publishing (from story-content-editing-preview, once that story is built; until then this button isn't shown).
9. Star chooses **Publish**. Publishing a chapter publishes the chapter and all its pages; a new series must be published once too, and the editor offers to publish it along with its first chapter. If published pages have moved, been removed, or a published chapter's number changed, the editor first shows the shared-link warning (mock-ups 4 and 9). If pages still need alt text, the editor shows a reminder before publishing (mock-up 10), in the same dialog when there is also a link warning (mock-up 4).
10. The status at the top of the editor shows **Updating the site…**, then **Live** with the time and **View on site**, which opens the chapter's first page in the reader (mock-up 5; from story-content-editing-know-when-live).

## Mock-ups

Low-fidelity: the real screens are Sanity Studio's own components, arranged and labelled as shown. Source: `mockups/comic-publish-pages/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | Comics: a series, its details, and its chapters with their published state | `mockups/comic-publish-pages/1-series-chapters.png` |
| 2 | A chapter: pages uploading, one being dragged to a new place, one missing alt text; Publish waiting for uploads | `mockups/comic-publish-pages/2-chapter-pages.png` |
| 3 | A page open: alt text, the warning, and Previous page and Next page | `mockups/comic-publish-pages/3-page-alt-text.png` |
| 4 | Publishing a moved page: the shared-link warning, with the alt text reminder | `mockups/comic-publish-pages/4-moved-page-warning.png` |
| 5 | The publish status: updating, live with View on site, and failed | `mockups/comic-publish-pages/5-publish-status.png` |
| 6 | A new series, and a new chapter with its number filled in | `mockups/comic-publish-pages/6-new-series-chapter.png` |
| 7 | Upload problems: didn't upload, not an image | `mockups/comic-publish-pages/7-upload-problems.png` |
| 8 | Problems that stop publishing: duplicate chapter number, missing web address | `mockups/comic-publish-pages/8-cant-publish.png` |
| 9 | The shared-link warning for a removed page, an inserted page, and a changed chapter number | `mockups/comic-publish-pages/9-link-warnings.png` |
| 10 | Publishing with pages missing alt text (no link changes): the reminder | `mockups/comic-publish-pages/10-alt-text-reminder.png` |
| 11 | Deleting a comic: **Delete** in the menu next to **Publish**, then the confirmation naming its chapters | `mockups/comic-publish-pages/11-delete-comic.png` |

## Layout

- **Comics (mock-up 1):** the editor's three columns: the menu (Comics, Art, Writing, Shop, Commissions, Site settings), the list of series, and the open series. The top bar holds the publish status and the open item's **Preview** and **Publish**. The open series shows **Title**, **Web address**, **Cover**, **Description**, **Status**, and **Type**, then **Chapters**: one row per chapter, "Chapter 2: The Long Road · 24 pages · On the site", with **Add chapter** under the list.
- **Chapter (mock-up 2):** **Chapter** (the chapter's number) and **Title** at the top, with their help text; then **Pages**, with **Upload pages** and the alt text count in its header, and the page grid, six thumbnails across on a laptop, each with its page number and file name. The whole grid accepts dropped files; a dashed box at the end says "Drop page files anywhere here".
- **Page (mock-up 3):** a panel over the chapter: the page image, large, with **Alt text** beside it and its help text, "What happens on this page, for people using screen readers." **Panels** appears below, collapsed, labelled "Filled in automatically later". **Previous page**, **Next page**, and **Done** at the bottom.

## Ordering and addresses

- **Pages** are ordered as they appear in the grid. New uploads go after existing pages, sorted by file name with numbers compared as numbers, so `page-2.png` comes before `page-10.png`.
- **Chapters** are ordered by the number in their **Chapter** field, which Star sets; this is how Star reorders chapters (story criterion 1). Dragging isn't used for chapters, because a chapter's number is part of its pages' addresses. Changing a published chapter's number shows the shared-link warning (mock-up 9), worded so it reads as a reminder, not an error.
- Adding pages at the end of a chapter, or adding a new chapter, never changes the address of a published page.
- **Moving, removing, or inserting a page before published pages, or changing a published chapter's number,** changes the addresses of later pages. When Star publishes such a change, the editor first shows the warning (mock-ups 4 and 9), for example "You moved page 3 of Chapter 2: The Long Road. Links people have shared to pages 3 to 24 of Chapter 2 will point to different pages." with **Publish anyway** and **Cancel**. Nothing is blocked.

## States and errors

- **Upload fails** (connection lost): that thumbnail shows "Didn't upload" with **Try again**; the other pages are unaffected (mock-up 7).
- **Not an image:** the thumbnail says "This isn't an image file" with **Remove** (mock-up 7).
- **Print-resolution originals:** Star uploads the file as it is and never resizes or exports anything. If the print-resolution sample check (design-cms) shows the image service can't take very large files, the editor makes a screen-size copy automatically during upload and keeps the original; Star sees nothing different. No message ever asks Star to resize.
- **Missing alt text:** a yellow "Alt text" mark on the thumbnail; the count in the **Pages** header; in the page panel, "Add alt text so people using screen readers can follow the story. You can still publish."; and a reminder line in the publish dialog. The chapter can still be published.
- **Chapter with no pages:** can be saved and published; it stays hidden from visitors (design-comic-start-reading), and the series' chapter list shows "0 pages · hidden from readers".
- **Two chapters with the same number:** the editor won't publish, and says "Chapter 2 already exists in this series. Choose another number." (mock-up 8).
- **Series without a web address:** the editor won't publish the series, and says "Add a web address so readers can find this comic." (mock-up 8).
- **Publish status** (mock-up 5): **Updating the site…**; **Live** with the time and **View on site**; or **Didn't go live** with "Your change is saved, but the site didn't update. The person who looks after the site has been told and will fix it; you don't need to do anything." (story-content-editing-know-when-live).

## Deleting a comic

Added after the lead's manual pass (2026-11-02): Sanity refused to delete a series while a chapter still pointed to it, and the lead decided that deleting a series deletes its chapters.

- On a series, the menu (**⋯**) next to **Publish** has **Delete**, as on every document (mock-up 11).
- **Delete** first asks, naming the comic and how many chapters go with it: "Delete Kettle Tales and its 3 chapters?" (or "its chapter" for one), "The comic, its chapters and their pages come off the site with the next update. This can't be undone.", with **Cancel** and **Delete comic and chapters**. A comic with no chapters gets "Delete Kettle Tales?" and **Delete**. An untitled comic is "this comic".
- The chapters, published and unpublished, are deleted first, then the comic, which closes as any deleted document does. If deleting the comic itself fails, it is left with no chapters, and **Delete** can be chosen again.
- Deleting one chapter is Sanity's own **Delete** on the chapter; nothing points to a chapter, so it needs no extra step.

## Accessibility

- The editor's own accessibility comes from Sanity Studio. This design adds the file-name ordering, the page panel's **Previous page** and **Next page**, the alt text count, and the warnings, all built from the Studio's standard components, so they are keyboard operable and announced.
- **Upload pages** is a button and the keyboard route for adding files; dragging is never required, and pages can also be moved with the Studio's keyboard reordering.
- Warnings use an icon and words, never colour alone.

## Persona walkthrough

A walkthrough for persona-artist (2026-11-01), which opened each mock-up, found one blocking problem and others. Addressed here, along with the lead's renaming of the chapter's number field to **Chapter**: Star is never asked to resize a print file (the editor makes a copy itself if needed); what **Publish** publishes, with published state shown on chapters; **Publish** waits for uploads; a **Preview** step tied to the preview story; **Previous page** and **Next page** in the page panel and an alt text count; **View on site** once live; failure wording without "the lead"; **Upload pages** as a button at the top; and mock-ups for every screen and state the design describes (6 to 9 added, 1 to 5 corrected to match the text).

## Open questions

1. Should the editor stop Star publishing a page with no alt text after a grace period, rather than only warning? The content-editing requirements leave this open.
2. Do print-resolution TIFF files upload and display? Checked with the sample upload (design-cms); if not, the automatic copy above covers it.
