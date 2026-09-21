import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import opentype from '../aroli/node_modules/opentype.js';

const temp = mkdtempSync(join(tmpdir(), 'aroli-sans-verify-'));
const required = Array.from({ length: 95 }, (_, i) => String.fromCodePoint(i + 32)).join('') +
  'ÀÁÂÃÉÊÍÓÔÕÚÇàáâãéêíóôõúç“”‘’–—…→←↑↓©';
let previousStem = 0;
for (const [style, weight] of [['Regular', 400], ['Medium', 500], ['SemiBold', 600], ['Bold', 700]] as const) {
  const otf = join(import.meta.dir, 'dist', `AroliSans-${style}.otf`);
  const restored = join(temp, `${style}.otf`);
  const result = spawnSync('fonttools', ['ttLib.woff2', 'decompress', otf.replace('.otf', '.woff2'), '-o', restored], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const fonts = [otf, restored].map(file => {
    const bytes = readFileSync(file);
    return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  });
  for (const font of fonts) {
    assert.equal(font.names.windows.fontFamily.en, 'Aroli Sans');
    assert.equal(font.tables.os2.usWeightClass, weight);
    assert.equal(Boolean(font.tables.os2.fsSelection & 32), weight >= 600, 'Bold selection metadata');
    assert.equal(Boolean(font.tables.head.macStyle & 1), weight >= 600, 'Mac bold selection metadata');
    assert.ok(font.tables.gpos, 'GPOS must survive serialization');
    for (const ch of 'ABDEFHIKLMNPRTVWXYZhiklmnr vwxz1247'.replaceAll(' ', ''))
      assert.ok(Math.abs(font.charToGlyph(ch).getBoundingBox().y1) <= 1, `${style}: baseline drift in ${ch}`);
    for (const ch of 'COGSUabcdeosu035689') {
      const bottom = font.charToGlyph(ch).getBoundingBox().y1;
      assert.ok(bottom >= -12 && bottom <= 0, `${style}: excessive round overshoot in ${ch}`);
    }
    assert.ok(font.charToGlyph('m').advanceWidth > font.charToGlyph('i').advanceWidth * 2, 'Proportional advances');
    for (const ch of required) {
      assert.ok(font.charToGlyphIndex(ch), `${style}: missing ${ch}`);
      if (ch !== ' ') assert.ok(font.charToGlyph(ch).path.commands.length, `${style}: empty ${ch}`);
    }
    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      for (const command of glyph.path.commands) {
        for (const [key, value] of Object.entries(command))
          if (key !== 'type') assert.ok(Number.isFinite(value), `${style}: invalid contour ${glyph.name}`);
      }
      const box = glyph.getBoundingBox();
      assert.ok(box.y2 <= 980 && box.y1 >= -270, `${style}: clipped ${glyph.name}`);
    }
  }
  const stem = fonts[0].charToGlyph('I').getBoundingBox();
  assert.ok(stem.x2 - stem.x1 > previousStem, 'Each weight needs distinct outlines');
  previousStem = stem.x2 - stem.x1;
  console.log(`${style}: OTF + WOFF2 coverage, metrics, contours, GPOS and weight verified`);
}
