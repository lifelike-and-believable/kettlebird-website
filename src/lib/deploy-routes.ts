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
export function sourceToRegex(source: string): string {
  const body = source
    .replace(/\.(?!\*)/g, '\\.') // a literal dot, not the `.` of `(.*)`
    .replace(/\/:[A-Za-z]+\*$/, '(?:/(.*))?');
  return `^${body}$`;
}

const sameRoute = (a: VercelRoute, b: VercelRoute) => JSON.stringify(a) === JSON.stringify(b);

/** Adds vercel.json's headers (before everything) and rewrites (after files, before the catch-all 404). */
export function withSiteRoutes(config: VercelConfig, vercel: VercelJson): VercelConfig {
  const headerRoutes: VercelRoute[] = (vercel.headers ?? []).map((h) => ({
    src: sourceToRegex(h.source),
    headers: Object.fromEntries(h.headers.map(({ key, value }) => [key, value])),
    continue: true,
  }));
  const rewriteRoutes: VercelRoute[] = (vercel.rewrites ?? []).map((r) => ({ src: sourceToRegex(r.source), dest: r.destination }));
  const ours = [...headerRoutes, ...rewriteRoutes];
  // Running twice gives the same result: drop any routes added before.
  const theirs = config.routes.filter((route) => !ours.some((o) => sameRoute(o, route)));
  const catchAll = theirs.findIndex((route) => route.status === 404);
  const at = catchAll === -1 ? theirs.length : catchAll;
  return { ...config, routes: [...headerRoutes, ...theirs.slice(0, at), ...rewriteRoutes, ...theirs.slice(at)] };
}
