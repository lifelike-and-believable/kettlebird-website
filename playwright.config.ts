// End-to-end tests run against a fixture build of the site (KETTLEBIRD_FIXTURES=1), served by
// its standalone Node server. Specs: docs/specs/comic-reader-start-and-turn.md, docs/specs/content-editing-preview.md.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // The fixture build uses the Node adapter (astro.config.mjs), served by its own standalone server.
    command: `npm run build:fixtures && HOST=127.0.0.1 PORT=${PORT} node dist/server/entry.mjs`,
    url: `http://127.0.0.1:${PORT}/comics`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
