import opentype from 'opentype.js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// All text outlines below are original Umbra drawings. Coordinates use a
// 600-unit cell and a 700-unit cap height before scaling to 2048 UPM.
const root = fileURLToPath(new URL('.', import.meta.url));
const out = join(root, 'dist');
mkdirSync(out, { recursive: true });
const S = 2.048;
const cell = 600;
const weight = 67;
type Pt = [number, number];
type Stroke = Pt[];
const P = () => new opentype.Path();

function polygon(path: any, points: Pt[]) {
  path.moveTo(points[0][0] * S, points[0][1] * S);
  for (const [x, y] of points.slice(1)) path.lineTo(x * S, y * S);
  path.close();
}
function line(path: any, a: Pt, b: Pt, w = weight) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ox = -dy / len * w / 2, oy = dx / len * w / 2;
  polygon(path, [[a[0]+ox,a[1]+oy],[b[0]+ox,b[1]+oy],[b[0]-ox,b[1]-oy],[a[0]-ox,a[1]-oy]]);
}
function circle(path: any, p: Pt, r = weight / 2) {
  const k = .55228475 * r;
  const x = p[0] * S, y = p[1] * S, rr = r * S, kk = k * S;
  path.moveTo(x+rr,y);
  path.curveTo(x+rr,y-kk,x+kk,y-rr,x,y-rr);
  path.curveTo(x-kk,y-rr,x-rr,y-kk,x-rr,y);
  path.curveTo(x-rr,y+kk,x-kk,y+rr,x,y+rr);
  path.curveTo(x+kk,y+rr,x+rr,y+kk,x+rr,y);
  path.close();
}
function stroke(path: any, pts: Stroke, w = weight, round = true) {
  for (let i=0;i<pts.length-1;i++) line(path,pts[i],pts[i+1],w);
  if (round) for (const pt of pts.slice(1,-1)) circle(path,pt,w/2);
}
function pathOf(strokes: Stroke[], w = weight) {
  const p = P();
  for (const s of strokes) stroke(p,s,w);
  return p;
}
const G: Record<string, Stroke[]> = {
  A: [[[90,0],[270,700],[450,0]],[[155,245],[385,245]]],
  B: [[[105,0],[105,700],[350,700],[450,615],[450,455],[355,355],[105,355]],[[355,355],[460,260],[460,90],[365,0],[105,0]]],
  C: [[[470,620],[385,700],[190,700],[100,600],[100,100],[190,0],[385,0],[470,80]]],
  D: [[[105,0],[105,700],[335,700],[470,565],[470,135],[335,0],[105,0]]],
  E: [[[470,700],[105,700],[105,0],[470,0]],[[105,355],[415,355]]],
  F: [[[105,0],[105,700],[470,700]],[[105,355],[410,355]]],
  G: [[[470,610],[380,700],[190,700],[100,600],[100,100],[190,0],[385,0],[470,90],[470,330],[320,330]]],
  H: [[[105,0],[105,700]],[[475,0],[475,700]],[[105,355],[475,355]]],
  I: [[[165,700],[435,700]],[[300,700],[300,0]],[[165,0],[435,0]]],
  J: [[[170,90],[245,0],[375,0],[460,100],[460,700]]],
  K: [[[105,0],[105,700]],[[470,700],[105,330],[475,0]]],
  L: [[[105,700],[105,0],[470,0]]],
  M: [[[90,0],[90,700],[300,335],[510,700],[510,0]]],
  N: [[[105,0],[105,700],[475,0],[475,700]]],
  O: [[[190,0],[100,100],[100,600],[190,700],[390,700],[480,600],[480,100],[390,0],[190,0]]],
  P: [[[105,0],[105,700],[375,700],[470,600],[470,440],[375,345],[105,345]]],
  Q: [[[190,0],[100,100],[100,600],[190,700],[390,700],[480,600],[480,100],[390,0],[190,0]],[[340,130],[500,-80]]],
  R: [[[105,0],[105,700],[365,700],[465,610],[465,445],[365,350],[105,350]],[[300,350],[480,0]]],
  S: [[[465,615],[380,700],[190,700],[105,615],[105,450],[190,360],[380,340],[465,250],[465,85],[380,0],[190,0],[105,85]]],
  T: [[[65,700],[515,700]],[[290,700],[290,0]]],
  U: [[[105,700],[105,130],[205,0],[375,0],[475,130],[475,700]]],
  V: [[[75,700],[290,0],[505,700]]],
  W: [[[65,700],[155,0],[290,400],[425,0],[515,700]]],
  X: [[[95,700],[485,0]],[[485,700],[95,0]]],
  Y: [[[80,700],[290,355],[500,700]],[[290,355],[290,0]]],
  Z: [[[95,700],[485,700],[95,0],[485,0]]],
  a: [[[450,385],[365,475],[190,475],[105,385],[105,90],[190,0],[365,0],[450,90]],[[450,475],[450,0]]],
  b: [[[105,700],[105,0]],[[105,385],[190,475],[365,475],[460,380],[460,95],[365,0],[190,0],[105,95]]],
  c: [[[450,390],[365,475],[190,475],[105,380],[105,95],[190,0],[365,0],[450,85]]],
  d: [[[475,700],[475,0]],[[475,385],[390,475],[215,475],[120,380],[120,95],[215,0],[390,0],[475,95]]],
  e: [[[105,240],[465,240],[465,380],[375,475],[195,475],[105,380],[105,95],[195,0],[390,0],[465,70]]],
  f: [[[160,0],[160,600],[245,700],[410,700]],[[70,475],[400,475]]],
  g: [[[455,475],[455,-110],[365,-205],[185,-205],[105,-135]],[[455,375],[365,475],[190,475],[105,380],[105,95],[190,0],[365,0],[455,95]]],
  h: [[[105,700],[105,0]],[[105,375],[200,475],[365,475],[460,375],[460,0]]],
  i: [[[285,475],[285,0]],[[195,0],[385,0]]],
  j: [[[390,475],[390,-105],[300,-205],[185,-205]]],
  k: [[[105,700],[105,0]],[[455,475],[105,205],[460,0]]],
  l: [[[220,700],[220,85],[305,0],[385,0]]],
  m: [[[75,0],[75,475]],[[75,375],[155,475],[245,475],[305,375],[305,0]],[[305,375],[385,475],[465,475],[525,375],[525,0]]],
  n: [[[105,0],[105,475]],[[105,375],[200,475],[365,475],[460,375],[460,0]]],
  o: [[[190,0],[105,95],[105,380],[190,475],[380,475],[475,380],[475,95],[380,0],[190,0]]],
  p: [[[105,-205],[105,475]],[[105,380],[195,475],[370,475],[460,380],[460,95],[370,0],[195,0],[105,95]]],
  q: [[[475,-205],[475,475]],[[475,380],[385,475],[210,475],[120,380],[120,95],[210,0],[385,0],[475,95]]],
  r: [[[105,0],[105,475]],[[105,340],[210,475],[390,475]]],
  s: [[[450,405],[370,475],[190,475],[110,405],[110,315],[190,245],[370,230],[450,155],[450,70],[370,0],[190,0],[110,70]]],
  t: [[[210,620],[210,95],[295,0],[425,0]],[[95,475],[425,475]]],
  u: [[[105,475],[105,95],[195,0],[365,0],[460,95]],[[460,475],[460,0]]],
  v: [[[85,475],[285,0],[485,475]]],
  w: [[[60,475],[155,0],[290,285],[425,0],[520,475]]],
  x: [[[105,475],[465,0]],[[465,475],[105,0]]],
  y: [[[85,475],[285,0],[485,475]],[[285,0],[195,-205],[105,-205]]],
  z: [[[105,475],[465,475],[105,0],[465,0]]],
  '0': [[[190,0],[105,100],[105,600],[190,700],[390,700],[475,600],[475,100],[390,0],[190,0]],[[155,80],[425,620]]],
  '1': [[[180,565],[300,700],[300,0]],[[160,0],[440,0]]],
  '2': [[[110,600],[200,700],[380,700],[470,600],[470,465],[105,0],[475,0]]],
  '3': [[[110,620],[200,700],[380,700],[470,610],[470,450],[380,355],[230,355]],[[380,355],[470,260],[470,90],[380,0],[190,0],[105,80]]],
  '4': [[[405,0],[405,700],[90,210],[500,210]]],
  '5': [[[470,700],[140,700],[105,370],[365,370],[470,270],[470,95],[380,0],[190,0],[105,75]]],
  '6': [[[445,650],[365,700],[190,700],[105,580],[105,100],[190,0],[375,0],[470,100],[470,270],[375,370],[190,370],[105,270]]],
  '7': [[[90,700],[500,700],[235,0]]],
  '8': [[[190,0],[100,95],[100,250],[190,350],[390,350],[480,250],[480,95],[390,0],[190,0]],[[190,350],[110,445],[110,605],[190,700],[390,700],[470,605],[470,445],[390,350]]],
  '9': [[[475,330],[385,420],[195,420],[105,510],[105,605],[195,700],[385,700],[475,605],[475,100],[385,0],[195,0],[120,65]]],
  '!': [[[290,700],[290,190]]],
  '?': [[[105,590],[200,700],[385,700],[475,590],[475,460],[290,300],[290,205]]],
  '.': [], ',': [[[300,35],[250,-115]]], ':': [], ';': [[[300,35],[250,-115]]],
  '-': [[[130,250],[450,250]]], '_': [[[80,-75],[500,-75]]],
  '+': [[[290,470],[290,60]],[[85,265],[495,265]]],
  '=': [[[110,355],[470,355]],[[110,140],[470,140]]],
  '<': [[[465,530],[105,255],[465,0]]], '>': [[[105,530],[465,255],[105,0]]],
  '/': [[[95,-80],[485,700]]], '\\': [[[95,700],[485,-80]]],
  '|': [[[290,700],[290,-120]]],
  '(': [[[405,750],[250,590],[210,350],[250,110],[405,-50]]],
  ')': [[[175,750],[330,590],[370,350],[330,110],[175,-50]]],
  '[': [[[390,750],[210,750],[210,-50],[390,-50]]],
  ']': [[[190,750],[370,750],[370,-50],[190,-50]]],
  '{': [[[425,750],[310,750],[240,650],[240,420],[150,350],[240,280],[240,50],[310,-50],[425,-50]]],
  '}': [[[155,750],[270,750],[340,650],[340,420],[430,350],[340,280],[340,50],[270,-50],[155,-50]]],
  '*': [[[290,560],[290,100]],[[105,445],[475,215]],[[475,445],[105,215]]],
  '#': [[[230,650],[140,50]],[[440,650],[350,50]],[[90,430],[510,430]],[[65,230],[485,230]]],
  '%': [[[105,0],[475,700]]],
  '&': [[[475,0],[175,380],[135,505],[175,650],[300,700],[420,625],[420,500],[105,185],[105,85],[190,0],[390,0],[475,100]]],
  '@': [[[475,80],[390,0],[185,0],[105,95],[105,600],[185,700],[390,700],[475,600],[475,260],[390,175],[270,175],[195,255],[195,450],[270,530],[390,530],[475,450]]],
  '$': [[[465,615],[380,700],[190,700],[105,615],[105,450],[190,360],[380,340],[465,250],[465,85],[380,0],[190,0],[105,85]],[[290,760],[290,-60]]],
  '^': [[[105,350],[290,700],[475,350]]], '~': [[[90,235],[180,320],[290,260],[400,200],[490,285]]],
  '`': [[[220,760],[340,610]]], "'": [[[290,700],[290,480]]],
  '"': [[[200,700],[200,480]],[[380,700],[380,480]]],
};

const glyphs: any[] = [new opentype.Glyph({name:'.notdef',advanceWidth:cell*S,path:pathOf([[[100,0],[100,700],[500,700],[500,0],[100,0]],[[100,0],[500,700]]])})];
const add = (name:string, unicode:number|undefined, path:any, width=cell) => glyphs.push(new opentype.Glyph({name,unicode,advanceWidth:width*S,path}));
for (let cp=32;cp<=126;cp++) {
  const ch=String.fromCharCode(cp), path=pathOf(G[ch] || []);
  if ('!.:;?ij'.includes(ch)) {
    if ('!.:;?'.includes(ch)) circle(path,[290,55],34);
    if (':;'.includes(ch)) circle(path,[290,375],34);
    if ('ij'.includes(ch)) circle(path,[285,650],34);
  }
  if (ch==='%') { circle(path,[155,575],80);circle(path,[425,125],80); }
  if (ch==='&') stroke(path,[[325,365],[490,0]]);
  add(`uni${cp.toString(16).padStart(4,'0').toUpperCase()}`,cp,path);
}
const accents: Record<string,[string,string]> = {
  'à':['a','grave'],'á':['a','acute'],'â':['a','circumflex'],'ã':['a','tilde'],'ä':['a','diaeresis'],
  'è':['e','grave'],'é':['e','acute'],'ê':['e','circumflex'],'ë':['e','diaeresis'],
  'ì':['i','grave'],'í':['i','acute'],'î':['i','circumflex'],'ï':['i','diaeresis'],
  'ò':['o','grave'],'ó':['o','acute'],'ô':['o','circumflex'],'õ':['o','tilde'],'ö':['o','diaeresis'],
  'ù':['u','grave'],'ú':['u','acute'],'û':['u','circumflex'],'ü':['u','diaeresis'],
  'ç':['c','cedilla'],'ñ':['n','tilde'],
  'À':['A','grave'],'Á':['A','acute'],'Â':['A','circumflex'],'Ã':['A','tilde'],
  'É':['E','acute'],'Ê':['E','circumflex'],'Í':['I','acute'],
  'Ó':['O','acute'],'Ô':['O','circumflex'],'Õ':['O','tilde'],
  'Ú':['U','acute'],'Ç':['C','cedilla'],'Ñ':['N','tilde'],
};
for (const [character,[base,accent]] of Object.entries(accents)) {
  const upper=base===base.toUpperCase(), top=upper?780:605;
  const path=pathOf(G[base]);
  if (accent==='acute') stroke(path,[[235,top-55],[345,top+25]],55);
  if (accent==='grave') stroke(path,[[235,top+25],[345,top-55]],55);
  if (accent==='circumflex') {stroke(path,[[190,top-50],[290,top+25],[390,top-50]],50);}
  if (accent==='tilde') stroke(path,[[165,top-25],[235,top+20],[305,top-20],[375,top+25]],45);
  if (accent==='diaeresis') {circle(path,[210,top],30);circle(path,[370,top],30);}
  if (accent==='cedilla') stroke(path,[[310,0],[345,-95],[260,-145]],48);
  add(`uni${character.codePointAt(0)!.toString(16).padStart(4,'0').toUpperCase()}`,character.codePointAt(0),path);
}
// The opening/descending/diagonal silhouette is the Umbra mark, drawn anew
// for the monospaced cell. Its supplementary PUA code avoids Nerd Font slots.
const mark=P();
stroke(mark,[[125,650],[125,255],[175,165],[280,130],[345,130],[480,495]],73);
add('umbraLimiar',0x100000,mark);
// Programming ligatures retain the width of their source sequence.
const ligatures: [string,string,Stroke[]][] = [
  ['->','arrowRight',[[[135,350],[1040,350]],[[800,565],[1040,350],[800,135]]]],
  ['=>','doubleArrowRight',[[[130,455],[810,455]],[[130,245],[810,245]],[[780,565],[1050,350],[780,135]]]],
  ['!=','notEqual',[[[200,650],[350,140]],[[670,450],[1050,450]],[[670,245],[1050,245]]]],
  ['<=','lessEqual',[[[505,600],[110,350],[505,100]],[[690,140],[1060,140]]]],
  ['>=','greaterEqual',[[[100,600],[495,350],[100,100]],[[690,140],[1060,140]]]],
  ['==','doubleEqual',[[[145,455],[1055,455]],[[145,245],[1055,245]]]],
];
for (const [sequence,name,parts] of ligatures) add(name,undefined,pathOf(parts),cell*sequence.length);

// Nerd Font symbols are a separately credited icon set. Text glyphs above
// never inherit outlines from the symbol font.
const symbolSource=process.env.UMBRA_NERD_SYMBOLS || '/usr/share/fonts/TTF/SymbolsNerdFont-Regular.ttf';
const symbolBytes=readFileSync(symbolSource);
const symbols=opentype.parse(symbolBytes.buffer.slice(symbolBytes.byteOffset,symbolBytes.byteOffset+symbolBytes.byteLength));
let iconCount=0;
const iconCodes=new Set<number>();
for (let i=0;i<symbols.glyphs.length;i++) {
  const source=symbols.glyphs.get(i);
  const cp=source.unicode;
  if (cp===undefined || (cp<0xe000 && ![0x23fb,0x23fc,0x23fd,0x23fe,0x2630,0x2665,0x26a1].includes(cp))) continue;
  if (cp===0x100000 || iconCodes.has(cp)) continue;
  iconCodes.add(cp);
  const box=source.getBoundingBox();
  const span=Math.max(1,box.x2-box.x1);
  const factor=Math.min(1, 1020/span);
  const shift=(cell*S-span*factor)/2-box.x1*factor;
  const p=P();
  for (const cmd of source.path.commands) {
    const x=(v:number)=>v*factor+shift;
    const y=(v:number)=>v*factor;
    if (cmd.type==='M') p.moveTo(x(cmd.x),y(cmd.y));
    else if (cmd.type==='L') p.lineTo(x(cmd.x),y(cmd.y));
    else if (cmd.type==='Q') p.quadTo(x(cmd.x1),y(cmd.y1),x(cmd.x),y(cmd.y));
    else if (cmd.type==='C') p.curveTo(x(cmd.x1),y(cmd.y1),x(cmd.x2),y(cmd.y2),x(cmd.x),y(cmd.y));
    else if (cmd.type==='Z') p.close();
  }
  add(`nf${cp.toString(16).toUpperCase()}`,cp,p);
  iconCount++;
}
const font=new opentype.Font({familyName:'Umbra Limiar Mono NF',styleName:'Regular',unitsPerEm:2048,ascender:1638,descender:-410,glyphs});
for (const platform of ['windows','macintosh','unicode']) {
  if (font.names[platform]) {
    font.names[platform].copyright={en:'Umbra text outlines © 2026 Umbra contributors. Nerd Font symbols © their respective authors.'};
    font.names[platform].description={en:'Original Umbra monospaced letterforms with programming ligatures and Nerd Font symbols.'};
  }
}
const base=join(out,'UmbraLimiarMonoNF-base.otf');
const final=join(out,'UmbraLimiarMonoNF-Regular.otf');
writeFileSync(base,Buffer.from(font.toArrayBuffer()));
const feature=join(root,'features.fea');
const result=spawnSync('fonttools',['feaLib','-o',final,feature,base],{encoding:'utf8'});
if(result.status!==0) throw new Error(`fonttools feaLib failed: ${result.stderr}`);
const licenseSource=process.env.UMBRA_NERD_LICENSE || '/usr/share/licenses/ttf-nerd-fonts-symbols-common/LICENSE';
writeFileSync(join(out,'NERD-FONTS-LICENSE.txt'),readFileSync(licenseSource));
const svgPath=(value:string,x:number,y:number,size:number)=>font.getPath(value,x,y,size,{kerning:false}).toPathData(2);
const specimen=`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="920" viewBox="0 0 1440 920">
<rect width="1440" height="920" fill="#050505"/><rect x="48" y="48" width="1344" height="824" fill="#101111" stroke="#252727"/>
<g fill="none" stroke="#252727"><path d="M72 210H1368M72 690H1368"/></g>
<g fill="#858A89" font-family="sans-serif" font-size="19" letter-spacing="3"><text x="80" y="96">UMBRA / LIMIAR MONO NF — PROTÓTIPO 01</text><text x="80" y="750">GLIFOS AUTORAIS + SÍMBOLOS NERD FONT</text></g>
<g fill="#C5C7C5"><path d="${svgPath('Umbra Limiar',80,178,74)}"/><path d="${svgPath('ABCDEFGHIJKLMNOPQRSTUVWXYZ',80,305,40)}"/><path d="${svgPath('abcdefghijklmnopqrstuvwxyz',80,390,40)}"/><path d="${svgPath('0123456789  !?{}[]()<>=+-/',80,475,40)}"/><path d="${svgPath('const limiar = (shadow) => light;',80,595,48)}"/></g>
<path d="${svgPath(String.fromCodePoint(0x100000),1110,840,180)}" fill="#C5C7C5"/>
</svg>`;
writeFileSync(join(out,'specimen.svg'),specimen);
console.log(`Built ${final}: ${glyphs.length} glyphs, ${iconCount} Nerd Font symbols, ${ligatures.length} ligatures`);
