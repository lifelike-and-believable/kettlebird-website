---
id: requirements-commissions
status: draft
derived-from:
  - concept:
---

# Commissions requirements

<!-- Drafted by bootstrap from src/pages/commissions.astro. -->

## REQ-commissions-1: Open or closed

The commissions page states at the top whether commissions are open, with a way to get in touch.

## REQ-commissions-2: Types and prices

The page lists each commission type from the CMS, in Star's chosen order, with its name, price range, description, example images, and delivery time. The section is hidden when there are none.

## REQ-commissions-3: How ordering works

The page explains the steps of a commission (email, invoice and deposit, sketch approval, delivery) and ends with an email link to start one.

## Open questions

1. The open/closed banner is hardcoded and says "open". Should Star be able to change it without a code change?
2. Terms of service say "coming soon". Who writes them, and are they a launch blocker?
3. Should a request form (type, size, deadline, references) replace or supplement email?
