---
id: requirements-comics
status: draft
derived-from:
  - concept:
---

# Comics requirements

<!-- Drafted by bootstrap from src/pages/comics.astro and src/pages/comics/[slug].astro. -->

## REQ-comics-1: Series list

The comics page lists every comic series in the CMS with its cover, title, description, type (original or fan comic), status (ongoing, complete, or hiatus), and page count. With no series it shows "Comics in progress — pages coming soon!"

## Constraints

- Pages and panel regions are already modelled in the current CMS (Sanity `comicPage` with `panels[]`). That model can change if a reader design needs something else.

## Open questions

1. **The reader does not exist.** Each series card links to `/comics/<slug>`, but that route builds no pages, so every link is broken. What should reading a comic be like: one page at a time, panel by panel (as `comicPage.panels` allows), or a vertical scroll?
2. Until a reader exists, should series cards stop linking anywhere, or link to an external host?
3. Should readers be able to bookmark or resume where they left off?
4. Build the reader in-house, or use an existing webcomic reader or host? Nothing planned earlier (react-pageflip, panzoom) was installed, so there is no sunk cost.
