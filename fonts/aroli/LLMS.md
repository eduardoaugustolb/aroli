# Fonte Aroli

Os contornos textuais autorais e o glifo do encaixe são definidos em `build.ts`.
As ligaduras ficam em `features.fea`. `dist/*-base.otf` é intermediário.

Depois de editar, rode `bun install` e `bun run build`; confira `fonttools ttx -l`
no OTF final e a tabela GSUB. O build executa `proof.ts`, que renderiza o OTF
final com Pango/HarfBuzz e Fontconfig isolado. Abra e inspecione visualmente
`dist/specimen.png` antes de declarar a fonte corrigida ou concluída; gerar a
imagem não substitui inspecioná-la. A prova deve mostrar i/j, acentos, ligaduras
com calt=0 e calt=1, código completo, ícones e tamanhos de 12/14/16/24 px.
Preserve os créditos e
a licença do Symbols Nerd Font. Não instale a fonte nas configurações do usuário
sem solicitação explícita.
