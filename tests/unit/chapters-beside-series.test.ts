// A chapter opens beside its series. Criteria: docs/specs/content-editing-organised-editor.md (AC-14).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chapterPaneTitle } from '../../sanity-studio/lib/comic-pages';

describe('content-editing-organised-editor#AC-14 chapter beside its series', () => {
  it('heads the chapter pane with the series and the chapter', () => {
    expect(chapterPaneTitle('Kettle Tales', { number: 2, title: 'The Long Road' })).toBe('Kettle Tales · Chapter 2: The Long Road');
    expect(chapterPaneTitle('Kettle Tales', { number: 1 })).toBe('Kettle Tales · Chapter 1');
    expect(chapterPaneTitle('Kettle Tales', { number: 0, title: 'Prologue' })).toBe('Kettle Tales · Prologue');
    expect(chapterPaneTitle('Kettle Tales', null)).toBe('Kettle Tales · New chapter');
    expect(chapterPaneTitle(undefined, null)).toBe('Untitled series · New chapter');
    expect(chapterPaneTitle('  ', { number: 3 })).toBe('Untitled series · Chapter 3');
    expect(chapterPaneTitle(' Kettle Tales ', null)).toBe('Kettle Tales · New chapter');
  });
  it('opens the chapter as a child of the series pane, headed with both names', () => {
    const structure = readFileSync('sanity-studio/structure.ts', 'utf8');
    expect(structure).toMatch(/S\.document\(\)[\s\S]*schemaType\('comicSeries'\)[\s\S]*\.child\(/);
    expect(structure).toMatch(/chapterPaneTitle\(/);
    expect(structure).toMatch(/initialValueTemplate\(CHAPTER_TEMPLATE/);
  });
  it('links chapter rows and Add chapter to that child pane, not to Sanity\'s open or create links', () => {
    const list = readFileSync('sanity-studio/components/ChaptersList.tsx', 'utf8');
    expect(list).toMatch(/usePaneRouter/);
    expect(list).toMatch(/ChildLink/);
    expect(list).not.toMatch(/IntentLink/);
  });
});
