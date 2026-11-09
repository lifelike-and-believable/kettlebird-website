# Kettlebird Creations Website - Project Plan

<!-- docs/PROJECT_PLAN.md. Brought up to date on 2026-11-06 (three times) and 2026-11-07 (four times). The first version (2025-12-24) planned the site as
nine milestones of checklists; the work has since moved to the process in docs/product (epics, stories,
designs, guides and specs), and this plan now summarises where things stand and what's left. The first
version is in the repository's history. -->

## Summary

**Project:** Kettlebird Creations, the website of Star Goldberg (writer and illustrator)
**Address:** https://newsite.kettlebird.com (set in `astro.config.mjs`, or with `SITE_URL`)
**Who decides:** Star, on the work and the content; the project lead, on what's built and when, by merging each step

### Goal

One home for Star's work: artwork, comics, stories, a shop and commissions, that Star can keep up to date without a developer, and that fans can read comfortably on a phone.

### Existing online presence

- **Tumblr:** https://kettle-bird.tumblr.com/
- **Ko-fi:** https://ko-fi.com/kettlebirdart
- **Bluesky:** https://bsky.app/profile/kettlebird.bsky.social

## How work is planned

The project follows rules-for-robots (`.rfr/`, `docs/product/process.yml`):

1. **Concept, personas and requirements** in `docs/product/`: who the site is for (fans, Star, commission clients) and what must be true for them.
2. **Epics and stories** (`docs/product/epics/`, `docs/product/stories/`): each piece of work as a user's goal.
3. **Designs** (`docs/design/`) with mock-ups rendered from the site's own styles, and a persona walkthrough before review.
4. **User guides** (`docs/user/`): Star's guides join the editor's online help; the fans' guide is `reading-comics.md`.
5. **Specs** (`docs/specs/`) with acceptance criteria, and their tests written and committed before the build.
6. **Build**, with every test passing; each step merges only on the lead's approval.

The look of the site is recorded in `docs/STYLE_GUIDE.md` and in the Kettlebird design system (on claude.ai), which tracks every change to the look and the pull request that built it.

## Where things stand (2026-11-09)

| Area | On the site | Where it's described |
|---|---|---|
| Home page | Tiles for each section over Star's photos and colours, the logo tile in the logo's own orange; the site's icon in browser tabs and on phones' home screens | design-home-tiles-and-icon |
| Site-wide | Torn-paper header (shorter on phones, with a menu), one arrow style everywhere, keyboard focus and reduced motion respected, link previews on every page, a sitemap, and structured data for search engines, listed once the site is at kettlebird.com | design-phone-header, design-arrows, design-comic-share-and-announce, design-site-search |
| Portfolio | Kraft folders with tabs, pieces whole, in rows at most 240 pixels tall; subfolders Star makes in the editor, each with its own address and its own order, newest or oldest first; any piece full screen, with zoom and moving between pieces | epic-portfolio-full-screen, epic-portfolio-folders, design-portfolio-size, design-portfolio-order |
| Comics | Series and chapter pages; a reader with First, Previous, Next and Newest, all pages of a chapter on one sheet, sharing, screen reader announcements; two pages side by side and a page-flip on wide screens, per comic; panel by panel, with panels found when Star uploads and corrected by Star in the editor; on a computer, pages that fit the screen, the width or the height, set per comic by Star and choosable by fans | epic-comic-reader, epic-comic-reader-flip-and-panels, design-comic-page-width |
| Writing | Stories read on the site, as one-shots or in chapters, with scene breaks and Star's pictures, on a white sheet that comes out of a typewriter as fans scroll; Star uploads each chapter as a Word document; stories with mature or explicit content ask before showing the text; news | epic-story-reader, design-story-import, design-story-mature-content, design-story-text-frame, design-story-typewriter |
| Shop | Products by category, each linking to Ko-fi | requirements-shop (REQ-shop-1) |
| Commissions | Open or closed, types and prices, how it works, and an email link to start | requirements-commissions (REQ-commissions-1 to 3) |
| About and contact | Star's about page, quick facts and social links | design-site-settings |
| Star runs the site | Sign-in at `/studio`; an editor organised as Comics, Art, Writing, Shop, Commissions and Site settings; preview before publishing; knowing when a change is live; help links to Star's guides on every item | epic-content-editing |

The newest changes (2026-11-09):
- **Smaller folders on a computer** (design-portfolio-size, docs/specs/portfolio-size.md), the lead's change request: rows at most 240 pixels tall (half the size) and the phone's tab sizes at every width, so several folders show at once on a large screen; subfolder grids at most 3 × 3 on a computer, with the count under every thumbnail. Phones are unchanged.
- **Oldest first in a subfolder** (design-portfolio-order, docs/specs/portfolio-order.md): each subfolder has **Order of pieces**, newest or oldest first, for its thumbnail, its open row and full screen; the sections stay newest first, and a subfolder still sits where its newest piece would be. Pieces with the same date now come in title order.
- **A fix in the editor:** subfolders' rows in the Subfolders list read "Invalid preview config"; they now read "Fan Work · 2 × 2 · 4 pieces", with "Oldest first" when it's set.
- **How work is done:** a test change that follows an approved spec no longer asks the lead, once the spec unlocks the test (CLAUDE.md); rules-for-robots is at rfr-v5.3.0.

Earlier (2026-11-08):
- **The Portfolio as folders, with subfolders** (epic-portfolio-folders, design-portfolio-folders, docs/specs/portfolio-folders.md), from Star's own concept:
  - each section is a kraft file folder with a tab on its own side, slightly slanted with rounded corners, stacked with a soft shadow;
  - pieces show whole, at 9/16 of the row's width (at most 480 pixels then, 240 since 2026-11-09), not as square crops; the filter buttons are gone;
  - Star gathers pieces into subfolders in the editor (Art, Subfolders), such as one fandom in Fan Work; each shows as a grid of its newest pieces, opens in its folder as "Fan Work: Murderbot" with a pink INDEX tab back, and has its own address;
  - full screen turns through the open subfolder's pieces, or the folder's loose ones.
- **Story text on a white sheet** (design-story-text-frame, docs/specs/story-text-frame.md): the text of a story or chapter sits on plain white with a soft shadow, keeping its reading width.
- **The sheet comes out of a typewriter** (design-story-typewriter, docs/specs/story-typewriter.md): a 1950s office typewriter with a KETTLEBIRD nameplate under the sheet follows the reader at the bottom of the screen, so the story scrolls up out of it, and rests under the last line; phones too. The drawing is a stand-in until Star's artwork comes.

## What's left

### Features waiting on decisions

1. **Requesting a commission through a form** (REQ-commissions-4, unmet). Before an epic:
   - where requests go (Star's email, a private list in the editor, or both; never the site's public content);
   - whether the form hides, or takes waitlist requests, when commissions are closed;
   - whether the terms of service ("coming soon" today) are written first, and by whom.
2. **Buying on the site** (REQ-shop-2, unmet: products link to Ko-fi today). Before an epic:
   - the payment provider;
   - who handles sales tax, shipping and fulfilment (Star, or a print-on-demand service);
   - whether stock is shown ("sold out"), and stops sales at zero;
   - whether the Ko-fi links stay, for tips or some products.

### The move to kettlebird.com (launch)

Search engines list the site only once its address is `https://kettlebird.com` (design-site-search, The move to kettlebird.com). On the day, the lead:

1. Adds `kettlebird.com` and `www.kettlebird.com` to the Vercel project, with `www` forwarding to `kettlebird.com`, and waits until Vercel shows both as set up; only then points the domain at Vercel and stops its forwarding to Tumblr at the registrar.
2. In one sitting: sets `SITE_URL` to `https://kettlebird.com` in Vercel's production settings; redeploys production, which turns listing on; and makes `newsite.kettlebird.com` forward permanently to the same address on `kettlebird.com`.
3. Adds the site to Google Search Console and Bing Webmaster Tools (each checks ownership with a DNS record) and gives each `https://kettlebird.com/sitemap-index.xml`.
4. Checks the live site: `robots.txt` names the sitemap; a page's source has no noindex, and has its canonical address and preview tags; a shared link shows its card; `https://newsite.kettlebird.com/writing` forwards to `https://kettlebird.com/writing`; `https://kettlebird.com/help` still has its noindex.

### Waiting on Star

- The two pictures for **Panel by panel** and **All pages** on phones; interim ones are in place until they come.
- The **home tiles' label colours**: white with a shadow for now; the alternatives (an ink outline, or ink) are in design-home-tiles-and-icon, mock-up 3.
- The **typewriter artwork**, nameplate included, to replace the stand-in drawing (design-story-typewriter, The artwork from Star).
- The **Commissions page layout**, which the next slice starts from.
- The rest of the Portfolio's **subfolders**: Star has made the first, in the editor (Art, Subfolders).

### Checks only a person can do

- The editor's subfolder steps, which the tests can't sign in to try (portfolio-folders AC-19 to AC-22). Making and publishing a subfolder and setting its order were confirmed in use on 2026-11-09. Still to try: untick a piece's section and publish (the note, then the piece leaving the subfolder), and delete a subfolder (the question with its count).
- The Word upload tutorial (`docs/tutorials/publishing-stories.md`) with one of Star's own chapters, including its pictures and a phone photo's location data being removed (story-import-word AC-12, AC-28).
- A read of the new "In search results and link previews" section of Star's guide `going-live.md`, and the lines added to the other guides (site-search AC-12).
- The page-flip on a page taller than the window, in Chrome and Safari on a computer (comic-reader-page-size AC-24).
- The reader on a real iPhone in Safari, and in the in-app browsers fans arrive from, for the reader bar on phones.
- The manual checks named in earlier specs ("manual:" in their criteria), on a phone.

## What happened to the first plan's milestones

| Milestone (2025-12-24) | What happened |
|---|---|
| 1. Foundation and planning | Done: Astro with React islands, Sanity, Vercel, deploying from `main` with a preview for every pull request. |
| 2. Design and branding | Done: `docs/STYLE_GUIDE.md`, then the design system. The radial menu became the home page's tiles. |
| 3. Portfolio | Done, and extended with the full-screen view, then rebuilt as folders with subfolders from Star's concept, sized down for computers, with each subfolder's order Star's choice. Built with the site's own code rather than PhotoSwipe. |
| 3A. Comic reader | Done, and extended: page-flip, two pages side by side, panel by panel with panels found automatically, and page sizes on a computer. Built without panzoom. |
| 3B. Written works page-flip | Replaced: stories read as web pages, which suit phones and screen readers better than a page-flip (epic-story-reader), uploaded from Word documents with their pictures. |
| 3C. Commerce | In part: the shop lists products and links to Ko-fi; buying on the site is open (above). |
| 3D. Commission requests | In part: the commissions page; the request form is open (above). Google Forms and a public queue board weren't used. |
| 4. Core pages | Done: home, about, news, contact links, the header and its phone menu, the page-not-found page. |
| 5. Interactivity | Done where it serves reading: the page-flip, zoom, motion that respects reduced motion, the site's icon, link previews. Decorative effects (ink splatter, parallax) weren't taken up. Search engines are ready for the launch: a sitemap, structured data and listing from kettlebird.com. |
| 6. Content | Star's, through the editor, with the publishing guides; ongoing. |
| 7. Quality | Continuous rather than a phase: unit and end-to-end tests for every spec, accessibility checks, mutation testing of pure logic, and the guides' tutorials run against each pull request's preview. |
| 8. Deployment | Continuous: Vercel deploys every merge to `main`. |
| 9. Post-launch iteration | This plan, and the requests that come in, through the process above. |

## Document history

| Date | Changes |
|---|---|
| 2025-12-24 | First version: nine milestones of checklists. |
| 2026-11-06 | Brought up to date: what's built, what's left, the decisions waiting, how work is planned, and what happened to each milestone. |
| 2026-11-06 | Later the same day: how pages fit on a computer, four fixes, and the page-flip check on tall pages. |
| 2026-11-06 | That evening: Featured is always the portfolio's top row. |
| 2026-11-07 | Writing from Word documents, mature or explicit content in place of ratings, the stories brought up to date, the Commissions page's subtitle removed, and the tidying once the test story is deleted. |
| 2026-11-07 | Later: the hidden old rating, its fallback and the one-off change removed, as the test story is deleted. |
| 2026-11-07 | Search engines and link previews, and the move to kettlebird.com as a launch step. |
| 2026-11-07 | Brought up to date after the search engines build: the newest changes in one list, the Writing page's subtitle, the Commissions description, the docs' pronouns for Star, and the guide review as a check. |
| 2026-11-08 | The Portfolio as folders, with subfolders, from Star's concept. |
| 2026-11-08 | Brought up to date after the folders and typewriter builds: the newest changes, the story's white sheet and typewriter, the artwork and subfolders waiting on Star, and the editor's subfolder check. |
| 2026-11-09 | Brought up to date: smaller folders on a computer, oldest first in a subfolder, the Subfolders list fix, test changes that follow a spec, rules-for-robots 5.3.0, the Commissions layout waiting on Star, and the subfolder steps confirmed so far. |
