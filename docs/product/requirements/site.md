---
id: requirements-site
status: approved
derived-from:
  - concept: 71f8899f4b90
---

# Site-wide requirements

<!-- Drafted by bootstrap. Describes current behaviour (src/layouts/BaseLayout.astro,
src/styles/global.css, src/lib/sanity.ts), not plans. -->

## REQ-site-1: Main navigation

Every page shows navigation to Portfolio, Comics, Writing, Shop, Commissions, About, and News, and the site title links to the home page. On narrow screens the navigation collapses behind a menu button that reports its state with `aria-expanded`.

## REQ-site-2: Skip link

The first focusable element on every page is a "Skip to main content" link that moves focus to the main content.

## REQ-site-3: Social and contact links

Every page's footer links to Star's Bluesky, Tumblr, Instagram, and Ko-fi profiles (opening in a new tab) and to kettlebirdillustration@gmail.com by `mailto:`.

## REQ-site-4: Keyboard focus and reduced motion

Every interactive element shows a visible focus indicator when reached by keyboard (but not on mouse click), and animations are reduced when the visitor's system asks for reduced motion.

## REQ-site-5: Builds without the CMS

The site builds and every page renders when the content source is unreachable or not configured; pages with no content show an empty-state message instead of failing.

## REQ-site-6: Search engines and link previews

Every public page has a canonical address, a link preview (with the site card when there's no other picture) and, where it applies, structured data; the build writes `robots.txt` and a sitemap. Search engines are asked not to list the site unless its address is `https://kettlebird.com` (design-site-search, docs/specs/site-search.md).

## Constraints

- Current implementation, not a commitment: a static Astro build (astro.config.mjs) that reads content from Sanity at build time, so new content appears after a rebuild.
- WCAG 2.1 AA is the stated accessibility target (docs/PROJECT_PLAN.md).
- Vercel is the production host (concept, decision 7).

## Success measures

- Lighthouse accessibility score of 90 or more on every page (target from docs/PROJECT_PLAN.md; not measured today).

## Open questions

1. Is WCAG 2.1 AA still the target, or 2.2 AA?
2. Should pages have social sharing previews (Open Graph), a sitemap, and a favicon? Answered: all three exist (design-comic-share-and-announce, design-home-tiles-and-icon, design-site-search; REQ-site-6).
