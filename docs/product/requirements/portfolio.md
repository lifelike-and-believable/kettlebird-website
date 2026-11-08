---
id: requirements-portfolio
status: approved
derived-from:
  - concept: 71f8899f4b90
---

# Portfolio requirements

<!-- Drafted by bootstrap from src/pages/portfolio.astro and src/components/GalleryGrid.tsx. -->

## REQ-portfolio-1: Gallery from the CMS

The portfolio shows every published gallery item from the CMS with its image and title, newest first (undated last), grouped into one folder per category. An item in several categories appears in each of their folders. Star can gather a folder's items into subfolders: a folder shows its subfolders, each as one grid thumbnail, among its items not in a subfolder; a subfolder opens in its folder, with its own address, and **INDEX** goes back (epic-portfolio-folders).

## REQ-portfolio-2: Category filter

Retired (epic-portfolio-folders, 2026-11-08): the folders are the page, one scroll apart, and **INDEX** goes back up from a subfolder. There is no filter bar.

## REQ-portfolio-3: Scrolling a section

Each folder's row scrolls horizontally, its pieces whole at the row's height, with "Scroll left" and "Scroll right" buttons (the site's arrows, which can't be used at the row's ends) as well as touch, trackpad or keyboard scrolling.

## REQ-portfolio-4: Viewing one piece

Activating a piece opens a dialog with the larger image, title, description, and tags, and a Close button that returns to the gallery.

## Constraints

- Current implementation: a React island (GalleryGrid.tsx) with images from the Sanity image CDN.

## Open questions

1. When the CMS has no gallery items, the page shows 18 hardcoded placeholder items, some titled after other studios' shows. Should production show an empty state instead?
2. The dialog does not close on Escape, keep focus inside while open, or return focus to the piece afterward. Treat these as bugs against REQ-portfolio-4 (tier:fix), or as new requirements?
3. The `featured` flag in the schema is not used. Should featured work appear on the home page?
4. Should visitors be able to filter by tag as well as category?
