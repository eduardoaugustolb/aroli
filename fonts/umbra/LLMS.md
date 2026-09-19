# Fonte Umbra

Os contornos textuais autorais e o glifo do limiar são definidos em `build.ts`.
As ligaduras ficam em `features.fea`. `dist/*-base.otf` é intermediário.

Depois de editar, rode `bun install` e `bun run build`; confira `fonttools ttx -l`
no OTF final, a tabela GSUB e um espécime renderizado. Preserve os créditos e
a licença do Symbols Nerd Font. Não instale a fonte nas configurações do usuário
sem solicitação explícita.
