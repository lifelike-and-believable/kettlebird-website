// Writing from Word documents, in the editor: the reader, the clean-up, pictures, the note, the messages, the
// question, the upload line and undo. Criteria: docs/specs/story-import-word.md. The sample documents are made by
// tests/fixtures/word/make-docx.mjs.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { pasteHtml } from '../../sanity-studio/lib/story-paste';
import { firstChapterFrom, HAS_CHAPTERS_NOTE, type Block } from '../../sanity-studio/lib/stories';
import {
  ACCEPT,
  addedTime,
  CHAPTER_TEXT_HELP,
  DROP_OVER,
  dropEmpty,
  fileProblem,
  ONE_SHOT_TEXT_HELP,
  readingLine,
  readProblem,
  replaceQuestion,
  UNDO_QUESTION,
  UPLOAD_BUTTON,
  UPLOAD_HINT,
  uploadLine,
  uploadNote,
} from '../../sanity-studio/lib/word/messages';
import {
  ALT_MISSING_LINE,
  altCountLine,
  altFromWord,
  altLabel,
  DECORATIVE_LABEL,
  editedSince,
  matchPictures,
  needsAlt,
  pictureAssets,
  pictureHash,
  resaveSize,
  resaveType,
  undoFrom,
  undoSnapshot,
  unusedPictures,
  type PictureSettings,
} from '../../sanity-studio/lib/word/pictures';
import { readDocx, WordProblem } from '../../sanity-studio/lib/word/read-docx';
import { STORY_PICTURE_TYPE, TEXT_UPLOAD_FIELD } from '../../sanity-studio/lib/word/schema';
import { readWordDocument, type WordDocument } from '../../sanity-studio/lib/word/upload';

// jsdom has no types here, as in story-editor.test.ts.
const { JSDOM } = createRequire(import.meta.url)('jsdom') as { JSDOM: new (html: string) => { window: Window & typeof globalThis } };
const window = new JSDOM('').window;
const parseXml = (xml: string) => new window.DOMParser().parseFromString(xml, 'application/xml');
const parseHtml = (html: string) => new JSDOM(html).window.document;
const sample = (name: string) => new Uint8Array(readFileSync(`tests/fixtures/word/${name}`));
let n = 0;
const key = () => `k${n++}`;
const read = (name: string, titles: Parameters<typeof readWordDocument>[1]['titles'] = { number: 3, title: 'Over the Ridge' }): WordDocument =>
  readWordDocument(sample(name), { parseXml, parseHtml, titles, key });

/** Blocks as short strings: a paragraph's text with *em* and **strong** marked, "⁂" for a scene break, "[picture n]". */
function shapes(blocks: Block[]): string[] {
  return blocks.map((b) => {
    if (b._type === 'sceneBreak') return '⁂';
    if (b._type === 'storyPicture') return `[picture ${(b as Block & { picture: number }).picture + 1}]`;
    return (b.children ?? [])
      .map((c) => {
        let t = c.text;
        if (c.marks?.includes('strong')) t = `**${t}**`;
        if (c.marks?.includes('em')) t = `*${t}*`;
        return t;
      })
      .join('');
  });
}

describe('story-import-word#AC-1 AC-2 AC-17 texts', () => {
  it('has the upload button, its line and the drop space', () => {
    expect(UPLOAD_BUTTON).toBe('Upload a Word document');
    expect(UPLOAD_HINT).toBe('.docx, or drop one below');
    expect(dropEmpty('chapter')).toBe("No text yet. Drop the chapter's .docx here, or use Upload a Word document.");
    expect(dropEmpty('story')).toBe("No text yet. Drop the story's .docx here, or use Upload a Word document.");
    expect(DROP_OVER).toBe('Drop the file here');
    expect(ACCEPT).toBe('.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });

  it("has the design's help texts", () => {
    expect(CHAPTER_TEXT_HELP).toBe(
      "Upload the chapter as a Word document (.docx). Its text and pictures come in; Word's layout and picture sizes don't. To change them, change the document and upload it again.",
    );
    expect(ONE_SHOT_TEXT_HELP).toBe('For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead.');
  });

  it("says how to make a story in chapters a one-shot again", () => {
    expect(HAS_CHAPTERS_NOTE).toBe(
      'This story has chapters, so its text is in them. To make it a one-shot again, remove its chapters and upload the whole story here.',
    );
  });

  it('says what it is reading', () => {
    expect(readingLine('The Long Road 3.docx')).toBe('Reading The Long Road 3.docx…');
    expect(readingLine('The Long Road 3.docx', 1, 2)).toBe('Reading The Long Road 3.docx… adding picture 1 of 2.');
  });

  it('loads the Word reader only when used', () => {
    const input = readFileSync('sanity-studio/components/StoryTextInput.tsx', 'utf8');
    expect(input).not.toMatch(/^import .*lib\/word\/(read-docx|upload)/m);
    expect(input).toMatch(/import\(['"]\.\.\/lib\/word\/upload['"]\)/);
  });
});

describe('story-import-word#AC-3 schema', () => {
  it('adds a picture block to the text', () => {
    expect(STORY_PICTURE_TYPE.name).toBe('storyPicture');
    const fields = Object.fromEntries(STORY_PICTURE_TYPE.fields.map((f) => [f.name, f]));
    expect(Object.keys(fields)).toEqual(['image', 'alt', 'decorative', 'fromWord', 'wordAlt', 'wordDecorative', 'hash', 'edited']);
    expect(fields.image).toMatchObject({ type: 'image' });
    expect(fields.alt).toMatchObject({ type: 'string', title: 'Alt text' });
    expect(fields.decorative).toMatchObject({ type: 'boolean', title: 'Decorative' });
    for (const hidden of ['fromWord', 'wordAlt', 'wordDecorative', 'hash', 'edited']) expect(fields[hidden], hidden).toMatchObject({ hidden: true });
    const text = readFileSync('sanity-studio/schemas/objects/storyText.ts', 'utf8');
    expect(text).toContain('STORY_PICTURE_TYPE');
  });

  it('keeps the upload with a story and a chapter, hidden', () => {
    expect(TEXT_UPLOAD_FIELD).toMatchObject({ name: 'textUpload', type: 'object', hidden: true });
    expect(TEXT_UPLOAD_FIELD.fields.map((f) => [f.name, f.type])).toEqual([
      ['fileName', 'string'],
      ['addedAt', 'datetime'],
      ['note', 'array'],
      ['noteClosed', 'boolean'],
      ['previous', 'text'],
      ['discarded', 'array'],
    ]);
    for (const schema of ['writtenWork', 'storyChapter']) {
      expect(readFileSync(`sanity-studio/schemas/objects/${schema}.ts`, 'utf8'), schema).toContain('TEXT_UPLOAD_FIELD');
    }
  });
});

describe('story-import-word#AC-4 file checks', () => {
  const MB = 1024 * 1024;
  it('lets a .docx up to 50 MB through', () => {
    expect(fileProblem({ name: 'The Long Road 3.docx', size: 1000 }, 'chapter')).toBeNull();
    expect(fileProblem({ name: 'SHOUT.DOCX', size: 50 * MB }, 'chapter')).toBeNull();
  });

  it("gives the design's message for each wrong file", () => {
    expect(fileProblem({ name: 'Notes.pdf', size: 10 }, 'chapter')).toBe(
      "Notes.pdf isn't a Word document. Upload the chapter as a .docx: in Word, File, Save As, Word Document; in Google Docs, File, Download, Microsoft Word (.docx).",
    );
    expect(fileProblem({ name: 'Notes.txt', size: 10 }, 'story')).toBe(
      "Notes.txt isn't a Word document. Upload the story as a .docx: in Word, File, Save As, Word Document; in Google Docs, File, Download, Microsoft Word (.docx).",
    );
    expect(fileProblem({ name: 'The Long Road 3.doc', size: 10 }, 'chapter')).toBe(
      'The Long Road 3.doc is an older Word file, which can\'t be read here. Open it in Word or Google Docs, save or download it as .docx, and upload that.',
    );
    expect(fileProblem({ name: 'The Long Road 3.gdoc', size: 10 }, 'chapter')).toBe(
      'The Long Road 3.gdoc is a link to a Google Doc, not the document. In Google Docs, choose File, Download, Microsoft Word (.docx), and upload that.',
    );
    expect(fileProblem({ name: 'The Long Road 3.docx', size: 50 * MB + 1 }, 'chapter')).toBe(
      'The Long Road 3.docx is over 50 MB, too big to read here. Make its pictures smaller in Word (Compress Pictures), or split the chapter.',
    );
    expect(fileProblem({ name: 'docx', size: 10 }, 'chapter')).toContain("docx isn't a Word document.");
  });
});

describe('story-import-word#AC-5 reading problems', () => {
  it('knows a locked document, and one it cannot read', () => {
    expect(() => readDocx(sample('locked.docx'), parseXml)).toThrow(WordProblem);
    try {
      readDocx(sample('locked.docx'), parseXml);
    } catch (e) {
      expect((e as WordProblem).kind).toBe('locked');
    }
    for (const bad of [sample('broken.docx'), new Uint8Array(), new Uint8Array([0x50, 0x4b, 3, 4, 0, 0])]) {
      try {
        readDocx(bad, parseXml);
        throw new Error('read');
      } catch (e) {
        expect((e as WordProblem).kind).toBe('unreadable');
      }
    }
  });

  it('knows a document with no words and no pictures', () => {
    try {
      read('empty.docx');
      throw new Error('read');
    } catch (e) {
      expect((e as WordProblem).kind).toBe('empty');
    }
    expect(read('pictures-only.docx').pictures).toHaveLength(1);
  });

  it("gives the design's messages", () => {
    expect(readProblem('locked', 'The Long Road 3.docx')).toBe('The Long Road 3.docx is locked with a password. Save an unlocked copy and upload that.');
    expect(readProblem('empty', 'The Long Road 3.docx')).toBe('The Long Road 3.docx has no words in it, so nothing was added.');
    expect(readProblem('unreadable', 'The Long Road 3.docx')).toBe('Something went wrong reading The Long Road 3.docx, and nothing was added. Try again.');
  });
});

describe('story-import-word#AC-6 reading Word', () => {
  it('reads the Word sample in order, as the paste rules make it', () => {
    expect(shapes(read('word-chapter.docx').blocks)).toEqual([
      'The road climbed all morning. *Nobody* spoke.',
      'Mira kept her eyes on the **ridge**, and on the **sky**.',
      '[picture 1]',
      'Dear Tam,\nThe kettle is still singing.\nLove, M.',
      '⁂',
      'They camped by the stream[1].',
      '[picture 2]',
      '⁂',
      'Morning came grey. Then it rained.',
      'Morning',
      '[picture 3]',
      '⁂',
      'A new scene.[2]',
      '[picture 4]',
      '⁂',
      'The Ridge',
      'Day · Miles',
      'Monday · 12',
      'x',
      'She looked back at the valley.',
      'A sentence with a comment.',
      '[picture 5]',
      '[picture 6]',
      'They walked on.',
      'The sun came out.',
      'Mira sang.',
      'Tam would have laughed.',
      'The end of the chapter.',
      '[1] A cold one.',
      '[2] Written in the snow.',
    ]);
  });

  it('reads the Google Docs sample', () => {
    expect(shapes(read('gdocs-chapter.docx', { number: 4 }).blocks)).toEqual([
      'The fox came back at *dusk*.',
      'It was **very** hungry.',
      '[picture 1]',
      '⁂',
      'Mira fed it. Bread and cheese.',
      '[picture 2]',
    ]);
  });

  it('makes scene breaks of gaps, and none at the end', () => {
    expect(shapes(read('spacing.docx').blocks)).toEqual([
      'Line 1 of a double-spaced chapter.', '⁂', 'Line 2 of a double-spaced chapter.', '⁂', 'Line 3 of a double-spaced chapter.', '⁂',
      'Line 4 of a double-spaced chapter.', '⁂', 'Line 5 of a double-spaced chapter.', '⁂', 'Line 6 of a double-spaced chapter.',
    ]);
  });

  it('says what it flattened, left out and accepted', () => {
    const { facts } = readDocx(sample('word-chapter.docx'), parseXml);
    expect(facts).toEqual({
      headings: ['Chapter 3: Over the Ridge', 'Morning', 'The Ridge'],
      tables: 1,
      footnotes: 2,
      tracked: true,
      leftOut: { textBox: 1, table: 1, drawing: 2 },
    });
    expect(readDocx(sample('gdocs-chapter.docx'), parseXml).facts).toEqual({
      headings: [], tables: 0, footnotes: 0, tracked: true, leftOut: { textBox: 0, table: 0, drawing: 0 },
    });
    expect(readDocx(sample('spacing.docx'), parseXml).facts.tracked).toBe(false);
  });

  it('leaves out the header, the comment, the text box and deleted text', () => {
    const all = shapes(read('word-chapter.docx').blocks).join('\n');
    for (const gone of ['The Long Road', 'A note in a box', 'Then it snowed', 'Chapter 3']) expect(all, gone).not.toContain(gone);
  });
});

describe('story-import-word#AC-7 same as pasting', () => {
  it('gives the same blocks as the same chapter pasted from Google Docs', () => {
    const html =
      '<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-1"><p dir="ltr"><span>The fox came back at </span><span style="font-style:italic;">dusk</span><span>.</span></p>' +
      '<p dir="ltr"><span>It was </span><span style="font-weight:700;">very</span><span> hungry.</span></p><p dir="ltr"><span>***</span></p>' +
      '<p dir="ltr"><span>Mira fed it. Bread and cheese.</span></p></b>';
    const pasted = shapes(pasteHtml(html, parseHtml));
    const uploaded = shapes(read('gdocs-chapter.docx', { number: 4 }).blocks).filter((s) => !s.startsWith('[picture'));
    expect(uploaded).toEqual(pasted);
  });
});

describe('story-import-word#AC-8 pictures', () => {
  const doc = read('word-chapter.docx');
  it('brings in the pictures it can, in order, with what Word said about them', () => {
    expect(doc.pictures.map((p) => ({ type: p.type, wordAlt: p.wordAlt, decorative: p.decorative, cropped: p.cropped, moved: p.moved }))).toEqual([
      { type: 'image/jpeg', wordAlt: 'A map of the valley, with the road marked in red', decorative: false, cropped: false, moved: false },
      { type: 'image/png', wordAlt: 'A fox sitting in tall grass\n\nDescription automatically generated', decorative: false, cropped: false, moved: true },
      { type: 'image/png', wordAlt: 'A letter in faded ink', decorative: false, cropped: true, moved: false },
      { type: 'image/png', wordAlt: '', decorative: true, cropped: false, moved: false },
      { type: 'image/jpeg', wordAlt: 'The map again', decorative: false, cropped: false, moved: false },
      { type: 'image/jpeg', wordAlt: 'IMG_2041.jpg', decorative: false, cropped: false, moved: false },
    ]);
  });

  it('brings a picture used twice in twice, with the same data', async () => {
    expect(await pictureHash(doc.pictures[0].data)).toBe(await pictureHash(doc.pictures[4].data));
    expect(await pictureHash(doc.pictures[0].data)).not.toBe(await pictureHash(doc.pictures[1].data));
    expect(await pictureHash(doc.pictures[0].data)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("lists a picture it can't add, numbered among the document's pictures", () => {
    expect(doc.failed).toEqual([{ number: 7, reason: 'drawing' }]);
  });

  it('counts a picture as moved when it shares a paragraph, and in place when alone', () => {
    const gd = read('gdocs-chapter.docx', { number: 4 });
    expect(gd.pictures.map((p) => p.moved)).toEqual([false, false]);
    expect(doc.pictures.filter((p) => p.moved)).toHaveLength(1);
  });
});

describe('story-import-word#AC-9 alt text', () => {
  it("takes Word's description, trimmed", () => {
    expect(altFromWord('  A map of the valley ')).toBe('A map of the valley');
    expect(altFromWord('Line one\nline two')).toBe('Line one\nline two');
  });

  it("leaves out Word's automatic alt text, a file name, and nothing", () => {
    for (const auto of [
      'A fox sitting in tall grass\n\nDescription automatically generated',
      'A picture containing text\n\nDescription generated with high confidence',
      'A dog\n\nDESCRIPTION GENERATED WITH VERY HIGH CONFIDENCE',
      'IMG_2041.jpg',
      'image1.png',
      'Scan 2.JPEG',
      'photo.webp',
      '   ',
      '',
      undefined,
    ]) {
      expect(altFromWord(auto), String(auto)).toBeUndefined();
    }
    expect(altFromWord('A map.png of the valley')).toBe('A map.png of the valley');
  });

  it('marks what came from Word, and ticks Decorative from Word', () => {
    const doc = read('word-chapter.docx');
    expect(doc.pictures.map((p) => [p.alt, p.fromWord, p.decorative])).toEqual([
      ['A map of the valley, with the road marked in red', true, false],
      [undefined, false, false],
      ['A letter in faded ink', true, false],
      [undefined, false, true],
      ['The map again', true, false],
      [undefined, false, false],
    ]);
  });
});

describe('story-import-word#AC-10 first line', () => {
  it("leaves out a first line that is the chapter's label, number or title", () => {
    expect(read('word-chapter.docx').firstLine).toBe('Chapter 3: Over the Ridge');
    expect(read('word-chapter.docx', { number: 3 }).firstLine).toBeUndefined();
    expect(read('word-chapter.docx', { number: 2, title: 'Over the Ridge' }).firstLine).toBeUndefined();
    expect(read('gdocs-chapter.docx', { number: 4 }).firstLine).toBeUndefined();
  });

  it('matches ignoring case, spaces and punctuation, as a paragraph too', async () => {
    const { leftOutFirstLine } = await import('../../sanity-studio/lib/word/upload');
    const ch = { number: 3, title: 'Over the Ridge' };
    for (const line of ['Chapter 3: Over the Ridge', 'CHAPTER 3 — OVER THE RIDGE', 'chapter 3', 'Chapter 3.', 'Over the Ridge', ' over  the ridge! ']) {
      expect(leftOutFirstLine(line, ch), line).toBe(true);
    }
    for (const line of ['Chapter 4', 'Chapter 33', 'Over the Ridge we went', 'The road climbed', '']) expect(leftOutFirstLine(line, ch), line).toBe(false);
    expect(leftOutFirstLine('The Long Road', { story: 'The Long Road' })).toBe(true);
    expect(leftOutFirstLine('Chapter 1', { story: 'The Long Road' })).toBe(false);
    expect(leftOutFirstLine('Chapter 1', {})).toBe(false);
  });
});

describe('story-import-word#AC-11 the note', () => {
  it('says what came in and what did not, for the Word sample', () => {
    expect(uploadNote({ fileName: 'word-chapter.docx', doc: read('word-chapter.docx'), what: 'chapter' })).toEqual([
      'Added word-chapter.docx: 20 paragraphs, 4 scene breaks and 6 pictures, with its italics and bold.',
      'Its first line, "Chapter 3: Over the Ridge", was left out, as the chapter\'s title shows it.',
      '2 headings came in as plain paragraphs: "Morning" and "The Ridge".',
      '1 table came in as plain paragraphs, one per row.',
      '2 footnotes came in at the end, numbered.',
      '1 picture that sat beside the text now sits below its paragraph.',
      '1 picture in a text box was left out.',
      '1 picture in a table was left out.',
      '2 drawings or charts made in Word were left out.',
      'Picture 3 is cropped in Word, so the whole picture came in. In Word, choose Compress Pictures, Delete cropped areas, and upload again.',
      '3 alt texts came from Word: check them.',
      'It had tracked changes, and they came in as if accepted: check them, or accept or reject them in Word and upload it again.',
      "Picture 7 in word-chapter.docx couldn't be added (it's a drawing made in Word, which the site can't show), so the chapter was added without it. Save it in the document as a picture (JPEG or PNG) and upload again, or publish without it.",
      'Check the chapter, then publish.',
    ]);
  });

  it('says less when there is less', () => {
    expect(uploadNote({ fileName: 'gdocs-chapter.docx', doc: read('gdocs-chapter.docx', { number: 4 }), what: 'chapter' })).toEqual([
      'Added gdocs-chapter.docx: 3 paragraphs, 1 scene break and 2 pictures, with its italics and bold.',
      '1 alt text came from Word: check it.',
      'It had tracked changes, and they came in as if accepted: check them, or accept or reject them in Word and upload it again.',
      'Check the chapter, then publish.',
    ]);
    expect(uploadNote({ fileName: 'pictures-only.docx', doc: read('pictures-only.docx'), what: 'chapter', onlyOne: true })).toEqual([
      'Only one document at a time: added pictures-only.docx: 1 picture.',
      '1 alt text came from Word: check it.',
      'Check the chapter, then publish.',
    ]);
  });

  it('warns about many scene breaks', () => {
    expect(uploadNote({ fileName: 'spacing.docx', doc: read('spacing.docx'), what: 'chapter' })).toEqual([
      'Added spacing.docx: 6 paragraphs and 5 scene breaks.',
      "That's a lot of scene breaks: the document may use empty paragraphs for spacing. Use Word's line spacing instead, and upload it again.",
      'Check the chapter, then publish.',
    ]);
  });

  it('builds each line from the counts', () => {
    const base: WordDocument = {
      blocks: [],
      pictures: [],
      failed: [],
      counts: { paragraphs: 1, sceneBreaks: 0, pictures: 0, italics: false, bold: false },
      facts: { headings: [], tables: 0, footnotes: 0, tracked: false, leftOut: { textBox: 0, table: 0, drawing: 0 } },
    };
    const note = (doc: Partial<WordDocument>, what: 'chapter' | 'story' = 'chapter') => uploadNote({ fileName: 'a.docx', doc: { ...base, ...doc }, what });
    expect(note({})[0]).toBe('Added a.docx: 1 paragraph.');
    expect(note({ counts: { paragraphs: 2, sceneBreaks: 1, pictures: 0, italics: true, bold: false } })[0]).toBe('Added a.docx: 2 paragraphs and 1 scene break, with its italics.');
    expect(note({ counts: { paragraphs: 2, sceneBreaks: 0, pictures: 1, italics: false, bold: true } })[0]).toBe('Added a.docx: 2 paragraphs and 1 picture, with its bold.');
    expect(note({ firstLine: 'The Long Road' }, 'story')[1]).toBe('Its first line, "The Long Road", was left out, as the story\'s title shows it.');
    expect(note({ facts: { ...base.facts, headings: ['Morning'] } })[1]).toBe('1 heading came in as a plain paragraph: "Morning".');
    expect(note({ facts: { ...base.facts, headings: ['A', 'B', 'C'] } })[1]).toBe('3 headings came in as plain paragraphs: "A", "B" and "C".');
    expect(note({ facts: { ...base.facts, tables: 2 } })[1]).toBe('2 tables came in as plain paragraphs, one per row.');
    expect(note({ facts: { ...base.facts, footnotes: 1 } })[1]).toBe('1 footnote came in at the end, numbered.');
    expect(note({ facts: { ...base.facts, leftOut: { textBox: 2, table: 3, drawing: 1 } } }).slice(1, 4)).toEqual([
      '2 pictures in text boxes were left out.',
      '3 pictures in tables were left out.',
      '1 drawing or chart made in Word was left out.',
    ]);
    const pic = { data: new Uint8Array(), type: 'image/png' as const, wordAlt: undefined, alt: undefined, fromWord: false, decorative: false, cropped: false, moved: true };
    expect(note({ pictures: [pic, pic] })[1]).toBe('2 pictures that sat beside the text now sit below their paragraphs.');
    expect(note({ failed: [{ number: 2, reason: 'format' }] })[1]).toBe(
      "Picture 2 in a.docx couldn't be added (it's in a format the site can't show), so the chapter was added without it. Save it in the document as a picture (JPEG or PNG) and upload again, or publish without it.",
    );
    expect(note({ failed: [{ number: 1, reason: 'upload' }] }, 'story')[1]).toBe(
      "Picture 1 in a.docx couldn't be added (it couldn't be uploaded), so the story was added without it. Upload the document again to try again, or publish without it.",
    );
    // At least 3, and more than one for every 5 paragraphs.
    const breaks = (paragraphs: number, sceneBreaks: number) =>
      note({ counts: { paragraphs, sceneBreaks, pictures: 0, italics: false, bold: false } }).some((l) => l.startsWith("That's a lot"));
    expect(breaks(10, 3)).toBe(true);
    expect(breaks(15, 3)).toBe(false);
    expect(breaks(4, 2)).toBe(false);
    expect(breaks(14, 3)).toBe(true);
  });
});

describe('story-import-word#AC-12 re-saving', () => {
  it('keeps a picture at most 3200 wide, keeping its shape', () => {
    expect(resaveSize(4000, 3000)).toEqual({ width: 3200, height: 2400 });
    expect(resaveSize(3200, 100)).toEqual({ width: 3200, height: 100 });
    expect(resaveSize(800, 1200)).toEqual({ width: 800, height: 1200 });
    expect(resaveSize(6401, 1001)).toEqual({ width: 3200, height: 500 });
  });

  it('keeps JPEG and WebP, and makes PNG of PNG and GIF', () => {
    expect(resaveType('image/jpeg')).toBe('image/jpeg');
    expect(resaveType('image/webp')).toBe('image/webp');
    expect(resaveType('image/png')).toBe('image/png');
    expect(resaveType('image/gif')).toBe('image/png');
  });
});

describe('story-import-word#AC-13 alt text needed', () => {
  it('counts the pictures with neither alt text nor Decorative', () => {
    expect(needsAlt([{ alt: 'A map' }, { decorative: true }, {}, { alt: '  ' }])).toBe(2);
    expect(altCountLine(0)).toBe('Every picture has alt text or is decorative.');
    expect(altCountLine(1)).toBe('1 needs alt text');
    expect(altCountLine(2)).toBe('2 need alt text');
  });

  it("has the design's labels and line", () => {
    expect(altLabel(2)).toBe('Alt text for picture 2');
    expect(DECORATIVE_LABEL).toBe('Decorative: screen readers skip it');
    expect(ALT_MISSING_LINE).toBe('Add alt text so people using screen readers know what it shows, or tick Decorative. You can still publish.');
  });
});

describe('story-import-word#AC-14 the question', () => {
  const now = new Date(2026, 10, 7, 16, 0);
  it('says what is there and what is coming', () => {
    expect(
      replaceQuestion({
        what: { number: 3 },
        now: { fileName: 'The Long Road 3.docx', addedAt: new Date(2026, 10, 7, 14, 38).toISOString(), paragraphs: 48, pictures: 3 },
        next: { fileName: 'The Long Road 3 (edited).docx', paragraphs: 51, pictures: 3, kept: 2, fresh: 1 },
        today: now,
      }),
    ).toEqual({
      title: "Replace Chapter 3's text?",
      lines: [
        'Now: The Long Road 3.docx, added 2:38 pm: 48 paragraphs, 3 pictures.',
        'New: The Long Road 3 (edited).docx: 51 paragraphs, 3 pictures; 2 keep their alt text, 1 is new.',
        'Anything changed in the editor since the last upload (alt text, Decorative) is kept for pictures that are still there. You can undo this until you publish.',
      ],
      cancel: 'Cancel',
      confirm: 'Replace',
    });
  });

  it('words each case', () => {
    const q = (now: Parameters<typeof replaceQuestion>[0]['now'], next: Parameters<typeof replaceQuestion>[0]['next'], what: { number?: number } = {}) =>
      replaceQuestion({ what, now, next, today: now.addedAt ? new Date(2026, 10, 7, 16, 0) : new Date() });
    expect(q({ paragraphs: 1, pictures: 0 }, { fileName: 'b.docx', paragraphs: 2, pictures: 0, kept: 0, fresh: 0 })).toMatchObject({
      title: "Replace the story's text?",
      lines: ['Now: 1 paragraph.', 'New: b.docx: 2 paragraphs.', expect.any(String)],
    });
    expect(q({ fileName: 'a.docx', addedAt: new Date(2026, 10, 5, 9, 5).toISOString(), paragraphs: 2, pictures: 1 }, { fileName: 'b.docx', paragraphs: 2, pictures: 1, kept: 1, fresh: 0 }).lines.slice(0, 2)).toEqual([
      'Now: a.docx, added 5 November: 2 paragraphs, 1 picture.',
      'New: b.docx: 2 paragraphs, 1 picture; 1 keeps its alt text.',
    ]);
    expect(q({ paragraphs: 2, pictures: 0 }, { fileName: 'b.docx', paragraphs: 2, pictures: 2, kept: 0, fresh: 2 }).lines[1]).toBe('New: b.docx: 2 paragraphs, 2 pictures; 2 are new.');
  });

  it('gives times as the design does', () => {
    const today = new Date(2026, 10, 7, 23, 0);
    expect(addedTime(new Date(2026, 10, 7, 14, 38).toISOString(), today)).toBe('2:38 pm');
    expect(addedTime(new Date(2026, 10, 7, 0, 5).toISOString(), today)).toBe('12:05 am');
    expect(addedTime(new Date(2026, 10, 7, 12, 0).toISOString(), today)).toBe('12:00 pm');
    expect(addedTime(new Date(2026, 10, 6, 14, 38).toISOString(), today)).toBe('6 November');
    expect(addedTime(new Date(2025, 10, 7, 14, 38).toISOString(), today)).toBe('7 November 2025');
  });
});

describe('story-import-word#AC-15 same pictures', () => {
  const was = (over: Partial<PictureSettings>): PictureSettings => ({ hash: 'a', alt: undefined, decorative: false, fromWord: false, wordAlt: undefined, wordDecorative: false, edited: false, ...over });

  it('keeps what was set for a picture with the same data, in order of use', () => {
    const previous = [
      was({ hash: 'map', alt: 'My map', edited: true, wordAlt: 'A map' }),
      was({ hash: 'fox', alt: 'A fox', fromWord: true, wordAlt: 'A fox' }),
      was({ hash: 'map', alt: 'The map again', fromWord: true, wordAlt: 'The map again' }),
    ];
    const result = matchPictures(previous, [
      { hash: 'map', wordAlt: 'A map', wordDecorative: false },
      { hash: 'map', wordAlt: 'The map again', wordDecorative: false },
      { hash: 'new', wordAlt: 'A letter', wordDecorative: false },
    ]);
    expect(result.kept).toBe(2);
    expect(result.fresh).toBe(1);
    expect(result.pictures).toEqual([
      was({ hash: 'map', alt: 'My map', edited: true, wordAlt: 'A map' }),
      was({ hash: 'map', alt: 'The map again', fromWord: true, wordAlt: 'The map again' }),
      was({ hash: 'new', alt: 'A letter', fromWord: true, wordAlt: 'A letter' }),
    ]);
  });

  it("lets Word's changed alt text or decorative mark win", () => {
    const previous = [was({ hash: 'letter', alt: 'Typed here', edited: true, wordAlt: 'A letter in faded ink' }), was({ hash: 'f', decorative: false, wordDecorative: false, edited: true, alt: 'x' })];
    const result = matchPictures(previous, [
      { hash: 'letter', wordAlt: 'A letter from Tam, in faded ink', wordDecorative: false },
      { hash: 'f', wordAlt: undefined, wordDecorative: true },
    ]);
    expect(result.pictures).toEqual([
      was({ hash: 'letter', alt: 'A letter from Tam, in faded ink', fromWord: true, wordAlt: 'A letter from Tam, in faded ink' }),
      was({ hash: 'f', alt: undefined, decorative: true, wordDecorative: true }),
    ]);
    expect(result.kept).toBe(2);
  });

  it('takes Word\'s alt text for new pictures, without the automatic kind', () => {
    const result = matchPictures([], [{ hash: 'n', wordAlt: 'A fox\n\nDescription automatically generated', wordDecorative: false }]);
    expect(result.pictures).toEqual([was({ hash: 'n', wordAlt: 'A fox\n\nDescription automatically generated' })]);
    expect(result).toMatchObject({ kept: 0, fresh: 1 });
  });

  it('finds the re-encoded fox new, and the rest the same, in the edited sample', async () => {
    const before = read('word-chapter.docx');
    const after = read('edited.docx');
    const hashes = async (doc: WordDocument) => Promise.all(doc.pictures.map((p) => pictureHash(p.data)));
    const [b, a] = [await hashes(before), await hashes(after)];
    const previous = before.pictures.map((p, i) => was({ hash: b[i], alt: p.alt, fromWord: p.fromWord, wordAlt: p.wordAlt, decorative: p.decorative, wordDecorative: p.decorative }));
    const result = matchPictures(previous, after.pictures.map((p, i) => ({ hash: a[i], wordAlt: p.wordAlt, wordDecorative: p.decorative })));
    expect(result).toMatchObject({ kept: 5, fresh: 1 });
    expect(result.pictures[2].alt).toBe('A letter from Tam, in faded ink');
  });
});

describe('story-import-word#AC-16 undo', () => {
  const pictureBlock = (asset: string, over: Record<string, unknown> = {}) => ({ _type: 'storyPicture', _key: asset, image: { _type: 'image', asset: { _type: 'reference', _ref: asset } }, ...over });
  const content = [{ _type: 'block', _key: 'a', children: [{ _type: 'span', text: 'Old.' }] }, pictureBlock('image-old-10x10-png')];
  const upload = { fileName: 'a.docx', addedAt: '2026-11-07T14:38:00.000Z' };

  it('keeps what undo puts back as text, so its pictures are not references', () => {
    const snapshot = undoSnapshot(content, upload);
    expect(typeof snapshot).toBe('string');
    expect(snapshot).not.toContain('"_ref"');
    expect(undoFrom(snapshot)).toEqual({ content, upload });
    expect(undoFrom(undoSnapshot(undefined, undefined))).toEqual({ content: [], upload: undefined });
    expect(undoFrom('not json')).toBeUndefined();
    expect(undoFrom(undefined)).toBeUndefined();
  });

  it('asks first only when alt text or Decorative was changed since', () => {
    expect(editedSince([pictureBlock('x'), pictureBlock('y', { edited: false })])).toBe(false);
    expect(editedSince([pictureBlock('x'), pictureBlock('y', { edited: true })])).toBe(true);
    expect(editedSince(undefined)).toBe(false);
    expect(UNDO_QUESTION).toEqual({ title: "Undo this upload? Alt text you've typed since will go too.", cancel: 'Cancel', confirm: 'Undo' });
  });

  it('shows the upload line, with undo until published', () => {
    const today = new Date(2026, 10, 7, 16, 0);
    const addedAt = new Date(2026, 10, 7, 14, 38).toISOString();
    expect(uploadLine({ fileName: 'The Long Road 3.docx', addedAt, published: false, today })).toEqual({
      text: 'The Long Road 3.docx, added 2:38 pm, not published yet',
      undo: 'Undo this upload',
    });
    expect(uploadLine({ fileName: 'The Long Road 3.docx', addedAt, published: true, today })).toEqual({ text: 'The Long Road 3.docx, added 2:38 pm' });
  });
});

describe('story-import-word#AC-18 unused pictures', () => {
  it('finds the pictures in a text', () => {
    expect(
      pictureAssets([
        { _type: 'block' },
        { _type: 'storyPicture', image: { asset: { _ref: 'image-a-1x1-png' } } },
        { _type: 'storyPicture', image: { asset: { _ref: 'image-a-1x1-png' } } },
        { _type: 'storyPicture', image: {} },
        { _type: 'storyPicture', image: { asset: { _ref: 'image-b-1x1-png' } } },
      ]),
    ).toEqual(['image-a-1x1-png', 'image-b-1x1-png']);
    expect(pictureAssets(undefined)).toEqual([]);
  });

  it('removes discarded and dropped pictures that nothing refers to, and only those', () => {
    expect(
      unusedPictures({
        discarded: ['image-old', 'image-kept-elsewhere', 'image-back'],
        before: ['image-dropped', 'image-still'],
        after: ['image-still', 'image-back'],
        referenced: new Set(['image-kept-elsewhere']),
      }),
    ).toEqual(['image-old', 'image-dropped']);
    expect(unusedPictures({ discarded: [], before: [], after: [], referenced: new Set() })).toEqual([]);
  });
});

describe('story-import-word#AC-19 one-shot to chapters', () => {
  it('moves the upload line into Chapter 1 with the text', () => {
    const text = [{ _type: 'block', children: [{ _type: 'span', text: 'It began.' }] }];
    const upload = { fileName: 'The Long Road.docx', addedAt: '2026-11-07T14:38:00.000Z' };
    expect(firstChapterFrom(text, upload)).toEqual({ number: 1, content: text, moved: true, textUpload: upload });
    expect(firstChapterFrom(text)).toEqual({ number: 1, content: text, moved: true });
    expect(firstChapterFrom([], upload)).toEqual({ number: 1, moved: false });
  });
});

describe('story-import-word#AC-27 guide', () => {
  it("says to upload, not paste, in Star's guide", () => {
    const guide = readFileSync('docs/user/publishing-stories.md', 'utf8');
    expect(guide).toContain('summary: "Starting a story, uploading its text, chapters, and ratings."');
    expect(guide).not.toMatch(/\bpast(e|ed|ing)\b/i);
    for (const heading of ['## Upload the text', '### Change something', '## Pictures', '## Scene breaks', '## Add a chapter to a story']) expect(guide).toContain(heading);
    for (const words of ['Upload a Word document', 'Upload a new version', 'Undo this upload', '**Alt text**', '**Decorative**', 'Compress Pictures', 'tracked changes']) {
      expect(guide, words).toContain(words);
    }
  });
});
