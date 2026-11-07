// Edge cases for writing from Word documents, with small documents built here from XML: the reader's handling of
// borders, tracked deletions, styles, drop caps, tables, older Word's shapes, notes and pictures; and the pure
// helpers' corners. Found by code review and mutation testing. Criteria: docs/specs/story-import-word.md.
import { createRequire } from 'node:module';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import type { Block } from '../../sanity-studio/lib/stories';
import { altFromWord, editedSince, inUndoCopies, matchPictures, pictureAssets, resaveSize, undoFrom, undoSnapshot } from '../../sanity-studio/lib/word/pictures';
import { readDocx, WordProblem } from '../../sanity-studio/lib/word/read-docx';
import { leftOutFirstLine, readWordDocument } from '../../sanity-studio/lib/word/upload';

const { JSDOM } = createRequire(import.meta.url)('jsdom') as { JSDOM: new (html: string) => { window: Window & typeof globalThis } };
const window = new JSDOM('').window;
const parseXml = (xml: string) => new window.DOMParser().parseFromString(xml, 'application/xml');
const parseHtml = (html: string) => new JSDOM(html).window.document;

const NS =
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
  'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
  'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" ' +
  'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" ' +
  'xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative"';
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);

/** A .docx from its body XML, styles, notes and media (named by relationship id: rIdName -> media/name). */
function docx(body: string, extra: { styles?: string; footnotes?: string; endnotes?: string; media?: Record<string, Uint8Array>; rels?: string } = {}) {
  const media = extra.media ?? {};
  const rels = Object.keys(media)
    .map((name) => `<Relationship Id="rId_${name.replace(/\W/g, '_')}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`)
    .join('');
  const files: Record<string, Uint8Array> = {
    'word/document.xml': strToU8(`<?xml version="1.0"?><w:document ${NS}><w:body>${body}</w:body></w:document>`),
    'word/_rels/document.xml.rels': strToU8(`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}${extra.rels ?? ''}</Relationships>`),
  };
  if (extra.styles) files['word/styles.xml'] = strToU8(`<?xml version="1.0"?><w:styles ${NS}>${extra.styles}</w:styles>`);
  if (extra.footnotes) files['word/footnotes.xml'] = strToU8(`<?xml version="1.0"?><w:footnotes ${NS}>${extra.footnotes}</w:footnotes>`);
  if (extra.endnotes) files['word/endnotes.xml'] = strToU8(`<?xml version="1.0"?><w:endnotes ${NS}>${extra.endnotes}</w:endnotes>`);
  for (const [name, data] of Object.entries(media)) files[`word/media/${name}`] = data;
  return zipSync(files);
}
const rel = (name: string) => `rId_${name.replace(/\W/g, '_')}`;
const t = (text: string) => `<w:r><w:t xml:space="preserve">${text}</w:t></w:r>`;
const p = (inner = '', pPr = '') => `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${inner}</w:p>`;
const picture = (name: string, opts: { alt?: string; anchor?: boolean; crop?: string; decorative?: string } = {}) => {
  const frame = opts.anchor ? 'wp:anchor' : 'wp:inline';
  const ext = opts.decorative !== undefined ? `<a:extLst><a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}"><adec:decorative val="${opts.decorative}"/></a:ext></a:extLst>` : '';
  return (
    `<w:r><w:drawing><${frame}><wp:docPr id="1" name="x"${opts.alt !== undefined ? ` descr="${opts.alt}"` : ''}>${ext}</wp:docPr>` +
    `<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:blipFill><a:blip r:embed="${rel(name)}"/>${opts.crop ?? ''}</pic:blipFill></pic:pic></a:graphicData></a:graphic></${frame}></w:drawing></w:r>`
  );
};
const read = (body: string, extra?: Parameters<typeof docx>[1]) => readDocx(docx(body, extra), parseXml);
const doc = (body: string, extra?: Parameters<typeof docx>[1], titles = {}) => readWordDocument(docx(body, extra), { parseXml, parseHtml, titles, key: () => 'k' });
const shapes = (blocks: Block[]) =>
  blocks.map((b) =>
    b._type === 'sceneBreak'
      ? '⁂'
      : b._type === 'storyPicture'
        ? `[picture ${(b as Block & { picture: number }).picture + 1}]`
        : (b.children ?? []).map((c) => (c.marks?.includes('em') ? `*${c.text}*` : c.marks?.includes('strong') ? `**${c.text}**` : c.text)).join(''),
  );

describe('story-import-word#AC-6 edges: borders and tracked deletions', () => {
  it('takes a bottom border set to nil or none as no line', () => {
    for (const val of ['nil', 'none']) {
      expect(read(p(t('One')) + p('', `<w:pBdr><w:bottom w:val="${val}"/></w:pBdr>`) + p(t('Two'))).html, val).toBe('<p>One</p><p></p><p>Two</p>');
    }
    expect(read(p('', '<w:pBdr><w:bottom/></w:pBdr>')).html).toBe('<p></p>');
    expect(read(p('', '<w:pBdr><w:bottom w:val="single"/></w:pBdr>')).html).toBe('<hr>');
    expect(read(p('', '<w:pBdr><w:top w:val="single"/></w:pBdr>')).html).toBe('<p></p>');
    // With text on it, the border's paragraph stays and the line follows it.
    expect(read(p(t('Under'), '<w:pBdr><w:bottom w:val="single"/></w:pBdr>')).html).toBe('<p>Under</p>');
  });

  it('leaves out a paragraph deleted with track changes on, without making a gap', () => {
    const deleted = p('<w:del w:id="1"><w:r><w:delText>Gone.</w:delText></w:r></w:del>', '<w:rPr><w:del w:id="2"/></w:rPr>');
    const result = doc(p(t('Kept one.')) + deleted + deleted + p(t('Kept two.')));
    expect(shapes(result.blocks)).toEqual(['Kept one.', 'Kept two.']);
    expect(result.facts.tracked).toBe(true);
    // A deleted mark on a paragraph that still has text keeps the text.
    expect(read(p(t('Still here.'), '<w:rPr><w:del w:id="3"/></w:rPr>')).html).toBe('<p>Still here.</p>');
    // An empty paragraph without a deleted mark is still an empty line.
    expect(read(p(t('A')) + p() + p() + p(t('B'))).html).toBe('<p>A</p><p></p><p></p><p>B</p>');
  });

  it('accepts insertions and drops deletions and moves, in paragraphs and between them', () => {
    const body =
      p(t('A') + '<w:moveFrom w:id="1">' + t('X') + '</w:moveFrom>' + '<w:moveTo w:id="2">' + t('B') + '</w:moveTo>') +
      '<w:ins w:id="3">' + p(t('Inserted paragraph.')) + '</w:ins>' +
      '<w:del w:id="4">' + p(t('Deleted paragraph.')) + '</w:del>';
    const result = read(body);
    expect(result.html).toBe('<p>AB</p><p>Inserted paragraph.</p>');
    expect(result.facts.tracked).toBe(true);
    expect(read('<w:moveTo w:id="1">' + p(t('M')) + '</w:moveTo>').facts.tracked).toBe(true);
    expect(read('<w:moveFrom w:id="1">' + p(t('M')) + '</w:moveFrom>')).toMatchObject({ html: '', facts: { tracked: true } });
    expect(read(p(t('Plain'))).facts.tracked).toBe(false);
  });
});

describe('story-import-word#AC-6 edges: italics and bold from styles', () => {
  const styles =
    '<w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:rPr><w:i/></w:rPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Letter"><w:name w:val="Letter"/><w:basedOn w:val="Quote"/></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
    '<w:style w:type="character" w:styleId="Emphasis"><w:name w:val="Emphasis"/><w:rPr><w:i/></w:rPr></w:style>' +
    '<w:style w:type="character" w:styleId="Thoughts"><w:name w:val="Thoughts"/><w:basedOn w:val="Emphasis"/></w:style>' +
    '<w:style w:type="character" w:styleId="Plain"><w:name w:val="Plain"/><w:rPr><w:i w:val="0"/></w:rPr></w:style>' +
    '<w:style w:type="character" w:styleId="Loop"><w:name w:val="Loop"/><w:basedOn w:val="Loop"/></w:style>' +
    '<w:style w:type="character" w:styleId="Strong"><w:name w:val="Strong"/><w:rPr><w:b w:val="1"/></w:rPr></w:style>';
  const run = (text: string, rPr: string) => `<w:r><w:rPr>${rPr}</w:rPr><w:t>${text}</w:t></w:r>`;

  it('takes them from the paragraph style and what it is based on', () => {
    expect(read(p(t('Dear Tam,'), '<w:pStyle w:val="Quote"/>'), { styles }).html).toBe('<p><em>Dear Tam,</em></p>');
    expect(read(p(t('Love, M.'), '<w:pStyle w:val="Letter"/>'), { styles }).html).toBe('<p><em>Love, M.</em></p>');
    expect(read(p(t('Plain.'), '<w:pStyle w:val="Normal"/>'), { styles }).html).toBe('<p>Plain.</p>');
    expect(read(p(t('Nobody knows.'), '<w:pStyle w:val="Missing"/>'), { styles }).html).toBe('<p>Nobody knows.</p>');
  });

  it('takes them from a character style and what it is based on, before the paragraph style', () => {
    expect(read(p(run('think', '<w:rStyle w:val="Thoughts"/>')), { styles }).html).toBe('<p><em>think</em></p>');
    expect(read(p(run('upright', '<w:rStyle w:val="Plain"/>'), '<w:pStyle w:val="Quote"/>'), { styles }).html).toBe('<p>upright</p>');
    expect(read(p(run('loop', '<w:rStyle w:val="Loop"/>')), { styles }).html).toBe('<p>loop</p>');
    expect(read(p(run('bold', '<w:rStyle w:val="Strong"/>')), { styles }).html).toBe('<p><strong>bold</strong></p>');
  });

  it("lets the run's own setting win, on or off", () => {
    expect(read(p(run('off', '<w:i w:val="false"/>'), '<w:pStyle w:val="Quote"/>'), { styles }).html).toBe('<p>off</p>');
    expect(read(p(run('off', '<w:i w:val="off"/>'), '<w:pStyle w:val="Quote"/>'), { styles }).html).toBe('<p>off</p>');
    expect(read(p(run('on', '<w:rStyle w:val="Plain"/><w:i w:val="true"/>')), { styles }).html).toBe('<p><em>on</em></p>');
    expect(read(p(run('both', '<w:b/><w:i/>'))).html).toBe('<p><em><strong>both</strong></em></p>');
    expect(read(p(run('not', '<w:b w:val="0"/>'))).html).toBe('<p>not</p>');
  });

  it('knows headings by style name, title, or outline level, whatever their ids', () => {
    const headingStyles =
      '<w:style w:type="paragraph" w:styleId="berschrift1"><w:name w:val="heading 1"/></w:style>' +
      '<w:style w:type="paragraph" w:styleId="T"><w:name w:val="Title"/></w:style>' +
      '<w:style w:type="paragraph" w:styleId="S"><w:name w:val="subtitle"/></w:style>' +
      '<w:style w:type="paragraph" w:styleId="O"><w:name w:val="Mine"/><w:pPr><w:outlineLvl w:val="2"/></w:pPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="N"><w:name w:val="heading 10"/><w:pPr><w:outlineLvl w:val="9"/></w:pPr></w:style>';
    const body =
      p(t('One'), '<w:pStyle w:val="berschrift1"/>') + p(t('Two'), '<w:pStyle w:val="T"/>') + p(t('Three'), '<w:pStyle w:val="S"/>') +
      p(t('Four'), '<w:pStyle w:val="O"/>') + p(t('Five'), '<w:outlineLvl w:val="0"/>') + p(t('Six'), '<w:outlineLvl w:val="9"/>') +
      p(t('Seven'), '<w:pStyle w:val="N"/>') + p('', '<w:pStyle w:val="T"/>');
    expect(read(body, { styles: headingStyles }).facts.headings).toEqual(['One', 'Two', 'Three', 'Four', 'Five']);
  });
});

describe('story-import-word#AC-6 edges: drop caps, runs and wrappers', () => {
  it('folds a drop cap into the paragraph it starts', () => {
    const cap = p(t('O'), '<w:framePr w:dropCap="drop" w:lines="3"/>');
    expect(read(cap + p(t('nce upon a time.')) + p(t('Next.'))).html).toBe('<p>Once upon a time.</p><p>Next.</p>');
    expect(read(p(t('I'), '<w:framePr w:dropCap="margin"/>') + p(t('n the margin.'))).html).toBe('<p>In the margin.</p>');
    // A frame that isn't a drop cap is a paragraph of its own.
    expect(read(p(t('Framed'), '<w:framePr w:w="2000"/>') + p(t('After.'))).html).toBe('<p>Framed</p><p>After.</p>');
    // A drop cap waits past empty paragraphs, and stands alone at the end.
    expect(read(cap + p() + p(t('nce.'))).html).toBe('<p></p><p>Once.</p>');
    expect(read(p(t('Last.')) + cap).html).toBe('<p>Last.</p><p>O</p>');
  });

  it('reads tabs, hyphens, breaks and wrappers as text', () => {
    const body = p(
      '<w:r><w:t>a</w:t><w:tab/><w:t>b</w:t><w:noBreakHyphen/><w:t>c</w:t><w:br w:type="page"/><w:t>d</w:t><w:br w:type="textWrapping"/><w:t>e</w:t><w:cr/><w:t>f</w:t><w:br w:type="column"/></w:r>' +
        '<w:hyperlink r:id="x">' + t('link') + '</w:hyperlink><w:smartTag>' + t('tag') + '</w:smartTag><w:customXml>' + t('xml') + '</w:customXml>' +
        '<w:fldSimple>' + t('field') + '</w:fldSimple><w:sdt><w:sdtContent>' + t('sdt') + '</w:sdtContent></w:sdt><w:sdt/>' +
        '<w:r><w:sym w:char="F04A"/></w:r><w:r><w:delText>gone</w:delText></w:r>',
    );
    expect(read(body).html).toBe('<p>a b-cd<br>e<br>flinktagxmlfieldsdt</p>');
    expect(read('<w:sdt><w:sdtContent>' + p(t('In a box.')) + '</w:sdtContent></w:sdt><w:sdt/><w:sectPr/>').html).toBe('<p>In a box.</p>');
  });

  it('escapes text, and uses an AlternateContent fallback only without a choice', () => {
    expect(read(p(t('a &lt; b &amp; "c"'))).html).toBe('<p>a &lt; b &amp; &quot;c&quot;</p>');
    const alt = (inner: string) => p(`<w:r><mc:AlternateContent>${inner}</mc:AlternateContent></w:r>`);
    expect(read(alt('<mc:Choice Requires="x"><w:t>choice</w:t></mc:Choice><mc:Fallback><w:t>fallback</w:t></mc:Fallback>')).html).toBe('<p>choice</p>');
    expect(read(alt('<mc:Fallback><w:t>fallback</w:t></mc:Fallback>')).html).toBe('<p>fallback</p>');
    expect(read(alt('')).html).toBe('<p></p>');
  });
});

describe('story-import-word#AC-6 AC-8 edges: tables', () => {
  const chart =
    '<w:r><w:drawing><wp:inline><wp:docPr id="9" name="Chart"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"/></a:graphic></wp:inline></w:drawing></w:r>';
  const box = (inner: string) =>
    `<w:r><w:drawing><wp:anchor><wp:docPr id="8" name="Box"/><a:graphic><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><wps:wsp><wps:txbx><w:txbxContent>${inner}</w:txbxContent></wps:txbx></wps:wsp></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r>`;
  const cell = (inner: string) => `<w:tc>${inner}</w:tc>`;
  const row = (...cells: string[]) => `<w:tr>${cells.join('')}</w:tr>`;

  it('counts each left-out picture once, by where it was', () => {
    const table = `<w:tbl>${row(cell(p(picture('a.png'))), cell(p(chart)), cell(p(box(p(picture('b.png'))))))}</w:tbl>`;
    const result = read(table, { media: { 'a.png': PNG, 'b.png': PNG } });
    expect(result.facts.leftOut).toEqual({ textBox: 1, table: 1, drawing: 1 });
    expect(result.facts.tables).toBe(1);
    expect(result.pictures).toEqual([]);
  });

  it('reads a table in a cell, and skips empty cells and rows', () => {
    const inner = `<w:tbl>${row(cell(p(t('x'))), cell(p(t('y'))))}${row(cell(p(t('z'))))}</w:tbl>`;
    const table = `<w:tbl><w:tblPr/>${row(cell(p(t('Outer'))), cell(inner))}${row(cell(p()), cell(p()))}${row(cell(p(t('Last'))), cell(p()))}</w:tbl>`;
    expect(read(table).html).toBe('<p>Outer · x · y z</p><p>Last</p>');
    expect(read(table).facts.tables).toBe(1);
  });

  it('counts older Word pictures in a table as table pictures', () => {
    const vml = `<w:r><w:pict><v:shape><v:imagedata r:id="${rel('a.png')}"/></v:shape></w:pict></w:r>`;
    expect(read(`<w:tbl>${row(cell(p(vml)))}</w:tbl>`, { media: { 'a.png': PNG } }).facts.leftOut).toEqual({ textBox: 0, table: 1, drawing: 0 });
  });
});

describe('story-import-word#AC-6 AC-8 edges: older Word shapes', () => {
  it("brings in an older Word picture with its alt text, and skips Word's shape templates", () => {
    const vml = `<w:r><w:pict><v:shapetype id="_x0000_t75"/><v:shape alt="An old map"><v:imagedata r:id="${rel('a.png')}"/></v:shape></w:pict></w:r>`;
    const result = read(p(vml), { media: { 'a.png': PNG } });
    expect(result.pictures).toEqual([{ number: 1, data: PNG, type: 'image/png', wordAlt: 'An old map', decorative: false, cropped: false, moved: false }]);
    expect(result.facts.leftOut).toEqual({ textBox: 0, table: 0, drawing: 0 });
    expect(result.html).toBe('<img data-picture="0">');
  });

  it('counts a drawn shape and a text box, and makes a horizontal line', () => {
    const shapes = '<w:r><w:pict><v:rect/><v:shape><v:textbox><w:txbxContent>' + p(`<w:r><w:pict><v:shape><v:imagedata r:id="x"/></v:shape></w:pict></w:r>`) + '</w:txbxContent></v:textbox></v:shape><o:OLEObject/></w:pict></w:r>';
    expect(read(p(shapes)).facts.leftOut).toEqual({ textBox: 1, table: 0, drawing: 1 });
    expect(read(p('<w:r><w:pict><v:rect o:hr="true"/></w:pict></w:r>')).html).toBe('<hr>');
    expect(read(p(t('Text') + '<w:r><w:pict><v:rect o:hr="t"/></w:pict></w:r>')).html).toBe('<p>Text</p><hr>');
    expect(read(p('<w:r><w:pict><v:rect o:hr="f"/></w:pict></w:r>')).facts.leftOut.drawing).toBe(1);
  });
});

describe('story-import-word#AC-8 AC-9 edges: pictures', () => {
  it('reads each picture type, and numbers the ones it cannot add among all of them', () => {
    const media = { 'a.gif': PNG, 'b.tiff': PNG, 'c.wmf': PNG, 'd.webp': PNG, 'e.JPG': PNG, 'f.jpe': PNG, 'g.emz': PNG };
    const body = Object.keys(media).map((name) => p(picture(name))).join('') + p(picture('missing.png'));
    const result = read(body, { media });
    expect(result.pictures.map((x) => [x.number, x.type])).toEqual([[1, 'image/gif'], [4, 'image/webp'], [5, 'image/jpeg'], [6, 'image/jpeg']]);
    expect(result.failed).toEqual([{ number: 2, reason: 'format' }, { number: 3, reason: 'drawing' }, { number: 7, reason: 'drawing' }, { number: 8, reason: 'format' }]);
    expect(result.html).toBe('<img data-picture="0"><img data-picture="1"><img data-picture="2"><img data-picture="3">');
  });

  it('finds a picture by an absolute or a relative target', () => {
    const rels = `<Relationship Id="abs" Target="/word/media/a.png"/><Relationship Id="up" Target="../word/media/a.png"/><Relationship Id="none"/>`;
    const one = (id: string) => `<w:r><w:drawing><wp:inline><wp:docPr id="1" name="x"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:blipFill><a:blip r:embed="${id}"/></pic:blipFill></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    const result = read(p(one('abs')) + p(one('up')) + p(one('none')), { media: { 'a.png': PNG }, rels });
    expect(result.pictures.map((x) => x.number)).toEqual([1, 2]);
    expect(result.failed).toEqual([{ number: 3, reason: 'format' }]);
  });

  it('marks crops, decorative marks and moves exactly', () => {
    const media = { 'a.png': PNG };
    const pics = [
      picture('a.png', { crop: '<a:srcRect l="0" t="0" r="0" b="0"/>' }),
      picture('a.png', { crop: '<a:srcRect b="100"/>' }),
      picture('a.png', { decorative: 'true' }),
      picture('a.png', { decorative: '0' }),
    ];
    const result = read(pics.map((x) => p(x)).join(''), { media });
    expect(result.pictures.map((x) => [x.cropped, x.decorative, x.moved])).toEqual([[false, false, false], [true, false, false], [false, true, false], [false, false, false]]);
    const two = read(p(picture('a.png') + picture('a.png')), { media });
    expect(two.pictures.map((x) => x.moved)).toEqual([true, true]);
    expect(read(p(picture('a.png', { anchor: true })), { media }).pictures[0].moved).toBe(true);
    expect(read(p(t('Text') + picture('a.png')), { media })).toMatchObject({ html: '<p>Text</p><img data-picture="0">', pictures: [{ moved: true }] });
  });

  it('leaves out a picture in a footnote, and keeps a footnote mark that has no note', () => {
    const footnotes = `<w:footnote w:id="1"><w:p>${picture('a.png')}${t(' Note.')}</w:p></w:footnote>`;
    const result = read(p(t('A') + '<w:r><w:footnoteReference w:id="1"/></w:r><w:r><w:footnoteReference w:id="7"/></w:r>'), { footnotes, media: { 'a.png': PNG } });
    expect(result.html).toBe('<p>A[1]</p><p>[1] Note.</p>');
    expect(result.pictures).toEqual([]);
    expect(result.facts.footnotes).toBe(1);
  });

  it('numbers footnotes and endnotes together in the order they appear, once each, and skips separators', () => {
    const footnotes = '<w:footnote w:type="separator" w:id="-1"><w:p>' + t('---') + '</w:p></w:footnote><w:footnote w:id="2"><w:p>' + t('Foot.') + '</w:p><w:p></w:p><w:p>' + t('More.') + '</w:p></w:footnote>';
    const endnotes = '<w:endnote w:id="2"><w:p>' + t('End.') + '</w:p></w:endnote>';
    const body = p(t('a') + '<w:r><w:endnoteReference w:id="2"/></w:r>' + t('b') + '<w:r><w:footnoteReference w:id="2"/></w:r>' + '<w:r><w:endnoteReference w:id="2"/></w:r>');
    expect(read(body, { footnotes, endnotes }).html).toBe('<p>a[1]b[2][1]</p><p>[1] End.</p><p>[2] Foot. More.</p>');
  });
});

describe('story-import-word#AC-5 edges: documents that cannot be read', () => {
  const kind = (bytes: Uint8Array) => {
    try {
      readDocx(bytes, parseXml);
      return 'read';
    } catch (e) {
      return (e as WordProblem).kind;
    }
  };
  it('is unreadable without a document, a body, or good XML', () => {
    expect(kind(zipSync({ 'word/other.xml': strToU8('<x/>') }))).toBe('unreadable');
    expect(kind(zipSync({ 'word/document.xml': strToU8('<w:document xmlns:w="x"><unclosed></w:document>') }))).toBe('unreadable');
    expect(kind(zipSync({ 'word/document.xml': strToU8(`<w:document ${NS}></w:document>`) }))).toBe('unreadable');
    expect(kind(docx(p(t('ok')), { styles: '<unclosed>' }))).toBe('unreadable');
    expect(kind(new Uint8Array([0xd0, 0xcf, 0x11]))).toBe('unreadable');
    expect(kind(new Uint8Array([0xd0, 0xcf, 0x11, 0xe0]))).toBe('locked');
    expect(kind(docx(p(t('ok'))))).toBe('read');
  });

  it('names its problem', () => {
    const problem = new WordProblem('empty');
    expect(problem).toBeInstanceOf(Error);
    expect(problem.name).toBe('WordProblem');
    expect(problem.message).toBe('empty');
  });
});

describe('story-import-word#AC-10 AC-11 edges: the upload', () => {
  it('leaves out a first line after a picture, and a scene break it leaves at the start', () => {
    const media = { 'a.png': PNG };
    expect(shapes(doc(p(picture('a.png')) + p(t('Chapter 2')) + p(t('* * *')) + p(t('Text.')), { media }, { number: 2 }).blocks)).toEqual([
      '[picture 1]',
      '⁂',
      'Text.',
    ]);
    expect(shapes(doc(p(t('Chapter 2')) + p(t('* * *')) + p(t('* * *')) + p(t('Text.')), {}, { number: 2 }).blocks)).toEqual(['Text.']);
  });

  it('takes the first line off the headings only when it was the first heading', () => {
    const styles = '<w:style w:type="paragraph" w:styleId="H"><w:name w:val="heading 1"/></w:style>';
    expect(doc(p(t('Chapter 2'), '<w:pStyle w:val="H"/>') + p(t('Morning'), '<w:pStyle w:val="H"/>'), { styles }, { number: 2 }).facts.headings).toEqual(['Morning']);
    expect(doc(p(t('Chapter 2')) + p(t('Morning'), '<w:pStyle w:val="H"/>'), { styles }, { number: 2 }).facts.headings).toEqual(['Morning']);
    expect(doc(p(t('Morning'), '<w:pStyle w:val="H"/>') + p(t('Text')), { styles }, { number: 2 }).facts.headings).toEqual(['Morning']);
  });

  it('is empty when only the title line was there', () => {
    expect(() => doc(p(t('Chapter 2')), {}, { number: 2 })).toThrow(WordProblem);
    expect(doc(p(t('Chapter 2')) + p(t('More')), {}, { number: 2 }).counts).toEqual({ paragraphs: 1, sceneBreaks: 0, pictures: 0, italics: false, bold: false });
  });

  it('counts marks only on paragraphs that came in', () => {
    const counts = doc(p(`<w:r><w:rPr><w:b/></w:rPr><w:t>Chapter 2</w:t></w:r>`) + p(`<w:r><w:rPr><w:i/></w:rPr><w:t>x</w:t></w:r>`), {}, { number: 2 }).counts;
    expect(counts).toMatchObject({ italics: true, bold: false });
  });

  it('matches a chapter numbered 0, and a title alone', () => {
    expect(leftOutFirstLine('Chapter 0', { number: 0 })).toBe(true);
    expect(leftOutFirstLine('Over the Ridge', { title: 'Over the Ridge' })).toBe(true);
    expect(leftOutFirstLine('Chapter 3 Over the Ridge', { title: 'Over the Ridge' })).toBe(false);
    expect(leftOutFirstLine('!!!', { story: '!!!' })).toBe(false);
  });
});

describe('story-import-word#AC-9 AC-15 AC-16 AC-18 edges: the pure helpers', () => {
  it('reads alt text from Word exactly', () => {
    expect(altFromWord('Description automatically generated, said the robot, then more')).toBe('Description automatically generated, said the robot, then more');
    expect(altFromWord('photo.png\nof a fox')).toBe('photo.png\nof a fox');
    expect(altFromWord('folder/photo.png')).toBe('folder/photo.png');
    expect(altFromWord('A cat\n\nDescription automatically generated   ')).toBeUndefined();
  });

  it('rounds a re-saved height', () => {
    expect(resaveSize(6400, 1001)).toEqual({ width: 3200, height: 501 });
    expect(resaveSize(3201, 3201)).toEqual({ width: 3200, height: 3200 });
  });

  it('matches each use of a picture once, and counts what it did', () => {
    const was = { hash: 'a', alt: 'Mine', decorative: false, fromWord: false, wordAlt: 'W', wordDecorative: false, edited: true };
    const result = matchPictures([was], [{ hash: 'a', wordAlt: 'W', wordDecorative: false }, { hash: 'a', wordAlt: 'W', wordDecorative: false }]);
    expect(result).toMatchObject({ kept: 1, changed: 0, fresh: 1 });
    expect(result.pictures[1]).toMatchObject({ alt: 'W', fromWord: true, edited: false });
    expect(matchPictures([], [])).toEqual({ pictures: [], kept: 0, changed: 0, fresh: 0 });
  });

  it("finds the pictures a draft's Undo copy holds", () => {
    const copy = undoSnapshot([{ _type: 'storyPicture', image: { asset: { _ref: 'image-a-1x1-png' } } }], undefined);
    expect(inUndoCopies(['image-a-1x1-png', 'image-b-1x1-png', 'image-a'], [copy, null, undefined])).toEqual(['image-a-1x1-png']);
    expect(inUndoCopies(['image-a-1x1-png'], [])).toEqual([]);
  });

  it('puts back what Undo kept, whatever was missing', () => {
    expect(undoFrom('{}')).toEqual({ content: [], upload: undefined });
    expect(undoFrom('{"content":[{"a":{"asset":{"other":1}}}],"upload":{"fileName":"a.docx"}}')).toEqual({ content: [{ a: { asset: { other: 1 } } }], upload: { fileName: 'a.docx' } });
    expect(undoFrom('{"content":[{"asset":"text"}]}')).toEqual({ content: [{ asset: 'text' }], upload: undefined });
    expect(undoFrom('')).toBeUndefined();
  });

  it('only counts pictures as edited, and only pictures for their assets', () => {
    expect(editedSince([{ _type: 'block', edited: true }])).toBe(false);
    expect(pictureAssets([{ _type: 'block', image: { asset: { _ref: 'image-x' } } }])).toEqual([]);
  });
});
