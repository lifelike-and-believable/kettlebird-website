// Makes the sample Word documents for docs/specs/story-import-word.md, in the shapes Word and Google Docs save
// (Office Open XML). Run: node tests/fixtures/word/make-docx.mjs. The .docx files are committed; this script is
// how they were made, so a change to them is a change here.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));

const NS = [
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"',
  'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"',
  'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"',
  'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"',
  'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"',
  'xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"',
  'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"',
  'xmlns:v="urn:schemas-microsoft-com:vml"',
  'xmlns:o="urn:schemas-microsoft-com:office:office"',
  'xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"',
  'xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative"',
].join(' ');

// Word writes line breaks in attributes (alt text) as &#xA;.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '&#xA;');

// Runs and paragraphs.
const t = (text) => `<w:t xml:space="preserve">${esc(text)}</w:t>`;
const run = (text, { i, b, style, gdocs } = {}) => {
  const props = [style && `<w:rStyle w:val="${style}"/>`, b && (gdocs ? '<w:b w:val="1"/>' : '<w:b/>'), i && (gdocs ? '<w:i w:val="1"/>' : '<w:i/>')]
    .filter(Boolean)
    .join('');
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}${t(text)}</w:r>`;
};
const br = '<w:r><w:br/></w:r>';
const para = (content = '', { style, border } = {}) => {
  const props = [style && `<w:pStyle w:val="${style}"/>`, border && '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="auto"/></w:pBdr>']
    .filter(Boolean)
    .join('');
  return `<w:p>${props ? `<w:pPr>${props}</w:pPr>` : ''}${content}</w:p>`;
};
const hrShape = para('<w:r><w:pict><v:rect style="width:0;height:1.5pt" o:hralign="center" o:hrstd="t" o:hr="t" fillcolor="#a0a0a0" stroked="f"/></w:pict></w:r>');

let docPrId = 1;
function docPr({ alt, decorative, name }) {
  const id = docPrId++;
  const ext = decorative
    ? '<a:extLst><a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}"><adec:decorative val="1"/></a:ext></a:extLst>'
    : '';
  return `<wp:docPr id="${id}" name="${esc(name ?? `Picture ${id}`)}"${alt !== undefined ? ` descr="${esc(alt)}"` : ''}>${ext}</wp:docPr>`;
}
function pictureGraphic(rel, { crop } = {}) {
  const src = crop ? '<a:srcRect l="12000" t="0" r="8000" b="5000"/>' : '';
  return (
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic>' +
    `<pic:nvPicPr><pic:cNvPr id="0" name="image"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rel}"/>${src}<a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="3000000" cy="2000000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>' +
    '</pic:pic></a:graphicData></a:graphic>'
  );
}
const inline = (rel, opts = {}) =>
  `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="3000000" cy="2000000"/>${docPr(opts)}${pictureGraphic(rel, opts)}</wp:inline></w:drawing></w:r>`;
const anchored = (rel, opts = {}) =>
  `<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="1" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:posOffset>0</wp:posOffset></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV><wp:extent cx="2000000" cy="2000000"/><wp:wrapSquare wrapText="bothSides"/>${docPr(opts)}${pictureGraphic(rel, opts)}</wp:anchor></w:drawing></w:r>`;
const textBox = (inner) =>
  '<w:r><mc:AlternateContent><mc:Choice Requires="wps"><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="2" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:posOffset>0</wp:posOffset></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV><wp:extent cx="2000000" cy="1000000"/><wp:wrapSquare wrapText="bothSides"/>' +
  `${docPr({ name: 'Text Box 1' })}<a:graphic><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><wps:wsp><wps:txbx><w:txbxContent>${inner}</w:txbxContent></wps:txbx><wps:bodyPr/></wps:wsp></a:graphicData></a:graphic></wp:anchor></w:drawing></mc:Choice>` +
  `<mc:Fallback><w:pict><v:shape type="#_x0000_t202"><v:textbox><w:txbxContent>${inner}</w:txbxContent></v:textbox></v:shape></w:pict></mc:Fallback></mc:AlternateContent></w:r>`;
const wordDrawing = () =>
  `<w:r><w:drawing><wp:inline><wp:extent cx="1000000" cy="1000000"/>${docPr({ name: 'Arrow 1' })}<a:graphic><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><wps:wsp><wps:spPr><a:prstGeom prst="rightArrow"><a:avLst/></a:prstGeom></wps:spPr><wps:bodyPr/></wps:wsp></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
const chart = (rel) =>
  `<w:r><w:drawing><wp:inline><wp:extent cx="3000000" cy="2000000"/>${docPr({ name: 'Chart 1' })}<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart r:id="${rel}"/></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
const table = (rows) =>
  `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/></w:tblPr>${rows
    .map((cells) => `<w:tr>${cells.map((c) => `<w:tc>${typeof c === 'string' ? para(run(c)) : c.xml}</w:tc>`).join('')}</w:tr>`)
    .join('')}</w:tbl>`;
const footnoteRef = (id) => `<w:r><w:rPr><w:rStyle w:val="FootnoteReference"/></w:rPr><w:footnoteReference w:id="${id}"/></w:r>`;
const endnoteRef = (id) => `<w:r><w:rPr><w:rStyle w:val="EndnoteReference"/></w:rPr><w:endnoteReference w:id="${id}"/></w:r>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${NS}>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="1"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Titre"><w:name w:val="Title"/><w:basedOn w:val="Normal"/></w:style>
<w:style w:type="character" w:styleId="Strong"><w:name w:val="Strong"/><w:rPr><w:b/></w:rPr></w:style>
<w:style w:type="character" w:styleId="Emphasis"><w:name w:val="Emphasis"/><w:rPr><w:i/></w:rPr></w:style>
<w:style w:type="character" w:styleId="FootnoteReference"><w:name w:val="footnote reference"/><w:rPr><w:vertAlign w:val="superscript"/></w:rPr></w:style>
</w:styles>`;

const notesXml = (kind, notes) => {
  const tag = kind === 'footnotes' ? 'footnote' : 'endnote';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:${kind} ${NS}><w:${tag} w:type="separator" w:id="-1"><w:p><w:r><w:separator/></w:r></w:p></w:${tag}><w:${tag} w:type="continuationSeparator" w:id="0"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:${tag}>${notes
    .map(([id, text]) => `<w:${tag} w:id="${id}"><w:p><w:r><w:rPr><w:rStyle w:val="FootnoteReference"/></w:rPr><w:${tag}Ref/></w:r>${run(` ${text}`)}</w:p></w:${tag}>`)
    .join('')}</w:${kind}>`;
};

/** A .docx from its body, media and extra parts. */
function docx({ body, media = {}, footnotes, endnotes, header, extraRels = [], styles = STYLES }) {
  const rels = [
    '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
    ...Object.keys(media).map(
      (name, i) => `<Relationship Id="rIdImg${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`,
    ),
    footnotes && '<Relationship Id="rIdFoot" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>',
    endnotes && '<Relationship Id="rIdEnd" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes" Target="endnotes.xml"/>',
    header && '<Relationship Id="rIdHead" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>',
    ...extraRels,
  ].filter(Boolean);
  const sect = header ? '<w:sectPr><w:headerReference w:type="default" r:id="rIdHead"/></w:sectPr>' : '<w:sectPr/>';
  const files = {
    '[Content_Types].xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="emf" ContentType="image/x-emf"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    ),
    '_rels/.rels': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    ),
    'word/_rels/document.xml.rels': strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.join('')}</Relationships>`,
    ),
    'word/document.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body.join('')}${sect}</w:body></w:document>`),
    'word/styles.xml': strToU8(styles),
  };
  if (footnotes) files['word/footnotes.xml'] = strToU8(notesXml('footnotes', footnotes));
  if (endnotes) files['word/endnotes.xml'] = strToU8(notesXml('endnotes', endnotes));
  if (header) files['word/header1.xml'] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ${NS}>${para(run(header))}</w:hdr>`);
  for (const [name, data] of Object.entries(media)) files[`word/media/${name}`] = data;
  return zipSync(files, { level: 6, mtime: new Date('2026-11-07T00:00:00Z') });
}

const solid = (width, height, color, format) => sharp({ create: { width, height, channels: 3, background: color } })[format]().toBuffer();

const map = new Uint8Array(await solid(1600, 1000, '#5b8a72', 'jpeg'));
const fox = new Uint8Array(await solid(900, 900, '#c96f3b', 'png'));
const letter = new Uint8Array(await solid(1200, 800, '#e8dcc0', 'png'));
const flourish = new Uint8Array(await solid(600, 80, '#2b2b2b', 'png'));
const window_ = new Uint8Array(await solid(800, 1200, '#7a8fb0', 'jpeg'));
const emf = new Uint8Array([1, 0, 0, 0, 0x6c, 0, 0, 0, 0x20, 0x45, 0x4d, 0x46]);
const boxed = new Uint8Array(await solid(300, 300, '#aa3355', 'png'));

// Word: everything the reader has to know about.
const wordMedia = { 'image1.jpeg': map, 'image2.png': fox, 'image3.png': letter, 'image4.png': flourish, 'image5.jpeg': window_, 'image6.emf': emf, 'image7.png': boxed };
const wordBody = (changes = {}) => [
  para(run('Chapter 3: Over the Ridge'), { style: 'Heading1' }),
  para(run('The road climbed all morning. ') + run('Nobody', { i: true }) + run(' spoke.')),
  para(run('Mira kept her eyes on the ') + run('ridge', { b: true }) + run(', and on the ') + run('sky', { style: 'Strong' }) + run('.')),
  para(inline('rIdImg1', { alt: 'A map of the valley, with the road marked in red' })),
  para(run('Dear Tam,') + br + run('The kettle is still singing.') + br + run('Love, M.')),
  para(run('* * *')),
  para(run('They camped by the stream') + footnoteRef(2) + run('.') + anchored('rIdImg2', { alt: 'A fox sitting in tall grass\n\nDescription automatically generated' })),
  para(),
  para(),
  para(run('Morning came grey.') + `<w:ins w:id="10" w:author="Star" w:date="2026-11-01T10:00:00Z">${run(' Then it rained.')}</w:ins>` + `<w:del w:id="11" w:author="Star" w:date="2026-11-01T10:00:00Z"><w:r><w:delText xml:space="preserve"> Then it snowed.</w:delText></w:r></w:del>`),
  para(run('Morning'), { style: 'Heading2' }),
  para(inline('rIdImg3', { alt: changes.letterAlt ?? 'A letter in faded ink', crop: true })),
  hrShape,
  para(run('A new scene.') + endnoteRef(1)),
  para(inline('rIdImg4', { alt: '', decorative: true })),
  para('', { border: true }),
  para(run('The Ridge'), { style: 'Heading2' }),
  table([
    ['Day', 'Miles'],
    ['Monday', '12'],
    [{ xml: para(inline('rIdImg7', { alt: 'A table picture' })) }, 'x'],
  ]),
  para(run('She looked back at the valley.') + textBox(para(run('A note in a box')) + para(inline('rIdImg7', { alt: 'In a box' })))),
  para('<w:commentRangeStart w:id="0"/>' + run('A sentence with a comment.') + '<w:commentRangeEnd w:id="0"/><w:r><w:commentReference w:id="0"/></w:r>'),
  para(inline('rIdImg1', { alt: 'The map again' })),
  para(inline('rIdImg5', { alt: 'IMG_2041.jpg' })),
  para(wordDrawing() + chart('rIdChart')),
  para(inline('rIdImg6', { alt: 'An old diagram' })),
  ...(changes.extra ? [para(run(changes.extra))] : []),
  ...['They walked on.', 'The sun came out.', 'Mira sang.', 'Tam would have laughed.'].map((line) => para(run(line))),
  para(run('The end of the chapter.')),
];
writeFileSync(
  join(here, 'word-chapter.docx'),
  docx({ body: wordBody(), media: wordMedia, footnotes: [[2, 'A cold one.']], endnotes: [[1, 'Written in the snow.']], header: 'The Long Road' }),
);
// A new version: a paragraph added, the fox re-encoded (as Google Docs re-saves pictures), the letter's alt text changed in Word.
docPrId = 1;
const foxResaved = new Uint8Array(await sharp(Buffer.from(fox)).png({ compressionLevel: 1 }).toBuffer());
writeFileSync(
  join(here, 'edited.docx'),
  docx({
    body: wordBody({ extra: 'A paragraph added later.', letterAlt: 'A letter from Tam, in faded ink' }),
    media: { ...wordMedia, 'image2.png': foxResaved },
    footnotes: [[2, 'A cold one.']],
    endnotes: [[1, 'Written in the snow.']],
  }),
);

// Google Docs: its shapes (w:val="1" marks, pictures named by file, suggestions as tracked changes).
docPrId = 1;
const gStyles = STYLES;
writeFileSync(
  join(here, 'gdocs-chapter.docx'),
  docx({
    styles: gStyles,
    media: { 'image1.png': fox, 'image2.png': letter },
    body: [
      para(run('The fox came back at ', { gdocs: true }) + run('dusk', { i: true, gdocs: true }) + run('.', { gdocs: true })),
      para(run('It was ', { gdocs: true }) + run('very', { b: true, gdocs: true }) + run(' hungry.', { gdocs: true })),
      para(inline('rIdImg1', { alt: 'The fox at the door', name: 'image1.png' })),
      para(run('***', { gdocs: true })),
      para(run('Mira fed it.', { gdocs: true }) + `<w:ins w:id="1" w:author="Star" w:date="2026-11-02T10:00:00Z">${run(' Bread and cheese.', { gdocs: true })}</w:ins>`),
      para(inline('rIdImg2', { name: 'image2.png' })),
    ],
  }),
);

// Double spacing made with empty paragraphs.
docPrId = 1;
writeFileSync(
  join(here, 'spacing.docx'),
  docx({ body: Array.from({ length: 6 }, (_, i) => [para(run(`Line ${i + 1} of a double-spaced chapter.`)), para(), para()]).flat() }),
);
docPrId = 1;
writeFileSync(join(here, 'pictures-only.docx'), docx({ media: { 'image1.png': fox }, body: [para(inline('rIdImg1', { alt: 'Just a fox' }))] }));
docPrId = 1;
writeFileSync(join(here, 'empty.docx'), docx({ body: [para(), para(run('   ')), para()] }));
// An encrypted document is a compound file (as an old .doc is), not a zip.
writeFileSync(join(here, 'locked.docx'), new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, ...new Array(504).fill(0)]));
writeFileSync(join(here, 'broken.docx'), strToU8('This is not a zip file at all.'));
console.log('Made the sample documents in', here);
