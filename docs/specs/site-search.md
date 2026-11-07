---
status: draft
unlocks:
  - tests/unit/comic-sharing-edges.test.ts, tests/unit/stories-sharing.test.ts, tests/e2e/comic-share-and-announce.spec.ts: a comic or story without a cover now falls back on the site card, not the square logo (site-search AC-6), as design-site-search says.
  - tests/unit/story-mature.test.ts, tests/unit/story-editor.test.ts, tests/unit/organised-editor.test.ts: the Mature or explicit content help text gains the design's sentence about search engines (site-search AC-11).
---

# Search engines and link previews

<!-- Technical spec for design-site-search (approved 2026-11-07, with its decisions as proposed: listing follows
the site's address; the site card without an address; the Portfolio's preview from the newest piece in
Featured; ticked stories marked adult; structured data as in the design; the Commissions description from
open or closed; Search Console and Bing at the move). Amends story-mature-content AC-1 (the help text) and
comic-reader-share-and-announce / story-reader-pages (the picture for a comic or story without a cover). A
plan-feature spec without an id. -->

## Problem

Search engines get no sitemap or robots.txt, the main pages have no canonical address or link preview, nothing describes Star or their work in structured data, and the staging address could be listed before the move. A shared link to the home page or the Portfolio shows no card.

## User stories

- As a fan, I want a shared link to any of Star's pages to show a card with a picture, and to find the site by searching for Star once it's at kettlebird.com, so that I can decide quickly to look. (design-site-search#personas)
- As someone looking for an artist, I want search results and shared links to show Star's work and whether commissions are open, so that I don't write only to find them closed. (design-site-search#personas)
- As Star, I want what I already enter to be what search engines and link previews show, and to know what ticking Mature or explicit content and Featured now also do. (design-site-search#personas)

## Acceptance criteria

Source: design-site-search sections as named. "Listed" means the site's address is `https://kettlebird.com`. "Public pages" are every page built ahead of time except **Page not found**, `/help` and its guides, and the comics' **All pages** sheets; `/preview/` pages are made on request and aren't public pages.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | `isListed(site)` is true only for the origin `https://kettlebird.com` (with or without a closing slash); `https://newsite.kettlebird.com`, `https://www.kettlebird.com`, `http://kettlebird.com` and preview addresses aren't listed. While not listed, every page built has `<meta name="robots" content="noindex">`, once. While listed, public pages have none, and `/help`, its guides, the **All pages** sheets and `/preview/` pages keep theirs. | test: unit "listing"; e2e "listing" | #listed-only-after-the-move |
| AC-2 | The build writes `/robots.txt`: `User-agent: *` and `Allow: /`, and, only while listed, `Sitemap: <site>/sitemap-index.xml`. It has no `Disallow` line. | test: unit "robots"; e2e "robots" | #listed-only-after-the-move |
| AC-3 | The build writes `/sitemap-index.xml`, naming `<site>/sitemap-0.xml`, and `/sitemap-0.xml`, listing the canonical address of every public page once, sorted, and nothing else: no `/help`, `/preview/`, sheet (`…/pages`), `404` or `/studio` address. Neither has dates, priorities or change frequencies. Both are written whether or not the site is listed. | test: unit "sitemap"; e2e "sitemap" | #the-sitemap |
| AC-4 | Every public page has one `<link rel="canonical">`: the site's address and the page's path without a closing slash (`<site>/writing`), and `<site>/` for the home page. **Page not found** has none. Every sitemap address is the canonical address of the page it names. | test: unit "canonical"; e2e "canonical" | #canonical-addresses |
| AC-5 | Every public page has, once each: `og:site_name` "Kettlebird Creations", `og:type` (`website`; `article` for stories, chapters and comic reader pages, as today), `og:title`, `og:description`, `og:url` (the canonical address), `og:image` (absolute), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, and `twitter:card` `summary_large_image`. | test: e2e "preview tags" | #link-previews |
| AC-6 | `public/assets/images/site-card.jpg` is the design's site card, 1200 × 630, with the alt text "Kettlebird Creations: illustration, comics and stories by Star Goldberg". The home, Comics, Writing, Shop, Commissions, About and News pages use it; their title and description are their tab title and description. A comic series or story without a cover uses it in place of the square logo (`kblogo.png`); with a cover, the cover's 1200 × 630 picture, as today, with the alt text "Cover of <title>". | test: unit "site card"; e2e "preview tags" | #link-previews |
| AC-7 | The Portfolio's preview picture is the newest piece by date whose **Portfolio sections** include Featured (`category` includes `featured`; the old `featured` switch is ignored): its image from the image service, fitted whole in 1200 × 630 on the paper colour (`f5f1e8`), as a JPEG; its alt text is the piece's alt text, else its title. With no such piece, or no pieces, it's the site card. | test: unit "portfolio preview" | #link-previews |
| AC-8 | The Commissions page's description (tab and preview) is "Commissions are open. Commission artwork from Kettlebird Creations: pricing, examples, and how to order." when commissions are open in the site settings, and "Commissions are closed for now. Pricing and examples of artwork from Kettlebird Creations." when closed. | test: unit "commissions description"; e2e "preview tags" | #link-previews |
| AC-9 | Structured data, one `<script type="application/ld+json">` per page that has it, valid JSON with `@context` `https://schema.org`: the home page a `WebSite` ("Kettlebird Creations", `<site>/`) and a `Person` (`@id` `<site>/#star`, "Star Goldberg", `alternateName` "Kettlebird", `url` `<site>/`, `sameAs` every social link in the site settings, in order, and no email); the About page a `ProfilePage` whose `mainEntity` is that `Person`, with `image` the portrait's address when there is one; a comic series a `ComicSeries` (name, description if any, image if a cover, `author` `{ "@id": "<site>/#star" }`, url) and a `BreadcrumbList` Comics › series; a comic reader page a `BreadcrumbList` Comics › series › the chapter's label (when the series shows chapters) › Page N; a story a `CreativeWork` (name, description if any, `genre` if any, image if a cover, author, `datePublished` if dated, url) and a `BreadcrumbList` Writing › story; a chapter a `BreadcrumbList` Writing › story › the chapter's label. Each breadcrumb's `item` is its page's canonical address. Other pages have none. | test: unit "structured data"; e2e "structured data" | #structured-data |
| AC-10 | A ticked story's page and each of its chapter pages have `<meta name="rating" content="adult">`, once; no other page has it. | test: unit "adult rating"; e2e "adult rating" | #mature-or-explicit-content |
| AC-11 | The story's **Mature or explicit content** help text ends with "Search engines are told too, so it can be left out for people searching with safe search on." | test: unit "help text" | #mature-or-explicit-content |
| AC-12 | Star's guides say what the design's For the guide lists: `going-live.md` has "## In search results and link previews"; `site-settings.md`, `editing-your-site.md` and `publishing-stories.md` have their lines. No guide promises a result will show. | test: unit "guides"; manual: review of the guides | #for-the-guide |
| AC-13 | `docs/PROJECT_PLAN.md` lists the move to kettlebird.com as a launch item with the design's steps, and requirements-site's open question 2 is answered (a sitemap, link previews and the site's icon now exist). | manual: review | #the-move-to-kettlebirdcom |

## Scope

- In:
  - `src/lib/seo.ts` (new, pure): `isListed`, `pageNoindex`, `canonicalUrl`, `robotsTxt`, `sitemapPaths`, `sitemapIndex`, `sitemapXml`, `SITE_CARD`, `previewImageAlt`, `commissionsDescription`, `jsonLd` and the structured data builders (`homeData`, `aboutData`, `seriesData`, `readerPageData`, `storyData`, `chapterData`).
  - `src/lib/portfolio-preview.ts` (new): `featuredPiece` (pure) and `portfolioPreviewImage` (the image service's address).
  - `src/integrations/seo-files.ts` (new): writes `robots.txt`, `sitemap-index.xml` and `sitemap-0.xml` at `astro:build:done` from the built pages; added in `astro.config.mjs`.
  - `src/layouts/BaseLayout.astro`: noindex while not listed; the preview tags as AC-5; `structuredData` and `adult` props.
  - The main pages, `SeriesPage`, `ReaderPage`, `StoryPage`, `StoryChapterPage`, `CommissionsPage`, `portfolio.astro` / `PortfolioPage`; `lib/comics/sharing.ts`, `lib/stories/sharing.ts` (the site card as the fallback, alt text).
  - `public/assets/images/site-card.jpg` (from the design's mock-up).
  - `sanity-studio/lib/editor-content.ts` (the help text).
  - Guides as AC-12; `docs/PROJECT_PLAN.md`, `docs/product/requirements/site.md`.
  - Tests: `tests/unit/site-search.test.ts`, `tests/e2e/site-search.spec.ts`, and the unlocks.
- Out: registering the domain, Search Console and Bing (the lead, at the move); a link-preview check in the editor; pictures of Star's art on the other main pages.

## APIs and assumptions

- Astro 5's `astro:build:done` hook gives the built pages' paths and the output directory, as `build-info.ts` uses; the files are served by Vercel and by the fixture build's Node server from that directory.
- `<meta name="rating" content="adult">` is how Google and Bing ask for safe search labelling; each decides for itself.
- schema.org types `WebSite`, `Person`, `ProfilePage`, `ComicSeries`, `CreativeWork` and `BreadcrumbList`.
- Vercel adds `X-Robots-Tag: noindex` to preview deployments.

## Non-functional requirements

- No change to the pages as seen; no new script runs in the browser. Each page's head grows by its tags and JSON (a few hundred bytes).
- New pure logic (`src/lib/seo.ts`) is mutation tested.

## Delivery

- Plan item: design-site-search (PR 183).
- Listing turns on when the lead changes the site's address at the move (AC-1); until then the built files say not to list.

## Risks and decisions

- Own sitemap writer rather than `@astrojs/sitemap`: no new dependency, and its addresses are the canonical ones by construction (the design's slash finding).
- The site card replaces the square logo for comics and stories without a cover; the tests naming the logo are unlocked.
