---
id: requirements-shop
status: draft
derived-from:
  - concept:
---

# Shop requirements

<!-- Drafted by bootstrap from src/pages/shop.astro. -->

## REQ-shop-1: Products by category

The shop lists every product in the CMS, grouped by category (print, sticker, digital, commission), with its image, name, price, and description. With no products it shows an empty-state message.

## REQ-shop-2: A way to buy

Each product with a purchase link shows a button that opens where it can be bought, and the page links to Star's whole shop. (Today: "Buy on Ko-fi ↗" links, and nothing is paid for on this site.)

## Open questions

1. Should stock (`inventory` in the schema) be shown, for example "sold out"?
2. Ko-fi, another storefront (for example a print-on-demand service), or an on-site cart and checkout? The concept's open question 1 decides this.
