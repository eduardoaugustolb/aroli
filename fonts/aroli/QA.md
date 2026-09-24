# Validação 0.9 — 2026-09-23

## Correção 0.904

O 0.903 não resolveu no olho: medi o rabicho e ele tem 0.57 px a 15 px —
some no antialiasing e sobra só o ponto. Novo rabicho com 1.3x a haste,
curva à esquerda até -150 (borda ~-362): `,` e `;` com gancho visível a
15 px no render FreeType, `.` inalterado. Fundo de tela escuro exige esse
contraste extra; o Zed precisa ser reiniciado para carregar os novos OTFs.

## Correção 0.903

`.` era só o ponto e `,` só o rabicho — em tamanho de código ambos liam como
o mesmo borrão na base. Agora `,` = ponto do final + rabicho e a metade
inferior de `;` é essa mesma vírgula. Um guarda incompleto (`!.:;?ij`, sem a
vírgula) quase anulou a correção; a remedição confirma `comma.y2 == period.y2`
nos três pesos (287/320/370) com rabicho até ~-265. `verify.ts` trava `.` na
base, `,`/`;` descendentes e pares distintos; `proof.ts` ganha linha de
pontuação, inspecionada no PNG.

## Correção 0.902

Causa raiz do piso desnivelado: barras horizontais em y=0 com borda em -hw
contra terminais verticais com borda em 0 — diferença de meio traço, consistente
em E/L/D/O/0 contra H/M/N. O 0.901 mascarou com escala vertical por glifo,
o que distorceu contornos e quebrou o autohinter (m Regular só com ombro,
SemiBold sem hints).
Agora `fixStrokes` desloca juntas não-verticais por |dx|/len*hw na construção,
com tratamento de loops fechados (O/o/0/D). Resultado em 2048 UPM:
planos em 0, ápices em -1..-5, todos dentro do fuzz [-16,0].
Hints: m/0/o/E com haste de base nos três pesos; SemiBold volta a hintar.
Raster Pillow/FreeType com `verify-raster.py`: 15 px exato (tamanho do Zed)
nos três pesos; 12/14/16/24 px dentro de 1 px. Provas PNG dos três pesos
abertas e inspecionadas.

## Correção 0.901

O screenshot posterior do Zed revelou uma falha que a inspeção anterior não
detectou: contornos com bases em -80, -68, -45, -32, -29 e 0 unidades.
Agora os caracteres sem descendentes terminam em 0, minúsculas de corpo baixo
chegam a 1065 e maiúsculas a 1434 unidades (arredondadas no OTF).
`verify.ts` verifica a base e a altura-x, e `verify-raster.py` verifica o limite
inferior visível em 12/14/15/16/24 px com Pillow/FreeType. O m Regular recebe
uma instrução de alinhamento inferior quando o autohinter a omite.
As provas de cada peso incluem agora uma linha específica de comparação da base.

Referência da instrução de borda CFF: [Adobe Type 2, seção 4.3](https://partners.adobe.com/public/developer/en/font/5177.Type2.pdf).

## Executado

- `bun install` e `AROLI_FONT_PYTHON=/tmp/aroli-font-tools/bin/python bun run build:all`: concluídos para Regular, Medium e SemiBold.
- Dependências da finalização: versões fixadas em `requirements-build.txt`.
- Cada OTF: 10.757 glifos, dos quais 10.617 são símbolos Nerd Font, e seis ligaduras.
- União dos contornos autorais e hinting CFF sem mensagens de erro; presença de instruções de haste verificada em I/i/l/n.
- Cobertura, avanço monoespaçado, largura das ligaduras, GSUB/calt, ponto de j, margens de i, diferenciação I/l/1 e pesos 400/500/600 verificados automaticamente.
- `fonttools ttx -l` nos três arquivos: tabelas CFF, GSUB, OS/2, cmap, head, hhea, hmtx, ltag, maxp, name e post presentes.
- Provas PNG de cada peso abertas e inspecionadas: alfabetos, acentos, i/I/l/1, ligaduras, ícones e código em 10–24 px. Regular anterior renderizado separadamente para comparação. 14–16 px é a faixa alvo; 10 px permanece um teste de estresse.
- Instalação autorizada com backup prévio; os três OTFs instalados conferem byte a byte com os artefatos validados. Fontconfig resolve Regular por padrão e seleciona Medium/SemiBold quando solicitados.
- `git diff --check`: sem erros.

## Limites desta validação

O Zed não foi reiniciado nem sua renderização final foi verificada nesta sessão.
Ainda é necessária a aceitação visual na IDE e em HiDPI antes de promover a
versão 0.9 para 1.0. Hinting melhora a rasterização, mas não torna todos os
renderizadores equivalentes. Itálico e cobertura latina ampliada não fazem
parte desta versão.
