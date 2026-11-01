---
id: requirements-shop
status: approved
derived-from:
  - concept: 71f8899f4b90
---

# Shop requirements

<!-- Drafted by bootstrap from src/pages/shop.astro. -->

## REQ-shop-1: Products by category

The shop lists every product, grouped by category (print, sticker, digital, commission), with its image, name, price, and description. With no products it shows an empty-state message.

## REQ-shop-2: Buying on the site

A visitor can add products to a cart, review it, and pay without leaving the site, and receives a confirmation of the order. (Today products link out to Ko-fi and nothing is paid for on this site, so this is unmet.)

## Open questions

1. Should stock (`inventory` in the schema) be shown, for example "sold out", and stop sales at zero?
2. Which payment provider, and who handles sales tax, shipping rates, and fulfilment (Star, or a print-on-demand service)?
3. Do Ko-fi links stay for tips or for some products?
