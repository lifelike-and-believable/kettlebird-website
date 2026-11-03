---
id: tutorial-previewing
status: draft
runner: manual
derived-from:
  - docs-previewing#open-the-preview: 73fde7ecea04
  - docs-previewing#what-the-preview-shows: b93065f22acc
  - docs-previewing#computer-and-phone: dca9dc4e088c
  - docs-previewing#after-you-publish: 39110c97c97a
  - docs-previewing#if-the-preview-cant-show-something: dc90fdc49e7e
---

# Tutorial: preview a change before publishing it

<!-- docs/tutorials/previewing.md. runner: manual: a person follows it on the deployed site, because
it needs a signed-in editor and the draft-reading token, which CI doesn't have. Before you start:
this change is deployed, and the lead has added SANITY_PREVIEW_TOKEN in Vercel
(docs/specs/content-editing-preview.md, What the lead sets up). Use the live address,
https://newsite.kettlebird.com until the move to kettlebird.com. Put things back as they were at the
end (step 9). -->

You'll preview a Site settings change and an art piece, at computer and phone width, see what's outlined and listed, and publish one of them.

## Steps

1. Open `/studio` and sign in. Choose **Site settings**, then **Commissions**. At the top of the item, above the fields, there's **Preview**. Beside **Publish** there's no Preview.
2. Choose **Preview**. A second pane opens beside the form, and the menu and list narrow. Above the page: "Preview of the Commissions page · Updated just now", **Computer** and **Phone**, and "Preview: not on the site yet. This item's unpublished changes are shown, outlined; everything else is as published." The button at the top of the item now reads **Hide preview**.
3. Choose **Closed** and write "Back in March." in **Note when closed**. Wait a second or two: the page dims, then shows the orange banner with a dashed outline, and a yellow line reads "Removed from the page: How it works, Ready to order? and the commission email buttons". Open the public Commissions page in another tab: it's still open.
4. Choose **Phone**: the page is shown at a phone's width. Choose **Computer** again. Point at a link in the preview: it says "Links don't work in the preview", and choosing it does nothing.
5. Choose **Hide preview**. The preview closes and the menu and list widen. Choose **Preview** again: it opens at the width you chose last.
6. Put **Commissions are…** back to **Open**, clear the note, and wait: the outline and the yellow line go.
7. Open **Art** and any piece, and choose **Preview**. The portfolio is shown, scrolled to the piece's first section with the carousel at the piece, and the piece outlined if you've changed anything. Change its alt text: the yellow line says "Not visible on the page: alt text". If it's in more than one section, the yellow line names the others ("Also in: …"). Choose **Show it opened**: the piece opens as fans see it.
8. Choose **Publish** with the preview open. The top line turns green: "Published. The site matches this preview once the status at the top right says Live." When the status says **Live**, the outlines go.
9. Put back anything you changed and publish it, so the site is as it was.

## What you found

**Preview** opens the site's own page beside the form, with only this item's unpublished changes, outlined; changes the page can't show are listed; it works at computer and phone width; and nothing reaches the public site until **Publish**.
