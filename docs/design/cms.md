---
id: design-cms
status: approved
derived-from:
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - requirements-content-editing#REQ-content-editing-3: ff2249e7189e
  - requirements-comics#REQ-comics-3: 1c122b12d909
  - persona-artist#skills-and-tools: 4e28d5374320
  - persona-artist#frustrations: ef88538c418e
  - epic-comic-reader#outcome: b4076be3edb8
  - epic-comic-reader-flip-and-panels#outcome: c1426bb16011
---

# Which CMS Star edits in

<!-- docs/design/cms.md. Concept decision 6: compare Sanity with alternatives before building more
on it. A cross-cutting decision rather than one feature's design; story designs (series pages,
publishing, panel correction) build on it. Checked 2026-11-01. -->

## Decision

**Keep Sanity**, and make it easier for Star: a simpler Studio layout, publishing that deploys the site on its own, and custom editors where the defaults are not enough (chapters, panels, site text).

Merging this note records the decision. If the lead prefers another option, it changes here before any story design builds on it.

## What we found

- **Sanity holds no content today.** A public query of the `production` dataset (project `gtopiz2h`) returns no documents and no images, and the site reads that dataset without a token, so this is exactly what the site sees. Every page shows its empty state or placeholders. A Studio has been deployed (`sanity-studio/sanity.cli.ts` has a deployment id), but nothing has been published from it.
- **So switching costs almost nothing now**, and this is the cheapest moment to change. The choice can be made on merit, not on sunk cost. The existing schemas (gallery items, comic series and pages, written works, products, commission types) are small and would take about a day to rebuild in any of the options.
- **Real comics exist outside the CMS** (lead, 2026-11-01). Comic pages are large, high-resolution images, and there will be hundreds of them across series and chapters. Where images live matters more than anything else here.

## What Star needs

From the approved requirements and Star's persona:

1. **No developer, no Git, no terminal** (persona-artist: skills and tools; REQ-content-editing-1).
2. **Edit the site's own text:** commission status, about page, home page text, social links (REQ-content-editing-3).
3. **Chapters, pages in order, and panel regions** that Star can correct by dragging boxes on a page (REQ-comics-3; epic-comic-reader-flip-and-panels).
4. **Large images handled well:** many full-resolution comic pages, served at the right size to phones and desktops.
5. **Changes reach the live site without a manual deploy**, and Star can tell when they have (persona-artist: frustrations).
6. **Low cost** for one editor, and no lock-in that would trap the content.

## Options compared

| | Sanity (current) | Git-based: Sveltia or Decap | Git-based with visual editing: TinaCMS or Keystatic | Hosted page builders (Storyblok, Contentful) | Self-hosted (Payload) |
|---|---|---|---|---|---|
| Star's editing | Web Studio, no Git. Can be simplified with a custom layout. | Web editor, no Git for Star, but every save is a commit. Sveltia pushes drafts straight to the branch unless set up with a drafts branch. | Web editor with live preview on the page. Tina's Astro visual editing is still described as experimental. | Polished visual editors | Web admin |
| Site text (REQ-content-editing-3) | Singleton documents | Data files | Data files | Yes | Yes |
| Chapters and ordering | Schema change | Folders or fields | Fields | Yes | Yes |
| Panel correction (drag boxes on a page) | Custom input component in React inside the Studio | Custom widget; possible, less documented | Custom field; Keystatic's custom fields are limited | Plugin or app; harder | Custom field |
| Large comic images | Image CDN with resizing, crops, and hotspots; 100 GB of assets and 100 GB a month of bandwidth on the free plan | Images in the Git repository. Hundreds of high-resolution pages bloat it; Git LFS adds cost and breaks some editors' image display (Keystatic issue, February 2026). Needs separate image hosting to work well. | Same as Git-based, unless paying for the vendor's media hosting | Image CDN | You host and serve images |
| Changes reach the site | Webhook to a Vercel deploy hook (free plan includes 2 webhooks) | Each save is a commit, which Vercel builds | Each save is a commit | Webhook | Webhook |
| Cost for one editor | Free plan: 20 seats, 10,000 documents. Growth is $15 per seat a month if needed (scheduled publishing, private datasets). | Free, open source | Free tier (Tina: 2 users); paid tiers for more | Paid beyond small free tiers | Free software; pay for a server and database |
| Lock-in | Content exportable as JSON; schemas are code in this repository | None; content is files in the repository | Little; content is files | High | Low |

## Why Sanity

- **Images decide it.** Comic pages are the heaviest content on the site, and Sanity already serves resized images from a CDN within a generous free allowance. Every Git-based option needs a separate image host to cope with hundreds of high-resolution pages, which adds a second system for Star to learn.
- **Panel correction needs a custom editor**, and Sanity Studio is built for that: a React input that shows the page and lets Star drag panel boxes, saved with the page. The other options make this harder or less certain.
- **It costs nothing at Star's scale**, and the free plan's limits (10,000 documents, 100 GB of images) leave plenty of room for years of comics.
- **The schemas already exist** in this repository, and the site already reads from Sanity.
- **The real risk is the Studio feeling too technical for Star.** That is addressed by the work below, not by changing CMS, and it is unverified until Star tries it (open question 1).

## Persona walkthrough

A walkthrough of this note for persona-artist (2026-11-01) found no blocking problems and nine others. The note was revised for seven of them: publish status that shows failures, preview before publishing, detection never overwriting Star's panel corrections, removing placeholders before Star starts, adding many pages at once, the full about page in site settings, and how Star signs in. Upload guidance belongs in Star's user documentation once open question 2 is answered. Where commission requests are read is left to the commissions design.

## Consequences for the work

- **Before Star starts:** remove the placeholder content from the code (stock images, other studios' titles, lorem ipsum), so that Star's first published piece is never shown beside it. Empty sections show their empty states until Star fills them.
- **New editing work** (one or more stories under the content-editing requirements, before or alongside the comic reader's publishing story):
  - **getting in:** Star is invited to the Sanity project by email and signs in at one bookmarked address; the user documentation covers this first;
  - **a Studio layout** organised around Star's work (Comics, Art, Writing, Shop, Commissions, Site settings), not around document types;
  - **a "Site settings" document** for commission status, the whole about page (bio, artist statement, portrait, quick facts), the home page text, and the social links (REQ-content-editing-3);
  - **preview before publishing:** Sanity's preview tools (included on the free plan) show a piece or comic page as it will look on the site, so Star can check crops and layout first;
  - **publish status:** publishing starts a site deploy, and the Studio shows the status of the change Star just published (building, live, or failed, with the usual delay of a minute or two), not only the time of the last update. A failed deploy says so in the Studio, so Star never believes a change is live when it is not;
  - **alt text:** whether alt text becomes required before publishing is an open question in the content-editing requirements; this note does not decide it.
- **Comic schema and editing changes** for the comic reader epics:
  - a chapter type, and pages ordered within chapters, with a way to add many pages at once (upload several files, ordered by file name, then reorder by dragging) instead of one page at a time;
  - panel regions on each page (already modelled), filled in by automatic detection, with a per-page flag recording that Star has corrected them. **Detection never overwrites a page Star has corrected**; it only fills pages Star has not touched. When detection runs is decided in that epic's design.
- **Datasets stay public** on the free plan. That is fine for published portfolio content. Commission requests (REQ-commissions-4) and orders (REQ-shop-2) contain personal details and must **not** be stored in Sanity's public dataset; their designs will choose where they go and where Star reads them.
- **Growth plan features** (scheduled publishing, private datasets) are not needed for anything approved so far. If a later story needs them, the cost ($15 per seat a month) is raised with the lead then.

## Open questions

1. Has Star used the deployed Studio? Their first-hand reaction is the best test of whether the simpler layout is enough.
2. What resolution and file format are the comic page originals? This sets the upload guidance in Star's documentation and checks the 100 GB allowance.
3. Should the Studio live at a `*.sanity.studio` address (as now) or at `/studio` on the site?

## Sources

- [Sanity pricing](https://www.sanity.io/pricing), checked 2026-11-01: free plan limits, webhooks, Growth price.
- [Keystatic & Astro](https://docs.astro.build/en/guides/cms/keystatic/) and [Keystatic pull request #1514](https://gh.r-mj.com/Thinkmill/keystatic/pull/1514) on images in Git LFS (February 2026).
- [Sveltia CMS](https://github.com/front-matter/sveltia-cms), and an [Astro user's notes on drafts](https://ergaster.org/til/sveltia-cms-astro).
- [Decap CMS releases](https://decapcms.org/docs/update-the-cms-version/) (3.10.0, January 2026).
- TinaCMS free tier and Astro support: [CostBench](https://costbench.com/software/headless-cms/tina-cms/free-plan/) (third-party; check tinacms.org before relying on it).
- [About Git Large File Storage](https://help.github.com/articles/about-large-file-storage) (GitHub).
