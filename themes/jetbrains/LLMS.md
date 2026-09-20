# JetBrains Umbra

Este módulo distribui o tema como plugin local para IDEs baseadas na IntelliJ
Platform. Mantenha `src/main/resources/META-INF/plugin.xml`,
`Umbra.theme.json` e `Umbra.xml` coerentes: o descritor registra o tema e o
esquema de editor que o JSON referencia.

Antes de alterar campos do formato, consulte a documentação atual do IntelliJ
Platform. Atualize README e changelog junto com qualquer mudança pública.

## Validação

Execute, a partir deste diretório:

```sh
bun run verify
bun run package
```

O segundo comando cria `dist/umbra-jetbrains-theme.zip`. Verifique o conteúdo
do ZIP antes de instalar em uma IDE real. Não declare compatibilidade visual
sem essa inspeção.
