---
id: requirements-content-editing
status: draft
derived-from:
  - concept:
---

# Content editing requirements

<!-- Drafted by bootstrap from sanity-studio/ and src/lib/. -->

## REQ-content-editing-1: Publishing without a developer

Star can add, edit, and remove gallery items, comic series and pages, written works, products, and commission types without code changes or a developer; the site shows the change after its next build. (Today: Sanity Studio.)

## REQ-content-editing-2: Alt text

A gallery item's alt text (up to 240 characters) is used as the image's alternative text in the portfolio and its dialog; an item without alt text falls back to its title. Comic pages also have an alt text field, unused until a comic reader exists.

## Constraints

- Current implementation, not a commitment: Sanity Studio, project `gtopiz2h`, dataset `production` (sanity-studio/sanity.config.ts). Content currently lives there, so a change of CMS needs a migration.

## Open questions

1. How does a content change reach the live site: a webhook that triggers a rebuild, or a manual deploy? Nothing in the repository sets this up.
2. The about page text, portrait, commission status, and social links can only be changed in code. Which of these should Star be able to edit?
3. Is alt text required before publishing? Today it is optional.
4. Is Sanity the right CMS for a single non-technical editor, or would something simpler (for example a Git-based CMS, or Markdown files with a visual editor) serve Star better? How much content is in Sanity today?
