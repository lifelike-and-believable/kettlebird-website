// Stub for the tests-first commit; see docs/specs/content-editing-know-when-live.md.
export const CONTENT_TYPES: string[] = [];
export const NOTE_AFTER_PUBLISH = 'stub';
export const DIDNT_GO_LIVE_EXPLANATION = 'stub';
export interface Change { _type: string; _updatedAt: string; slug?: string; seriesSlug?: string; number?: number }
export interface BuildInfo { contentReadAt: string; builtAt: string }
export interface StatusInput { latest: Change | null; removedAt: string | null; pending: number; build: BuildInfo | null; now: Date; error?: boolean; timeZone?: string }
export type StatusKind = 'none' | 'updating' | 'slow' | 'failed' | 'live' | 'removed' | 'offline';
export interface Status { kind: StatusKind; label: string; viewPath?: string }
export function liveStatus(_input: StatusInput): Status { return { kind: 'none', label: 'stub' }; }
export function formatWhen(_at: string | Date, _now: Date, _timeZone?: string): string { return 'stub'; }
export function viewOnSitePath(_change: Change): string | undefined { return 'stub'; }
