---
id: requirements-comics
status: approved
derived-from:
  - concept: 1ee760877f50
---

# Comics requirements

<!-- Drafted by bootstrap from src/pages/comics.astro and src/pages/comics/[slug].astro. -->

## REQ-comics-1: Series list

The comics page lists every comic series with its cover, title, description, type (original or fan comic), status (ongoing, complete, or hiatus), and page count. With no series it shows "Comics in progress — pages coming soon!"

## REQ-comics-2: Reading a comic

Choosing a series opens a reader on the site that shows its pages in order, starting at the first page. The reader works on phone and desktop, can be operated by keyboard and touch, and gives each page its alt text.

## Constraints

- Pages and panel regions are already modelled in the current CMS (Sanity `comicPage` with `panels[]`). That model can change if a reader design needs something else.

## Open questions

1. Today each series card links to `/comics/<slug>`, which builds no pages, so REQ-comics-2 is unmet and every link is broken. The comic reader epic fixes this.
2. One page at a time, panel by panel (as `comicPage.panels` allows), or a vertical scroll? A design question for the epic.
3. Should readers be able to bookmark or resume where they left off?
4. Build the reader in-house, or use an existing webcomic reader? Nothing planned earlier (react-pageflip, panzoom) was installed, so there is no sunk cost.
