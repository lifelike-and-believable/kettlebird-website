// Stub for the tests-first commit; see docs/specs/content-editing-site-settings.md.
export const SETTINGS_ITEMS: { type: string; title: string }[] = [];
export const SETTINGS_TYPES: string[] = [];
export const isSettingsType = (_name: string) => false;
export const SETTINGS_ACTIONS: string[] = [];
export const SETTINGS_FIELDS: Record<string, Record<string, { label: string; description: string }>> = {};
export const MESSAGES: Record<string, string> = {};
export const ADD_LABELS: Record<string, string> = {};
export const STARTING_VALUES: Record<string, Record<string, unknown>> = {};
export function rowTitle(_a?: string, _b?: string): string { return ''; }
export function isWebAddress(_s: unknown): boolean { return false; }
export function linkMessage(_field: 'name' | 'url', _link: { name?: string; url?: string } | undefined): string | true { return true; }
export function factMessage(_fact: { label?: string; value?: string } | undefined): string | true { return true; }
export function emailMessage(_email: unknown): string | true { return true; }
export function noteMessage(_note: unknown): string | true { return true; }
export function fixLines(_markers: { path: unknown[]; message: string; level: string }[], _value: Record<string, unknown> | undefined, _type: string): string[] { return []; }
export function fixSummary(_lines: string[]): string | null { return null; }
export function thingsToFix(_count: number): string | null { return null; }
