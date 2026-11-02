// Stub for the tests-first commit; see docs/specs/content-editing-site-settings.md.
export interface Link { name: string; url: string }
export interface Fact { label: string; value: string }
export interface Picture { src: string; width: number; height: number }
export interface Settings {
  commissions: { open: boolean; note: string };
  about: { portrait: Picture | null; portraitAlt: string; bio: string[]; statement: string[]; facts: Fact[] };
  home: { text: string[] };
  contact: { email: string; links: Link[] };
}
export type RawSettings = Record<string, Record<string, unknown> | null | undefined>;
export const STARTING: RawSettings = {};
export function paragraphs(_text: unknown): string[] { return []; }
export function readSettings(_raw: RawSettings, _picture?: (image: unknown) => Picture | null): Settings {
  return { commissions: { open: true, note: '' }, about: { portrait: null, portraitAlt: '', bio: [], statement: [], facts: [] }, home: { text: [] }, contact: { email: '', links: [] } };
}
export function linkColour(_index: number): string { return ''; }
export interface CommissionsView { open: boolean; heading: string; note: string; intro: string; showOrdering: boolean; outro: string }
export function commissionsView(_s: Settings): CommissionsView { return { open: true, heading: '', note: '', intro: '', showOrdering: true, outro: '' }; }
export function getInTouchText(_open: boolean): string { return ''; }
