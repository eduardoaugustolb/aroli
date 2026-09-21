# Aroli para IDEs JetBrains

Tema dark charcoal para IDEs baseadas na IntelliJ Platform, incluindo
WebStorm, GoLand, IntelliJ IDEA, PyCharm, PhpStorm, RubyMine e Rider. A UI usa
superfícies charcoal e a sintaxe mantém os acentos semânticos discretos do
Aroli: keywords em rose, tipos em blue, funções em lilac, strings em amber e
variáveis comuns em Bone.

## Requisitos

- Uma IDE JetBrains baseada na IntelliJ Platform 2024.1 ou posterior.
- O arquivo `aroli-jetbrains-theme.zip`, gerado nesta pasta.

## Instalação

1. Na IDE, abra `Settings` / `Preferences`.
2. Abra `Plugins`, clique no ícone de engrenagem e escolha **Install Plugin from Disk…**.
3. Selecione `dist/aroli-jetbrains-theme.zip` e reinicie a IDE quando solicitado.
4. Abra `Settings` / `Preferences` → `Appearance & Behavior` → `Appearance` e selecione **Aroli Dark**.

O tema ativa o esquema de editor Aroli Dark automaticamente. Caso a IDE preserve o
esquema anterior, selecione **Aroli** em `Editor` → `Color Scheme`.

## Desenvolvimento local

Na pasta `themes/jetbrains/aroli`:

```sh
bun run verify
bun run package
```

O pacote é criado em `dist/aroli-jetbrains-theme.zip`. A validação verifica a
estrutura dos arquivos-fonte e o conteúdo do pacote; ela não substitui a
inspeção visual dentro de uma IDE JetBrains.

## Atualização e remoção

Para atualizar, gere o ZIP novo e repita a instalação. Para remover, abra
`Settings` / `Preferences` → `Plugins`, localize **Aroli Themes** e desinstale o
plugin; então reinicie a IDE. Isso não altera suas configurações de editor,
fontes ou atalhos.

Se estiver usando o pacote inicial 0.1.0, reinstale o ZIP 0.1.1 ou posterior:
o descritor inicial não incluía o campo obrigatório de versão do plugin.
O comando `verify` agora exige a mesma versão em `plugin.xml` e `package.json`.

## Cobertura e limites

As superfícies em repouso usam o mesmo charcoal `#101111`, incluindo editor,
definido pelo atributo `TEXT` do esquema na versão 0.1.3 ou posterior,
gutter, abas, cabeçalhos, painéis e menus. Seleção, hover e alertas mantêm
contraste próprio para indicar estados de interação.

- UI: editor, abas, painéis, menus, listas, entradas, notificações, barras de
  status e indicadores de foco.
- Editor: sintaxe, seleção, busca, gutter, diffs e terminal integrado quando a
  IDE usa as chaves padrão da plataforma.
- O plugin não inclui fonte, ícones de arquivos ou ajustes de comportamento.
- Verificado estruturalmente com a IntelliJ Platform 2024.1 como versão mínima;
  a aparência de plugins de terceiros pode usar cores próprias.

---

Aroli no GitHub: https://github.com/eduardoaugustolb/umbra
