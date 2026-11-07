// Every text for writing from Word documents in the editor: the button, the drop space, the help, reading, the
// note, the messages, the replace question and the upload line. Pure. Spec: docs/specs/story-import-word.md;
// design: docs/design/story-import.md.
import type { WordDocument } from './upload';
import { FROM_WORD } from './pictures';

export type TextOf = 'chapter' | 'story';

export const UPLOAD_BUTTON = 'Upload a Word document';
export const UPLOAD_NEW = 'Upload a new version';
export const UPLOAD_HINT = '.docx, or drop one below';
export const DROP_OVER = 'Drop the file here';
export const ACCEPT = '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const CHAPTER_TEXT_HELP =
  "Upload the chapter as a Word document (.docx). Its text and pictures come in; Word's layout and picture sizes don't. To change them, change the document and upload it again.";
export const ONE_SHOT_TEXT_HELP = 'For a one-shot: upload the whole story as a Word document (.docx). For a story in chapters, add chapters instead.';
export const MAX_BYTES = 50 * 1024 * 1024;
export { FROM_WORD };

export const dropEmpty = (of: TextOf) => `No text yet. Drop the ${of}'s .docx here, or use ${UPLOAD_BUTTON}.`;

export function readingLine(name: string, picture?: number, total?: number): string {
  return picture && total ? `Reading ${name}… adding picture ${picture} of ${total}.` : `Reading ${name}…`;
}

/** AC-4: a problem with a file, from its name and size, before it's read; null when it can be read. */
export function fileProblem(file: { name: string; size: number }, of: TextOf): string | null {
  const name = file.name;
  const ext = /\.([^.]+)$/.exec(name)?.[1]?.toLowerCase();
  if (ext === 'doc') return `${name} is an older Word file, which can't be read here. Open it in Word or Google Docs, save or download it as .docx, and upload that.`;
  if (ext === 'gdoc') return `${name} is a link to a Google Doc, not the document. In Google Docs, choose File, Download, Microsoft Word (.docx), and upload that.`;
  if (ext !== 'docx') {
    return `${name} isn't a Word document. Upload the ${of} as a .docx: in Word, File, Save As, Word Document; in Google Docs, File, Download, Microsoft Word (.docx).`;
  }
  if (file.size > MAX_BYTES) return `${name} is over 50 MB, too big to read here. Make its pictures smaller in Word (Compress Pictures), or split the chapter.`;
  return null;
}

/** AC-5 */
export function readProblem(kind: 'locked' | 'empty' | 'unreadable', name: string): string {
  if (kind === 'locked') return `${name} is locked with a password. Save an unlocked copy and upload that.`;
  if (kind === 'empty') return `${name} has no words in it, so nothing was added.`;
  return `Something went wrong reading ${name}, and nothing was added. Try again.`;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const list = (items: string[]) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

const REASONS = {
  drawing: "it's a drawing made in Word, which the site can't show",
  format: "it's in a format the site can't show",
  upload: "it couldn't be uploaded",
};

/** AC-11: the note after an upload, line by line. */
export function uploadNote(input: { fileName: string; doc: WordDocument; what: TextOf; onlyOne?: boolean }): string[] {
  const { fileName, doc, what } = input;
  const { counts, facts } = doc;
  const parts = [
    counts.paragraphs && plural(counts.paragraphs, 'paragraph', 'paragraphs'),
    counts.sceneBreaks && plural(counts.sceneBreaks, 'scene break', 'scene breaks'),
    counts.pictures && plural(counts.pictures, 'picture', 'pictures'),
  ].filter((p): p is string => !!p);
  const marks = [counts.italics && 'italics', counts.bold && 'bold'].filter(Boolean).join(' and ');
  const added = `${input.onlyOne ? 'Only one document at a time: added' : 'Added'} ${fileName}: ${list(parts)}${marks ? `, with its ${marks}` : ''}.`;
  const lines = [added];
  if (doc.firstLine) lines.push(`Its first line, "${doc.firstLine}", was left out, as the ${what}'s title shows it.`);
  const headings = facts.headings;
  if (headings.length) {
    const named = list(headings.map((h) => `"${h}"`));
    lines.push(headings.length === 1 ? `1 heading came in as a plain paragraph: ${named}.` : `${headings.length} headings came in as plain paragraphs: ${named}.`);
  }
  if (facts.tables) lines.push(`${plural(facts.tables, 'table', 'tables')} came in as plain paragraphs, one per row.`);
  if (facts.footnotes) lines.push(`${plural(facts.footnotes, 'footnote', 'footnotes')} came in at the end, numbered.`);
  const moved = doc.pictures.filter((p) => p.moved).length;
  if (moved) {
    lines.push(
      moved === 1
        ? '1 picture that sat beside the text now sits below its paragraph.'
        : `${moved} pictures that sat beside the text now sit below their paragraphs.`,
    );
  }
  const { textBox, table, drawing } = facts.leftOut;
  if (textBox) lines.push(textBox === 1 ? '1 picture in a text box was left out.' : `${textBox} pictures in text boxes were left out.`);
  if (table) lines.push(table === 1 ? '1 picture in a table was left out.' : `${table} pictures in tables were left out.`);
  if (drawing) lines.push(drawing === 1 ? '1 drawing or chart made in Word was left out.' : `${drawing} drawings or charts made in Word were left out.`);
  doc.pictures.forEach((p, i) => {
    if (p.cropped) {
      lines.push(`Picture ${i + 1} is cropped in Word, so the whole picture came in. In Word, choose Compress Pictures, Delete cropped areas, and upload again.`);
    }
  });
  const fromWord = doc.pictures.filter((p) => p.fromWord).length;
  if (fromWord) lines.push(fromWord === 1 ? '1 alt text came from Word: check it.' : `${fromWord} alt texts came from Word: check them.`);
  if (facts.tracked) {
    lines.push('It had tracked changes, and they came in as if accepted: check them, or accept or reject them in Word and upload it again.');
  }
  if (counts.sceneBreaks >= 3 && counts.sceneBreaks * 5 > counts.paragraphs) {
    lines.push("That's a lot of scene breaks: the document may use empty paragraphs for spacing. Use Word's line spacing instead, and upload it again.");
  }
  for (const f of doc.failed) {
    const fix = f.reason === 'upload' ? 'Upload the document again to try again, or publish without it.' : 'Save it in the document as a picture (JPEG or PNG) and upload again, or publish without it.';
    lines.push(`Picture ${f.number} in ${fileName} couldn't be added (${REASONS[f.reason]}), so the ${what} was added without it. ${fix}`);
  }
  lines.push(`Check the ${what}, then publish.`);
  return lines;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2:38 pm" today, "5 November" this year, "7 November 2025" before. */
export function addedTime(iso: string, today: Date): string {
  const d = new Date(iso);
  if (d.toDateString() === today.toDateString()) {
    const h = d.getHours() % 12 || 12;
    return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() < 12 ? 'am' : 'pm'}`;
  }
  const day = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return d.getFullYear() === today.getFullYear() ? day : `${day} ${d.getFullYear()}`;
}

const counted = (paragraphs: number, pictures: number) =>
  [plural(paragraphs, 'paragraph', 'paragraphs'), pictures && plural(pictures, 'picture', 'pictures')].filter(Boolean).join(', ');

/** AC-14: the question before replacing a text. */
export function replaceQuestion(input: {
  what: { number?: number };
  now: { fileName?: string; addedAt?: string; paragraphs: number; pictures: number };
  next: { fileName: string; paragraphs: number; pictures: number; kept: number; fresh: number };
  today: Date;
}): { title: string; lines: string[]; cancel: string; confirm: string } {
  const { now, next } = input;
  const title = input.what.number !== undefined ? `Replace Chapter ${input.what.number}'s text?` : "Replace the story's text?";
  const was = now.fileName && now.addedAt ? `Now: ${now.fileName}, added ${addedTime(now.addedAt, input.today)}: ` : 'Now: ';
  const matched = [
    next.kept && (next.kept === 1 ? '1 keeps its alt text' : `${next.kept} keep their alt text`),
    next.fresh && (next.fresh === 1 ? '1 is new' : `${next.fresh} are new`),
  ].filter(Boolean);
  return {
    title,
    lines: [
      `${was}${counted(now.paragraphs, now.pictures)}.`,
      `New: ${next.fileName}: ${counted(next.paragraphs, next.pictures)}${matched.length ? `; ${matched.join(', ')}` : ''}.`,
      'Anything changed in the editor since the last upload (alt text, Decorative) is kept for pictures that are still there. You can undo this until you publish.',
    ],
    cancel: 'Cancel',
    confirm: 'Replace',
  };
}

export const UNDO = 'Undo this upload';
export const UNDO_QUESTION = { title: "Undo this upload? Alt text you've typed since will go too.", cancel: 'Cancel', confirm: 'Undo' };

/** AC-16: the line above the text. */
export function uploadLine(input: { fileName: string; addedAt: string; published: boolean; today: Date }): { text: string; undo?: string } {
  const text = `${input.fileName}, added ${addedTime(input.addedAt, input.today)}`;
  return input.published ? { text } : { text: `${text}, not published yet`, undo: UNDO };
}
