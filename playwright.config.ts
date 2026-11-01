// End-to-end tests run against a fixture build of the site (KETTLEBIRD_FIXTURES=1), served by
// `astro preview`. Spec: docs/specs/comic-reader-start-and-turn.md.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run build:fixtures && npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}/comics`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
