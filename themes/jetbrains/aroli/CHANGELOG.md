# Migração Aroli — 2026-09-20

Nova identidade Encaixe, nomes públicos e documentação Aroli. Paleta preservada. Consulte o registro em docs/migrations/2026-09-20-aroli.md na raiz. Releases anteriores abaixo são históricas.

# Changelog

## 0.1.3 — 2026-09-16

- corrige a chave de fundo do editor para `TEXT`, mantendo `#101111` igual à UI;
- identifica o esquema registrado como `Umbra`;
- valida o fundo do editor para impedir regressões.

## 0.1.2 — 2026-09-16

- uniformiza superfícies da UI em charcoal `#101111`, incluindo cabeçalhos,
  abas ativas e inativas, menus, popups e campos;
- define o fundo do editor explicitamente em `DEFAULT_TEXT`, evitando herdar
  o cinza do Darcula.

## 0.1.1 — 2026-09-16

- adiciona a versão obrigatória ao descritor do plugin;
- valida a correspondência da versão entre `plugin.xml` e `package.json`.

## 0.1.0 — 2026-09-16

- primeira versão do plugin Umbra para IDEs JetBrains;
- interface charcoal, esquema de editor e terminal integrado com a paleta
  semântica Umbra;
- pacote local instalável por arquivo ZIP.
