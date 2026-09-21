import opentype from 'opentype.js';
import assert from 'node:assert/strict';

const bytes=await Bun.file(new URL('./dist/AroliMonoNF-Regular.otf',import.meta.url)).arrayBuffer();
const font=opentype.parse(bytes);
const width=font.charToGlyph(' ').advanceWidth;
for(const char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789àáâãäèéêëìíîïòóôõöùúûüçñÀÁÂÃÉÊÍÓÔÕÚÇÑ') {
  assert.notEqual(font.charToGlyphIndex(char),0,`Missing ${char}`);
  assert.equal(font.charToGlyph(char).advanceWidth,width,`Cell width: ${char}`);
}
const glyphs=Array.from({length:font.glyphs.length},(_,i)=>font.glyphs.get(i));
for(const name of ['arrowRight','doubleArrowRight','notEqual','lessEqual','greaterEqual','doubleEqual']) {
  assert.equal(glyphs.find(g=>g.name===name)?.advanceWidth,width*2,`Ligature width: ${name}`);
}
assert(font.tables.gsub.features.some(f=>f.tag==='calt'),'Missing contextual alternates');
const dot=font.charToGlyph('j').path.commands.filter(c=>'y' in c && c.y>600*2.048);
const xs=dot.map(c=>c.x);
assert(Math.abs((Math.min(...xs)+Math.max(...xs))/2-350*2.048)<3,'j dot is off-center');
for(const char of '\ue0a0\uf07b\uf120\ue0b0'+String.fromCodePoint(0x100000)) assert.notEqual(font.charToGlyphIndex(char),0,'Missing icon');
console.log('Final OTF verified: coverage, j dot, cell widths, ligature widths, calt, icons.');
