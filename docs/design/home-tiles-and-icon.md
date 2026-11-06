---
id: design-home-tiles-and-icon
status: draft
derived-from:
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
---

# Home tiles and the site's icon: design

<!-- docs/design/home-tiles-and-icon.md. A design amendment asked for by the lead (2026-11-06) after reviewing
the Kettlebird design system and its visual reference: the home page's tile labels without a shaded box, the
logo tile in the logo's own orange with the mark inside the border, and the logo as the site's icon in the
browser and on phones' home screens. Mock-ups are in docs/design/mockups/home-tiles-and-icon/ (PNG images, and
mockups.html, the source they are rendered from with render.mjs, built from the home page's own styles with
its fonts, colours and images). The proposed logo files are beside them, made from
public/assets/images/kblogo.png by make-logo.py; the today-*.png images are screenshots of the site. -->

## Personas

- persona-fan: fans arrive on a phone from a link (#skills-and-tools), decide quickly whether to stay (#context-of-use), and come back to read the next page or see new art (#goals). The home page's first screen is the logo and the tiles; a fan who keeps the site open in a tab, bookmarks it or adds it to a phone's home screen finds it again by its icon. Today the tab shows the browser's blank globe, and a phone's home screen shows a shrunken screenshot of the page.
- persona-artist: the site should look like Star's own work (#goals). The logo is drawn on its own orange; today it sits as an orange square on a yellow tile, filling the tile edge to edge.

## The problem

- **Shaded labels.** Each tile's label sits on a 20% black box (`.tile-content`), which greys the photo and the flat colours behind it.
- **The logo tile.** The tile is `color-yellow` (#f4ce6a). The logo picture, the mark on its own #ffbb58 square, is stretched to cover the whole tile, so the tile is really the picture's orange, the bird nearly touches the tile's edges, and the yellow never shows.
- **No icon.** The site sets no icon. Browsers show a blank globe in the tab, the address bar and bookmarks; iPhones use a screenshot of the page on the home screen (mock-up 4).

## The change

**Home tiles** (mock-ups 1 and 2):

- **No shaded box behind the labels.** The white capitals and their soft dark shadow sit straight on the photo or colour. Nothing else about the labels changes: font, size, case, shadow and place.
- **The logo tile in the logo's own orange,** `color-logo` (#ffbb58), with the mark lifted off its square (`kettlebird-mark.png`, transparent) so it sits directly on the tile.
- **The mark inside the border,** held 12% of the tile's width in from each side and scaled to fit, so the bird and the letters never touch the outline. On a phone the tile stays first and square.
- Unchanged: the grid, the tiles' sizes and order, their photos and colours, the hover, and the links.

**The site's icon** (mock-ups 4 and 5):

- **Every page** names the icon in its `<head>`, from the same files, so the tab, address bar, bookmarks, history and home screens show the bird.
- **Drawn from the logo, never redrawn.** Every size is the mark on a `color-logo` square:
  - 512 × 512 and 192 × 192 (Android home screens, through a small web manifest);
  - 180 × 180 (iPhone and iPad home screens);
  - 48, 32 and 16 (browsers), also in `favicon.ico` for the browsers and readers that look for that file.
- **The full mark from 64 px up, the bird alone at 48 and under.** At small sizes K and B shrink to a pixel or two and blur the bird; the bird's shape and eye still read at 16 px (mock-up 5).
- **The mark fills 84% of the large icons and 94% of the small ones,** so it reads as large as it can without touching the edge. Phones round the corners of home-screen icons themselves; the files stay square.
- **Link previews** keep today's picture, the logo on its orange square (`kblogo.png`): it already follows the rule.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | Home page tiles | No 20% black box behind the labels (`src/components/pages/HomePage.astro`, `.tile-content`). |
| 2 | Home page logo tile | `color-logo` ground, the transparent mark held 12% inside the border, scaled to fit (`.grid-tile-logo`, `.tile-image`). |
| 3 | Every page's head | Icon links and a web manifest (`src/layouts/BaseLayout.astro`). |
| 4 | Site files | The mark and icons in `public/`, made by `make-logo.py` from `kblogo.png`. |

Not changed: the header (the name in type), link previews, the Studio, and the logo's drawing and colours.

## Mock-ups

Built from the home page's own styles, with its fonts, colours and pictures. Source: `mockups/home-tiles-and-icon/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | After, on a laptop (1280 × 900): labels without the box; the logo tile in the logo's orange, the mark inside the border. Today: `today-laptop.png` | `mockups/home-tiles-and-icon/1-laptop.png` |
| 2 | After, on a phone (390 × 844). Today: `today-phone.png` | `mockups/home-tiles-and-icon/2-phone.png` |
| 3 | The flat tiles' labels, white and ink, for the question at review | `mockups/home-tiles-and-icon/3-flat-tile-labels.png` |
| 4 | Today and after: a browser's tab and address bar, and a phone's home screen | `mockups/home-tiles-and-icon/4-browser-and-home-screen.png` |
| 5 | The icon at each size, and the pixels of the 16 and 32 | `mockups/home-tiles-and-icon/5-icon-sizes.png` |

## Accessibility

- The logo tile keeps its text alternative, "Kettlebird Logo". The icons are decoration for the browser and have none.
- The mark's purple on `color-logo` is 5.4:1.
- **Labels without the box:** on photos, the soft dark shadow carries the white capitals, as it already does; the box only darkened them by a fifth.
- **The flat tiles fail contrast.** White on Shop (`color-orange`) is 2.3:1, on About (`color-green`) 1.6:1, and on News (`color-yellow`) 1.5:1, where large text needs 3:1. With the box they are 3.5, 2.6 and 2.4:1, so Shop passes today and the other two don't; without it all three fail. Mock-up 3 shows ink labels (6.2, 8.7 and 9.4:1) as the fix; see Decisions at review.
- Nothing moves that didn't before; the tiles' hover is unchanged.

## Other documents

- **The design system** (Kettlebird, on claude.ai) already shows this as decided: its Logo component, `color-logo` and `color-logo-purple` tokens and Home tile guidelines. When this is built, its Changes entry moves from "decided" to the pull request that built it.
- **The visual reference** shows the logo sizes and the tiles as here.
- **`docs/STYLE_GUIDE.md`**, Branding and iconography: its favicon line ("Simplified KB or bird icon from logo") is settled by this design: the bird alone at 48 and under, the full mark above.

## For the spec to check

- On the home page, no tile label has a background of its own (no colour, no image behind the text box), and the labels keep their font, size, colour and text shadow.
- The logo tile's background is #ffbb58; its picture is the transparent mark, at least 12% of the tile's width from each edge of its border box, at a laptop's 1280 × 800 and a phone's 390 × 844, and the picture keeps its text alternative.
- Every page's `<head>` names `/favicon.ico`, PNG icons at 16, 32 and 48, an apple-touch-icon at 180 and a web manifest with 192 and 512; each file is served, square, the stated size, with #ffbb58 at its corners.
- The 48 px and smaller icons hold no K or B; the larger ones do.
- Link previews still use `kblogo.png`.
- Everything else on the home page looks and behaves as before.

## Decisions at review

Questions for the lead:
1. **Labels on the flat tiles:** keep white (as asked: the box goes, and Shop's label falls below 3:1 too), or set the three flat tiles' labels in ink (mock-up 3; proposed)?
2. **The icon's small size:** the bird alone at 48 and under (proposed), or the full mark at every size?

## Persona walkthrough

To be run before review.
