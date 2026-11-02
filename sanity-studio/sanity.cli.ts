import { defineCliConfig } from 'sanity/cli';

// Project "Kettlebird Website" in the Kettlebird Creations organisation (created 2026-11-01).
// SANITY_STUDIO_DATASET picks another dataset, for example `test`, without editing this file.
export default defineCliConfig({
  // The editor is served at /studio on the site (design-sign-in), and by `sanity dev` at
  // localhost:3333/studio. Built files and routes both use it.
  project: { basePath: '/studio' },
  api: {
    projectId: '1p6w5n0l',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
