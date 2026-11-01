---
id: design-preview
status: draft
derived-from:
  - story-content-editing-preview: be2784e6f165
  - design-cms#decision: 889c200357ba
  - design-organised-editor: c014dfe64fbc
  - design-comic-publish-pages: 37139d9491dd
  - design-site-settings: 156335124dd1
  - design-know-when-live: b7f62b452b90
  - design-sign-in: 8a54c1540982
  - persona-fan#goals: 2b047e4cae5d
  - persona-artist#frustrations: ef88538c418e
---

# Preview before publishing: design

<!-- docs/design/preview.md. Design for story-content-editing-preview. Mock-ups are in
docs/design/mockups/preview/ (PNG images, and mockups.html, the source they are rendered from with
render.mjs). design-comic-publish-pages named a Preview button for chapters, tied to this story;
this design places it. -->

## Personas

- persona-artist: "publishing work that then looks wrong (cropping…) with no preview" is one of Star's listed frustrations, and Star often uploads straight after finishing a piece. So the preview sits beside the form, shows the real site page with the change in place, follows every edit, and works at phone width, where most fans read. Changes a page can't show, like alt text, are listed instead, so Star isn't left thinking the preview checked them.
- persona-fan: fans never see unpublished work. Preview pages are separate from the public site, and the public site never reads drafts.

## How it works

- **The preview is the site's own page**, built by the site with the same components it uses for the real page. A crop, a line break, or a long title looks exactly as it will once published.
- **It shows this item's unpublished changes only.** Everything else on the page is as published, so the preview shows exactly what **Publish** on this item will produce. Another half-finished draft, such as a bio Star is still writing, doesn't appear.
- **Preview pages are separate from the public site**, at their own addresses under `/preview/`, made on demand. The editor opens them with a short-lived key that only the editor holds. Without it, a preview address shows **Page not found**. Preview pages are never cached, and search engines are told not to list them.
- **The public site never reads drafts.** It's built from published content only, without the key that reads drafts. That key is held only by the preview pages on the live site; pull request previews and builds don't have it. A check on every build confirms that no unpublished content reached the built site, like the sign-in design's "no link to /studio" check.
- The public pages, including **View on site**, never change mode: they always show what visitors see.

## Flow

1. While editing an item, Star chooses **Preview**, beside **Publish** at the bottom of the item (mock-up 8).
2. The editor makes room. The menu and list fold away, the form stays on the left, and the site page appears on the right (mock-ups 1 to 6). Above the page:
   - which page it is, and when the preview last caught up ("Updated just now");
   - **Computer** and **Phone**, and for an art piece, **Show it opened**;
   - a fixed line that doesn't scroll away: "Preview: not on the site yet. This item's unpublished changes are shown, outlined; everything else is as published."
3. The parts Star has changed are outlined in dashes. Anything Star changed that the page can't show, or removed, is listed in a yellow line under it. Examples: "Not visible on the page: alt text"; "Removed: Instagram link"; "Removed from the page: How it works".
4. As Star types, changes a picture, or moves a crop, the preview catches up. Usually that takes a second or two after Star pauses, and "Updated just now" refreshes when it does.
5. **Computer** shows the page at a laptop's width (1280 pixels), scaled to fit the space, so the layout is the computer one even in a narrow window. **Phone** shows it at a phone's width (375 pixels), full size. Star's choice is remembered.
6. Links in the preview don't go anywhere. Pointing at one says "Links don't work in the preview". To preview another page of a chapter, Star opens it in the chapter.
7. After **Publish**, the fixed line turns green: "Published. The site matches this preview once the status at the top right says Live." (mock-up 7). Once the status says **Live**, the outlines and lists go, because there's nothing unpublished left.
8. **Hide preview** closes it, and the menu and list come back.

## Which page the preview shows, and where it scrolls

| Item | Page, and where it scrolls | Mock-up |
|---|---|---|
| Art piece | The portfolio, scrolled to the piece's first portfolio section, with that section's carousel moved to the piece. The yellow line names any other sections it's also in. **Show it opened** opens the piece as fans see it when they choose it, over the page. This needs a small addition to the portfolio: a way to open a given piece and move to it, used only by the preview. | 1, 2 |
| Chapter | The reader, at the page open in the chapter's page panel. With no page open, page 1. If Star moves the open page, the preview follows it to its new number. | 3 |
| Series | The series page, from the top. | 4 |
| Site settings: Commissions | The Commissions page, from the top. | 5 |
| Site settings: About page | The about page, scrolled to the changed part. | |
| Site settings: Home page | The home page, scrolled to the artist text. | |
| Site settings: Contact and social links | The home page, scrolled to the social links and footer. | 6 |
| Story, product, commission type | The Writing page, the shop, or the Commissions page, scrolled to the item. | |

The rows without a mock-up use the same layout as mock-up 5 or 6, with their own page.

## Mock-ups

Low-fidelity. The left side is the editor (Sanity Studio), with the forms from design-organised-editor and design-comic-publish-pages; the right side stands in for the site's real page, simplified. Source: `mockups/preview/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | An art piece at computer width, scrolled to the piece | `mockups/preview/1-art-computer.png` |
| 2 | **Show it opened**, at phone width | `mockups/preview/2-art-opened-phone.png` |
| 3 | A chapter, following the page open in the page panel | `mockups/preview/3-chapter-page.png` |
| 4 | A series | `mockups/preview/4-series.png` |
| 5 | Site settings, Commissions: closing them, with what's removed listed | `mockups/preview/5-commissions.png` |
| 6 | Site settings, Contact and social links: scrolled to the change | `mockups/preview/6-contact-and-links.png` |
| 7 | After **Publish** | `mockups/preview/7-after-publish.png` |
| 8 | Before the preview is open: **Preview** beside **Publish** | `mockups/preview/8-before-preview.png` |
| 9 | When the preview can't show the page | `mockups/preview/9-cant-preview.png` |

## States and errors

Mock-up 9 shows the first three:
- **No portfolio section:** "Choose a portfolio section to see where this piece goes."
- **No web address on a series** (or the chapter's series has none): "Add a web address so readers can find this series. The preview needs it too."
- **Can't load** (no connection, or the site doesn't answer): "Can't show the preview right now." with **Try again**, and "Your changes are saved. You can still publish."

Also:
- **No picture on an art piece yet:** "Add the picture to preview it."
- **A chapter with no pages yet:** "Add a page to preview this chapter." Visitors never see a chapter without pages (design-comic-start-reading).
- **A chapter with the same number as another:** the preview shows it, with "Chapter 2 already exists in this series; publishing is blocked until you change one" in the yellow line.
- **New, never-published items** (a series, a chapter in an unpublished series): shown in place as if published, outlined.
- **Still catching up:** the last preview stays in place, dimmed, until the new one arrives, so the page doesn't flash.
- **A picture still uploading:** the preview shows it once the upload finishes.

## Accessibility

- **Preview**, **Hide preview**, **Computer**, **Phone** and **Show it opened** are buttons, reachable by keyboard; the chosen width is marked as chosen.
- The fixed line says it's a preview in words; the outlines are an extra cue, and changes the page can't show are listed in words.
- Screen readers hear the preview as a separate region, named "Preview of the Commissions page". "Preview updated" is announced only when Star pauses, never on every keystroke.
- The preview never takes keyboard focus from the form when it updates.

## For the spec to check

- Sanity's Presentation tool, or a document view, can show the preview page beside the form, fold the menu and list away, and update after edits, on the free plan. Check the API request limits at that rate.
- **Preview** can sit beside **Publish** as its own button, not inside a menu. design-comic-publish-pages still puts **Preview** and **Publish** in the top bar; that's corrected with Star's guide to know-when-live.
- Astro serves the `/preview/` pages on demand on Vercel (an adapter, with only those pages on demand), reusing the real pages' components, with the reader and series pages refactored so their data can come from a draft.
- Only this item's draft is used, with everything else published.
- The access check: a short-lived key from the editor (Sanity's preview secret), the read token kept on the server and set for production only, and **Page not found** without it. Preview pages send no-cache and no-index headers. The framing rule allows the editor (design-sign-in's "only this site").
- The public client reads published content only (perspective "published"), and a build check finds no draft documents.
- Changed fields can be outlined, and removals and non-visible changes listed.
- The portfolio can open a given piece and move its carousel to it; the reader's and portfolio's scripts don't scroll the editor or take focus.
- **Computer** at 1280 pixels scaled to fit; **Phone** at 375 pixels.

## Persona walkthrough

A walkthrough for persona-artist and persona-fan (2026-11-01) opened each mock-up and checked the real pages behind them. Everything it found is addressed above.

It flagged two things as blocking:
- The portfolio can't open a given piece today. The design now names that addition and its limits.
- Four states and screens had no mock-up. There are now nine mock-ups, and a note on the rows that share a layout.

Things that would have misled Star:
- The art mock-up didn't match the real portfolio. It now shows the carousel, and **Show it opened** shows the real overlay.
- Which section and carousel position the preview shows: now the first section, with the other sections named.
- Whether other drafts appear: they don't; the preview shows only this item.
- Changes the page can't show, like alt text, the contact email and removals: now listed.
- What **Computer** means in a narrow window: now a fixed laptop width.
- The mark scrolling away, and nothing changing after **Publish**: the mark is now fixed, and it turns green after publishing.
- Links leading out of the preview: they're now inactive.
- **View on site** showing drafts: the public pages never change mode.

For fans, it found that keeping drafts off the public site had no stated means and no check. Both are now in "How it works".

Smaller points:
- the forms now match the approved designs;
- where **Preview** sits;
- where each page scrolls;
- the chapter's edge cases;
- the catch-up indicator and announcements;
- one wording for the missing web address.
