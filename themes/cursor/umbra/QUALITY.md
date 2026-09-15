# Integridade e qualidade do Umbra Cursor

## Princípio

Um SVG válido e um XCursor correto não comprovam anatomia ou qualidade visual.
A silhueta deve funcionar antes do contorno, da cor e dos detalhes internos.

## Histórico e correção de critérios

As revisões de 2026-09-15 encontraram hotspots desalinhados, alpha incorreto,
selos com margens desiguais, haste torta, marcas fora da mão e texto sobreposto.

A tentativa seguinte impôs dedos de largura igual, gaps profundos e uma base
horizontal. Passou nos testes, mas produziu a silhueta de garfo apontada pelo
usuário. Palma achatada, polegar triangular e punho dentado agravavam a leitura.
Essas regras foram **substituídas**, não mantidas como padrão de qualidade.

A reconstrução usa palma alta, polegar curto, punho simples e curvas articuladas.
Os testes de pixels em quatro barras fixas foram substituídos por continuidade
da forma, volume da palma e punho sem interrupções. Esta mudança é intencional:
testes não devem cristalizar uma geometria que a revisão visual rejeitou.

## Fonte de verdade

scripts/generate-hands.ts gera src/hover.svg, src/grab.svg, src/grabbing.svg e
silhouettes.svg. Não editar os derivados isoladamente. A opção --check verifica
os três SVGs; a prancha deve ser regenerada junto deles e conferida na CI.
A seta e os selos permanecem nos outros arquivos de src/.

## Invariantes

- Grade de 48 × 48; saídas de 24, 32 e 48 px.
- Palma com volume vertical, aproximadamente de y=23 até y=38.
- Punho simples: x=22 até 33, término em y=42. Sem dentes ou entalhes.
- Polegar curto, arredondado, conectado por curvas contínuas à lateral.
- Região inferior compartilhada; parte superior articula-se por pose.
- Dedos variam em largura, inclinação e altura. Não usar barras idênticas.
- Bases arqueadas, espaços rasos: não cortar até o centro da palma.
- Mão fechada é uma massa de dedos flexionados, não a aberta truncada.
- Hover: indicador integrado à palma e três dedos dobrados.
- Sem riscos internos nesta versão. Qualquer detalhe futuro só entra depois
  da aprovação da silhueta sem ele.
- Contorno único das mãos: 2,5 unidades; encontros suaves.
- Hotspots: hover (21, 8); grab/grabbing (24, 24); seta e selos (5, 4).
- Seta com haste paralela e base perpendicular; mesma geometria nos selos.
- Selos: centro (36, 35), raio 9, contorno 2, envelope radial do símbolo de
  6,25 incluindo o traço e folga interna de 1,75.
- Preservar curva esquerda e saída diagonal do limiar Umbra, Bone e Charcoal.

## Procedimento para toda atualização

Na raiz do repositório:

```sh
make -C themes/cursor/umbra hands
make -C themes/cursor/umbra check preview
bun themes/cursor/umbra/scripts/verify-cursors.ts /tmp/umbra-cursor-sheet.svg
rsvg-convert /tmp/umbra-cursor-sheet.svg -o /tmp/umbra-cursor-sheet.png
rsvg-convert themes/cursor/umbra/silhouettes.svg -o /tmp/umbra-silhouettes.png
rsvg-convert themes/cursor/umbra/preview.svg -o /tmp/umbra-cursor-preview.png
git diff --check
```

1. Editar a fonte correspondente e regenerar todos os derivados.
2. Investigar falhas: não reduzir limites apenas para obter aprovação.
3. Revisar primeiro silhouettes.svg. As poses devem ser reconhecíveis sem
   cor, outline ou linhas internas. Rejeitar leitura de garfo, asa, coroa,
   plataforma ou blocos independentes.
4. Comparar poses: preservar anatomia e proporções, permitindo flexão real.
   Seguir o contorno completo: punho, palma, polegar, dedos, lateral e punho.
   Procurar quinas, degraus, transições abruptas e partes desconectadas.
5. Revisar o preview e a folha dos pixels dos binários sobre claro e escuro,
   nos três tamanhos. A folha amplia cada pixel em 2×; ver também a 50% para
   avaliar tamanho nativo. Conferir selos, equilíbrio óptico e texto.
6. Antes de publicar, testar numa sessão com o tema: links, início/fim de
   arraste, cópia e operação proibida. Registrar aplicativo, ambiente e tamanho.
   O aplicativo escolhe o estado; o tema não força grab depois do drop.
7. Atualizar gerador, SVGs, binários, aliases, preview, silhuetas e changelog
   juntos. Registrar o que foi automatizado, inspecionado e testado na sessão.

## Cobertura automática e limites

make check reconstrói os binários e verifica SVGs gerados, sete cursores × três
tamanhos, metadados, hotspots visíveis, alpha pré-multiplicado, margens livres,
alinhamento da seta e aliases de interação.
Nas mãos verifica região inferior estável, silhueta conectada, punho contínuo
e volume em três alturas da palma.

Esses testes são amostrais. Não certificam reconhecimento de uma mão, flexão
convincente, continuidade de todas as curvas ou proporções esteticamente boas.
A inspeção visual é obrigatória. Não declarar aprovação visual do usuário sem
ela ocorrer; apresentar a prancha para avaliação.

A CI recompila, verifica e publica provas visuais. Uma alteração local no YAML
não comprova que a execução remota passou. Falhas de preview desatualizado e
anatomia gerada devem ser corrigidas na fonte.

## Registro da reconstrução

### Refinamento de caráter após a reconstrução

Direção de acabamento: a versão atual é a referência principal da família.
Alterações futuras devem ser microajustes; não aproximar mais da referência
externa nem adicionar detalhes internos. Preservar comprimento do indicador,
largura geral, volume do mindinho e pose fechada. A região inferior compartilhada
e o outline permanecem invariantes durante esse acabamento.

- Preservar a anatomia aprovada como direção; não reconstruir a partir da referência.
- Hover: indicador discretamente inclinado, base mais cheia e dedos dobrados
  com alturas distintas em uma sequência curva.
- Fechada: pequenas assimetrias nos nós dos dedos, preservando a massa compacta.
- Aberta: compensar a largura do mindinho na geometria; nunca afinar apenas
  seu stroke. Comparar a área clara interna em 24, 32 e 48 px.
- Polegar mais curto, lateral da palma mais cheia e cantos do punho suavizados
  são alterações compartilhadas pelas três poses.
- Manter o outline único de 2,5. Verificar peso óptico além do valor numérico.
- Reconhecimento vem da palma compacta, polegar curvo, assimetrias discretas
  e punho simples. Não adicionar entalhes ou riscos para imitar a referência.

- 21 frames verificados localmente.
- Silhuetas, preview e pixels finais inspecionados em claro e escuro.
- Regras anteriores de barras/gaps fixos explicitamente retiradas.
- Reconhecimento pelo usuário, sessão real e execução remota da CI pendentes.
