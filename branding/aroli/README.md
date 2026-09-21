# Aroli — assets de produção

Direção aprovada: [storyboard ImageGen](../../output/imagegen/aroli-study-01/storyboard.png). Implementação vetorial original baseada nessa referência, sem embutir raster nos logos.

![Sistema visual](exports/aroli-system.png)

- [Símbolo](logo/aroli-symbol.svg) · [versão escura](logo/aroli-symbol-black.svg)
- [Assinatura](logo/aroli-lockup.svg) · [wordmark](logo/aroli-wordmark.svg)
- [Avatar](logo/aroli-avatar.svg) · [PNG 512](exports/aroli-avatar-512.png)
- [Prancha](system.svg) · [Provas](stress.svg)
- [Wallpaper](applications/wallpaper.svg) · [troca de concorrente](applications/competitor-swap.svg)

## Reconstruir

Na raiz, com Bun, unzip e rsvg-convert disponíveis:

```sh
cd fonts/aroli && bun install --frozen-lockfile
cd ../../web && bun run setup:fonts
cd .. && bun branding/aroli/build.ts
```

O comando baixa Switzer oficial e verifica a licença contra SWITZER-LICENSE.txt; os arquivos locais são ignorados pelo Git. O gerador usa opentype.js do módulo Mono. Textos finais em curvas não exigem fontes do leitor. Switzer é de Indian Type Foundry; o símbolo Encaixe é específico da Aroli.

geometry.ts define as duas massas usadas pelo gerador e pela Mono. O build sincroniza favicon, avatar do site, ícones VS Code/JetBrains/Chrome, promos Chrome e wallpaper. Após mudanças, regenerar e inspecionar PNGs. [Guia completo](../../DESIGN.md).
