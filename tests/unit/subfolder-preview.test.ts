// Fix: a subfolder's row in the editor's Subfolders list showed "Invalid preview config". Sanity accepts only
// text (or nothing) for a preview's title, subtitle and description; the subtitle was a component. The prepared
// value is now text, and a preview component adds the piece count. Criteria: docs/specs/portfolio-folders.md
// AC-18, docs/specs/portfolio-order.md AC-6.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { subfolderPreview } from '../../sanity-studio/lib/editor-content';

const TEXT_FIELDS = ['title', 'subtitle', 'description', 'imageUrl', 'date'] as const;
const isText = (v: unknown) => v === undefined || v === null || ['string', 'number', 'boolean'].includes(typeof v);

describe('subfolder list preview', () => {
  const cases = [
    { title: 'Murderbot', section: 'fanart', gridSize: 2, order: 'oldest', id: 'sub-1' },
    { title: 'Book covers', section: 'commission', gridSize: 3, id: 'drafts.sub-2' },
    { title: 'Made before Order of pieces', section: 'fanart', id: 'sub-3' },
    { title: undefined, section: undefined, id: undefined },
  ];
  it('prepares only text for the fields Sanity checks, for every subfolder', () => {
    for (const c of cases) {
      const value = subfolderPreview(c) as Record<string, unknown>;
      for (const field of TEXT_FIELDS) expect(isText(value[field]), `${field} of ${c.title}`).toBe(true);
    }
  });
  it('keeps the name, and gives the section, grid size and order without the count', () => {
    expect(subfolderPreview(cases[0])).toMatchObject({ title: 'Murderbot', subtitle: 'Fan Work · 2 × 2 · Oldest first' });
    expect(subfolderPreview(cases[1])).toMatchObject({ title: 'Book covers', subtitle: 'Past Clients · 3 × 3' });
    expect(subfolderPreview(cases[2])).toMatchObject({ subtitle: 'Fan Work · 2 × 2' });
    expect(subfolderPreview(cases[3]).subtitle).toBeUndefined();
  });
  it('passes the id, section, grid size and order on for the count', () => {
    expect(subfolderPreview(cases[0])).toMatchObject({ subfolderId: 'sub-1', section: 'fanart', gridSize: 2, order: 'oldest' });
  });
  it('uses it in the schema, with a preview component for the count, and no component as the subtitle', () => {
    const schema = readFileSync('sanity-studio/schemas/objects/portfolioSubfolder.ts', 'utf8');
    expect(schema).toMatch(/subfolderPreview\(/);
    expect(schema).toMatch(/preview: SubfolderPreview/);
    expect(schema).toMatch(/subfolderPreviewWith\(\(value\) => listDetail\('portfolioSubfolder', value\)\)/);
    expect(schema).not.toMatch(/as unknown as string/);
    expect(schema).not.toMatch(/subfolderSubtitle/);
    const component = readFileSync('sanity-studio/components/SubfolderInputs.tsx', 'utf8');
    expect(component).toMatch(/export function subfolderPreviewWith/);
    expect(component).toMatch(/renderDefault\(\{ \.\.\.props, subtitle/);
  });
});
