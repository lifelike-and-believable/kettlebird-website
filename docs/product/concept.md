---
id: concept
status: draft
---

# Kettlebird Creations website

<!-- Drafted by bootstrap from README.md, docs/PROJECT_PLAN.md, docs/CONTENT_STRATEGY.md,
docs/TECHNICAL_ARCHITECTURE.md, and the code in src/. Those docs are partly out of date; where they
disagree with the code, this draft follows the code and says so. The tools in use today (Astro,
Sanity, Ko-fi, AO3, email) are how the site works now, not commitments: requirements say what must be
true for users, and a better tool can replace any of these. -->

## Problem

Star Goldberg (Kettlebird Creations) is a writer and illustrator working toward graphic novels. Their work is spread across Tumblr, Bluesky, Instagram, Ko-fi, and AO3 (docs/PROJECT_PLAN.md, "Project Overview"; social links in src/layouts/BaseLayout.astro). Someone who finds one piece has no single place to see the rest, judge Star's range before commissioning, read the comics, or buy prints. Star is not a developer and needs to keep that place current without asking one (docs/Technical_Specification.md, overview).

## Audience

- **Fans and readers** who want to browse the art, read comics and stories, and support Star by buying merch (docs/CONTENT_STRATEGY.md, readership and Ko-fi measures).
- **Prospective commission clients** who need to see examples, prices, and how to order (src/pages/commissions.astro; docs/PROJECT_PLAN.md, commission questions).
- **Star, as the site's content editor** (sanity-studio/; docs/CONTENT_STRATEGY.md, update schedule).

## Vision

One home for everything Star makes, in a hand-drawn, textured style that feels like their work. Visitors can browse the portfolio, read comics and stories, see what is for sale, and start a commission, on any device and with assistive technology. Star publishes new work and updates the site's own text without code changes or help from a developer.

## Non-goals

- **Accounts, comments, or a client portal.** Listed only as "Phase 2 possibilities" in docs/TECHNICAL_ARCHITECTURE.md.
- **Content outside Star's commission limits** (NSFW, hateful content, and others listed in docs/CONTENT_STRATEGY.md).

## Open questions

1. **Selling.** Today the shop links out to Ko-fi and nothing is paid for on the site. The original plan had a cart and checkout. Should the site take payments itself, use a different storefront, or stay with Ko-fi? (Decides whether "no on-site payments" becomes a non-goal.)
2. **Stories.** Today stories link out to AO3. The plan had an on-site page-flip reader. Read on the site, on AO3, or both?
3. **Comics.** The comic reader is planned and modelled in the CMS, but the reader route builds no pages, so every series link is broken. Is it the top priority among the unfinished features?
4. **Commissions.** Should a request form replace or supplement email, as docs/PROJECT_PLAN.md planned?
5. **Editing.** The commission open/closed banner, the about page, and the social links can only be changed in code. Should Star be able to edit them?
6. **Hosting.** Both Vercel and Netlify are configured, differently. Which is production, and is there a live URL?
