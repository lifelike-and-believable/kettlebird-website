import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import { buildInfo } from './src/integrations/build-info.ts';
import { seoFiles } from './src/integrations/seo-files.ts';

// The site's own address: shared links, link previews and canonical addresses use it
// (design-comic-share-and-announce, Addresses). Change it here, or with SITE_URL, when the site moves.
// Search engines may list the site only at https://kettlebird.com (docs/specs/site-search.md AC-1).
const site = process.env.SITE_URL ?? 'https://newsite.kettlebird.com';

// Every page is built ahead of time except /preview/, which is made on request
// (docs/specs/content-editing-preview.md). Builds on Vercel use the Vercel adapter, including
// pull-request previews, which are fixture builds (KETTLEBIRD_FIXTURES=1 for Preview, lead's
// decision 2026-11-01). Fixture builds elsewhere, for tests and tutorials, use the Node adapter,
// because `astro preview` doesn't run Vercel builds.
const fixtures = process.env.KETTLEBIRD_FIXTURES === '1';
const onVercel = process.env.VERCEL === '1';

export default defineConfig({
  site,
  integrations: [react(), buildInfo(), seoFiles()],
  srcDir: 'src',
  output: 'static',
  adapter: fixtures && !onVercel ? node({ mode: 'standalone' }) : vercel(),
  // Fixed at build time, so pages made on request (the preview route) know a fixture build too.
  vite: { define: { __KETTLEBIRD_FIXTURES__: JSON.stringify(fixtures) } },
  env: {
    schema: {
      // Read only by the preview route, when a preview is requested; never during the build.
      SANITY_PREVIEW_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
