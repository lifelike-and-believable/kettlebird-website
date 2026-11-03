import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import { buildInfo } from './src/integrations/build-info.ts';

// The site's own address: shared links, link previews and canonical addresses use it
// (design-comic-share-and-announce, Addresses). Change it here, or with SITE_URL, when the site moves.
const site = process.env.SITE_URL ?? 'https://newsite.kettlebird.com';

// Every page is built ahead of time except /preview/, which is made on request
// (docs/specs/content-editing-preview.md). Deployed builds use the Vercel adapter; fixture builds,
// for tests and tutorials, use the Node adapter, because `astro preview` doesn't run Vercel builds.
const fixtures = process.env.KETTLEBIRD_FIXTURES === '1';

export default defineConfig({
  site,
  integrations: [react(), buildInfo()],
  srcDir: 'src',
  output: 'static',
  adapter: fixtures ? node({ mode: 'standalone' }) : vercel(),
  // Fixed at build time, so pages made on request (the preview route) know a fixture build too.
  vite: { define: { __KETTLEBIRD_FIXTURES__: JSON.stringify(fixtures) } },
  env: {
    schema: {
      // Read only by the preview route, when a preview is requested; never during the build.
      SANITY_PREVIEW_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
