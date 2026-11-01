---
id: requirements-content-editing
status: approved
derived-from:
  - concept: 71f8899f4b90
---

# Content editing requirements

<!-- Drafted by bootstrap from sanity-studio/ and src/lib/. -->

## REQ-content-editing-1: Publishing without a developer

Star can add, edit, and remove gallery items, comic series and pages, written works, products, and commission types without code changes or a developer; the site shows the change after its next build. (Today: Sanity Studio.)

## REQ-content-editing-2: Alt text

A gallery item's alt text (up to 240 characters) is used as the image's alternative text in the portfolio and its dialog; an item without alt text falls back to its title. Comic pages also have an alt text field, unused until a comic reader exists.

## REQ-content-editing-3: Site text

Star can change, without a developer, whether commissions are open, the about page (bio, artist statement, portrait, and quick facts), the home page's artist text, and the social links. (Unmet today: all four are in code.)

## Constraints

- Current implementation, not a commitment: Sanity Studio, project `gtopiz2h`, dataset `production` (sanity-studio/sanity.config.ts). Content currently lives there, so a change of CMS needs a migration.

## Open questions

1. How does a content change reach the live site: a webhook that triggers a rebuild, or a manual deploy? Nothing in the repository sets this up.
2. Is alt text required before publishing? Today it is optional.
3. Which CMS? The concept's decision 6 calls for comparing Sanity with simpler alternatives (for example a Git-based CMS) before more is built on it. How much content is in Sanity today?
