// Stub for the tests-first commit; see docs/specs/content-editing-organised-editor.md.
export type ItemType = 'comicSeries' | 'galleryItem' | 'writtenWork' | 'product' | 'commissionType';
export interface Section { title: string; type?: ItemType; newLabel?: string; ordering?: [string, 'asc' | 'desc'][] }
export const SECTIONS: Section[] = [{ title: 'stub' }];
export const ITEM_NAMES: Record<ItemType | 'comicChapter', string> = {
  comicSeries: 'stub', comicChapter: 'stub', galleryItem: 'stub', writtenWork: 'stub', product: 'stub', commissionType: 'stub',
};
export const SITE_SETTINGS_NOTE = 'stub';
export const EMPTY_LIST = 'stub';
export interface FieldText { label: string; help: string; missing?: string; atLeastOne?: boolean }
export const FIELDS: Record<ItemType, Record<string, FieldText>> = {
  comicSeries: { stub: { label: 'stub', help: 'stub' } }, galleryItem: {}, writtenWork: {}, product: {}, commissionType: {},
};
export const HIDDEN: Record<ItemType, string[]> = { comicSeries: ['stub'], galleryItem: [], writtenWork: [], product: [], commissionType: [] };
export function fieldText(_type: ItemType, _name: string): { title: string; description: string } { return { title: 'stub', description: 'stub' }; }
export function requiredMessage(_type: ItemType, _name: string): string { return 'stub'; }
export interface Option { title: string; value: string }
export const PORTFOLIO_SECTIONS: Option[] = [{ title: 'stub', value: 'stub' }];
export const SHOP_SECTION_OPTIONS: Option[] = [{ title: 'stub', value: 'stub' }];
export const SERIES_STATUS: Option[] = [{ title: 'stub', value: 'stub' }];
export const SERIES_KIND: Option[] = [{ title: 'stub', value: 'stub' }];
export function listDetail(_type: ItemType, _item: Record<string, unknown>): string | undefined { return 'stub'; }
export function missingSummary(_type: ItemType, _missing: string[]): string | null { return 'stub'; }
export function thingsToAdd(_count: number): string | null { return 'stub'; }
export const PIECE_ALT_TEXT_WARNING = 'stub';
export const DEVELOPER_WORDS: string[] = ['stub'];
