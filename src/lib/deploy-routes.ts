// With the Vercel adapter, Vercel takes its routing from .vercel/output/config.json and ignores
// vercel.json's headers and rewrites. scripts/vercel-output.mjs turns those into routes and adds
// them to the adapter's config after the build, so vercel.json stays the one place they're written.
// Spec: docs/specs/content-editing-preview.md (AC-12). Pure.

export interface VercelRoute {
  src?: string;
  dest?: string;
  status?: number;
  headers?: Record<string, string>;
  continue?: boolean;
  handle?: string;
}

export interface VercelConfig {
  version: number;
  routes: VercelRoute[];
  [key: string]: unknown;
}

/** The parts of vercel.json that the adapter's output leaves out. */
export interface VercelJson {
  headers?: { source: string; headers: { key: string; value: string }[] }[];
  rewrites?: { source: string; destination: string }[];
}

/** A vercel.json source ("/(.*)", "/studio/:path*", "/build-info.json") as a route's regular expression. */
export function sourceToRegex(_source: string): string {
  throw new Error('not implemented');
}

/** Adds vercel.json's headers (before everything) and rewrites (after files, before the catch-all 404). */
export function withSiteRoutes(_config: VercelConfig, _vercel: VercelJson): VercelConfig {
  throw new Error('not implemented');
}
