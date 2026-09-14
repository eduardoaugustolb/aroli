# Umbra para Chrome

Tema dark charcoal para o Chrome, alinhado ao Umbra do VS Code e do Zed. Superfícies escuras e consistentes, texto Bone e um único acento sage-blue em links da New Tab — sem imagens chamativas no frame.

Variante Ink disponível em [`../umbra-ink/`](../umbra-ink/): mesma linguagem, com omnibox e New Tab em Ink `#050505`.

## Paleta (Umbra)

| Função | Cor | Uso no Chrome |
| --- | --- | --- |
| Charcoal | `#101111` | frame, abas inativas, NTP |
| Raised | `#161919` | toolbar, omnibox, header da NTP |
| Hover | `#202424` | fundo de botões |
| Bone | `#C5C7C5` | texto de abas, toolbar, omnibox, NTP |
| Ash | `#858A89` | texto de abas inativas |
| Quiet | `#697271` | texto de abas inativas sem foco |
| Ícones | `#AEB9BC` | ícones da toolbar |
| Sage Blue | `#9AB7B0` | links da NTP |

A regra é a mesma do sistema: ~85–90% da experiência em neutros escuros, cor só com função.

## Instalação fácil

Temas de Chrome são instalados em modo desenvolvedor a partir da pasta. Você não precisa entender empacotamento para usar.

### Você precisa de

- Google Chrome ou Chromium instalado.
- Este repositório disponível localmente.

### Instalar passo a passo

1. Abra `chrome://extensions` e ative o **Modo do desenvolvedor** (canto superior direito).
2. Clique em **Carregar sem compactação** e selecione esta pasta:
   `themes/chrome/umbra`
3. O tema é aplicado na hora. Para trocar para a variante Ink, desative este e carregue `themes/chrome/umbra-ink`.

### Atualizar

Atualize o repositório e clique em **Recarregar** no cartão do tema em `chrome://extensions`.

### Remover

Em `chrome://extensions`, clique em **Remover** no cartão Umbra. Isso volta ao tema padrão sem tocar em outros dados do navegador.

### Empacotar para a Chrome Web Store

O `umbra-0.1.0.zip` ao lado do README contém só `manifest.json` e a
imagem da NTP, pronto para upload. O ícone `store/icon-128.png` (gerado de
`store/icon.svg`, monograma UM em Bone sobre Charcoal) vai separado, nos
campos da ficha da loja. Para regenerar o zip após mudar o tema:

```sh
python3 -c "
import zipfile
with zipfile.ZipFile('themes/chrome/umbra/umbra-0.1.0.zip', 'w', zipfile.ZIP_DEFLATED) as z:
  z.write('themes/chrome/umbra/manifest.json', 'manifest.json')
  z.write('themes/chrome/umbra/images/theme_ntp_background.png', 'images/theme_ntp_background.png')
"
```

A cada nova versão, suba `version` no `manifest.json` e gere um zip novo
com o número correspondente. A variante Ink segue o mesmo processo em
`../umbra-ink/`.

## Compatibilidade

- formato: tema Chrome `manifest_version: 3`, só `theme` (sem JavaScript/HTML);
- cores como arrays RGB, conforme `kOverwritableColorTable`;
- imagem: só `theme_ntp_background` (PNG 1920×1080, SVG de origem ao lado para regenerar);
- sem `tints`: o tema não altera matiz/saturação da UI;
- variante Ink: `../umbra-ink/manifest.json`, com frame/omnibox/NTP em `#050505`.

## Solução de problemas

### “Blocked by the administrator” ao carregar sem compactação

Se o navegador é gerenciado por policy da máquina (no Omarchy, o
`/etc/brave/policies/managed/color.json` já marca o Brave como gerenciado),
o carregamento unpacked pode ser negado mesmo sem blocklist visível.
Confirme em `brave://policy` se há policies aplicadas.

Para liberar o tema, adicione o ID da pasta a uma allowlist gerenciada:

1. Descubra o ID da variante (ele é derivado do caminho absoluto da pasta):

```sh
python3 -c "import hashlib;print(''.join(chr(ord('a')+((b>>4)&15))+chr(ord('a')+(b&15)) for b in hashlib.sha256(b'/caminho/absoluto/para/themes/chrome/umbra').digest()[:16]))"
```

2. Crie `/etc/brave/policies/managed/umbra-allow.json` (com `sudo`) no formato:

```json
{
  "ExtensionInstallAllowlist": ["<id-umbra>", "<id-ink>"]
}
```

Não use `UnpackedExtensionAllowlist`: esse nome não é reconhecido (aparece
como `Error` em `brave://policy`). Cada ID precisa ter exatamente 32
caracteres de `a` a `p`; uma única entrada inválida rejeita a lista inteira
(o status fica `Error` em vez de `OK`).

3. Em `brave://policy`, clique em **Reload policies** e confira se a allowlist
   está `OK`. policies de máquina também são lidas na inicialização; se o
   status não atualizar, encerre o Brave por completo e abra de novo.
4. Repita o **Carregar sem compactação**.

Se mesmo com a allowlist `OK` o erro persistir, o caminho é desgerenciar o
navegador: com backup, remova o `color.json` do Omarchy de
`/etc/brave/policies/managed/` e `/etc/chromium/policies/managed/` e
reinicie o Brave por completo. Navegador não gerenciado sempre permite
unpacked; o efeito colateral é só perder a cor de frame forçada (o Brave
segue o próprio tema escuro).

## Limitações conhecidas

- O Chrome não permite estilizar o conteúdo das páginas, DevTools ou diálogos internos — só frame, toolbar, abas, omnibox e NTP;
- `ntp_header` tem efeito limitado em versões recentes (a NTP usa o `ntp_background` da imagem);
- sem imagem no frame: degradê ou foto no topo quebraria a regra de campo escuro dominante.

---

Umbra no GitHub: https://github.com/eduardoaugustolb/umbra
