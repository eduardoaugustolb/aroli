# Umbra Limiar Mono NF

Protótipo autoral de fonte monoespaçada para programação. O alfabeto latino básico, algarismos, pontuação, símbolo do limiar e ligaduras são desenhados em [`build.ts`](build.ts). A construção combina segmentos retos e curvas discretas, com terminais abertos, largura fixa e o gesto descendente/diagonal do limiar na marca U+100000.

Os ícones vêm de **Symbols Nerd Font** e mantêm seus pontos de código. São um conjunto externo à autoria dos caracteres de texto. A fonte gera um único OTF com ambos; `dist/NERD-FONTS-LICENSE.txt` acompanha a compilação. Os nomes e o desenho do texto Umbra não são derivados de JetBrains Mono, Fira Code ou outra fonte de texto.

## Construção

Requisitos: Bun, `opentype.js` (instalado pelo Bun), `fonttools` e o arquivo `SymbolsNerdFont-Regular.ttf`. O script procura este último em `/usr/share/fonts/TTF/` ou no caminho indicado por `UMBRA_NERD_SYMBOLS`.

```sh
cd fonts/umbra
bun install
bun run build
```

Saída: [`dist/UmbraLimiarMonoNF-Regular.otf`](dist/UmbraLimiarMonoNF-Regular.otf). O arquivo `dist/*-base.otf` é intermediário. Ative *contextual alternates* (`calt`) no editor para `->`, `=>`, `!=`, `<=`, `>=` e `==`. O símbolo Umbra fica em U+100000. Veja o [espécime PNG](dist/specimen.png) ou [SVG](dist/specimen.svg).

## Estado do protótipo

- Cobertura textual: ASCII 32–126 e 37 letras acentuadas comuns em português e idiomas próximos. Ainda faltam outros caracteres latinos, pesos, itálico e refinamento de espaçamento e hinting.
- As ligaduras preservam a largura total da sequência. Seu suporte visual depende do editor/terminal.
- Os ícones Nerd Font preservam os códigos do conjunto instalado. A cobertura exata depende da versão desse arquivo.
- O desenho ainda precisa de prova em tamanhos de 10–14 px, tela comum e HiDPI, antes de uma versão estável.

Esta fonte é opcional e não altera as configurações dos temas Umbra existentes. O guia de marca em [`../../DESIGN.md`](../../DESIGN.md) continua a orientar forma e legibilidade.

## Licenciamento

O código e os desenhos textuais Umbra são originais deste projeto; os ícones pertencem aos respectivos autores do Nerd Fonts. A licença proprietária da raiz não deve ser apresentada como licença exclusiva do OTF combinado. O protótipo está pronto para avaliação local; antes de publicar ou redistribuir o binário, é necessário definir uma licença compatível para os glifos autorais e conferir as licenças do conjunto de ícones usado na compilação.
