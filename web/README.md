# Aroli — protótipo web

Landing em Next.js, React, GSAP/ScrollTrigger e Lenis. Briefing: [LANDING-PAGE.md](../LANDING-PAGE.md).

## Executar

```sh
cd web
bun install
bun run setup:fonts
bun run dev
```

Abra o endereço informado pelo Next.js. Para validar a versão de produção:

```sh
bun run build
bun run typecheck
```

## Escopo

Três seções semânticas compartilham uma cena fixada pelo ScrollTrigger. Uma timeline com os momentos `atmosfera`, `continuidade` e `integracoes` reduz o Zed, acomoda o Kitty e organiza a composição final. O conteúdo explica o projeto, sua intenção e as integrações disponíveis. Breakpoints recriam a sequência para desktop e mobile. Os links abrem os materiais do repositório.

Editor e terminal usam capturas reais da geração anterior, mantidas junto dos temas e copiadas para `public/examples/`. Documentam a paleta preservada, não uma instalação nova de Aroli. As imagens são servidas por `next/image`. A interface usa Aroli Sans local via `next/font/local`, com quatro pesos reais (400, 500, 600 e 700). `setup:fonts` copia os WOFF2 versionados de `../fonts/aroli-sans/dist/` para `app/fonts/`. O build não baixa fontes nem exige ferramentas tipográficas. Consulte o [guia da fonte](../fonts/aroli-sans/README.md) para reconstruir os desenhos autorais.

Cursor circular com `mix-blend-mode: difference` para inverter o que está atrás, sem rastro. Sobre botões, assume as dimensões do controle; sobre links, vira sublinhado na linha do texto. Leituras de DOM fora do `pointermove` (1x por frame). Substitui o cursor nativo apenas com mouse, hover e movimento permitido; toque e movimento reduzido preservam o nativo.

Favicon Encaixe em `app/icon.svg`, avatar em `public/aroli-avatar-512.png`, assinatura em `public/aroli-lockup.svg`. SEO e JSON-LD usam Aroli. A hero usa dois planos curvos em CSS com acomodação de 280 ms e estado estático para movimento reduzido. Os componentes antigos SlicedWaves permanecem disponíveis no código, mas não são montados na página. Canonical e imagem social absoluta dependem da URL de publicação, ainda indefinida.

Depois do notebook, a história continua em duas seções interativas: **o ambiente responde** (cursor) e **o ambiente ganha voz** (fonte). Transições GSAP ligadas ao scroll revelam o fio visual e os títulos; os laboratórios ficam no fluxo normal, sem pin ou bloqueio de rolagem. Movimento reduzido apresenta tudo sem as transições. A limpeza de GSAP, ticker e Lenis ocorre ao desmontar ou mudar a preferência de movimento.

### Laboratório do cursor

Em `#cursor`, o círculo muda automaticamente para Aroli na primeira chegada à área de leitura (75% do viewport). Os SVGs originais do tema são pré-carregados 800 px antes. A mudança também funciona com o mouse parado durante a rolagem; o cursor nativo só é escondido após as imagens estarem decodificadas. Depois da primeira chegada, a escolha manual prevalece inclusive ao voltar pelo scroll. Ao sair, o modo escolhido continua ativo pelo site.

Os eventos e o alvo sob o ponteiro escolhem seta, mão, texto, arraste, redimensionamento, ajuda, espera ou indisponível. Os hotspots vêm do tema original. Reversões rápidas do mouse ampliam o cursor por 850 ms somente no modo Aroli. Movimento reduzido mantém Aroli sem atraso nem shake; toque conserva o comportamento nativo. O playground inclui clique, seleção de texto, peça arrastável por mouse/toque/setas e controle de largura.

### Laboratório da fonte

`#fonte` carrega a fonte autoral real em WOFF2, com tamanho e ligaduras controláveis. As abas oferecem texto livre, editor com realce de sintaxe/busca/arquivos/saída e terminal com histórico/autocompletar. O editor salva com Ctrl/⌘ S e executa com Ctrl/⌘ Enter. Tab indenta; Shift+Tab permite sair do campo pelo teclado.

Editor e terminal compartilham arquivos em memória. `help`, `ls`, `pwd`, `cd`, `cat`, `echo` com redirecionamento, `touch`, `mkdir`, `rm`, `clear`, `whoami`, `history` e `bun hello.js` possuem comportamento simulado. A execução aceita `const`/`let`, literais, concatenação e `console.log`; código não suportado retorna um erro explícito. Não usa eval, shell do servidor nem acesso ao sistema. Recarregar descarta a sessão. Áreas internas com rolagem usam `data-lenis-prevent`.

Para atualizar os assets depois de alterar a fonte ou o cursor:

```sh
bun run sync:playground
```

Requer `fonttools` com suporte a WOFF2. Os assets versionados permitem compilar o site sem essa ferramenta. A licença dos ícones da fonte acompanha os arquivos em `public/playground/NERD-FONTS-LICENSE.txt`.

Validação: `bun run typecheck`, `bun run test`, `bun run build`. Revisar no navegador a troca automática e manual, o shake, a seleção, o arraste, as três abas da fonte, arquivos compartilhados e o fluxo completo até `#mais`, em desktop, toque e movimento reduzido.

## Tokens

Sem Tailwind por decisão: os tokens vivem no `:root` de `app/styles/base.css` e o CSS segue dividido por responsabilidade (`hero.css`, `notebook.css`, `sections.css`, `cursor.css`).

- Cores: `--ink`, `--bone`, `--muted`, `--line`.
- Espaçamento (`--space-*`, múltiplos de 4px): 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px.
- Raios (`--radius-*`): xs=3px, sm=6px, md=8px, lg=12px, xl=18px, full=50%.
- Movimento: `--duration-fast/base/slow` (.25s/.35s/.9s), `--ease-smooth` e `--ease-brand` (`cubic-bezier(0.2, 0, 0, 1)`, desaceleração da marca).
- Camadas (`--z-*`): bg=0, content=1, scene=2, fade=3, apps=4, header=50, skip=200, cursor=1000, meter=2000.

Regra: estilos novos usam tokens; valores fora da escala só com motivo (ex.: 35px do grid do footer, 14px da base do notebook).

## Revisão visual pendente

Verificar o percurso em aparelho físico, barras móveis do navegador, legibilidade durante as transições e custo de renderização. O protótipo não representa aprovação final de copy, tipografia ou duração do scroll.

---

Aroli no GitHub: https://github.com/eduardoaugustolb/umbra
