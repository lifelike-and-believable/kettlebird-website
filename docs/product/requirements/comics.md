---
id: requirements-comics
status: approved
derived-from:
  - concept: 71f8899f4b90
---

# Comics requirements

<!-- Drafted by bootstrap from src/pages/comics.astro and src/pages/comics/[slug].astro. -->

## REQ-comics-1: Series list

The comics page lists every comic series with its cover, title, description, type (original or fan comic), status (ongoing, complete, or hiatus), and page count. With no series it shows "Comics in progress — pages coming soon!"

## REQ-comics-2: Reading a comic

Choosing a series opens a reader on the site that shows its pages in order, starting at the first page. The reader works on phone and desktop, can be operated by keyboard and touch, and gives each page its alt text.

## REQ-comics-3: Chapters

A series can be divided into chapters. A reader can see a series' chapters, start reading at any chapter, and tell which chapter a page belongs to. (Unmet today: the CMS has series and pages only.)

## Constraints

- Pages and panel regions are already modelled in the current CMS (Sanity `comicPage` with `panels[]`). That model can change if a reader design needs something else.
- Real comic content exists but is not in the CMS yet; Star will provide sample pages to build against (2026-11-01).

## Open questions

1. Today each series card links to `/comics/<slug>`, which builds no pages, so REQ-comics-2 is unmet and every link is broken. The comic reader epic fixes this.
2. Build the reader in-house, or use an existing webcomic reader? Nothing planned earlier (react-pageflip, panzoom) was installed, so there is no sunk cost.
