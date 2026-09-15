# Changelog

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
