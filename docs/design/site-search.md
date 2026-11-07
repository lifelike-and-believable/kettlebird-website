---
id: design-site-search
status: approved
derived-from:
  - requirements-site#open-questions: ba017b8c2500
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-commission-client#goals: 94a5f248cb6c
  - persona-commission-client#context-of-use: 230296362b05
  - persona-commission-client#frustrations: bf4363305ada
  - persona-artist#frustrations: ef88538c418e
  - persona-artist#goals: f3044c738f84
  - design-comic-share-and-announce#addresses: bbe0d87276f4
  - design-comic-share-and-announce#for-the-spec-to-check: 65d1bf8d2414
  - design-story-mature-content#the-change: 23eafbff95f4
  - design-help-links: 333e2d238e6a
  - design-preview: dc01c995c1e6
---

# Search engines and link previews: design

<!-- docs/design/site-search.md. A site-wide design asked for by the lead (2026-11-07), after a review of how
the site serves search engines: no sitemap or robots.txt, no canonical address or link preview on the main
pages, and no structured data. The lead decided search engines list the site only once it has moved to
kettlebird.com (2026-11-07). Answers requirements-site's open question 2 ("social sharing previews, a sitemap,
and a favicon"). Mock-ups are in docs/design/mockups/site-search/: PNG images, mockups.html (their source) and
render.mjs; site-card.jpg there is the proposed site card itself. -->

## Personas

- persona-fan: arrives from a shared link, usually on a phone, and decides within seconds (#skills-and-tools). A link to the home page or the Portfolio shows a card with a picture today only on comic and story pages; with this design every public page has one. Fans who hear of Star by name can find the site by searching for it.
- persona-commission-client: compares several artists (#context-of-use), wants examples of similar work (#goals), and doesn't want to find out only after writing that commissions are closed (#frustrations). Once the site is listed, the Commissions page and the Portfolio can come up when they search for Kettlebird or Star by name (search engines decide the order). A shared Portfolio link shows a piece of Star's art; a shared Commissions link says whether commissions are open.
- persona-artist: Star has no new field to fill in. For comics and stories, what they already enter (titles, short descriptions, covers) is what search results and link previews show. The main pages' titles and descriptions are written into the site and stay as they are; changing them is a request to the lead. Two things Star already does gain a second effect, and the guide and the editor say so: the newest piece in **Featured** becomes the Portfolio's preview picture, and ticking **Mature or explicit content** marks the story for adults in search. Star's social links tell search engines which profiles are Star's.

## What's there today

- Every public page has its own tab title and description.
- Comic series, comic reader pages, stories and chapters have a canonical address and a link preview (design-comic-share-and-announce): the cover on paper, 1200 × 630, or the logo when there's no cover.
- `/studio`, `/help`, `/preview/` and the comics' **All pages** sheets ask search engines not to list them.
- There's no `robots.txt` and no sitemap, the other pages have no canonical address or link preview, and there's no structured data.
- Every page answers at two addresses, with and without a closing slash (`/writing` and `/writing/`).
- The site is at `https://newsite.kettlebird.com`; `kettlebird.com` forwards to Star's Tumblr.

## Listed only after the move

The lead's decision (2026-11-07): search engines list the site once it's at `https://kettlebird.com`, not before.

- **Listing is on when the site's address is `https://kettlebird.com`**, and off at any other address. The site's address is the one setting it already has (`astro.config.mjs`, or `SITE_URL`), so moving the site turns listing on with the same change and the build that follows it, and nothing else needs remembering. Pull-request previews are never listed (Vercel asks search engines not to list them, and their address isn't kettlebird.com).
- **While listing is off** (mock-up 6, left):
  - every page carries `<meta name="robots" content="noindex">`, so any page a search engine has already found drops out;
  - `robots.txt` allows everything, so search engines can read that noindex (a `Disallow` would stop them reading it);
  - the sitemap is built but `robots.txt` doesn't name it.
  - Link previews still work: social sites read the card whether or not a page is listed.
- **Once listing is on** (mock-up 6, right):
  - public pages drop the noindex;
  - `robots.txt` names the sitemap and blocks nothing;
  - `/help`, `/preview/`, `/studio` and the **All pages** sheets keep their noindex, as today. They aren't blocked in `robots.txt`, for the same reason as above: a blocked address can still be listed from links to it, without its noindex being read.

## Canonical addresses

- Every public page has a canonical address on the site's address, without a closing slash (`https://kettlebird.com/writing`), as comic and story pages have today. The home page's is `https://kettlebird.com/`.
- That settles the two addresses each page answers at: search engines count both as one page. The site's own links already leave out the closing slash.
- The sitemap uses the same addresses: every address in it is its page's canonical address, character for character. (A sitemap tool may add a closing slash by itself; the build must not let it.)
- **Page not found** has none, and keeps its 404 status.

## Link previews

Every public page has a link preview, not only comic and story pages: `og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image` with `og:image:width`, `og:image:height` and `og:image:alt`, and `twitter:card` (`summary_large_image`); social sites that read Twitter tags fall back to the Open Graph ones.

- **The site card** (mock-up 1): a new picture, 1200 × 630, of the Kettlebird logo on the site's paper, with "Kettlebird Creations" and "Illustration, comics and stories by Star Goldberg". It has no address on it, so it's right before and after the move (the social site shows the address under it). Its alt text is "Kettlebird Creations: illustration, comics and stories by Star Goldberg". It's made from the site's own fonts and images and saved as a file (`public/assets/images/site-card.jpg`); the mock-up's frame 1 is the proposed file.
- **Which picture each page uses:**

| Page | Picture | Title and description |
|---|---|---|
| Home, Comics, Writing, Shop, About, News | The site card | The page's tab title and description, as today |
| Commissions | The site card | The tab title; the description says whether commissions are open (below) |
| Portfolio | The newest piece in its **Featured** section, whole, on paper, 1200 × 630 (mock-up 3); the site card when nothing is in Featured | The page's tab title and description |
| Comic series and reader pages; stories and chapters | The cover, as today; the site card in place of the square logo when there's no cover | As today |

- **The Portfolio's piece**:
  - **Featured** here is the Portfolio section (a piece whose **Portfolio sections** include Featured), the Portfolio's top row. It isn't the old hidden "Featured on homepage" switch, which stays unused.
  - The newest piece by date in that section is the one shown first in that row, and it's the preview's picture. Changing which pieces are in Featured, or a piece's date, changes it with the next publish.
  - It's made from the piece's image by the image service, fitted whole inside 1200 × 630 on the paper colour, the way covers are (a new size for portfolio pieces; covers already have one), so it's never cropped. Its alt text is the piece's own.
- **The Commissions page's description** follows **Commissions** in the site settings: "Commissions are open. Commission artwork from Kettlebird Creations: pricing, examples, and how to order." when open, and "Commissions are closed for now. Pricing and examples of artwork from Kettlebird Creations." when closed. So a search result or a shared link doesn't invite someone to order while they're closed (until the next time a search engine reads the page).
- The type is `website` for the main pages and series, `article` for stories and chapters (as today).
- Mock-up 2 shows the home page's card; today such a link shows no card.
- Star can't see a link preview in the editor before publishing: **Preview** shows the page, not the card. The pictures are the ones Star already sees (covers, the Featured row), fitted whole on paper.

## Structured data

Each public page describes itself to search engines in schema.org terms (JSON-LD in the page's head). Nothing shows on the page.

| Page | What it says |
|---|---|
| Home | The site (`WebSite`, "Kettlebird Creations") and Star (`Person`: "Star Goldberg", also known as "Kettlebird", the home page's address, and `sameAs` the social links from the site settings). |
| About | A profile page (`ProfilePage`) about the same `Person`, with the about page's portrait when it has one. |
| Comic series | `ComicSeries`: title, description, cover, Star as author, its address. |
| Story | `CreativeWork`: title, short description, genres, cover, Star as author, the date posted. |
| Reader pages, chapters, series and stories | A `BreadcrumbList`: Comics › the series › Chapter 2 › Page 4; Writing › the story › Chapter 3. Search engines may show it as the path in a result (mock-up 5). |

- `sameAs` is every link in **Social links** in **Site settings**, so adding or removing one there updates it with the next publish. Each is taken to be one of Star's own profiles (the guide says so). The email address isn't included.
- Pronouns aren't a schema.org property; the about page already says them.
- Search engines decide what to show from this. The extra links under a result (mock-up 4) and the path (mock-up 5) are theirs to choose, and may not appear.

## Mature or explicit content

design-story-mature-content (The change, On the site) left search engines unchanged. This design changes that for search: a ticked story's page and its chapter pages carry `<meta name="rating" content="adult">`, which the main search engines read so they can leave the page out when someone searches with safe search on (mock-up 5's note); each search engine decides for itself. Link previews are unchanged: no mature flag, as that design says. The gate is unchanged.

The field's help text in the editor gains one sentence, so Star knows when ticking it: "Search engines are told too, so it can be left out for people searching with safe search on." (The help text is design-story-mature-content's; its test changes with it.)

## The sitemap

- Built with the site (`/sitemap-index.xml`, `/sitemap-0.xml`), from the pages that are built ahead of time: every public page, comic series and reader page, story and chapter.
- Left out: `/help`, `/preview/`, `/studio`, the **All pages** sheets and **Page not found**.
- No dates, priorities or change frequencies: search engines find new pages from the list itself.
- It's rebuilt with every publish, so a new page or chapter is in it once it's live.

## The move to kettlebird.com

Not part of the build. Steps for the lead on the day, for the launch checklist (`docs/PROJECT_PLAN.md` gains them as a launch item):

1. Add `kettlebird.com` and `www.kettlebird.com` to the Vercel project, with `www` forwarding to `kettlebird.com`, and wait until Vercel shows both as set up. Only then point the domain at Vercel and stop its forwarding to Tumblr at the registrar, so there's no gap.
2. In one sitting:
   - change the site's address to `https://kettlebird.com` (`SITE_URL` in Vercel's production settings, or `astro.config.mjs`);
   - redeploy production (changing `SITE_URL` alone does nothing until the next build), which turns listing on;
   - make `newsite.kettlebird.com` forward permanently to the same address on `kettlebird.com`, so links already shared keep working and the old address isn't listed beside the new one.
3. Add the site to Google Search Console and Bing Webmaster Tools (each checks ownership with a DNS record) and give each `https://kettlebird.com/sitemap-index.xml`.
4. Check, on the live site:
   - `https://kettlebird.com/robots.txt` names the sitemap;
   - a page's source has no noindex, has its canonical address and its preview tags;
   - a shared link shows its card (most social sites have a card checker);
   - `https://newsite.kettlebird.com/writing` forwards to `https://kettlebird.com/writing`;
   - `https://kettlebird.com/help` still has its noindex.

## Mock-ups

Source: `mockups/site-search/mockups.html`. Frames 2 to 5 are illustrations of a social site and a search engine, not any real one; each draws its own card and results.

| # | What it shows | File |
|---|---|---|
| 1 | The site card, at its real size (the proposed file is `site-card.jpg` beside it) | `mockups/site-search/1-site-card.png` |
| 2 | The home page's link on a social site: today (no card), then with the site card | `mockups/site-search/2-home-link-preview.png` |
| 3 | The Portfolio's link: the newest piece in Featured, whole on paper (a tall piece of Star's stands in) | `mockups/site-search/3-portfolio-link-preview.png` |
| 4 | Searching for the site after the move: the home page's result, with the site's name and icon | `mockups/site-search/4-search-home.png` |
| 5 | A chapter in search results, with its path; the note on ticked stories | `mockups/site-search/5-search-chapter.png` |
| 6 | What search engines read before and after the move: `robots.txt`, noindex and the sitemap | `mockups/site-search/6-what-search-engines-read.png` |

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The site's address (`astro.config.mjs`) | Says whether listing is on: only at `https://kettlebird.com`. |
| 2 | `src/layouts/BaseLayout.astro` | Noindex on every page while listing is off; a canonical address, a link preview and structured data on every public page that gives them; the adult rating when a page asks for it. |
| 3 | The main pages (`HomePage`, `PortfolioPage`, `comics.astro`, `WritingPage`, `ShopPage`, `CommissionsPage`, `AboutPage`, `news.astro`) | Their canonical address and link preview; the home and about pages' structured data. |
| 4 | Comic and story pages (`SeriesPage`, `ReaderPage`, `StoryPage`, `StoryChapterPage`, `lib/comics/sharing.ts`, `lib/stories/sharing.ts`) | Structured data and breadcrumbs; the site card in place of the logo when there's no cover; the adult rating on ticked stories and their chapters. |
| 5 | `public/assets/images/site-card.jpg` | New: the site card. |
| 6 | `robots.txt` (new, made at build time from the site's address) and the sitemap (new: `@astrojs/sitemap`, or the site's own list) | As above, depending on listing; sitemap addresses equal the canonical ones. |
| 7 | The Portfolio (`portfolio.astro`, `PortfolioPage.astro`, `lib/queries.ts`) | The newest piece in Featured, and its 1200 × 630 picture on paper from the image service (a new size for portfolio pieces). |
| 8 | The Commissions page (`CommissionsPage.astro`) | Its description from the open or closed setting. |
| 9 | The story's **Mature or explicit content** help text (`sanity-studio/lib/editor-content.ts`) | One sentence more, as above. |
| 10 | Star's guides and the project plan | As For the guide and The move say. |

## States and errors

| Situation | What happens |
|---|---|
| Before the move | Every page asks not to be listed; link previews work. |
| After the move | Public pages are listed; help, preview, studio and sheets aren't. |
| A pull-request preview | Never listed (its address isn't kettlebird.com, and Vercel asks search engines not to list it). |
| Nothing in Featured | The Portfolio's preview uses the site card. |
| The Portfolio's pieces can't be read at build time | The Portfolio shows its empty message, as today, and its preview uses the site card. |
| Commissions closed | The Commissions page's description and preview say so. |
| A series or story without a cover | Its preview uses the site card, in place of today's square logo. |
| A social link removed in Site settings | It leaves `sameAs` with the next publish. |
| A page removed | It leaves the sitemap with the next publish, and its address shows **Page not found**. |
| A link to `newsite.kettlebird.com` after the move | Forwards to the same page on `kettlebird.com`. |
| A ticked story with safe search on | Search engines can leave it out; its link preview is as before. |

## Accessibility

Nothing changes on the pages. Every preview picture has alt text (`og:image:alt`): the site card's says what the card says, a cover's and a piece's are their own.

## For the guide

Star's guides (not changed in this pull request); all are existing guides, so the help menu needs nothing new:

- `going-live.md`, a new short section, "In search results and link previews":
  - Until the site moves to kettlebird.com, search engines are asked not to list it; after the move they can.
  - For a comic or a story, search results and link previews show its title, short description and cover (the site's own picture when there's no cover). The main pages' titles and descriptions are part of the site: ask the lead to change one.
  - A shared Portfolio link shows the newest piece in **Featured**.
  - A ticked story can be left out for people searching with safe search on.
  - Search engines and social sites check again in their own time, so a change can take days to show there. There's nothing Star needs to do to make them check.
- `site-settings.md`:
  - "Your contact email and social links": add only your own profiles; the links also tell search engines which profiles are yours.
  - "Open or close commissions": search results and shared links to the Commissions page say whether they're open, after the next time they check.
- `editing-your-site.md`, where **Portfolio sections** are listed: the newest piece in **Featured** is the picture when someone shares the Portfolio's link.
- `publishing-stories.md`, "Mature content and content notes": the help text's new sentence, in plain words.

## For the spec to check

- Listing follows the site's address: noindex on every page and no sitemap line in `robots.txt` at any address but `https://kettlebird.com`; at that address, no noindex on public pages and the sitemap named.
- `/help`, `/preview/`, `/studio` and the sheets keep their noindex at both.
- A canonical address on every public page, without a closing slash; none on **Page not found**. Every sitemap address equals its page's canonical address.
- Link-preview tags on every public page, with the right picture and alt text for each (the table above), the image's width and height; absolute addresses from the site's address. The Portfolio's picture comes from the Featured section, not the hidden switch.
- The Commissions description, open and closed.
- `site-card.jpg` is 1200 × 630.
- The structured data on the home, about, series, story, reader and chapter pages, valid JSON-LD; `sameAs` from the site settings.
- The adult rating on ticked stories and their chapters only; the help text's new sentence (design-story-mature-content's help-text test is unlocked for it).
- The sitemap: the pages it has and leaves out, rebuilt with the site.

## Decisions at review

Proposed, for the lead to confirm or change:

1. Listing follows the site's address (on only at `https://kettlebird.com`), so the move turns it on with no second setting to remember. The alternative is a separate on-off setting.
2. The site card: the logo, "Kettlebird Creations" and "Illustration, comics and stories by Star Goldberg", on paper, with no address (mock-up 1). It replaces the square logo as the picture for comics and stories without a cover.
3. The Portfolio's preview shows the newest piece in Featured, whole on paper; the other main pages show the site card. Star can't see the card before publishing.
4. Ticked stories are marked adult for search engines, so safe search can leave them out, and the tick's help text says so. This changes design-story-mature-content's "search engines unchanged". The alternative is to leave them unmarked, so search engines judge each page themselves.
5. Structured data as in the table, including Star's `Person` with "Kettlebird" as the other name and the social links as `sameAs`.
6. The Commissions page's description says whether commissions are open (the wording above).
7. Google Search Console and Bing Webmaster Tools are set up by the lead at the move, under the lead's account or Star's.

## Persona walkthrough

By the persona-walkthrough agent, 2026-11-07, for persona-fan, persona-commission-client and persona-artist, and the lead's move steps as a practical check, read against the mock-ups, `BaseLayout.astro`, the page components, both `sharing.ts` files, `astro.config.mjs`, `vercel.json` and Star's guides. Addressed above:

- **Blocking, now fixed:**
  - The design said Star's own entries drive every page's search and preview text; the main pages' text is written into the site (Personas and For the guide now say so).
  - It said a shared Commissions link would show Star's art; only the Portfolio's does. The Commissions page's description now says whether commissions are open instead, which the persona's first frustration asks for.
  - "Featured" could mean the Portfolio section or a hidden switch, and portfolio pieces have no 1200 × 630 picture yet. It's now the section, the newest piece in it, and a new picture size (Where it applies, row 7).
  - A sitemap tool can add closing slashes that disagree with the canonical addresses; the sitemap's addresses must now equal the canonical ones.
- **For fans:** the site card said "kettlebird.com" while the site is still at the old address (the address is gone from the card); mock-up 3 used a placeholder (now a tall piece of Star's on paper); mock-up 4 invented the next result's text (now neutral); "left out" with safe search was stated as certain (now "can be left out").
- **For Star:** ticking **Mature or explicit content** gains a second effect (now in its help text and the guide); the Portfolio's picture changes with Featured and Star can't preview it (in the guide and Decisions); which social links count as profiles (all of them, and the guide says add only your own); the guide says listing is off until the move, and that there's nothing to do to make search engines check sooner.
- **For the lead's move:** verify the domain in Vercel before the registrar change; change the address, redeploy and forward the old address in one sitting; a check list for the live site afterwards.
- **For the build:** blocking `/studio/` and `/preview/` in `robots.txt` would stop search engines reading their noindex, so `robots.txt` now blocks nothing; the exact preview tags (image size and alt text) are listed.
- Not taken up: a link-preview check in the editor (Decision 3), and a picture of Star's art on the other main pages.
