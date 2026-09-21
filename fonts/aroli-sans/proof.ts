import { mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const out = join(import.meta.dir, 'dist');
const temp = mkdtempSync(join(tmpdir(), 'aroli-sans-proof-'));
for (const style of ['Regular', 'Medium', 'SemiBold', 'Bold'])
  symlinkSync(join(out, `AroliSans-${style}.otf`), join(temp, `${style}.otf`));
const config = join(temp, 'fonts.conf');
writeFileSync(config, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${temp}</dir><cachedir>${temp}/cache</cachedir></fontconfig>`);
const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const row = (text: string, size: number, weight = 400) => `<span font_family="Aroli Sans" size="${size * 1024}" weight="${weight}">${escape(text)}</span>`;
const proof = [
  row('AROLI SANS / 0.1 / DESENHO AUTORAL', 14),
  row('Tudo encontra seu lugar.', 60, 500),
  row('Aa Rr Gg & 0123456789', 48),
  row('HELMN WAVE / HOOH / baseline', 42, 500),
  row('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 27),
  ...([400, 500, 600, 700] as const).map(weight => row('HOM NOME WWW / MINIMUM / WOMAN', 30, weight)),
  row('abcdefghijklmnopqrstuvwxyz', 36),
  row('ÀÁÂÃÄÅ ÉÊË ÍÎÏ ÓÔÕÖ ÚÛÜ ÇÑ', 25),
  row('àáâãäå èéêë ìíîï òóôõö ùúûü çñ ÿ', 25),
  row('“Precisão, proporção e espaço.” → Aroli', 27),
  ...([400, 500, 600, 700] as const).map(weight => row(`${weight} / Aroli Sans — o ambiente ganha voz.`, 25, weight)),
  ...[12, 14, 16, 18, 24].map(size => row(`${size} px / Temas escuros, funções e configurações. 1Il 0Oo ij`, size)),
  row('AVATAR  To  Ta  Vo  Wa  Yo  LT  LY / (ação) [2026]', 23),
  row('! ? . , : ; / \\ | @ # $ % & * + = < > { } _ ~', 22),
].join('\n');
const result = spawnSync('pango-view', ['--no-display', '--pixels', '--markup', '--margin=48', '--spacing=12', '--background=#101111', '--foreground=#C5C7C5', `--output=${join(out, 'specimen.png')}`, '--text', proof], { env: { ...process.env, FONTCONFIG_FILE: config }, encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr);
console.log('Rendered final OTF files with isolated Pango/HarfBuzz:', join(out, 'specimen.png'));
