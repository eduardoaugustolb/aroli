import opentype from 'opentype.js';
import assert from 'node:assert/strict';

const bytes=await Bun.file(process.argv[2] || new URL('./dist/AroliMonoNF-Regular.otf',import.meta.url)).arrayBuffer();
const font=opentype.parse(bytes);
const width=font.charToGlyph(' ').advanceWidth;
for(const char of 'ABCDEF GHIJKLMNOPRSTUVWXYZabcdefhiklmnorstuvwxz0123456789'.replaceAll(' ','')) {
  const y1=font.charToGlyph(char).getBoundingBox().y1;
  // Flat terminals at 0, pointed apexes keep a small optical overshoot inside [-16,0].
  assert(y1<=1 && y1>=-17,`Uneven baseline: ${char} y1=${y1}`);
}
for(const char of 'acemnorsuvwxz') {
  const y2=font.charToGlyph(char).getBoundingBox().y2;
  assert(y2>=520*2.048-1 && y2<=520*2.048+17,`Uneven x-height: ${char} y2=${y2}`);
}
for(const char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789àáâãäèéêëìíîïòóôõöùúûüçñÀÁÂÃÉÊÍÓÔÕÚÇÑ') {
  assert.notEqual(font.charToGlyphIndex(char),0,`Missing ${char}`);
  assert.equal(font.charToGlyph(char).advanceWidth,width,`Cell width: ${char}`);
}
const glyphs=Array.from({length:font.glyphs.length},(_,i)=>font.glyphs.get(i));
for(const name of ['arrowRight','doubleArrowRight','notEqual','lessEqual','greaterEqual','doubleEqual']) {
  assert.equal(glyphs.find(g=>g.name===name)?.advanceWidth,width*2,`Ligature width: ${name}`);
}
assert(font.tables.gsub.features.some(f=>f.tag==='calt'),'Missing contextual alternates');
const style=process.argv[3] || 'Regular';
assert.equal(font.tables.os2.usWeightClass,{Regular:400,Medium:500,SemiBold:600}[style]);
assert.equal(font.tables.post.isFixedPitch,1);
const iBounds=font.charToGlyph('i').getBoundingBox();
assert(iBounds.x2-iBounds.x1 > width*.57,'i is too narrow for its cell');
assert(Math.abs(iBounds.x1-(width-iBounds.x2)) < 4,'i side bearings are unbalanced');
for(const [a,b] of [['I','l'],['I','1'],['i','l'],['.',','],[',',';']]) {
  assert.notDeepEqual(font.charToGlyph(a).path.commands,font.charToGlyph(b).path.commands,`${a}/${b} must remain distinct`);
}
const periodBox=font.charToGlyph('.').getBoundingBox();
assert(periodBox.y1>=-1,'period must sit on the baseline');
for(const char of [',',';']) {
  assert(font.charToGlyph(char).getBoundingBox().y1<-100,`${char} must descend below the baseline`);
}
const dot=font.charToGlyph('j').path.commands.filter(c=>'y' in c && c.y>600*2.048);
const xs=dot.map(c=>c.x);
assert(Math.abs((Math.min(...xs)+Math.max(...xs))/2-350*2.048)<3,'j dot is off-center');
for(const char of '\ue0a0\uf07b\uf120\ue0b0'+String.fromCodePoint(0x100000)) assert.notEqual(font.charToGlyphIndex(char),0,'Missing icon');
console.log('Final OTF verified: coverage, j dot, cell widths, ligature widths, calt, icons.');
