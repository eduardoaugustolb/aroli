# Changelog

## Base do mindinho — 2026-09-16

- ligação do mindinho à palma alargada na mão aberta, com espaço interdigital
  mais raso e curva externa mais cheia;
- contorno único de 2,5 preservado: a correção recupera área Bone na geometria,
  sem afinar o traço nem alterar a região inferior compartilhada das mãos.

## Ponta do indicador de progresso — 2026-09-16

- ponta circular alinhada à tangente do arco e ao sentido horário da animação;
- substituído o cotovelo radial por cabeça triangular dentro do envelope do selo;
- símbolo compartilhado pela versão estática e pelos 24 quadros animados.

## Carregamento animado — 2026-09-16

- wait gira a ampulheta; progress gira apenas o símbolo do selo;
- 24 quadros de 50 ms por tamanho (24/32/48 px), com hotspots fixos;
- writer XCursor grava duração por quadro; aliases watch e left_ptr_watch;
- prévia animada no laboratório, com movimento reduzido;
- verificação de 234 frames: duração, variação, transição do loop, margens,
  alpha e estabilidade da seta; leitura confirmada pela libXcursor;
- todos os quadros inspecionados em claro/escuro; teste na sessão real pendente.


## Coerência dos estados auxiliares — 2026-09-16

- substituído núcleo Ink com halo Bone por corpo Bone e limite Charcoal;
- direcionais reconstruídos como silhuetas preenchidas, com hastes e pontas;
- menu e progresso reutilizam a seta limiar e os selos, com hotspot (5, 4);
- preview ampliado de sete para todos os 32 estados;
- corrigida a orientação invertida de nesw-resize e nwse-resize;
- 96 frames verificados; silhuetas, preview e pixels revisados em claro/escuro;
- laboratório interativo pendente: nenhum navegador conectado nesta sessão;
- critérios de identidade registrados em QUALITY.md; validação de sessão
  e reconhecimento pelo usuário permanecem pendentes.

## Halo nos estados de traço — 2026-09-15

- estados finos (text, resizes, crosshair, cell, wait, zoom e demais de
  `generate-states.ts`) ganharam halo Bone sob o núcleo Ink;
- antes, o traço único Ink ficava invisível sobre fundo escuro (0 px visíveis
  do `text` em `#101111`); agora são 384 px visíveis no escuro e 526 no claro;
- `make check preview` aprovado: 32 cursores × 3 tamanhos, hotspots, alpha,
  margens e aliases; teste em sessão real pendente.

## Laboratório de cursores — 2026-09-15

- adicionada página test.html com CSS e JS separados;
- catálogo dos 32 estados e aliases, filtro e playground de texto, links,
  arraste, drop e redimensionamento;
- documentação de qualidade passou a exigir a revisão da página além da folha
  de contato dos binários.

## Estados padrão completos — 2026-09-15

- adicionados all-scroll, auto, cell, redimensionamentos, context-menu,
  crosshair, help, progresso, texto, espera, zoom e cursor oculto;
- `move` corrigido para all-scroll; `dnd-move` continua com a mão fechada;
- formas auxiliares vêm de um gerador único e os 96 frames são verificados.

## Acabamento da família — 2026-09-15

- microajustes na base do indicador, ritmo dos dedos dobrados e lateral do hover;
- base do mindinho aberto integrada por curvas, preservando largura e afastamento;
- mão fechada preservada nesta etapa; base anatômica e outline de 2,5 inalterados;
- 21 frames verificados e silhuetas inspecionadas em tamanhos reduzidos.

## Refinamento de caráter — 2026-09-15

- hover com indicador levemente inclinado, base orgânica e nós mais definidos;
- assimetrias discretas na mão fechada, preservando sua estrutura;
- mindinho aberto alargado sem alterar a espessura do contorno;
- polegar encurtado, lateral da palma mais cheia e punho suavizado nas três poses;
- silhuetas e binários inspecionados em claro/escuro; 21 frames verificados.

## Reconstrução anatômica — 2026-09-15

- palma alta, polegar curto e arredondado, punho simples e dedos articulados;
- removidos dentes inferiores e riscos internos;
- prancha de silhuetas para avaliação sem cor ou detalhes;
- testes revistos para não cristalizar a construção rejeitada de barras;
- 21 frames verificados; reconhecimento pelo usuário, sessão real e CI remota pendentes.

## Anatomia compartilhada e qualidade — 2026-09-15

- gerador único para largura dos dedos, polegar, dorso e punho das três mãos;
- espaços reais entre dedos da mão aberta, preservados em 24/32/48 px;
- hotspot do hover atualizado para a nova posição do indicador;
- regressões verificadas nos pixels e detecção de SVG gerado desatualizado;
- QUALITY.md e AGENTS.md orientam futuras alterações e revisão visual;
- CI ampliada para compilar, verificar e publicar provas visuais;
- 21 frames verificados localmente; sessão real e CI remota ainda não testadas.

## Refinamento visual — 2026-09-15

- mãos redesenhadas em vista dorsal, com três marcas alinhadas, punho e dedos completos;
- selos de status com a mesma margem radial interna, incluindo a espessura dos símbolos;
- seta com curva inferior esquerda e encontros chanfrados derivados do limiar Umbra;
- sete estados reconstruídos e verificados em 24, 32 e 48 px.

## Correções — 2026-09-15

- pontos de clique consistentes na seta e nos estados de arraste; hover junto à ponta do dedo;
- fechamento do contorno e separadores dos dedos da mão corrigidos;
- contorno da seta uniforme entre estados;
- selo de mover centralizado, link redesenhado e símbolos com folga interna;
- margem direita dos selos preservada também em 24 px;
- pixels XCursor gravados em ARGB pré-multiplicado, evitando halos;
- preview dos seis estados e verificação dos 18 frames gerados.

## 0.1.0 — 2026-09-15

- primeira versão do Umbra Cursor;
- seta, hover e estados essenciais de drag-and-drop autorais;
- build XCursor em 24, 32 e 48 px e aliases para nomes comuns.
