import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import schemaTypes from './schemas';

export default defineConfig({
  name: 'kettlebirdStudio',
  title: 'Kettlebird Creations Studio',
  // Only SANITY_STUDIO_* settings reach the editor in the browser.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '1p6w5n0l',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});
