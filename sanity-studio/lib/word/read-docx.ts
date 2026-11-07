// The Word reader: a .docx (Office Open XML) as the HTML the paste rules read (story-paste.ts), with its pictures
// and what the note needs to say. Pure: unzipping with fflate, XML with the parser it's given (the browser's
// DOMParser in the editor, jsdom's in tests). Spec: docs/specs/story-import-word.md AC-5, AC-6, AC-8.
import { strFromU8, unzipSync } from 'fflate';

export type WordProblemKind = 'locked' | 'unreadable' | 'empty';

/** A document that can't be added, and why (AC-5). */
export class WordProblem extends Error {
  constructor(readonly kind: WordProblemKind) {
    super(kind);
    this.name = 'WordProblem';
  }
}

export type PictureType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
export type PictureFailure = 'drawing' | 'format' | 'upload';

/** A picture where it sits in the text, as Word saved it. */
export interface WordPicture {
  /** Its place among the document's pictures, counting those that can't be added (AC-11). */
  number: number;
  data: Uint8Array;
  type: PictureType;
  /** Word's description, as saved. */
  wordAlt?: string;
  decorative: boolean;
  cropped: boolean;
  /** It sat beside the text, in a line with text, or beside another picture (AC-8). */
  moved: boolean;
}

export interface WordFacts {
  headings: string[];
  tables: number;
  footnotes: number;
  tracked: boolean;
  leftOut: { textBox: number; table: number; drawing: number };
}

export interface WordRead {
  /** Paragraphs (`p`, `em`, `strong`, `br`), scene breaks (`hr`) and pictures (`img data-picture="n"`, n into `pictures`). */
  html: string;
  pictures: WordPicture[];
  /** Pictures that can't be added, numbered among the document's pictures. */
  failed: { number: number; reason: PictureFailure }[];
  facts: WordFacts;
}

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const MC = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
const PICTURE_URI = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
const OLE = [0xd0, 0xcf, 0x11, 0xe0];

const TYPES: Record<string, PictureType> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', jpe: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
const DRAWINGS = new Set(['emf', 'wmf', 'emz', 'wmz']);

const children = (el: Element): Element[] => Array.from(el.childNodes).filter((n): n is Element => n.nodeType === 1);
const isW = (el: Element, name: string) => el.localName === name && el.namespaceURI === W;
const wChild = (el: Element | undefined, name: string) => (el ? children(el).find((c) => isW(c, name)) : undefined);
const wAttr = (el: Element | undefined, name: string) => el?.getAttributeNS(W, name) ?? el?.getAttribute(`w:${name}`) ?? null;
/** Every descendant with this local name (any namespace). */
const all = (el: Element, local: string): Element[] => Array.from(el.getElementsByTagName('*')).filter((e) => e.localName === local);
const first = (el: Element, local: string) => all(el, local)[0];
/** A w:b or w:i that's on: present, without val "0", "false" or "off". */
const on = (el: Element | undefined) => !!el && !['0', 'false', 'off'].includes(wAttr(el, 'val') ?? '');

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ESCAPES[c]);

/** A style's own bold and italic (undefined when it doesn't set them), what it's based on, and whether it's a heading. */
interface Style { name: string; bold?: boolean; italic?: boolean; basedOn?: string; heading: boolean }
type Where = { inNote?: boolean; inTable?: boolean; style?: string | null };
type Placed = { picture: WordPicture; anchored: boolean };
const VML_SHAPES = new Set(['shape', 'rect', 'roundrect', 'oval', 'line', 'polyline', 'arc', 'curve', 'group', 'image']);

function parse(xml: string, parseXml: (xml: string) => Document): Element {
  const doc = parseXml(xml);
  const root = doc.documentElement;
  if (!root || root.localName === 'parsererror' || doc.getElementsByTagName('parsererror').length) throw new WordProblem('unreadable');
  return root;
}

export function readDocx(bytes: Uint8Array, parseXml: (xml: string) => Document): WordRead {
  if (OLE.every((b, i) => bytes[i] === b)) throw new WordProblem('locked');
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes);
  } catch {
    throw new WordProblem('unreadable');
  }
  const text = (name: string) => (files[name] ? strFromU8(files[name]) : undefined);
  const documentXml = text('word/document.xml');
  if (!documentXml) throw new WordProblem('unreadable');
  return new Reader(files, parseXml).read(parse(documentXml, parseXml), text);
}

class Reader {
  private rels = new Map<string, string>();
  private styles = new Map<string, Style>();
  private notes = new Map<string, Element>();
  private noteOrder: string[] = [];
  private documentPictures = 0;
  private html: string[] = [];
  private pictures: WordPicture[] = [];
  private failed: WordRead['failed'] = [];
  private facts: WordFacts = { headings: [], tables: 0, footnotes: 0, tracked: false, leftOut: { textBox: 0, table: 0, drawing: 0 } };
  /** A drop cap waiting for the paragraph it starts. */
  private dropCap: { html: string; text: string } | null = null;

  constructor(private files: Record<string, Uint8Array>, private parseXml: (xml: string) => Document) {}

  read(document: Element, text: (name: string) => string | undefined): WordRead {
    const rels = text('word/_rels/document.xml.rels');
    if (rels) for (const rel of all(parse(rels, this.parseXml), 'Relationship')) this.rels.set(rel.getAttribute('Id') ?? '', rel.getAttribute('Target') ?? '');
    const styles = text('word/styles.xml');
    if (styles) this.readStyles(parse(styles, this.parseXml));
    for (const kind of ['footnote', 'endnote']) {
      const xml = text(`word/${kind}s.xml`);
      if (!xml) continue;
      for (const note of children(parse(xml, this.parseXml)).filter((c) => isW(c, kind))) {
        if (!note.getAttributeNS(W, 'type') && !note.getAttribute('w:type')) this.notes.set(`${kind}:${wAttr(note, 'id')}`, note);
      }
    }
    const body = wChild(document, 'body');
    if (!body) throw new WordProblem('unreadable');
    this.blocks(body);
    if (this.dropCap) this.html.push(`<p>${this.dropCap.html}</p>`);
    this.noteOrder.forEach((id, i) => {
      const note = this.notes.get(id);
      if (!note) return;
      const parts = children(note)
        .filter((c) => isW(c, 'p'))
        .map((p) => this.runs(p, { inNote: true }).html.trim())
        .filter(Boolean);
      this.html.push(`<p>[${i + 1}] ${parts.join(' ')}</p>`);
    });
    this.facts.footnotes = this.noteOrder.length;
    return { html: this.html.join(''), pictures: this.pictures, failed: this.failed, facts: this.facts };
  }

  /** How much has been left out so far. */
  private leftOut(): number {
    const { textBox, table, drawing } = this.facts.leftOut;
    return textBox + table + drawing + this.failed.length;
  }

  private readStyles(root: Element) {
    for (const style of children(root).filter((c) => isW(c, 'style'))) {
      const id = wAttr(style, 'styleId') ?? '';
      const name = wAttr(wChild(style, 'name'), 'val') ?? id;
      const rPr = wChild(style, 'rPr');
      const outline = wAttr(wChild(wChild(style, 'pPr'), 'outlineLvl'), 'val');
      const b = wChild(rPr, 'b');
      const i = wChild(rPr, 'i');
      this.styles.set(id, {
        name,
        bold: b ? on(b) : undefined,
        italic: i ? on(i) : undefined,
        basedOn: wAttr(wChild(style, 'basedOn'), 'val') ?? undefined,
        heading: /^heading [1-9]$/i.test(name) || /^(title|subtitle)$/i.test(name) || (outline !== null && Number(outline) < 9),
      });
    }
  }

  /** A style's bold or italic, through what it's based on; undefined when none of them sets it. */
  private styleMark(id: string | null | undefined, mark: 'bold' | 'italic'): boolean | undefined {
    const seen = new Set<string>();
    while (id && !seen.has(id)) {
      seen.add(id);
      const style = this.styles.get(id);
      if (!style) return undefined;
      if (style[mark] !== undefined) return style[mark];
      id = style.basedOn;
    }
    return undefined;
  }

  private blocks(parent: Element) {
    for (const el of children(parent)) {
      if (isW(el, 'p')) this.paragraph(el);
      else if (isW(el, 'tbl')) this.table(el);
      else if (isW(el, 'sdt')) {
        const content = wChild(el, 'sdtContent');
        if (content) this.blocks(content);
      } else if (isW(el, 'ins') || isW(el, 'moveTo')) {
        this.facts.tracked = true;
        this.blocks(el);
      } else if (isW(el, 'del') || isW(el, 'moveFrom')) this.facts.tracked = true;
    }
  }

  private paragraph(p: Element) {
    const pPr = wChild(p, 'pPr');
    const styleId = wAttr(wChild(pPr, 'pStyle'), 'val');
    const outline = wAttr(wChild(pPr, 'outlineLvl'), 'val');
    const heading = (styleId ? this.styles.get(styleId)?.heading : false) || (outline !== null && Number(outline) < 9);
    // A bottom border Word set to nil or none cancels a style's border: it isn't a line.
    const bottom = wChild(wChild(pPr, 'pBdr'), 'bottom');
    const border = !!bottom && !['nil', 'none', ''].includes(wAttr(bottom, 'val') ?? '');
    const markDeleted = !!wChild(wChild(pPr, 'rPr'), 'del');
    if (markDeleted) this.facts.tracked = true;
    const before = this.leftOut();
    const read = this.runs(p, { style: styleId });
    const { pictures, rule } = read;
    let { html, text } = read;
    // A drop cap (the big first letter of a chapter) is its own paragraph in Word: it starts the next one.
    const frame = wChild(pPr, 'framePr');
    if (frame && ['drop', 'margin'].includes(wAttr(frame, 'dropCap') ?? '') && text.trim() && !pictures.length) {
      this.dropCap = { html: (this.dropCap?.html ?? '') + html, text: (this.dropCap?.text ?? '') + text };
      return;
    }
    if (this.dropCap && text.trim()) {
      html = this.dropCap.html + html;
      text = this.dropCap.text + text;
      this.dropCap = null;
    }
    // A paragraph whose only content was left out isn't an empty line, so it makes no gap.
    const dropped = this.leftOut() !== before;
    const hasText = text.trim() !== '';
    // A paragraph deleted with track changes on: nothing of it is left, as if accepted.
    if (markDeleted && !hasText && !pictures.length && !rule) return;
    if (heading && hasText) this.facts.headings.push(text.trim());
    if (rule || (border && !hasText && pictures.length === 0)) {
      if (hasText) this.html.push(`<p>${html}</p>`);
      this.html.push('<hr>');
      return;
    }
    if (hasText || (pictures.length === 0 && !dropped)) this.html.push(`<p>${hasText ? html : ''}</p>`);
    for (const placed of pictures) {
      placed.picture.moved = placed.anchored || hasText || pictures.length > 1;
      this.html.push(`<img data-picture="${this.pictures.length}">`);
      this.pictures.push(placed.picture);
    }
  }

  private table(tbl: Element) {
    this.facts.tables += 1;
    for (const row of this.rows(tbl)) this.html.push(`<p>${row}</p>`);
  }

  /** A table's rows as text, each row's cells joined with " · "; a table in a cell joins its rows with spaces. */
  private rows(tbl: Element): string[] {
    const cell = (tc: Element): string =>
      children(tc)
        .flatMap((c) => (isW(c, 'p') ? [this.runs(c, { inTable: true }).html.trim()] : isW(c, 'tbl') ? this.rows(c) : []))
        .filter(Boolean)
        .join(' ');
    return children(tbl)
      .filter((c) => isW(c, 'tr'))
      .map((tr) =>
        children(tr)
          .filter((c) => isW(c, 'tc'))
          .map(cell)
          .filter(Boolean)
          .join(' · '),
      )
      .filter(Boolean);
  }

  /** A paragraph's runs as HTML and text, with the pictures placed in it and whether it's a drawn horizontal line. */
  private runs(p: Element, where: Where) {
    const out = { html: '', text: '', pictures: [] as Placed[], rule: false };
    const add = (value: string, bold: boolean, italic: boolean) => {
      if (!value) return;
      out.text += value;
      let html = escape(value).replace(/\n/g, '<br>');
      if (bold) html = `<strong>${html}</strong>`;
      if (italic) html = `<em>${html}</em>`;
      out.html += html;
    };
    const walk = (parent: Element) => {
      for (const el of children(parent)) {
        if (isW(el, 'r')) this.run(el, add, out, where);
        else if (isW(el, 'del') || isW(el, 'moveFrom')) this.facts.tracked = true;
        else if (isW(el, 'ins') || isW(el, 'moveTo')) {
          this.facts.tracked = true;
          walk(el);
        } else if (isW(el, 'hyperlink') || isW(el, 'smartTag') || isW(el, 'customXml') || isW(el, 'fldSimple')) walk(el);
        else if (isW(el, 'sdt')) {
          const content = wChild(el, 'sdtContent');
          if (content) walk(content);
        }
      }
    };
    walk(p);
    return out;
  }

  private run(
    r: Element,
    add: (value: string, bold: boolean, italic: boolean) => void,
    out: { pictures: Placed[]; rule: boolean },
    where: Where,
  ) {
    const rPr = wChild(r, 'rPr');
    const charStyle = wAttr(wChild(rPr, 'rStyle'), 'val');
    // The run's own formatting, else its character style's, else its paragraph style's (each through what it's based on).
    const mark = (name: 'b' | 'i', key: 'bold' | 'italic') => {
      const own = wChild(rPr, name);
      return own ? on(own) : (this.styleMark(charStyle, key) ?? this.styleMark(where.style, key) ?? false);
    };
    const bold = mark('b', 'bold');
    const italic = mark('i', 'italic');
    const items = (parent: Element): Element[] =>
      children(parent).flatMap((c) => {
        if (c.localName === 'AlternateContent' && c.namespaceURI === MC) {
          const choice = children(c).find((x) => x.localName === 'Choice') ?? children(c).find((x) => x.localName === 'Fallback');
          return choice ? items(choice) : [];
        }
        return [c];
      });
    for (const el of items(r)) {
      if (isW(el, 't')) add(el.textContent ?? '', bold, italic);
      else if (isW(el, 'tab')) add(' ', bold, italic);
      else if (isW(el, 'noBreakHyphen')) add('-', bold, italic);
      else if (isW(el, 'br')) {
        const type = wAttr(el, 'type');
        if (!type || type === 'textWrapping') add('\n', bold, italic);
      } else if (isW(el, 'cr')) add('\n', bold, italic);
      else if (isW(el, 'footnoteReference') || isW(el, 'endnoteReference')) {
        const id = `${isW(el, 'footnoteReference') ? 'footnote' : 'endnote'}:${wAttr(el, 'id')}`;
        if (!this.notes.has(id)) continue;
        if (!this.noteOrder.includes(id)) this.noteOrder.push(id);
        add(`[${this.noteOrder.indexOf(id) + 1}]`, false, false);
      } else if (isW(el, 'drawing')) this.drawing(el, out, where);
      else if (isW(el, 'pict')) this.vml(el, out, where);
    }
  }

  private drawing(el: Element, out: { pictures: Placed[] }, where: Where) {
    const frame = children(el)[0];
    if (!frame) return;
    if (all(frame, 'txbx').length || all(frame, 'txbxContent').length) {
      // Each picture in it once: pictures are pic:pic elements (a Fallback copy has none).
      this.facts.leftOut.textBox += all(frame, 'pic').length;
      return;
    }
    const data = first(frame, 'graphicData');
    if (data?.getAttribute('uri') !== PICTURE_URI) {
      this.facts.leftOut.drawing += 1;
      return;
    }
    if (where.inTable) {
      this.facts.leftOut.table += 1;
      return;
    }
    if (where.inNote) return;
    const blip = first(frame, 'blip');
    const rel = blip?.getAttributeNS(R, 'embed') ?? blip?.getAttribute('r:embed') ?? '';
    const docPr = first(frame, 'docPr');
    const decorative = all(frame, 'decorative').some((d) => ['1', 'true'].includes(d.getAttribute('val') ?? ''));
    const crop = first(frame, 'srcRect');
    const cropped = !!crop && ['l', 't', 'r', 'b'].some((side) => Number(crop.getAttribute(side) ?? 0) !== 0);
    this.place(rel, { wordAlt: docPr?.getAttribute('descr') ?? undefined, decorative, cropped }, frame.localName === 'anchor', out);
  }

  /** Older Word's shapes: a drawn horizontal line, a picture, or a text box. */
  private vml(el: Element, out: { pictures: Placed[]; rule: boolean }, where: Where) {
    // Only shapes: a v:shapetype is a template Word writes before its shapes, not something on the page.
    for (const shape of children(el).filter((c) => VML_SHAPES.has(c.localName))) {
      const hr = shape.getAttributeNS('urn:schemas-microsoft-com:office:office', 'hr') ?? shape.getAttribute('o:hr');
      if (hr === 't' || hr === 'true') {
        out.rule = true;
        continue;
      }
      if (all(shape, 'textbox').length) {
        this.facts.leftOut.textBox += all(shape, 'imagedata').length;
        continue;
      }
      const image = first(shape, 'imagedata');
      if (!image) this.facts.leftOut.drawing += 1;
      else if (where.inTable) this.facts.leftOut.table += 1;
      else if (!where.inNote) {
        const rel = image.getAttributeNS(R, 'id') ?? image.getAttribute('r:id') ?? '';
        this.place(rel, { wordAlt: shape.getAttribute('alt') ?? undefined, decorative: false, cropped: false }, false, out);
      }
    }
  }

  private place(
    rel: string,
    about: { wordAlt?: string; decorative: boolean; cropped: boolean },
    anchored: boolean,
    out: { pictures: Placed[] },
  ) {
    this.documentPictures += 1;
    const target = this.rels.get(rel) ?? '';
    // A target is relative to word/, or absolute from the package's root; ".." steps up a folder.
    const parts: string[] = [];
    for (const part of (target.startsWith('/') ? target.slice(1) : `word/${target}`).split('/')) {
      if (part === '..') parts.pop();
      else if (part && part !== '.') parts.push(part);
    }
    const path = parts.join('/');
    const data = this.files[path];
    const ext = (target.split('.').pop() ?? '').toLowerCase();
    const type = TYPES[ext];
    if (!data || !type) {
      this.failed.push({ number: this.documentPictures, reason: DRAWINGS.has(ext) ? 'drawing' : 'format' });
      return;
    }
    out.pictures.push({ picture: { number: this.documentPictures, data, type, wordAlt: about.wordAlt, decorative: about.decorative, cropped: about.cropped, moved: false }, anchored });
  }
}
