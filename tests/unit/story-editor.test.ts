// Stories in the editor: fields, checks, the text and its paste clean-up, chapters, warnings.
// Criteria: docs/specs/story-reader-editor.md.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { fieldText, FIELDS, HIDDEN } from '../../sanity-studio/lib/editor-content';
import { ITEM_HELP } from '../../sanity-studio/lib/help';
import { CONTENT_TYPES, viewOnSitePath } from '../../sanity-studio/lib/live-status';
import { isPreviewable } from '../../sanity-studio/lib/preview';
import {
  CHAPTER_TEXT_MESSAGE, cleanPastedBlocks, deleteStoryDialog, duplicateStoryChapterMessage, firstChapterFrom, HAS_CHAPTERS_NOTE,
  isSceneBreakLine, MOVED_NOTE, STATUSES, storyChapterPaneTitle, storyChapterRow, storyLinkDialog, storyNeeds,
  WEB_ADDRESS_MESSAGE, type Block,
} from '../../sanity-studio/lib/stories';

const read = (path: string) => readFileSync(path, 'utf8');
const p = (text: string, marks: string[] = []): Block => ({ _type: 'block', style: 'normal', children: [{ _type: 'span', text, marks }] });
const texts = (blocks: Block[]) => blocks.map((b) => (b._type === 'sceneBreak' ? '⁂' : (b.children ?? []).map((c) => c.text).join('')));
let n = 0;
const key = () => `k${n++}`;

describe('story-reader-editor#AC-1 story fields', () => {
  it('has every field, in order, with the design\'s labels and help, and hides none', () => {
    expect(Object.keys(FIELDS.writtenWork)).toEqual([
      'title', 'slug', 'excerpt', 'coverImage', 'genre', 'mature', 'contentNotes', 'status', 'content', 'chapters', 'publishDate', 'externalLink',
    ]);
    expect(HIDDEN.writtenWork).toEqual(['rating']);
    expect(fieldText('writtenWork', 'title')).toEqual({ title: 'Title (required)', description: "The story's title." });
    expect(fieldText('writtenWork', 'slug')).toEqual({
      title: 'Web address',
      description: "It's the last part of the story's link: kettlebird.com/writing/the-kettles-song. Filled in from the title. Changing it after people have shared links breaks them.",
    });
    // story-mature-content AC-1: the checkbox in place of Rating.
    expect(fieldText('writtenWork', 'mature')).toEqual({ title: 'Mature or explicit content', description: "Tick it for sex scenes, graphic violence or other strong content. Readers are then asked before the text shows, and the story's card and page say so. Left unticked, readers go straight to the text. It covers the story and all its chapters." });
    expect(fieldText('writtenWork', 'contentNotes')).toEqual({ title: 'Content notes', description: 'Anything a reader should know before starting, such as "Mild violence". Shown before the story.' });
    expect(fieldText('writtenWork', 'status')).toEqual({ title: 'Status', description: 'For a story in chapters: In progress or Complete.' });
    expect(fieldText('writtenWork', 'content')).toEqual({ title: 'Text', description: 'For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead.' });
    expect(fieldText('writtenWork', 'chapters')).toEqual({ title: 'Chapters', description: 'For a story in chapters. Each chapter has its own page.' });
    expect(fieldText('writtenWork', 'externalLink').description).toBe("Optional: the story somewhere else, such as AO3. Without text on the site, the Writing page's Read it opens it; with text, it's shown as \"Also on AO3\".");
  });

  it('keeps the stored names slug and content, shown, in the schema', () => {
    const source = read('sanity-studio/schemas/objects/writtenWork.ts');
    const uses = [...source.matchAll(/fieldText\('writtenWork', '(\w+)'\)/g)].map((m) => m[1]);
    expect(uses).toEqual(Object.keys(FIELDS.writtenWork));
    // story-mature-content AC-1: only the old rating is hidden, until the one-off change removes it.
    expect([...source.matchAll(/name: '(\w+)',[^}]*hidden: true/gs)].map((m) => m[1])).toEqual(['rating']);
  });
});

describe('story-reader-editor#AC-2 AC-8 story checks', () => {
  it('offers the statuses with their stored values', () => {
    // story-mature-content AC-1: no ratings to offer.
    expect(STATUSES).toEqual([{ title: 'In progress', value: 'inProgress' }, { title: 'Complete', value: 'complete' }]);
  });

  it('needs a web address only once there is text or a chapter', () => {
    // story-mature-content AC-2: no rating is asked for.
    expect(WEB_ADDRESS_MESSAGE).toBe('Add a web address so readers can find this story.');
    expect(storyNeeds({ hasText: false, hasChapters: false })).toEqual([]);
    expect(storyNeeds({ hasText: true, hasChapters: false })).toEqual([WEB_ADDRESS_MESSAGE]);
    expect(storyNeeds({ hasText: false, hasChapters: true, slug: 'the-long-road' })).toEqual([]);
    expect(storyNeeds({ hasText: true, hasChapters: false, slug: '  ' })).toEqual([WEB_ADDRESS_MESSAGE]);
    expect(storyNeeds({ hasText: true, hasChapters: false, slug: 'a' })).toEqual([]);
  });

  it('says where the text is on a story with chapters', () => {
    expect(HAS_CHAPTERS_NOTE).toBe('This story has chapters, so its text is in them. To make it a one-shot again, remove its chapters and upload the whole story here.');
  });
});

describe('story-reader-editor#AC-3 text schema', () => {
  it('allows only paragraphs with italic and bold, and the scene break', () => {
    const source = read('sanity-studio/schemas/objects/storyText.ts');
    expect(source).toMatch(/styles: \[\{ title: 'Normal', value: 'normal' \}\]/);
    expect(source).toMatch(/lists: \[\]/);
    expect(source).toMatch(/decorators: \[\{ title: 'Italic', value: 'em' \}, \{ title: 'Bold', value: 'strong' \}\]/);
    expect(source).toMatch(/annotations: \[\]/);
    expect(source).toMatch(/name: 'sceneBreak'[^]*title: 'Scene break'/);
    for (const file of ['writtenWork', 'storyChapter']) expect(read(`sanity-studio/schemas/objects/${file}.ts`), file).toMatch(/type: 'storyText'/);
  });
});

describe('story-reader-editor#AC-4 paste', () => {
  it('knows a symbol-only line', () => {
    for (const line of ['* * *', '***', '---', '~', '#', '⁂', '= = =', '•••', ' · · · ', '~~~', '-*-']) expect(isSceneBreakLine(line), line).toBe(true);
    for (const line of ['', '**', '--', 'A', '* a *', '...', '***!', '—', '1 2 3']) expect(isSceneBreakLine(line), line).toBe(false);
  });

  it('makes scene breaks from symbol lines and runs of empty lines, and drops single empty lines', () => {
    const out = cleanPastedBlocks([p('One.'), p(''), p('Two.'), p('* * *'), p('Three.'), p(''), p('  '), p(''), p('Four.'), p('')], key);
    expect(texts(out)).toEqual(['One.', 'Two.', '⁂', 'Three.', '⁂', 'Four.']);
    expect(out.find((b) => b._type === 'sceneBreak')).toEqual({ _type: 'sceneBreak', _key: expect.any(String) });
  });

  it('keeps italics and bold, turns other styles into paragraphs, and drops other objects', () => {
    const heading: Block = { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Part One', marks: ['strong'] }] };
    const out = cleanPastedBlocks([heading, p('In ', []), { _type: 'image' }, p('italics', ['em']), { _type: 'sceneBreak' }], key);
    expect(out.map((b) => [b._type, b.style ?? null])).toEqual([['block', 'normal'], ['block', 'normal'], ['block', 'normal'], ['sceneBreak', null]]);
    expect(out[0].children).toEqual([{ _type: 'span', text: 'Part One', marks: ['strong'] }]);
    expect(out[2].children?.[0].marks).toEqual(['em']);
  });

  it('never starts or ends with a scene break made from empty lines', () => {
    expect(texts(cleanPastedBlocks([p(''), p(''), p('Only.'), p(''), p('')], key))).toEqual(['Only.']);
  });

  it('cleans Google Docs and Word clipboard HTML through the editor\'s own paste library', async () => {
    const { pasteHtml } = await import('../../sanity-studio/lib/story-paste');
    const require = createRequire(import.meta.url);
    const { JSDOM } = require('jsdom');
    const parseHtml = (html: string) => new JSDOM(html).window.document;
    const docs = `<b id="docs-internal-guid-1" style="font-weight:normal;"><p><span style="font-weight:400;">She opened the door. </span><span style="font-style:italic;font-weight:400;">Not again.</span></p><br><p><span>* * *</span></p><br><br><p><span style="font-weight:700;">Morning.</span></p></b>`;
    expect(texts(pasteHtml(docs, parseHtml))).toEqual(['She opened the door. Not again.', '⁂', 'Morning.']);
    const word = `<p class=MsoNormal>One <i>two</i>.</p><hr><h1>Heading</h1><p class=MsoNormal><img src="x.png">Three.</p>`;
    const out = pasteHtml(word, parseHtml);
    expect(texts(out)).toEqual(['One two.', '⁂', 'Heading', 'Three.']);
    expect(out[0].children?.find((c) => c.text === 'two')?.marks).toEqual(['em']);
  }, 60_000);
});

describe('story-reader-editor#AC-6 chapters', () => {
  it('lists, names and numbers chapters as comics do, in story words', () => {
    expect(storyChapterRow({ number: 2, title: 'Over the Ridge', published: true })).toBe('Chapter 2: Over the Ridge · On the site');
    expect(storyChapterRow({ number: 3, published: false })).toBe('Chapter 3 · Not published yet');
    expect(duplicateStoryChapterMessage(2, [1, 2])).toBe('Chapter 2 already exists in this story. Choose another number.');
    expect(duplicateStoryChapterMessage(3, [1, 2])).toBeNull();
    expect(storyChapterPaneTitle('The Long Road', { number: 2, title: 'Over the Ridge' })).toBe('The Long Road · Chapter 2: Over the Ridge');
    expect(storyChapterPaneTitle('The Long Road', null)).toBe('The Long Road · New chapter');
    expect(storyChapterPaneTitle(undefined, { number: 1 })).toBe('Chapter 1');
    expect(CHAPTER_TEXT_MESSAGE).toBe("Add the chapter's text.");
  });

  it('has a chapter schema with its story, number, title, text and date', () => {
    const source = read('sanity-studio/schemas/objects/storyChapter.ts');
    for (const name of ['story', 'number', 'title', 'content', 'publishDate']) expect(source, name).toMatch(new RegExp(`name: '${name}'`));
    expect(source).toMatch(/to: \[\{ type: 'writtenWork' \}\]/);
  });
});

describe('story-reader-editor#AC-7 one-shot to chapters', () => {
  it('moves a one-shot\'s text into Chapter 1, and only then', () => {
    const text = [p('The whole story.')];
    expect(firstChapterFrom(text)).toEqual({ number: 1, content: text, moved: true });
    expect(firstChapterFrom([])).toEqual({ number: 1, moved: false });
    expect(firstChapterFrom(undefined)).toEqual({ number: 1, moved: false });
    expect(MOVED_NOTE).toBe("Your story's text is now in Chapter 1.");
  });
});

describe('story-reader-editor#AC-9 link warnings', () => {
  it('warns when a published chapter\'s number or a story\'s web address changes', () => {
    expect(storyLinkDialog({ kind: 'chapter', from: 2, to: 3, title: 'Over the Ridge' })).toEqual({
      title: 'Some links will change',
      lines: ["You changed Over the Ridge from chapter 2 to chapter 3. Links people have shared to it use chapter 2's address, so they'll stop working, or open a different chapter if you later add a new chapter 2."],
    });
    expect(storyLinkDialog({ kind: 'chapter', from: 2, to: 3 })?.lines[0]).toMatch(/^You changed chapter 2 to chapter 3\./);
    expect(storyLinkDialog({ kind: 'chapter', from: 2, to: 2 })).toBeNull();
    expect(storyLinkDialog({ kind: 'story', from: 'the-long-road', to: 'long-road', title: 'The Long Road' })).toEqual({
      title: 'Some links will change',
      lines: ["You changed The Long Road's web address from the-long-road to long-road. Links people have shared to the story and its chapters will stop working."],
    });
    expect(storyLinkDialog({ kind: 'story', from: 'a', to: 'a' })).toBeNull();
  });
});

describe('story-reader-editor#AC-10 delete', () => {
  it('names the chapters it deletes', () => {
    expect(deleteStoryDialog('The Long Road', 3)).toEqual({
      title: 'Delete The Long Road and its 3 chapters?',
      lines: ["They come off the site, and links people have shared to them stop working. This can't be undone."],
      confirm: 'Delete',
    });
    expect(deleteStoryDialog('One Shot', 1).title).toBe('Delete One Shot and its chapter?');
    expect(deleteStoryDialog(undefined, 0)).toEqual({ title: 'Delete this story?', lines: ["It comes off the site with the next update. This can't be undone."], confirm: 'Delete' });
  });
});

describe('story-reader-editor#AC-11 AC-12 help and live status', () => {
  it('links stories and chapters to the stories guide', () => {
    expect(ITEM_HELP.writtenWork).toEqual({ text: 'Help: Start a new story', path: '/help/publishing-stories#start-a-new-story' });
    expect(ITEM_HELP.storyChapter).toEqual({ text: 'Help: Add a chapter to a story', path: '/help/publishing-stories#add-a-chapter-to-a-story' });
    // A chapter has a preview since story-reader-pages AC-12.
    expect(isPreviewable('storyChapter')).toBe(true);
  });

  it('counts chapters as content, and opens the Writing page for them until story pages exist', () => {
    expect(CONTENT_TYPES).toContain('storyChapter');
    expect(viewOnSitePath({ _type: 'storyChapter', _updatedAt: '2026-11-04T00:00:00Z' } as never)).toBe('/writing');
  });
});
