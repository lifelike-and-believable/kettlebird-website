import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { buildInfo } from './src/integrations/build-info.ts';

export default defineConfig({
  integrations: [react(), buildInfo()],
  srcDir: 'src',
  output: 'static'
});
