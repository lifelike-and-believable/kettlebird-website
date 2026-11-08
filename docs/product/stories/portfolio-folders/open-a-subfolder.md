---
id: story-portfolio-folders-open-a-subfolder
status: approved
derived-from:
  - epic-portfolio-folders#outcome: 0a70fc8bd1ef
  - persona-fan#goals: 2b047e4cae5d
  - persona-commission-client#goals: 94a5f248cb6c
---

# Open a subfolder

<!-- docs/product/stories/portfolio-folders/open-a-subfolder.md. Story 2 of epic-portfolio-folders. -->

As a fan, I want to open a subfolder, such as one fandom in Fan Work, and see only its pieces, then go back to the whole folder, so that I can follow what I came for.

## Acceptance criteria

- In a folder's row, each subfolder shows as one thumbnail: a grid of its pieces, at the grid size Star chose for it (such as 2 × 2 or 3 × 3), with the subfolder's name under it. The folder's pieces that aren't in a subfolder show beside the subfolders, as pieces.
- A subfolder has its own address: sharing or bookmarking it opens the Portfolio with that subfolder open in its folder, and the browser's Back button leaves it, back to the folder's top level.
- Choosing a subfolder's thumbnail shows that subfolder's pieces in the folder's row, in place of the folder's top level, and the folder's tab reads the subfolder's name (for example "Murderbot").
- While a subfolder is open, a pink **INDEX** tab shows beside the folder's tab; choosing it goes back to the folder's top level. At the top level there is no **INDEX** tab.
- Opening a subfolder changes only that folder; the other folders stay as they are.
- Choosing a piece in an open subfolder opens it as any piece; full screen moves through that subfolder's pieces.
- A screen reader hears that the folder now shows the subfolder ("Fan Work: Murderbot, 6 pieces"), and focus moves to the subfolder's first piece; after **INDEX**, focus returns to the subfolder's thumbnail.
- Subfolder thumbnails, the **INDEX** tab and the pieces can all be reached and chosen with a keyboard.
