// Edge cases of the story editor's pure logic that mutation testing showed nothing checked
// (docs/specs/story-reader-editor.md AC-4, AC-6, AC-9, AC-10; recorded under the spec's unlocks).
import { describe, expect, it } from 'vitest';
import {
  cleanPastedBlocks, deleteStoryDialog, isSceneBreakLine, storyChapterPaneTitle, storyLinkDialog, type Block,
} from '../../sanity-studio/lib/stories';

const p = (text: string, marks: string[] = []): Block => ({ _type: 'block', style: 'normal', children: [{ _type: 'span', text, marks }] });
const kinds = (blocks: Block[]) => blocks.map((b) => (b._type === 'sceneBreak' ? '⁂' : (b.children ?? []).map((c) => c.text).join('')));
let n = 0;
const key = () => `k${n++}`;

describe('story-reader-editor#AC-4 paste edges', () => {
  it('reads a symbol line with spaces around it, and needs three symbols', () => {
    expect(isSceneBreakLine('  ~  ')).toBe(true);
    expect(isSceneBreakLine(' ⁂ ')).toBe(true);
    expect(isSceneBreakLine('* *')).toBe(false);
    expect(isSceneBreakLine('- -')).toBe(false);
    expect(isSceneBreakLine('* * *')).toBe(true);
  });

  it('reads a line across its spans', () => {
    const split: Block = { _type: 'block', children: [{ _type: 'span', text: '*' }, { _type: 'span', text: '**' }] };
    expect(kinds(cleanPastedBlocks([p('a'), split, p('b')], key))).toEqual(['a', '⁂', 'b']);
    const words: Block = { _type: 'block', children: [{ _type: 'span', text: 'Two ' }, { _type: 'span', text: 'spans' }] };
    expect(kinds(cleanPastedBlocks([words], key))).toEqual(['Two spans']);
  });

  it('makes a scene break from exactly two empty lines, and not from dropped pictures', () => {
    expect(kinds(cleanPastedBlocks([p('a'), p(''), p(''), p('b')], key))).toEqual(['a', '⁂', 'b']);
    expect(kinds(cleanPastedBlocks([p('a'), { _type: 'image' }, { _type: 'image' }, p('b')], key))).toEqual(['a', 'b']);
  });

  it('never puts two scene breaks together', () => {
    const out = cleanPastedBlocks([p('a'), { _type: 'sceneBreak' }, p('* * *'), p(''), p(''), { _type: 'sceneBreak' }, p('b')], key);
    expect(kinds(out)).toEqual(['a', '⁂', 'b']);
  });

  it('keeps a paragraph\'s key, clears its links and keeps only italic and bold', () => {
    const block: Block = {
      _type: 'block', _key: 'mine', style: 'h1', markDefs: [{ _key: 'l1', _type: 'link' }],
      children: [{ _type: 'span', text: 'x', marks: ['em', 'underline', 'l1', 'strong'] }],
    };
    const [out] = cleanPastedBlocks([block], key);
    expect(out._key).toBe('mine');
    expect(out.markDefs).toEqual([]);
    expect(out.children?.[0].marks).toEqual(['em', 'strong']);
  });

  it('gives new blocks a short random key of their own', () => {
    const out = cleanPastedBlocks([p('a'), p(''), p(''), p('b')]);
    const keys = out.map((b) => b._key);
    for (const k of keys) expect(k).toMatch(/^[a-z0-9]{1,8}$/);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('story-reader-editor#AC-6 AC-9 AC-10 wording edges', () => {
  it('titles a chapter pane without its story while the story has no title', () => {
    expect(storyChapterPaneTitle(undefined, { number: 2 })).toBe('Chapter 2');
    expect(storyChapterPaneTitle(undefined, null)).toBe('New chapter');
  });

  it('names an untitled story and an untitled chapter plainly', () => {
    expect(storyLinkDialog({ kind: 'story', from: 'a', to: 'b' })?.lines[0]).toMatch(/^You changed the story's web address from a to b\./);
    expect(storyLinkDialog({ kind: 'story', from: 'a', to: 'b', title: '  ' })?.lines[0]).toMatch(/^You changed the story's web address/);
    expect(storyLinkDialog({ kind: 'chapter', from: 2, to: 3, title: '  ' })?.lines[0]).toMatch(/^You changed chapter 2 to chapter 3\./);
    expect(deleteStoryDialog('  ', 0).title).toBe('Delete this story?');
  });
});

describe('story-reader-editor#AC-3 AC-4 paste schema', () => {
  it('describes the same text as the editor\'s Text type', async () => {
    const { STORY_TEXT_SCHEMA } = await import('../../sanity-studio/lib/story-paste');
    const source = (await import('node:fs')).readFileSync('sanity-studio/schemas/objects/storyText.ts', 'utf8');
    for (const style of STORY_TEXT_SCHEMA.styles) expect(source).toContain(`{ title: '${style.title}', value: '${style.value}' }`);
    for (const mark of STORY_TEXT_SCHEMA.decorators) expect(source).toContain(`{ title: '${mark.title}', value: '${mark.value}' }`);
    expect(STORY_TEXT_SCHEMA.blockObjects.map((o) => o.name)).toEqual(['sceneBreak']);
    expect(source).toMatch(/lists: \[\]/);
    expect(source).toMatch(/annotations: \[\]/);
  });
});
