---
id: design-home-tiles-and-icon
status: approved
derived-from:
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
  - requirements-site#REQ-site-4: 5970ab67a115
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
- persona-artist: the site should look like Star's own work (#goals). The logo is drawn on its own orange, and the site should show it that way: on that orange, whole, never cropped by the tile.

## The problem

- **Shaded labels.** Each tile's label sits on a 20% black box (`.tile-content`) that fills the tile and dims the photo or colour behind it.
- **The logo tile.** The tile is set to `color-yellow` (#f4ce6a), but the logo picture (the mark on its own #ffbb58 square) is laid over it to cover the whole tile, so what shows is the picture's orange square in a yellow-set tile, and the picture, not the tile, decides how the logo sits. The picture's square is also what sets the height of the grid's top four rows on a laptop.
- **No icon.** The site sets no icon and `public/` has none. Browsers show a blank globe in the tab, the address bar and bookmarks; iPhones use a screenshot of the page on the home screen, and Android a letter on a plain circle (mock-up 4).

## The change

**Home tiles** (mock-ups 1 and 2):

- **No shaded box behind the labels.** The labels sit straight on the photo or colour. Their font, size, case and place don't change. They stay white with their soft dark shadow, which carries the contrast for now (the lead, 2026-11-06). Without the box, white falls short on the light photos and the flat colours (Accessibility); the lead will look at the alternatives in mock-up 3 with Star, and any change to the labels' colour is a later amendment.
- **The logo tile in the logo's own orange,** `color-logo` (#ffbb58), with the mark lifted off its square (`kettlebird-mark.png`, transparent) so it sits directly on the tile. The mark is about the size it is today.
- **The mark inside the border,** set 12% of the tile's width in from each side and scaled to fit, so the bird and the letters never touch the outline.
- **The tile stays square** (`aspect-ratio: 1`), as the picture made it, so the grid's rows keep their heights at every width; on a phone it stays first.
- **The tiles' hover lift stops under reduced motion,** a small fix found on the way (REQ-site-4).
- Unchanged: the grid, the tiles' sizes and order, their photos and colours, the hover otherwise, and the links.

**The site's icon** (mock-ups 4 and 5):

- **Every page** names the icon in its `<head>`, from the same files, so the tab, address bar, bookmarks, history and home screens show the bird.
- **Drawn from the logo, never redrawn.** Every size is the mark on a `color-logo` square:
  - 512 × 512 and 192 × 192 (Android home screens, through a small web manifest), and a 512 × 512 maskable icon with the mark at 62%, inside the round safe zone Android cuts icons to;
  - 180 × 180 (iPhone and iPad home screens);
  - 48, 32 and 16 (browsers), also in `favicon.ico` for the browsers and readers that look for that file.
- **The full mark from 64 px up, the bird alone at 48 and under.** At small sizes K and B shrink to a pixel or two and blur the bird; the bird's shape and eye still read at 16 px (mock-up 5).
- **The mark fills 84% of the large icons and 88% of the small ones,** so it reads as large as it can with a pixel or more of orange around it. iPhones round the corners of home-screen icons themselves, and Android cuts the maskable icon to its own shape; the files stay square.
- **The web manifest** names the site "Kettlebird Creations" (short name "Kettlebird"), starts at `/`, opens in the browser (`display: browser`), and lists the 192, 512 and maskable 512 icons, with `background_color` #ffbb58.
- **No `theme-color`:** the browser keeps its own toolbar colour (the lead, 2026-11-06).
- **Link previews** are not changed. Comic and story pages fall back to `kblogo.png`, which already follows the rule; the home page and the other top pages set no preview picture, which is a separate change.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | Home page tiles | No 20% black box behind the labels (`src/components/pages/HomePage.astro`, `.tile-content`). |
| 2 | Home page logo tile | `color-logo` ground, square, the transparent mark set 12% inside the border, scaled to fit (`.grid-tile-logo`, `.tile-image`). |
| 3 | Every page's head | Icon links and a web manifest (`src/layouts/BaseLayout.astro`). |
| 4 | Site files | The mark, the icons and `favicon.ico` in `public/`, made by `make-logo.py` from `kblogo.png`; the web manifest written by hand. |

Not changed: the header (the name in type), link previews, the Studio, and the logo's drawing and colours.

## Mock-ups

Built from the home page's own styles, with its fonts, colours, pictures and gutters. Source: `mockups/home-tiles-and-icon/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | After, on a laptop (1280 × 900): labels without the box; the logo tile in the logo's orange, the mark inside the border. Today: `today-laptop.png` | `mockups/home-tiles-and-icon/1-laptop.png` |
| 2 | After, on a phone (390 × 844). Today: `today-phone.png` | `mockups/home-tiles-and-icon/2-phone.png` |
| 3 | The labels without the box on photo and flat tiles: white as asked, white with a 3px ink outline, and ink (alternatives for the lead and Star) | `mockups/home-tiles-and-icon/3-flat-tile-labels.png` |
| 4 | Today and after: a browser's tab and address bar, and phones' home screens (iPhone and Android) | `mockups/home-tiles-and-icon/4-browser-and-home-screen.png` |
| 5 | The icon at each size, the pixels of the 16 and 32, and the maskable icon cut to a circle | `mockups/home-tiles-and-icon/5-icon-sizes.png` |

## Accessibility

- The logo tile keeps its text alternative, "Kettlebird Logo". The icons are decoration for the browser and have none.
- The mark's purple on `color-logo` is 5.4:1.
- **Labels without the box.** White on the photos, measured from the pictures behind the words, is 1.5:1 on Comics and 2.2:1 on Commissions (2.2 and 3.3 with the box); the soft shadow doesn't carry them. On the flat tiles it is 2.3:1 on Shop (`color-orange`), 1.6:1 on About (`color-green`) and 1.5:1 on News (`color-yellow`); with the box, 3.5, 2.6 and 2.4:1, so only Shop passes today. Contact me (#cc5544 to #d94f3d) is 4.1:1 and passes either way. Large text needs 3:1.
- **Kept for now,** at the lead's decision: the labels stay white with their shadow. The alternatives are in mock-up 3: white with a 3px ink outline (`color-ink`, 15:1 against white, between every letter and whatever is behind it), and ink labels (6.2, 8.7 and 9.4:1 on the flat tiles, but failing on the dark photos). The lead will choose with Star.
- The 16 px icon is small: the bird reads as a purple teardrop with its eye; the lead chose it at review (mock-up 5).
- Under reduced motion the tiles no longer lift on hover.

## Other documents

- **The design system** (Kettlebird, on claude.ai) already shows this as decided: its Logo component, `color-logo` and `color-logo-purple` tokens and Home tile guidelines. When this is built, its Changes entry moves from "decided" to the pull request that built it.
- **The visual reference** shows the logo sizes and the tiles as here.
- **`docs/STYLE_GUIDE.md`**, Branding and iconography: its favicon line ("Simplified KB or bird icon from logo") is settled by this design: the bird alone at 48 and under, the full mark above.

## For the spec to check

- On the home page, no tile label has a background of its own; the labels keep their font, size, place, white colour and text shadow.
- The logo tile's background is #ffbb58; its picture is the transparent mark, set 12% of the tile's width in from each side, and keeps its text alternative "Kettlebird Logo".
- The logo tile is square, and at 1280 × 800 the grid's row heights, and every tile's size, position and order, are the same as before; at 390 × 844 the logo tile is first and square.
- Under reduced motion, a tile doesn't move on hover.
- Every page's `<head>` names `/favicon.ico`, PNG icons at 16, 32 and 48, an apple-touch-icon at 180 and `/site.webmanifest`; each file is served, square and the stated size, with #ffbb58 at its corners; the 48 and smaller have at least one row and column of #ffbb58 on every edge.
- The manifest holds the name, short name, `start_url` `/`, `display` `browser`, `background_color` #ffbb58, and the 192, 512 and maskable 512 icons (`purpose: maskable`).
- The 48 px and smaller icons hold no K or B; the larger ones do.
- Pages that set a preview picture today still set the same one.

## Decisions at review

The lead's review (2026-11-06):
- **The labels:** the shaded box goes; the labels stay white with their shadow for now. The lead will discuss the alternatives in mock-up 3 (an ink outline, or ink) with Star; any change is a later amendment.
- **The icon's small sizes:** the bird alone at 48 px and under, the full mark above.
- **`theme-color`:** none; the browser keeps its own toolbar colour.

## Persona walkthrough

A walkthrough for persona-fan, and for persona-artist on the look (2026-11-06), opened every mock-up and logo file and checked the design against the code. It found two blocking problems, six misleading ones and six slower ones. All are addressed above:
- **Blocking:**
  - without the box, white labels fail on the light photos as well as the flat tiles (now measured, with alternatives in mock-up 3);
  - Android cuts home-screen icons to a circle and needs a maskable icon (added, with the manifest's contents).
- **Misleading:**
  - today's logo tile was described wrongly (the picture covers the tile; the mark is about a quarter in);
  - link previews: the home page sets none, so the fallback only applies to comic and story pages (now stated, and out of scope);
  - the 16 px icon touched its top edge (now 88%, with orange on every edge);
  - the 16 px claim needs Star's eye at actual size;
  - the mock-ups' gutters and header didn't match the site (re-rendered);
  - the Contact me tile was left out of the contrast figures.
- **Slower:**
  - the transparent mark had a blue rim on other grounds (make-logo.py now keeps each edge pixel's own ink colour);
  - make-logo.py didn't write `favicon.ico` (it does; the manifest is written by hand);
  - the style guide's logo card lines (updated);
  - checks the spec couldn't test (the tile's squareness and the grid's rows now named);
  - the tiles' hover under reduced motion (now in scope);
  - `theme-color` (decided at review: none).
