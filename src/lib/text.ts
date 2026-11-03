// Text Star types into a description, with its line breaks (tier:fix: returns were ignored).
// A single return starts a new line and a blank line leaves a gap, as Site settings' text does.

/** The lines of `text`, for showing with a break between each; an empty line shows as a gap. */
export function textLines(text: string | null | undefined): string[] {
  const trimmed = (text ?? '').replace(/\r\n?/g, '\n').trim();
  if (trimmed === '') return [];
  const lines = trimmed.split('\n').map((line) => line.trimEnd());
  // Several blank lines in a row show as one gap.
  return lines.filter((line, i) => line !== '' || lines[i - 1] !== '');
}

/** `text` on one line, for link previews. */
export function oneLine(text: string): string {
  return text.trim().split(/\s+/).join(' ');
}
