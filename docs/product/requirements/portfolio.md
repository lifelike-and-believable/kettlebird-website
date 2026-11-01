---
id: requirements-portfolio
status: draft
derived-from:
  - concept:
---

# Portfolio requirements

<!-- Drafted by bootstrap from src/pages/portfolio.astro and src/components/GalleryGrid.tsx. -->

## REQ-portfolio-1: Gallery from the CMS

The portfolio shows every published gallery item from the CMS with its image and title, newest first, grouped into one section per category. An item in several categories appears in each of their sections.

## REQ-portfolio-2: Category filter

A filter bar lists each category that has at least one item, plus an option for all. Choosing a category shows only that category's section.

## REQ-portfolio-3: Scrolling a section

Each category section scrolls horizontally, with "Scroll left" and "Scroll right" buttons as well as touch or trackpad scrolling.

## REQ-portfolio-4: Viewing one piece

Activating a piece opens a dialog with the larger image, title, description, and tags, and a Close button that returns to the gallery.

## Constraints

- Current implementation: a React island (GalleryGrid.tsx) with images from the Sanity image CDN.

## Open questions

1. When the CMS has no gallery items, the page shows 18 hardcoded placeholder items, some titled after other studios' shows. Should production show an empty state instead?
2. The dialog does not close on Escape, keep focus inside while open, or return focus to the piece afterward. Treat these as bugs against REQ-portfolio-4 (tier:fix), or as new requirements?
3. The `featured` flag in the schema is not used. Should featured work appear on the home page?
4. Should visitors be able to filter by tag as well as category?
