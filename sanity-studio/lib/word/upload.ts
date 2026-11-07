// A Word document as a story's text: the reader's HTML through the paste rules (pasteHtml, with pictures kept),
// the first line that repeats the title left out, and the counts the note and the question need. Pure; the editor
// loads it only when a document is chosen. Spec: docs/specs/story-import-word.md AC-5 to AC-11.
import { pasteHtml } from '../story-paste';
import type { Block } from '../stories';
import { altFromWord } from './pictures';
import { readDocx, WordProblem, type PictureFailure, type WordFacts, type WordPicture } from './read-docx';

export { WordProblem };

/** A picture as it comes in: Word's picture and what it said, with the alt text that counts. */
export interface IncomingPicture extends WordPicture {
  alt?: string;
  fromWord: boolean;
}

export interface WordCounts {
  paragraphs: number;
  sceneBreaks: number;
  pictures: number;
  italics: boolean;
  bold: boolean;
}

export interface WordDocument {
  /** The text: paragraphs, scene breaks, and pictures as `{ _type: 'storyPicture', picture: n }`, n into `pictures`. */
  blocks: Block[];
  pictures: IncomingPicture[];
  failed: { number: number; reason: PictureFailure }[];
  firstLine?: string;
  counts: WordCounts;
  facts: WordFacts;
}

export interface Titles {
  number?: number;
  title?: string;
  /** On a one-shot, the story's title. */
  story?: string;
}

const norm = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/** AC-10: a first line that's the chapter's label, "Chapter 3", its title, or a one-shot's story title. */
export function leftOutFirstLine(line: string, titles: Titles): boolean {
  const text = norm(line);
  if (!text) return false;
  const names: string[] = [];
  if (titles.number !== undefined) {
    names.push(`chapter ${titles.number}`);
    if (titles.title) names.push(`chapter ${titles.number} ${norm(titles.title)}`);
  }
  if (titles.title) names.push(norm(titles.title));
  if (titles.story) names.push(norm(titles.story));
  return names.includes(text);
}

const textOf = (block: Block) => (block.children ?? []).map((c) => c.text).join('');

export function readWordDocument(
  bytes: Uint8Array,
  options: { parseXml: (xml: string) => Document; parseHtml: (html: string) => Document; titles: Titles; key?: () => string },
): WordDocument {
  const read = readDocx(bytes, options.parseXml);
  let blocks = pasteHtml(read.html, options.parseHtml, options.key);
  let firstLine: string | undefined;
  const firstText = blocks.findIndex((b) => b._type === 'block');
  if (firstText >= 0 && leftOutFirstLine(textOf(blocks[firstText]), options.titles)) {
    firstLine = textOf(blocks[firstText]).trim();
    blocks = blocks.filter((_, i) => i !== firstText);
    // A scene break left at the start goes too.
    while (blocks[0]?._type === 'sceneBreak') blocks = blocks.slice(1);
  }
  const headings = [...read.facts.headings];
  if (firstLine !== undefined && headings[0] === firstLine) headings.shift();
  const spans = blocks.flatMap((b) => (b._type === 'block' ? (b.children ?? []) : []));
  const counts: WordCounts = {
    paragraphs: blocks.filter((b) => b._type === 'block').length,
    sceneBreaks: blocks.filter((b) => b._type === 'sceneBreak').length,
    pictures: blocks.filter((b) => b._type === 'storyPicture').length,
    italics: spans.some((s) => s.marks?.includes('em')),
    bold: spans.some((s) => s.marks?.includes('strong')),
  };
  if (counts.paragraphs === 0 && counts.pictures === 0) throw new WordProblem('empty');
  const pictures = read.pictures.map((p) => {
    const alt = altFromWord(p.wordAlt);
    return { ...p, alt, fromWord: !!alt };
  });
  return { blocks, pictures, failed: read.failed, firstLine, counts, facts: { ...read.facts, headings } };
}
