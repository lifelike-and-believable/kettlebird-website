---
id: docs-publishing-comics
status: approved
summary: "Starting a comic, adding chapters and pages, and publishing them."
derived-from:
  - design-help-links#the-help-page: 9b6650022c9f
  - design-comic-publish-pages: 9225936f631c
  - story-comic-reader-publish-pages: c43f60cc7f9f
  - design-comic-start-reading#what-star-enters: f8ef076087b9
  - design-organised-editor#sections-and-fields: 20d25885468d
  - design-comic-spread-and-flip#flow-star: 8a29fdafa90d
  - design-comic-spread-and-flip#what-star-enters: 16e88bf6624e
  - design-comic-spread-and-flip#how-it-works: c145d0b6b751
  - design-comic-spread-and-flip#settings-per-comic: 64a1be41076a
  - story-comic-reader-flip-and-panels-comic-settings: 91b08e4f2d65
  - story-comic-reader-flip-and-panels-two-page-spread: 3bd1fa1fe9f5
  - design-comic-panels#flow-star: e225a835bdb6
  - design-comic-panels#what-star-enters: 309998a120e2
  - design-comic-panels#how-it-works: cce393bb0002
  - story-comic-reader-flip-and-panels-panels-found: 61aa1e576413
  - story-comic-reader-flip-and-panels-correct-the-panels: 0e8299e7679c
  - design-comic-page-width#for-the-guides: 83f4c25ba8e5
---

# Publishing comic pages and chapters

<!-- docs/user/publishing-comics.md. For Star (persona-artist): how to put comic pages on the site
with the editor at /studio. Written from design-comic-publish-pages. -->

Everything here happens in the editor, at `kettlebird.com/studio` (signing in is in [Getting started](getting-started.md)). **Publish** is at the bottom of the open item, and the update status is at the top right.

When you publish, the site updates on its own, usually within a minute or two; [When your change is live](going-live.md) explains the status that tells you. You never need to resize or export your pages for the site; the only thing to check is that their file names sort in reading order (see "Add pages").

## Start a new comic

1. In the editor's menu, choose **Comics**, then **New series**.
2. Type the comic's **Title**. The **Web address** fills itself in from the title; that's the end of the comic's link, like `/comics/moonlit-errands` after your site's address. You can change it now, but once people have shared links, leave it alone.
3. Add a **Cover**, a **Description**, the **Status** (**Ongoing**, **Complete**, or **On Hiatus**), and the **Kind** (**Original** or **Fancomic**). In the **Description**, press Enter to start a new line, and leave a blank line between paragraphs: the site shows them as you typed them.
4. Choose **Add chapter** to add the first chapter (below). When you publish, the editor publishes the new comic along with it.

If your comic doesn't have chapters, add one chapter and leave its **Title** empty. Readers won't see a chapter list, and you can add chapters later without breaking anyone's links.

## Add a chapter

1. Open the comic under **Comics** and choose **Add chapter**.
2. The **Chapter** field already has the next number. Use 0 for a prologue.
3. Type the chapter's **Title**: just the name, like "Homeward". The site adds "Chapter 3" for you.

Your comic's **Chapters** list shows each chapter as **On the site** or **Not published yet**. A chapter with no pages stays hidden from readers until you add some.

To move a chapter, change its **Chapter** number. If readers may have shared links to its pages, the editor reminds you before you publish (see "If links will change", below).

## Add pages

1. In the chapter (a new chapter opens straight away beside the comic; otherwise choose it in the comic's **Chapters** list), choose **Upload pages** and pick your page files, or drag them from your computer anywhere onto the pages.
2. Upload your original files, as they are, even at print resolution: PNG, JPEG, and TIFF files all work. The site makes smaller copies for readers' screens. Photoshop (PSD) and PDF files aren't page images; save those as PNG first.
3. New pages go after the pages already there, in file-name order: name your files so they sort in reading order, like `page-01`, `page-02`. (Numbers sort as numbers, so `page-2` comes before `page-10`.)
4. To change the order, drag a page to its new place.

While files upload, the **Publish** button shows how many are done ("Uploading 4 of 20…") and can't be pressed. Large files take longer; keep the editor open until they finish, and if you try to close it, your browser will ask whether to leave. When **Publish** reads **Publish** again, every upload has finished. Before publishing, check that no page says "Didn't upload" (see "If something goes wrong"); a page that didn't upload won't be published.

## Describe each page

Each page has **Alt text**: a sentence or two about what happens on the page, which screen readers read to people who can't see it, for example "Fox reaches for the kettle on the top shelf and knocks over a jar."

1. Choose a page to open it. It opens over the chapter, with the page large on the left.
2. Type its **Alt text**. Until you do, the panel says "Add alt text so people using screen readers can follow the story. You can still publish."
3. Use **Next page** and **Previous page** to move through the chapter without closing it. Choose **Done** when you've finished.

Below **Two-page spread** is **Panels**: the panels the site found on the page, for fans who read panel by panel. See "Panels", below.

The top of the pages shows how many still need alt text ("3 pages need alt text"), and those pages have a yellow "Alt text" mark. You can publish without it, but readers using screen readers won't be able to follow those pages.

## Two-page spreads and how pages pair up

A comic can show two pages side by side on a laptop, or a tablet held sideways, like an open comic; on a phone, readers always see one page at a time. A comic can also turn its pages, on any screen, with an animation of a page turning over; it's skipped for readers who've asked their device to reduce motion, and in older browsers.

### Turn them on for a comic

Both are off for every comic until you turn them on, comic by comic:

1. Open the comic under **Comics**.
2. Under **How it reads**, tick **Two pages side by side**, **Page-flip**, or both.
3. Publish the comic itself (publishing a chapter doesn't publish its comic's settings). No page's link changes, so the editor doesn't warn you about shared links.
4. To see how it reads before you publish, open a chapter and choose **Preview**: **Computer** shows pairs if **Two pages side by side** is ticked, and **Previous** and **Next** turn pages in the preview, with the page-flip if it's ticked.

With **Two pages side by side** off, every screen shows one page at a time. A page you've marked as a two-page spread still shows wide on a laptop, on its own. Each chapter's **Open on** then has no effect, and says so; the choice is kept for if you turn pairs on later.

### How big pages show on a computer

Under **How it reads**, **Page size on a computer** chooses how big pages show on a laptop or desktop, one at a time or two side by side:

- **Fit the screen** (every comic starts with this): the whole page and the buttons show at once, without scrolling. Pages are small: about 390 pixels wide in a laptop's 1440 × 780 browser window (the table below shows others).
- **Fit the width**: each page shows as wide as its picture, narrowed to fit the window. Pages can run below the bottom of the window, and readers scroll down to the buttons.
- **Fit the height**: each page is as tall as the window, never wider than its picture. Readers scroll down a little to the buttons.

**Largest page width** is the widest a page shows, in screen pixels. Leave it empty and each page shows no wider than its picture, so uploading bigger pictures gives bigger pages. Above its number box, a blue line says how wide this comic's pictures are (it appears once the comic has pages). A number wider than your pictures enlarges them, and they may look soft. A two-page spread shows up to twice it. **Fit the screen** ignores it.

What a 2:3 page comes to, in pixels wide, in some common browser windows (a screen less the browser's own bars), with **Largest page width** empty and pictures at least as wide as shown. A **Largest page width**, or narrower pictures, change these; **Fit the height** is never wider than the picture either:

| Window | Fit the screen | Fit the width, pictures 800 / 1600 / 2400 wide | Fit the height |
|---|---|---|---|
| 1366 × 640 (a small laptop) | about 290 | 800 / 1318 / 1318 | about 430 |
| 1440 × 780 (a laptop) | about 390 | 800 / 1392 / 1392 | about 520 |
| 1920 × 960 (a desktop) | about 510 | 800 / 1600 / 1872 | about 640 |

A few things to know:

- Most laptops have sharp screens, where a picture looks sharpest when it's twice the width it shows at. A page shown at 800 pixels looks best from a picture 1600 wide.
- Keep a chapter's pages the same size, so they read evenly.
- Narrower windows and browser zoom shrink pages to fit. Phones and tablets always fit the screen.
- Fans on a computer can choose another size for themselves with **Page size**, the button beside **Panel by panel** in the reader. A dot on that button means a choice of their own is showing in that browser; choosing **Comic's choice** there clears it. If what you see on your own computer doesn't match your setting, check for that dot.
- Like the tick boxes, these go live when you publish the comic itself. **Preview** at **Computer** shows a 1280 × 800 laptop's window, made smaller to fit beside the editor, so it shows how the page and buttons fall, not the page's real size. To see the real size, publish the comic and open it on your computer; if it isn't the size you chose, look for a dot on **Page size**.

### How pages pair up

Each chapter has **Open on**, under its **Title**:

- **The right, like a printed comic** (already chosen): page 1 shows alone on the right, then pages 2 and 3 face each other, then 4 and 5.
- **The left, pairing from page 1**: pages 1 and 2 face each other, then 3 and 4.

If a chapter's last page has no page facing it, it shows alone on its own side. A spread (below) takes both sides, and the page after it starts a new pair on the left.

### Add a two-page spread

A two-page spread is one picture drawn across two facing pages. To add one:

1. Upload it as one wide picture, then drag it into its place among the chapter's pages. (In a new chapter, you can instead name the file so it sorts into place.)
2. Open it and tick **Two-page spread**, under **Alt text**. In the pages grid it now shows twice as wide, marked "Two-page spread".

On a wide screen, a spread covers both sides and is never split across a page turn. On a phone, it's shrunk to fit the screen, with "Turn your phone sideways to see it bigger." under it. A spread is still one page, with one link, and readers see "Page 5 of 12 · two-page spread" above it.

If you upload a picture that's wider than it is tall and don't tick the box, the page panel asks: "This picture is wider than it is tall. Is it a two-page spread? If so, tick **Two-page spread**; otherwise it shows small, on one side."

### A page left alone

A spread always starts on the left. If the page before it would have been on the left, that page shows alone on the left, and the spread's page panel says so under the tick box, for example "This chapter opens on the right, so page 4 shows alone on the left, before this spread." That's allowed. To close the gap, move a page, or change the chapter's **Open on**.

### Check it

Changing **Open on** or ticking **Two-page spread** changes no page's link, so the editor doesn't warn you about shared links. To check how a chapter pairs up, choose **Preview**: if the comic has **Two pages side by side** ticked, **Computer** shows pairs, however narrow your editor window is; **Phone** shows one page at a time.

## Panels

Fans can read a page panel by panel, each panel enlarged to fit their screen, whenever the reader shows one page at a time (on a phone, and on a laptop in comics without two pages side by side). The site finds the panels for you; you check them, and fix the few it gets wrong. Your changes are saved as you work and go live when you publish the chapter.

### How panels are found

As soon as a page uploads, the editor looks for the light gutters between its panels and numbers them in reading order: top to bottom, and left to right in each row. On a two-page spread, the middle counts as a gap only if you left a light gap there. A page takes about a second. Each page's tile in the grid says what it found, for example "5 panels", or "Shown whole" for a splash page or a page without clear gutters, which shows whole in panel-by-panel reading.

**Publish** waits while panels are being found ("Finding panels on 3 pages…"), as it does for uploads. If it takes more than 20 seconds, **Publish** works again and those pages go live whole. When their panels arrive, the page says "Panels found after publishing. Publish again to use them."

### Check them

Open a page. Its picture shows each panel as a numbered box, and **Panels**, under **Two-page spread**, says "5 panels, found by the site. Check that they match your page."

- If they're right, choose **They're right**.
- To move a box, drag it. To resize it, drag one of the handles on its corners and edges.
- To add a panel, drag on the picture where there's no box, or choose **Add panel** for a box in the middle of the page. It's numbered after the last one. A box smaller than 3% of the page isn't kept.
- To remove a box, click it and choose **Remove**.
- To change the reading order, click a box and choose **Earlier** or **Later**; or choose **Set the reading order** and click the boxes in the order they're read, then **Finish order**. **Cancel** leaves the order as it was.
- To show a page whole in panel-by-panel reading, choose **Show this page whole**. To give it panels again, draw them.
- **Undo** undoes your last change, back to when you opened the page. Nothing asks before a change, because you can always undo it.

Once you've changed or confirmed a page's panels, they're yours: the site never finds panels on that page again. If you replace the picture, the site finds its panels again when they were the site's; if they were yours, it keeps them and says "The picture changed. Check that your panels still match." While the panels are still the site's, **Find panels again** looks again.

With the keyboard, every box is a button, named for example "Panel 2 of 5":

- Tab to a box. The arrow keys move it a little; Shift with Right or Down makes it wider or taller, and with Left or Up narrower or shorter.
- [ and ] move it earlier or later. Delete removes it. Ctrl+Z (⌘Z on a Mac) undoes.
- In **Set the reading order**, Tab to each box in turn and press Enter to number it; Escape cancels.
- **Add panel**, **Show this page whole** and the other actions are buttons. **Set the reading order** and **Show this page whole** can't be used when a page has no boxes.

### Pages from before panels

A chapter you uploaded before panels existed says "12 pages have no panels yet. Find them, then check them before you publish." Until then, those pages read whole. Choose **Find panels**; the chapter shows "Finding panels: 4 of 12 done." as it works. Then check them as above, and publish.

### See it as fans will

Choose **Preview**, then **Phone**, and choose **Panel by panel** in the preview's reader bar. The preview opens at the page you have open. **Next** steps through the panels and on to the next page of the chapter; it stops at the chapter's last panel, because the preview doesn't go to other chapters.

### If panels go wrong

| What you see | What to do |
|---|---|
| "No panels found: this page shows whole." | Nothing, if the page is a splash. Otherwise, draw its panels. |
| "Couldn't look for panels" on a tile, or "Couldn't look for panels on this page." | Draw the panels, or leave the page whole. Publishing isn't affected. |
| "That box was too small to be a panel." | Draw it bigger. |
| "Panels found after publishing. Publish again to use them." | Check them, then publish the chapter again. |

## Publish

1. To see a page as readers will, choose **Preview**, at the top of the chapter. [See it before you publish](previewing.md) explains it. (It arrives with a later update to the editor; until then, the button isn't there.)
2. Choose **Publish**.
3. If any pages still need alt text, or published links will change (below), the editor tells you first; choose **Publish anyway** to carry on, or **Cancel** to go back and fix it.
4. The status at the top right shows **Updating the site…**, then **Live** with the time (see [When your change is live](going-live.md)).
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

The comic, its chapters and their pages come off the site with the next update, and links people have shared to them stop working. This can't be undone. The status at the top right then reads "Removed from the site" with the time; see [When your change is live](going-live.md).

To remove just one chapter, open it and choose **Delete** from the same menu.

## If something goes wrong

| What you see | What it means | What to do |
|---|---|---|
| "Didn't upload" on a page, with **Try again** | The upload was interrupted, for example by a dropped connection. | Choose **Try again**. The other pages are fine. |
| "This isn't an image file", with **Remove** | A file that isn't a picture was dropped in. | Choose **Remove**, then upload the right file. |
| "Chapter 2 already exists in this series. Choose another number.", and **Publish** greyed out with "Fix the problem above to publish." | Two chapters have the same **Chapter** number. | Change one of them. |
| "Add a web address so readers can find this comic.", and **Publish** greyed out | The comic's **Web address** is empty. | Fill it in; it can be the title, in lower case with dashes. |
| "This isn't an image file" on a PSD or PDF | Those aren't page images. | Save the page as PNG, then upload it. |
| **Didn't go live** at the top right | After 15 minutes, the site still didn't update. Something went wrong on the site's side, not yours. | Nothing: your change is saved, and the person who looks after the site is told automatically and will fix it. Publishing more is fine; wait until it says **Live** before telling people it's up. |
