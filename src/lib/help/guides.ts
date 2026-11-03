// Star's guides as help pages on the site (docs/specs/content-editing-help-links.md, AC-1 to AC-5,
// AC-10). Pure: renders a guide's Markdown to HTML, with GitHub's section ids, links between guides
// rewritten to /help/… and checked, and tables wrapped in a focusable, named box.
// STUB: tests first.

/** The guides built into /help, in the order Star needs them (design-help-links). */
export const GUIDE_NAMES = [] as readonly string[];

export interface Section {
  id: string;
  title: string;
}

export interface Guide {
  name: string;
  title: string;
  summary: string;
  sections: Section[];
  html: string;
}

/** A guide's front matter `summary`, title (its `#` heading) and `##` sections, with GitHub's ids. */
export function outline(_markdown: string): { title: string; summary: string; sections: Section[]; ids: string[] } {
  throw new Error('not implemented');
}

/** Renders one guide; `known` maps each built guide to its section ids, for checking links. */
export function renderGuide(_name: string, _markdown: string, _known: Record<string, string[]>): Guide {
  throw new Error('not implemented');
}

/** Renders every guide in GUIDE_NAMES, reading each file with `read`. Throws on a broken link. */
export function loadGuides(_read: (name: string) => string): Guide[] {
  throw new Error('not implemented');
}

/** Why `/help/…` address `path` goes nowhere, or undefined when it names a built guide and section. */
export function addressProblem(_path: string, _guides: Guide[]): string | undefined {
  throw new Error('not implemented');
}
