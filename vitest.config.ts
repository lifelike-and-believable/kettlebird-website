/// <reference types="vitest" />
// getViteConfig compiles .astro components, so unit tests can render them with Astro's container API.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: { include: ['tests/unit/**/*.test.{ts,tsx}'] },
});
