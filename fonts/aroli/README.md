# Aroli Mono NF

Protótipo autoral de fonte monoespaçada para programação. O alfabeto latino básico, algarismos, pontuação, símbolo do Encaixe e ligaduras são desenhados em [`build.ts`](build.ts). A construção combina segmentos retos e curvas discretas, com terminais abertos, largura fixa e a marca Encaixe em U+100000, derivada do mestre vetorial. O desenho dos caracteres de código foi preservado nesta migração; Aroli Sans é a fonte proporcional de comunicação, não a fonte monoespaçada.

Os ícones vêm de **Symbols Nerd Font** e mantêm seus pontos de código. São um conjunto externo à autoria dos caracteres de texto. A fonte gera um único OTF com ambos; `dist/NERD-FONTS-LICENSE.txt` acompanha a compilação. Os nomes e o desenho do texto Aroli não são derivados de JetBrains Mono, Fira Code ou outra fonte de texto.

## Construção

Use `AROLI_NERD_SYMBOLS` e `AROLI_NERD_LICENSE` para caminhos personalizados. `UMBRA_NERD_SYMBOLS` e `UMBRA_NERD_LICENSE` continuam aceitos como aliases de compatibilidade, com prioridade para os nomes novos.

Requisitos: Bun, `opentype.js` (instalado pelo Bun), `fonttools`, `pango-view`, Fontconfig e o arquivo `SymbolsNerdFont-Regular.ttf`. O script procura este último em `/usr/share/fonts/TTF/` ou no caminho indicado por `AROLI_NERD_SYMBOLS`.

```sh
cd fonts/aroli
bun install
bun run build
```

Saída: [`dist/AroliMonoNF-Regular.otf`](dist/AroliMonoNF-Regular.otf). Há também pesos de leitura para interfaces: [`Medium`](dist/AroliMonoNF-Medium.otf) e [`SemiBold`](dist/AroliMonoNF-SemiBold.otf), gerados pelo mesmo desenho com contorno mais robusto. O arquivo `dist/*-base.otf` é intermediário. Ative *contextual alternates* (`calt`) no editor para `->`, `=>`, `!=`, `<=`, `>=` e `==`. O símbolo Aroli fica em U+100000. Veja o [espécime PNG](dist/specimen.png) ou [SVG](dist/specimen.svg).

## Estado do protótipo

A prova visual é produzida com Pango/HarfBuzz a partir do OTF final, em um ambiente Fontconfig isolado sem fontes de fallback. Inclui os 37 caracteres acentuados, comparação `calt=0`/`calt=1`, i/j, ícones e tamanhos de 12, 14, 16 e 24 px. É obrigatório abrir e inspecionar o PNG após alterações; a geração do arquivo por si só não constitui aprovação visual.

- Cobertura textual: ASCII 32–126 e 37 letras acentuadas comuns em português e idiomas próximos. Ainda faltam outros caracteres latinos, pesos, itálico e refinamento de espaçamento e hinting.
- As ligaduras preservam a largura total da sequência. Seu suporte visual depende do editor/terminal.
- Os ícones Nerd Font preservam os códigos do conjunto instalado. A cobertura exata depende da versão desse arquivo.
- O desenho ainda precisa de prova em tamanhos de 10–14 px, tela comum e HiDPI, antes de uma versão estável.

Esta fonte é opcional e não altera as configurações dos temas Aroli existentes. O guia de marca em [`../../DESIGN.md`](../../DESIGN.md) continua a orientar forma e legibilidade.

## Licenciamento

O código e os desenhos textuais Aroli são originais deste projeto; os ícones pertencem aos respectivos autores do Nerd Fonts. A licença proprietária da raiz não deve ser apresentada como licença exclusiva do OTF combinado. O protótipo está pronto para avaliação local; antes de publicar ou redistribuir o binário, é necessário definir uma licença compatível para os glifos autorais e conferir as licenças do conjunto de ícones usado na compilação.
