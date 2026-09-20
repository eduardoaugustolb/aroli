# Changelog

## [0.7.2] - 2026-09-14

- hover de warn corrigido: `warning` clareado para `#D7BF88` sobre `warning.background` `#211A0E` (9.6:1), `warning.border` para `#8A774E`;
- `elevated_surface.background` elevado para `#161919` para popovers se destacarem do editor;
- sintaxe menos cinza em Go: tipos/constantes/construtores/escapes em blue `#7FB8CC`, namespaces/módulos/membros/propriedades em sage `#9AB7B0`, adicionados `namespace`, `module` e `parameter`.

## [0.7.1] - 2026-09-11

- botão Install/Upgrade das extensões agora usa `info.background` sage escuro em vez do azul padrão do Zed;
- adicionados `info.border`, `hint.background/border`, `success.border` e família `warning` para evitar fallbacks azuis;
- `panel.focused_border` alinhado de `#00A6C7` para sage `#9AB7B0`, consistente com `border.focused`.

## [0.3.0] - 2026-09-05

- nova base dark charcoal com editor Ink `#050505` e painéis Charcoal `#101111`;
- sintaxe com Violet, Blue e Cyan usados de forma econômica;
- estados de foco, seleção, erro e sucesso recalibrados para combinar superfície, borda e acento.

## [0.4.0] - 2026-09-05

- sintaxe inspirada na distribuição semântica do Min Theme, sem reproduzir sua paleta;
- funções, keywords, tipos, strings, números e operadores agora têm separação cromática própria;
- cores reduzidas em saturação para preservar a atmosfera Umbra.

## [0.5.0] - 2026-09-05

- distribuição de cores refinada a partir das referências Min, Catppuccin e Dracula;
- tons Lilac, Violet, Blue, Amber, Gold e Sage ajustados para uma sintaxe mais expressiva e menos saturada;
- funções e variáveis comuns mantidas fora dos acentos mais fortes.

## [0.6.0] - 2026-09-05

- componentes de UI consolidados na superfície Charcoal `#101111`;
- variações de quase preto removidas de painéis, abas, menus e controles;
- hover, seleção e foco mantidos apenas como estados de interação.

## [0.7.0] - 2026-09-05

- editor, gutter e terminal unificados com a superfície Charcoal `#101111`;
- azul ciano intenso substituído por Slate Blue e Sage Blue mais suaves;
- paleta da sintaxe e documentação sincronizadas.

## [0.2.0] - 2026-09-05

- paleta refeita em dark charcoal, com separação mais clara entre editor, painéis e controles;
- sintaxe com acentos frios econômicos e pouco saturados;
- estados de interface ajustados para combinar fundo, borda e cor sem espalhar acentos;
- contraste visual calibrado para leitura mais calma sem apagar a estrutura do código.

## [0.1.0] - 2026-09-05

- primeira versão do tema `Umbra`;
- superfícies OLED/AMOLED em preto e cinza;
- sintaxe com acentos cyan, violet, amber, coral e mint;
- cores ANSI para o terminal integrado do Zed.
