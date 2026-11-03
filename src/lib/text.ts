// Text Star types into a description, with its line breaks (tier:fix: returns were ignored).
// STUB: tests first.

/** The lines of `text`, for showing with a break between each; an empty line shows as a gap. */
export function textLines(_text: string | null | undefined): string[] {
  return [];
}

/** `text` on one line, for link previews. */
export function oneLine(text: string): string {
  return text;
}
