# Working on this repository

The process is rules-for-robots (`.rfr/`, `docs/product/process.yml`): stories, designs with mock-ups, user guides, specs with tests first, each approved by the lead's merge.

## Standing decisions from the lead

- **Every new guide for Star joins the site's online help** (2026-11-03). A guide added to `docs/user/` for Star also gets:
  - a `summary:` line in its front matter;
  - its name in `GUIDE_NAMES` (`src/lib/help/guides.ts`), in the order Star needs it;
  - its title and address in the editor's **Help** menu (`HELP_MENU`, `sanity-studio/lib/help.ts`);
  - links from the item types it covers (`ITEM_HELP`), when it's the guide for them.

  A feature's design says where its guide sits in the help. Fans' guides (like `reading-comics.md`) go in `FAN_GUIDES` instead. `tests/unit/help-every-guide.test.ts` fails if a guide is in neither list.

- **A test change that follows an approved spec doesn't ask** (2026-11-09). When an approved behaviour change needs an existing test changed, first add an entry to that spec's `unlocks:` front matter, then edit the test. The rfr-core test guard (TEST-001) lets the edit through only when it finds the entry, so:
  - one file per entry: `- tests/unit/example.test.ts: why it changes (AC-3)`;
  - the reason cites a criterion ID from the spec's own table;
  - the entry is on the branch before the edit, not added afterwards.

  A test change that no spec criterion explains still goes to the lead.
