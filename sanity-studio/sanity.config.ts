import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import schemaTypes from './schemas';

export default defineConfig({
  name: 'kettlebirdStudio',
  title: 'Kettlebird Creations Studio',
  projectId: process.env.SANITY_PROJECT_ID || 'gtopiz2h',
  dataset: process.env.SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});
