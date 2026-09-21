// Run with bun branding/umbra/explorations/limiar/build.ts
const dir = import.meta.dir;
const old = 'M16 16V68C16 108 72 108 72 68V16L104 60L136 16V100';
const proposed = 'M24 20V72Q24 108 60 108H100L148 44';
const connected = 'M24 20V72Q24 108 60 108H100L148 44L176 72L204 44';
const head = (w:number,h:number,title:string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${title}</title>`;
const shape = (variant:number|boolean,color='#C5C7C5') => `<path d="${variant===2?connected:variant?proposed:old}" fill="none" stroke="${color}" stroke-width="16" stroke-linejoin="${variant===2?'bevel':variant?'round':'bevel'}"/>`;
await Bun.write(`${dir}/limiar-symbol.svg`,head(172,132,'Umbra — proposta U limiar')+shape(true)+'</svg>');
await Bun.write(`${dir}/limiar-m-symbol.svg`,head(228,132,'Umbra — limiar com M abstrato conectado')+shape(2)+'</svg>');
const mark=(n:number|boolean,x:number,y:number,w:number,color='#C5C7C5')=>`<g transform="translate(${x} ${y}) scale(${w/(n===2?228:n?172:152)})">${shape(n,color)}</g>`;
const text=(x:number,y:number,s:string,size=18,color='#858A89')=>`<text x="${x}" y="${y}" fill="${color}" font-family="DejaVu Sans,sans-serif" font-size="${size}">${s}</text>`;
let s=head(2144,1520,'Umbra — comparação UM atual, U limiar e limiar com M');
s+='<defs><filter id="blur"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="2144" height="1520" fill="#050505"/>';
s+=text(64,62,'umbra / estudo de símbolo',28,'#C5C7C5')+text(64,96,'01 — Comparação para avaliação · formas planas, sem luz ou textura',16);
s+='<path d="M720 140V1430M1424 140V1430" stroke="#252727"/>';
for(const n of [0,1,2]){
 const x=64+n*704;
 s+=text(x,164,['A / UM ATUAL','B / U LIMIAR','C / LIMIAR + M ABSTRATO'][n],18,'#C5C7C5');
 s+=text(x,194,['Duas letras em um percurso contínuo.','Curva à esquerda. Abertura. Saída diagonal.','A diagonal continua em um M de vale raso.'][n],16);
 s+=mark(n,x+132,242,290);
 s+=text(x,516,'SÍMBOLO / mesma largura óptica aproximada',13);
 s+=text(x,564,'FAVICON / 16, 24, 32 e 48 px',13);
 let dx=x; for(const z of [16,24,32,48]){s+=mark(n,dx,590,z)+text(dx,656,String(z),12);dx+=90;}
 s+=text(x,710,'AVATAR / quadrado e recorte circular',13);
 s+=`<rect x="${x}" y="734" width="128" height="128" rx="24" fill="#161919"/><circle cx="${x+248}" cy="798" r="64" fill="#161919"/>`;
 s+=mark(n,x+24,766,80)+mark(n,x+208,766,80);
 s+=text(x,918,'ASSINATURA / símbolo + nome',13)+mark(n,x,948,68)+text(x+92,994,'umbra',48,'#C5C7C5');
 s+=text(x,1064,'INVERSÃO / preto sobre Bone',13)+`<rect x="${x}" y="1084" width="560" height="126" rx="4" fill="#C5C7C5"/>`+mark(n,x+228,1103,100,'#050505');
 s+=text(x,1258,'DESFOQUE / estrutura geral',13)+`<g filter="url(#blur)">${mark(n,x,1284,130)}</g>`;
 s+=text(x,1436,['Mais literal; a junção concentra detalhes.','Mais aberto; pode parecer um recipiente ou uma rampa.','Mais horizontal; o M também pode parecer um zigue-zague.'][n],15);
}
s+=text(64,1490,'Proposta exploratória · identidade vigente preservada · reconhecimento por pessoas ainda não medido',14);
await Bun.write(`${dir}/comparison.svg`,s+'</svg>');
let test=head(1440,580,'Umbra — testes de linguagem sem assinatura e troca de nome');
test+='<rect width="1440" height="580" fill="#050505"/>';
test+=text(64,64,'02 — A linguagem além do símbolo',28,'#C5C7C5');
test+=text(64,108,'Sem logo, nome ou slogan',18)+text(768,108,'Troca de nome / controle de distinção',18);
for(const x of [64,768]){
 test+=`<rect x="${x}" y="140" width="600" height="320" fill="#101111"/>`;
 test+=`<path d="M${x+300} 170V300Q${x+300} 386 ${x+370} 386H${x+480}L${x+564} 268" fill="none" stroke="#292D2D" stroke-width="22"/>`;
}
test+=text(796,230,'nord',44,'#C5C7C5');
test+=text(64,506,'O contorno mantém parentesco com o wallpaper.',16)+text(768,506,'A troca ainda é plausível: exclusividade não comprovada.',16);
test+=text(64,544,'O limiar pode organizar recortes e composições; associação à Umbra exige uso consistente.',16);
await Bun.write(`${dir}/language-tests.svg`,test+'</svg>');
