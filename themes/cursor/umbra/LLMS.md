# Umbra Cursor

Leia `AGENTS.md` e `QUALITY.md` antes de editar assets ou build. As mãos são
derivadas de `scripts/generate-hands.ts`; não altere SVGs gerados isoladamente.

## Rotina

```sh
make -C themes/cursor/umbra check preview
```

Atualize arquivos gerados, preview, silhuetas e changelog juntos. Para
instruções destinadas a usuários, altere `docs/installation.md`; README é
apenas o ponto de entrada.

O laboratório de navegador fica em `test.html`, com estilo em `test.css` e
comportamento em `test.js`. Ao adicionar um estado ao build, atualize as
listas do laboratório e teste a página localmente.
