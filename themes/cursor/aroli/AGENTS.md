# Manutenção do Aroli Pointer

Antes de alterar este tema, leia QUALITY.md e a seção relevante de ../../../DESIGN.md.
Use Bun para os scripts TypeScript.

- As mãos são geradas por scripts/generate-hands.ts. Não edite os SVGs gerados
  isoladamente: a anatomia compartilhada deve permanecer única.
- Estados auxiliares são gerados por scripts/generate-states.ts. Não altere um
  SVG de resize, precisão, espera ou zoom isoladamente; ajuste a fonte e gere
  novamente o catálogo inteiro.
- Não substitua revisão visual por aprovação dos testes. Inspecione o preview
  e os pixels dos binários nos três tamanhos, em superfícies claras e escuras.
- Avalie silhouettes.svg antes dos detalhes. Não volte a dedos como barras
  iguais, palma achatada, polegar triangular ou punho dentado.
- Execute o procedimento de QUALITY.md; atualize preview, binários e changelog.
- Não enfraqueça testes ou atualize referências apenas para fazer passar uma
  mudança. Explique qualquer alteração intencional das invariantes.
- Informe separadamente o que foi verificado por código, visualmente e em
  aplicativos reais. Não declare testes de sessão que não foram executados.
- Preserve alterações alheias ao tema. Não instale na sessão sem solicitação.
