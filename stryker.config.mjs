// Stryker mutation testing (rfr-process 0.9.3, profile static-site). Advisory: the `process /
// mutation` job reports the score and surviving mutants on tier:story and tier:epic pull requests and
// never fails the build.
export default {
  testRunner: 'vitest',
  // Only the logic the unit tests cover: the reader's model (src/lib, the profile's default) and the
  // editor's comic page rules (sanity-studio/lib, a folder of pure logic the profile says to add).
  // The Sanity loaders (queries.ts, source.ts) are covered by the end-to-end tests over fixtures.
  // Astro pages and Studio components are checked by the end-to-end tests and tutorials, which
  // Stryker doesn't run, so their mutants would all survive and hide the useful ones.
  mutate: ['src/lib/**/*.ts', 'sanity-studio/lib/**/*.ts', '!**/*.d.ts', '!src/lib/sanity.ts', '!src/lib/queries.ts', '!src/lib/comics/source.ts', '!src/lib/preview/load.ts', '!src/lib/commission-cards.ts', '!sanity-studio/lib/upload-store.ts'],
  reporters: ['json', 'html', 'clear-text', 'progress'],
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
  htmlReporter: { fileName: 'reports/mutation/mutation.html' },
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  thresholds: { high: 80, low: 60, break: null },
  tempDirName: '.stryker-tmp',
  cleanTempDir: 'always',
  // The Studio has its own node_modules; Stryker doesn't need to copy it into its sandbox.
  ignorePatterns: ['sanity-studio/node_modules', 'sanity-studio/dist', 'dist', '.rfr', 'tutorial-recordings', 'test-results', 'playwright-report'],
};
