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

interface Style { name: string; bold: boolean; italic: boolean; heading: boolean }

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
      this.styles.set(id, {
        name,
        bold: on(wChild(rPr, 'b')),
        italic: on(wChild(rPr, 'i')),
        heading: /^heading [1-9]$/i.test(name) || /^(title|subtitle)$/i.test(name) || (outline !== null && Number(outline) < 9),
      });
    }
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
    const border = !!wChild(wChild(pPr, 'pBdr'), 'bottom');
    const before = this.leftOut();
    const { html, text, pictures, rule } = this.runs(p, {});
    // A paragraph whose only content was left out isn't an empty line, so it makes no gap.
    const dropped = this.leftOut() !== before;
    const hasText = text.trim() !== '';
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
    this.facts.leftOut.table += all(tbl, 'blip').length + all(tbl, 'imagedata').length;
    for (const tr of children(tbl).filter((c) => isW(c, 'tr'))) {
      const cells = children(tr)
        .filter((c) => isW(c, 'tc'))
        .map((tc) =>
          all(tc, 'p')
            .filter((p) => p.namespaceURI === W)
            .map((p) => this.runs(p, { inTable: true }).html.trim())
            .filter(Boolean)
            .join(' '),
        )
        .filter(Boolean);
      if (cells.length) this.html.push(`<p>${cells.join(' · ')}</p>`);
    }
  }

  /** A paragraph's runs as HTML and text, with the pictures placed in it and whether it's a drawn horizontal line. */
  private runs(p: Element, where: { inNote?: boolean; inTable?: boolean }) {
    const out = { html: '', text: '', pictures: [] as { picture: WordPicture; anchored: boolean }[], rule: false };
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
    out: { pictures: { picture: WordPicture; anchored: boolean }[]; rule: boolean },
    where: { inNote?: boolean; inTable?: boolean },
  ) {
    const rPr = wChild(r, 'rPr');
    const charStyle = this.styles.get(wAttr(wChild(rPr, 'rStyle'), 'val') ?? '');
    const bold = wChild(rPr, 'b') ? on(wChild(rPr, 'b')) : !!charStyle?.bold;
    const italic = wChild(rPr, 'i') ? on(wChild(rPr, 'i')) : !!charStyle?.italic;
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

  private drawing(el: Element, out: { pictures: { picture: WordPicture; anchored: boolean }[] }, where: { inNote?: boolean; inTable?: boolean }) {
    const frame = children(el)[0];
    if (!frame) return;
    if (all(frame, 'txbx').length || all(frame, 'txbxContent').length) {
      this.facts.leftOut.textBox += all(frame, 'blip').length;
      return;
    }
    const data = first(frame, 'graphicData');
    if (data?.getAttribute('uri') !== PICTURE_URI) {
      if (!where.inTable) this.facts.leftOut.drawing += 1;
      return;
    }
    if (where.inTable || where.inNote) return;
    const blip = first(frame, 'blip');
    const rel = blip?.getAttributeNS(R, 'embed') ?? blip?.getAttribute('r:embed') ?? '';
    const docPr = first(frame, 'docPr');
    const decorative = all(frame, 'decorative').some((d) => ['1', 'true'].includes(d.getAttribute('val') ?? ''));
    const crop = first(frame, 'srcRect');
    const cropped = !!crop && ['l', 't', 'r', 'b'].some((side) => Number(crop.getAttribute(side) ?? 0) !== 0);
    this.place(rel, { wordAlt: docPr?.getAttribute('descr') ?? undefined, decorative, cropped }, frame.localName === 'anchor', out);
  }

  /** Older Word's shapes: a drawn horizontal line, a picture, or a text box. */
  private vml(el: Element, out: { pictures: { picture: WordPicture; anchored: boolean }[]; rule: boolean }, where: { inNote?: boolean; inTable?: boolean }) {
    for (const shape of children(el)) {
      const hr = shape.getAttributeNS('urn:schemas-microsoft-com:office:office', 'hr') ?? shape.getAttribute('o:hr');
      if (hr === 't' || hr === 'true') {
        out.rule = true;
        continue;
      }
      if (all(shape, 'textbox').length) {
        this.facts.leftOut.textBox += all(shape, 'imagedata').length + all(shape, 'blip').length;
        continue;
      }
      const image = first(shape, 'imagedata');
      if (image && !where.inTable && !where.inNote) {
        const rel = image.getAttributeNS(R, 'id') ?? image.getAttribute('r:id') ?? '';
        this.place(rel, { wordAlt: shape.getAttribute('alt') ?? undefined, decorative: false, cropped: false }, false, out);
      } else if (!image && !where.inTable) this.facts.leftOut.drawing += 1;
    }
  }

  private place(
    rel: string,
    about: { wordAlt?: string; decorative: boolean; cropped: boolean },
    anchored: boolean,
    out: { pictures: { picture: WordPicture; anchored: boolean }[] },
  ) {
    this.documentPictures += 1;
    const target = this.rels.get(rel) ?? '';
    const path = target.startsWith('/') ? target.slice(1) : `word/${target}`.replace(/\/[^/]+\/\.\.\//g, '/');
    const data = this.files[path];
    const ext = (target.split('.').pop() ?? '').toLowerCase();
    const type = TYPES[ext];
    if (!data || !type) {
      this.failed.push({ number: this.documentPictures, reason: DRAWINGS.has(ext) ? 'drawing' : 'format' });
      return;
    }
    out.pictures.push({ picture: { data, type, wordAlt: about.wordAlt, decorative: about.decorative, cropped: about.cropped, moved: false }, anchored });
  }
}
