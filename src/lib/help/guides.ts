// Star's guides as help pages on the site (docs/specs/content-editing-help-links.md, AC-1 to AC-5,
// AC-10). Pure: renders a guide's Markdown to HTML, with GitHub's section ids, links between guides
// rewritten to /help/… and checked, and tables wrapped in a focusable, named box.
import GithubSlugger from 'github-slugger';
import type { Element, Root as HastRoot } from 'hast';
import type { Heading, Link, Root as MdastRoot } from 'mdast';
import { toString } from 'mdast-util-to-string';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

/** The guides built into /help, in the order Star needs them (design-help-links). */
/** Guides in docs/user written for fans, not Star; they aren't help pages. Every other guide must be in GUIDE_NAMES. */
export const FAN_GUIDES = ['reading-comics'] as const;

export const GUIDE_NAMES = ['getting-started', 'editing-your-site', 'publishing-comics', 'publishing-stories', 'site-settings', 'previewing', 'going-live'] as const;

export interface Section {
  id: string;
  title: string;
}

export interface Guide {
  name: string;
  title: string;
  summary: string;
  sections: Section[];
  /** Every heading's id, for checking addresses. */
  ids: string[];
  html: string;
}

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;
const GUIDE_LINK = /^([a-z0-9-]+)\.md(?:#(.+))?$/;

function split(markdown: string): { summary: string; body: string } {
  const match = FRONT_MATTER.exec(markdown);
  const summary = match ? (/^summary: "(.*)"$/m.exec(match[1])?.[1] ?? '') : '';
  return { summary, body: match ? markdown.slice(match[0].length) : markdown };
}

/** Parses the body and gives every heading GitHub's id, in document order. */
function parse(body: string): MdastRoot {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body);
  const slugger = new GithubSlugger();
  visit(tree, 'heading', (node: Heading) => {
    node.data = { ...node.data, hProperties: { id: slugger.slug(toString(node)) } };
  });
  return tree;
}

const idOf = (node: Heading) => String((node.data?.hProperties as { id: string }).id);

/** A guide's front matter `summary`, title (its `#` heading) and `##` sections, with GitHub's ids. */
export function outline(markdown: string): { title: string; summary: string; sections: Section[]; ids: string[] } {
  const { summary, body } = split(markdown);
  const headings: Heading[] = [];
  visit(parse(body), 'heading', (node: Heading) => {
    headings.push(node);
  });
  const h1 = headings.find((h) => h.depth === 1);
  return {
    title: h1 ? toString(h1) : '',
    summary,
    sections: headings.filter((h) => h.depth === 2).map((h) => ({ id: idOf(h), title: toString(h) })),
    ids: headings.map(idOf),
  };
}

/** "What you see, what it means, what to do", from a table's header cells; empty cells are skipped. */
function tableName(table: Element): string {
  const cells: string[] = [];
  visit(table, { tagName: 'th' }, (node: Element) => {
    cells.push(toString(node));
  });
  const named = cells.filter((text) => text !== '');
  return named.map((text, i) => (i === 0 ? text : text.charAt(0).toLowerCase() + text.slice(1))).join(', ');
}

function wrapTables() {
  return (tree: HastRoot) => {
    visit(tree, { tagName: 'table' }, (node: Element, index, parent) => {
      parent!.children[index!] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['help-table'], role: 'region', tabIndex: 0, ariaLabel: tableName(node) },
        children: [node],
      };
    });
  };
}

/** Renders one guide; `known` maps each built guide to its section ids, for checking links. */
export function renderGuide(name: string, markdown: string, known: Record<string, string[]>): Guide {
  const { title, summary, sections, ids } = outline(markdown);
  const tree = parse(split(markdown).body);
  const h1 = tree.children.find((node) => node.type === 'heading' && node.depth === 1);
  tree.children = tree.children.filter((node) => node !== h1);
  visit(tree, 'link', (node: Link) => {
    const fail = (reason: string) => {
      throw new Error(`${name}: the link to ${node.url} ${reason}`);
    };
    if (node.url.startsWith('#')) {
      if (!ids.includes(node.url.slice(1))) fail('goes to no section of this guide');
      return;
    }
    const match = GUIDE_LINK.exec(node.url);
    if (!match) return;
    const [, target, section] = match;
    if (!(target in known)) fail("goes to a guide that isn't a help page");
    if (section && !known[target].includes(section)) fail(`goes to no section of ${target}`);
    node.url = `/help/${target}${section ? `#${section}` : ''}`;
  });
  const hast = unified().use(remarkRehype).use(wrapTables).runSync(tree) as HastRoot;
  const html = unified().use(rehypeStringify).stringify(hast);
  return { name, title, summary, sections, ids, html };
}

/** Renders every guide in GUIDE_NAMES, reading each file with `read`. Throws on a broken link. */
export function loadGuides(read: (name: string) => string): Guide[] {
  const sources = GUIDE_NAMES.map((name) => [name, read(name)] as const);
  const known = Object.fromEntries(sources.map(([name, markdown]) => [name, outline(markdown).ids]));
  return sources.map(([name, markdown]) => renderGuide(name, markdown, known));
}

/** Why `/help/…` address `path` goes nowhere, or undefined when it names a built guide and section. */
export function addressProblem(path: string, guides: Guide[]): string | undefined {
  if (path === '/help') return undefined;
  const match = /^\/help\/([a-z0-9-]+)(?:#(.+))?$/.exec(path);
  if (!match) return `${path} isn't a help address`;
  const guide = guides.find((g) => g.name === match[1]);
  if (!guide) return `${path}: ${match[1]} isn't a help page`;
  if (match[2] && !guide.ids.includes(match[2])) return `${path}: ${match[1]} has no section ${match[2]}`;
  return undefined;
}

