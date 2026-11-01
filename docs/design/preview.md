---
id: design-preview
status: draft
derived-from:
  - story-content-editing-preview: be2784e6f165
  - design-cms#decision: 889c200357ba
  - design-organised-editor: c014dfe64fbc
  - persona-artist#frustrations: ef88538c418e
---

# Preview before publishing: design

<!-- docs/design/preview.md. Design for story-content-editing-preview. Mock-ups are in
docs/design/mockups/preview/ (PNG images, and mockups.html, the source they are rendered from with
render.mjs). design-comic-publish-pages named a Preview button for chapters, tied to this story;
this design places it. -->

## Personas

- persona-artist: "publishing work that then looks wrong (cropping, missing alt text) with no preview" is one of Star's listed frustrations, and Star often uploads straight after finishing a piece. So the preview sits beside the form, shows the real site page with the change in place, follows every keystroke, and works at phone width, where most fans read.

## How it works

- **The preview is the site's own page**, built by the site from Star's unpublished changes, the same way it builds the real page. A crop, a line break, or a long title looks exactly as it will once published. It isn't a sketch of the page.
- **It's shown only inside the editor**, to someone signed in. The preview pages aren't part of the public site: visitors can't open them, search engines don't list them, and the public pages never show unpublished changes.
- Everything else on the site stays as it is: built once per update. Only the preview pages are made on demand.

## Flow

1. While editing an item, Star chooses **Preview**, at the bottom of the item beside **Publish**.
2. The editor splits: the form on the left, the site page on the right, headed with which page it is ("Preview of the Portfolio, with this piece opened") and with **Computer** and **Phone** buttons (mock-ups 1 and 2).
3. The page is marked across its top: "Preview: not on the site yet. Unpublished changes are shown, outlined." The parts Star has changed are outlined in dashes.
4. As Star types, changes a picture, or moves a crop, the preview updates within a second or two, without publishing.
5. **Phone** narrows the page to a phone's width (mock-up 2); **Computer** widens it again. Star's choice is remembered for next time.
6. **Hide preview** closes it; **Publish** works as always, with the preview open or not.

## Which page the preview shows

| Item | Page | Mock-up |
|---|---|---|
| Art piece | The portfolio, scrolled to the piece's section, with the piece opened, so both the square thumbnail's crop and the whole picture show | 1, 2 |
| Chapter | The reader, at the page Star has open in the chapter's **Pages** (page 1 if none) | 3 |
| Series | The series page | 4 |
| Site settings: Commissions | The Commissions page | 5 |
| Site settings: About page | The about page | |
| Site settings: Home page | The home page | |
| Site settings: Contact and social links | The home page, whose social row, footer and contact all show the change | |
| Story, product, commission type | The Writing page, the shop, or the Commissions page | |

## Mock-ups

Low-fidelity. The left side is the editor (Sanity Studio); the right side stands in for the site's real page. Source: `mockups/preview/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | An art piece, with the preview at computer width | `mockups/preview/1-art-computer.png` |
| 2 | The same piece at phone width | `mockups/preview/2-art-phone.png` |
| 3 | A chapter: the reader at the page Star has open | `mockups/preview/3-chapter-page.png` |
| 4 | A series | `mockups/preview/4-series.png` |
| 5 | Site settings, Commissions: closing them | `mockups/preview/5-site-settings.png` |
| 6 | When the preview can't be shown | `mockups/preview/6-cant-preview.png` |

## States and errors

- **Something the page needs is missing** (mock-up 6), such as a series with no **Web address**, or a chapter with no series: "Add a **Web address** to preview this series. The preview needs to know where the page will be." The message names the field.
- **A new item not yet published:** the preview shows it on its page as if published, outlined, among the published items.
- **A chapter with no pages yet:** "Add a page to preview this chapter." Visitors never see a chapter without pages (design-comic-start-reading).
- **Can't load** (no connection, or the site doesn't answer): "Can't show the preview right now." with **Try again**, and "Your changes are saved. You can still publish."
- **Still loading:** the last preview stays in place, dimmed, until the new one arrives, so the page doesn't flash.
- **A picture still uploading:** the preview shows the picture once the upload finishes.

## Accessibility

- **Preview**, **Hide preview**, **Computer** and **Phone** are buttons, reachable by keyboard; **Computer** and **Phone** say which is chosen.
- The preview's top line says it's a preview in words; the outlines are an extra cue, not the only one.
- Screen readers hear the preview page as a separate region, named by its heading ("Preview of the Commissions page").
- The preview never updates while a screen reader is reading it mid-sentence; updates are announced politely ("Preview updated").

## For the spec to check

- Sanity's Presentation tool, or a document view, can show the site's page beside the form and update it as Star types, on the free plan.
- The site can serve a preview page on demand from unpublished changes, only to someone signed in to the editor. That means server rendering for the preview pages alone, on Vercel, with every other page staying a static build.
- Preview pages send "don't list" and "don't cache" headers, and the site's framing rule allows the editor (design-sign-in already changes it to "only this site").
- Changed parts can be outlined.
- The preview can open the portfolio with a piece opened, and the reader at a given page.
- **Phone** width is 375 pixels; **Computer** fills the space.
