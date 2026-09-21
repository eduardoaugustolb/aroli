# Aroli Black para Chrome

Variante Black do Aroli para Chrome. Mesma linguagem da variante padrão ([`../umbra/`](../umbra/)), com omnibox, frame e New Tab em Ink `#050505` e toolbar em Charcoal `#101111` — espelha a relação editor/painéis do Aroli Black no VS Code.

## Paleta (Ink)

| Função | Cor | Uso no Chrome |
| --- | --- | --- |
| Ink | `#050505` | frame, abas inativas, omnibox, NTP |
| Charcoal | `#101111` | toolbar, header da NTP |
| Hover | `#202424` | fundo de botões |
| Bone | `#C5C7C5` | texto de abas, toolbar, omnibox, NTP |
| Ash | `#858A89` | texto de abas inativas |
| Quiet | `#697271` | texto de abas inativas sem foco |
| Ícones | `#AEB9BC` | ícones da toolbar |
| Sage Blue | `#9AB7B0` | links da NTP |

## Instalação fácil

### Você precisa de

- Google Chrome ou Chromium instalado.
- Este repositório disponível localmente.

### Instalar passo a passo

1. Abra `chrome://extensions` e ative o **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação** e selecione esta pasta:
   `themes/chrome/umbra-ink`
3. Para voltar à variante padrão, desative este e carregue `themes/chrome/umbra`.

### Atualizar

Atualize o repositório e clique em **Recarregar** no cartão do tema em `chrome://extensions`.

### Remover

Em `chrome://extensions`, clique em **Remover** no cartão Aroli Black.

### Empacotar para a Chrome Web Store

O `aroli-black-0.2.0.zip` ao lado do README contém só `manifest.json` e a
imagem da NTP, pronto para upload. Para regenerar após mudar o tema:

```sh
bun scripts/package-chrome.ts
```

A cada nova versão, suba `version` no `manifest.json` e gere um zip novo
com o número correspondente.

## Compatibilidade

- formato: tema Chrome `manifest_version: 3`;
- diferenças em relação ao Aroli padrão: `frame`, `background_tab`, `omnibox_background` e `ntp_background` em `[5, 5, 5]`, `toolbar` em `[16, 17, 17]`;
- imagem: `images/theme_ntp_background.png` (1920×1080, planos Encaixe com a paleta neutra existente).

## Limitações conhecidas

- Mesmas da variante padrão: só frame, toolbar, abas, omnibox e NTP são estilizáveis;
- Ink puro pode reduzir a separação entre frame e área de conteúdo em monitores com preto esmagado — prefira o Aroli padrão nesse caso;
- “Blocked by the administrator” ao carregar: veja a seção de solução de problemas no [`../umbra/README.md`](../umbra/README.md#blocked-by-the-administrator-ao-carregar-sem-compactação).

---

Aroli no GitHub: https://github.com/eduardoaugustolb/aroli

## Migração Aroli

A pasta conserva o nome antigo para manter o ID da instalação unpacked. Não renomeie nem mova o checkout se depender desse ID. Os nomes públicos são Aroli Dark e Aroli Black; pacotes 0.2.0 são locais, não publicados. Paleta preservada; imagens e ícones atualizados.
