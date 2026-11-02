// The editor's settings that the site's Vitest can check: its title and which sign-in options it
// offers. No `sanity` imports. Spec: docs/specs/content-editing-sign-in.md (AC-3, AC-4).

export interface ProviderLike { name: string; title: string; url: string }

/** AC-3 */
export const STUDIO_TITLE = 'Kettlebird Creations';

/** Sanity's names for Google and for E-mail / password. GitHub, which Star doesn't use, is left out. */
const ALLOWED = ['google', 'sanity'];

/** AC-4: Sanity's providers, keeping only Google and E-mail / password, in Sanity's order. */
export function signInProviders<P extends ProviderLike>(defaults: P[]): P[] {
  return defaults.filter((provider) => ALLOWED.includes(provider.name));
}
