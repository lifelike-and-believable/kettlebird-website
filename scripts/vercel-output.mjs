#!/usr/bin/env node
// After `astro build` (Vercel adapter) and the editor's build: copy the editor into the deployed files,
// and add vercel.json's headers and rewrites to the adapter's routing, which Vercel uses instead of
// vercel.json. Spec: docs/specs/content-editing-preview.md (AC-12).
// Usage: node --experimental-strip-types scripts/vercel-output.mjs
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { withSiteRoutes } from '../src/lib/deploy-routes.ts';

const OUTPUT = '.vercel/output';
const configPath = `${OUTPUT}/config.json`;
if (!existsSync(configPath)) {
  console.error(`${configPath} is missing: run astro build with the Vercel adapter first.`);
  process.exit(1);
}
if (!existsSync('dist/studio/index.html')) {
  console.error('dist/studio/index.html is missing: run npm run build:studio first.');
  process.exit(1);
}
cpSync('dist/studio', `${OUTPUT}/static/studio`, { recursive: true });
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const config = withSiteRoutes(JSON.parse(readFileSync(configPath, 'utf8')), vercel);
writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`vercel-output: editor copied, ${config.routes.length} routes written to ${configPath}.`);
