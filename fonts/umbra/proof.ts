import { mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Render the FINAL binary with Pango/HarfBuzz, isolated from installed fonts.
// No fallback fonts or intermediate font can mask missing glyphs or GSUB bugs.
const root=fileURLToPath(new URL('.',import.meta.url));
const temp=mkdtempSync(join(tmpdir(),'umbra-font-proof-'));
symlinkSync(join(root,'dist/UmbraLimiarMonoNF-Regular.otf'),join(temp,'Umbra.otf'));
const config=join(temp,'fonts.conf');
writeFileSync(config,`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${temp}</dir><cachedir>${temp}/cache</cachedir></fontconfig>`);
const env={...process.env,FONTCONFIG_FILE:config};
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const row=(s:string,size=26,features='calt=1')=>`<span size="${size*1024}" font_features="${features}">${escape(s)}</span>`;
const operators='->  =>  !=  <=  >=  ==';
const text=[
  row('UMBRA / LIMIAR MONO NF / PROVA 02',18),
  row('Umbra Limiar',52),
  row('ABCDEFGHIJKLMNOPQRSTUVWXYZ',30),
  row('abcdefghijklmnopqrstuvwxyz',30),
  row('0123456789  i j ij ji jj  1Il  0Oo',30),
  row('ACENTOS / caracteres presentes no OTF',16),
  row('àáâãä èéêë ìíîï òóôõö ùúûü çñ',30),
  row('ÀÁÂÃ ÉÊ Í ÓÔÕ Ú ÇÑ',30),
  row('ação, coração, funções, útil, variável, ÍNDICE',26),
  row('LIGADURAS / calt=0',16),
  row(operators,38,'calt=0'),
  row('LIGADURAS / calt=1 / mesma largura',16),
  row(operators,38),
  row('const limiar = (shadow) => light;',26),
  row('if (j != i && valor <= limite) return ação;',26),
  row('12 px / i j ij ji ação -> => != <= >= ==',12),
  row('14 px / i j ij ji ação -> => != <= >= ==',14),
  row('16 px / i j ij ji ação -> => != <= >= ==',16),
  row('24 px / i j ij ji ação -> => != <= >= ==',24),
  row('NERD FONT / Git, pasta, terminal, Powerline, Umbra',16),
  row('\ue0a0  \uf07b  \uf120  \ue0b0  '+String.fromCodePoint(0x100000),36),
].join('\n');
writeFileSync(join(root,'dist/specimen.pango'),text);
for(const extension of ['png','svg']) {
  const result=spawnSync('pango-view',['--no-display','--pixels','--font=Umbra Limiar Mono NF 26','--markup','--margin=40','--spacing=12','--background=#101111','--foreground=#C5C7C5',`--output=${join(root,`dist/specimen.${extension}`)}`,'--text',text],{env,encoding:'utf8'});
  if(result.status!==0) throw new Error(result.stderr);
}
console.log('Rendered final OTF through Pango/HarfBuzz: dist/specimen.png');
