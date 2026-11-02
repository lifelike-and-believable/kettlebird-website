// Field names and help text for the four Site settings items (design-site-settings, Fields).
import { SETTINGS_FIELDS } from '../../lib/site-settings';

export const settingsText = (type: string, field: string) => {
  const { label, description } = SETTINGS_FIELDS[type][field];
  return { title: label, description };
};

/** The starting values as an initial value: Sanity needs a _key on every item in a list. */
export function withKeys(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([field, v]) => [
      field,
      Array.isArray(v) ? v.map((item, i) => ({ _key: `start${i + 1}`, ...(item as object) })) : v,
    ]),
  );
}
