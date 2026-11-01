---
id: story-content-editing-clear-placeholders
status: approved
derived-from:
  - epic-content-editing#outcome: ce75baca7267
  - requirements-site#REQ-site-5: 08cd1be0172a
  - persona-artist#goals: f3044c738f84
  - persona-artist#frustrations: ef88538c418e
  - persona-fan#frustrations: 078d5295ca3a
---

# Clear the placeholders

<!-- docs/product/stories/content-editing/clear-placeholders.md. Story 1 of epic-content-editing; done before Star is invited. -->

As Star, I want the site to show only my own work, with honest empty states where I haven't added anything yet, so that nothing I publish appears beside stock art or other studios' titles.

## Acceptance criteria

- The portfolio shows no built-in sample items; with no work added it shows its empty state ("No artwork yet — check back soon!").
- No page shows another studio's or show's title, stock artwork, or "Lorem ipsum".
- The home page's "About the artist" block shows no placeholder portrait or text: until Star fills it in (Site settings story), the block is left out.
- The about page shows no "[Portrait coming soon]", "Bio coming soon", or "Artist statement coming soon" text: sections Star hasn't filled in are left out.
- The placeholder logo image is replaced by the site's real logo, or by the "Kettlebird" title alone if there is none.
- Every page still builds and shows its empty state when the CMS has no content (REQ-site-5).
