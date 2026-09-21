<div align="center">
  <img src="branding/aroli/logo/aroli-lockup.svg" alt="Aroli" width="280" />

  **Tudo encontra seu lugar.**

  Temas, tipografia, ponteiros e fundos para um ambiente que se adapta a você.
</div>

![Sistema visual Aroli](branding/aroli/exports/aroli-system.png)

## Uma família, um ambiente

| Produto | Conteúdo |
| --- | --- |
| Aroli Themes | Aroli Dark e Aroli Black, com as mesmas cores da geração anterior |
| [Aroli Mono](fonts/aroli/README.md) | Fonte autoral para código, ligaduras e variante NF; protótipo |
| [Aroli Pointer](themes/cursor/aroli/README.md) | Cursores Linux com 32 estados e aliases |
| [Aroli Backdrops](wallpapers/README.md) | Fundos e composições do ambiente |
| [Aroli Desktop](https://github.com/eduardoaugustolb/aroli-desktop) | Ambiente pronto (Hyprland + Quickshell + instalador); repo independente em `desktop/` |

## Temas disponíveis

| Aplicação | Variantes | Guia |
| --- | --- | --- |
| VS Code | Dark / Black | [Instalação](themes/vscode/aroli/README.md) |
| Zed | Dark | [Instalação](themes/zed/aroli/README.md) |
| JetBrains | Dark | [Instalação](themes/jetbrains/aroli/README.md) |
| Chrome | Dark / Black | [Dark](themes/chrome/aroli-dark/README.md) · [Black](themes/chrome/aroli-black/README.md) |
| Kitty | Dark | [Instalação](themes/kitty/aroli/README.md) |
| Starship | Prompt | [Instalação](themes/starship/aroli/README.md) |

## Identidade e desenvolvimento

Abra [Aroli.code-workspace](Aroli.code-workspace) para exibir o workspace como **Aroli**. Se a sua pasta de checkout ainda se chama `umbra`, pode renomeá-la para `aroli` — o Git acompanha o conteúdo, sem efeito no histórico.

- [Guia de identidade](DESIGN.md): símbolo Encaixe, cores, tipografia e aplicações.
- [Assets e reprodução](branding/aroli/README.md): mestres SVG, exports e comandos.
- [Registro da migração](docs/migrations/2026-09-20-aroli.md): decisões, compatibilidade, verificações e reversão.
- [Site](web/README.md): preparação da Aroli Sans local, build e laboratórios.
- [Instruções para agentes](LLMS.md): navegação e limites por módulo.

## De Umbra para Aroli

A migração está concluída: identidade, nomes públicos, repositório, pastas e IDs de extensão são Aroli. A paleta permanece; Dark e Black são os nomes das variantes.

Os IDs de VS Code (`Aroli Dark`/`Aroli Black`), Zed (`aroli-themes`) e JetBrains (`aroli.jetbrains.theme`) mudaram — selecione os temas de novo após atualizar. As pastas Chrome agora são `aroli-dark`/`aroli-black`; recarregue as instalações unpacked. O repositório é [eduardoaugustolb/aroli](https://github.com/eduardoaugustolb/aroli), com redirecionamento do endereço antigo. Histórico em [docs/migrations/2026-09-20-aroli.md](docs/migrations/2026-09-20-aroli.md).

## Licença

O projeto mantém sua [licença proprietária](LICENSE). [Aroli Sans](fonts/aroli-sans/README.md) é a fonte proporcional autoral, com binários locais versionados. Aroli Mono preserva os créditos e a licença dos ícones Nerd Fonts; consulte o [guia da fonte](fonts/aroli/README.md). O arquivo histórico em `branding/archive/` não representa a identidade atual.
