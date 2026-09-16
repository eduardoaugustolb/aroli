# Umbra Cursor

![Preview do Umbra Cursor](preview.svg)

Pack de cursores para Linux. A seta é limpa e neutra, com preenchimento Bone e
contorno Charcoal. A seta adapta o limiar de `DESIGN.md`: descida vertical,
curva inferior à esquerda e saída diagonal à direita, com encontros chanfrados.
As mãos usam palma alta, polegar curto, punho simples e dedos articulados.
A base do mindinho da mão aberta preserva área clara entre as bordas do
contorno, com ligação cheia à palma e espaço interdigital raso.
A leitura depende da silhueta, sem marcas internas ou dentes no punho.
Ao arrastar, a mão fica fechada; o estado `grab` usa a mão aberta.
Copiar, criar link e operação proibida usam selos específicos.
Os estados auxiliares mantêm corpo Bone e contorno Charcoal de 2,5 unidades.
Setas direcionais têm silhuetas preenchidas; instrumentos de precisão usam
núcleo claro com limite escuro. Menu e progresso reutilizam a seta original
e a geometria dos selos. Não usar núcleo Ink com halo Bone.
Os desenhos são autorais — não são assets do macOS.

Os selos compartilham centro `(36, 35)`, raio de 9 px e contorno de 2 px.
Os símbolos ficam inscritos em um raio de 6,25 px (incluindo seus traços),
preservando 1,75 px até a borda interna do círculo na grade de 48 px.
A cor identifica o estado; a geometria e o espaçamento permanecem constantes.

## Instalar

O [guia de instalação](docs/installation.md) cobre geração, GNOME, KDE Plasma,
Hyprland com e sem UWSM, Sway, XFCE/Cinnamon/MATE/X11, Flatpak e diagnóstico.

## Desenvolvimento

Leia [QUALITY.md](QUALITY.md) antes de alterar o tema: fonte de anatomia,
invariantes, regressões conhecidas, revisão visual e critérios de publicação.
As três mãos são geradas por `scripts/generate-hands.ts`; execute
`make -C themes/cursor/umbra hands` após alterar essa fonte.
Os estados auxiliares são gerados por `scripts/generate-states.ts`; execute
`make -C themes/cursor/umbra states` após alterar as formas compartilhadas.

`src/` contém os SVGs em uma grade de 48 px; `scripts/build-cursor` renderiza
24, 32 e 48 px e grava os arquivos binários em `cursors/`. Os PNGs temporários
ficam fora do repositório. Para apagar somente a saída gerada:

```sh
make -C themes/cursor/umbra clean
```

### Ver o preview

Revise primeiro a [prancha de silhuetas](silhouettes.svg), sem detalhes ou contorno.

Abra [preview.svg](preview.svg) no navegador ou no GitHub para ver a composição
com os 32 estados do tema. Para regenerá-la após mexer nos desenhos:

```sh
bun themes/cursor/umbra/scripts/generate-preview.ts
```

Para reconstruir e verificar os binários:

```sh
make -C themes/cursor/umbra check
```

Para testar todos os cursores no navegador, abra [test.html](test.html). O
laboratório usa os SVGs da fonte (navegadores não leem binários XCursor
diretamente), lista estados e aliases e inclui texto, links, arraste e
redimensionamento.

A verificação cobre 234 frames (32 estados em três tamanhos, incluindo animações): pontos de
clique, transparência pré-multiplicada, margens sem cortes, alinhamento da
seta entre estados e destinos dos aliases. A seta e seus estados com selos
compartilham o hotspot `(5, 4)`; o hover usa `(21, 8)`, junto à ponta do dedo.
As mãos aberta e fechada compartilham `(24, 24)`, evitando saltos entre elas.
As coordenadas são relativas à grade de 48 px e escaladas no build.

Para inspecionar os pixels dos binários sobre fundos claro e escuro, gere
uma folha de contato (cada pixel é exibido a 2×):

```sh
bun themes/cursor/umbra/scripts/verify-cursors.ts /tmp/umbra-cursors.svg
```

A GitHub Action **Cursor preview** executa o mesmo comando em pushes e pull
requests que afetam o pack. Ela falha se `preview.svg` não tiver sido atualizado
e disponibiliza o arquivo como artefato da execução.

## Estados

| Estado | Nome XCursor | Tratamento |
| --- | --- | --- |
| Normal | `default`, `left_ptr` | seta Bone com sombra/contorno carvão |
| Automático | `auto` | alias do normal |
| Hover | `pointer`, `hand2` | mão clara e articulada |
| Arrastar | `grabbing`, `closedhand`, `dnd-move` | mão fechada |
| Soltar / disponível para arrastar | `grab`, `openhand` | mão aberta |
| Copiar | `copy`, `dnd-copy` | selo `+` sálvia |
| Link | `alias`, `dnd-link` | selo de elo azul |
| Bloqueado | `no-drop`, `not-allowed` | selo de barra rosa |
| Movimento | `all-scroll`, `move` | setas nas quatro direções |
| Precisão | `cell`, `crosshair`, `text` | célula, mira e seleção de texto |
| Redimensionar | `e-resize`, `ew-resize`, `n-resize`, `ne-resize`, `nesw-resize`, `ns-resize`, `nw-resize`, `nwse-resize`, `row-resize`, `s-resize`, `se-resize`, `sw-resize`, `w-resize`, `col-resize` | setas direcionais, por linha e por coluna |
| Utilitário | `context-menu`, `help`, `progress`, `wait`, `zoom-in`, `zoom-out`, `none` | menu, ajuda, atividade, espera, zoom e cursor oculto |

O tema herda os demais estados do Adwaita para preservar cursores que ainda
não receberam um desenho específico.

O aplicativo controla a troca de estado: a mão aberta após soltar aparece
quando ele solicita `grab` ou `openhand`. O tema não altera essa lógica.

### Carregamento animado

`wait` (alias `watch`) gira a ampulheta em torno do hotspot central.
`progress` (alias `left_ptr_watch`) gira somente o símbolo no selo; a seta
permanece imóvel. Ambos contêm 24 quadros de 50 ms por tamanho, ciclo de 1,2 s.
O movimento indica atividade, sem representar percentual concluído.

A [prévia no laboratório](test.html#loading-title) reproduz os mesmos quadros.
Os cartões de cursor CSS e preview.svg continuam estáticos. A prévia animada
respeita movimento reduzido; os binários XCursor têm duração fixa e dependem
do suporte de animação do aplicativo/compositor. O tema não lê preferências
de movimento reduzido da sessão.

Os SVGs de `src/frames/` e `src/animated/` são derivados de
`generate-states.ts`. Para revisar todos os quadros dos binários:

```sh
bun themes/cursor/umbra/scripts/verify-cursors.ts /tmp/umbra-animation.svg --animation
```
