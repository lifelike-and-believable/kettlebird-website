import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { buildInfo } from './src/integrations/build-info.ts';

// The site's own address: shared links, link previews and canonical addresses use it
// (design-comic-share-and-announce, Addresses). Change it here, or with SITE_URL, when the site moves.
const site = process.env.SITE_URL ?? 'https://newsite.kettlebird.com';

export default defineConfig({
  site,
  integrations: [react(), buildInfo()],
  srcDir: 'src',
  output: 'static'
});
