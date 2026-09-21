# Aroli — identidade visual

Versão 1.1 · 2026-09-21. Direção aprovada no storyboard; vetores de produção redesenhados a partir dele. Método: skill memorable-visual-identity. [Prancha aprovada](output/imagegen/aroli-study-01/storyboard.png) · [Sistema vetorial](branding/aroli/system.svg) · [Migração](docs/migrations/2026-09-20-aroli.md).

## Conceito e posicionamento

**Tudo encontra seu lugar.** Aroli organiza ferramentas digitais em um ambiente coerente. Duas peças diferentes preservam um intervalo e pertencem ao mesmo conjunto. Público inicial: pessoas que personalizam ferramentas de desenvolvimento; a identidade comporta outros produtos digitais.

Apple Friendly orienta proporções, legibilidade e cuidado tipográfico. Não copiar símbolos Apple, ícones de sistema ou efeitos de vidro. A paleta permanece; a comunicação tipográfica muda; o Encaixe substitui o limiar.

## Arquitetura de nomes

| Papel | Nome |
| --- | --- |
| Marca / workspace | Aroli |
| Temas | Aroli Themes |
| Variante padrão | Aroli Dark |
| Variante mais profunda | Aroli Black |
| Fonte de comunicação | Aroli Sans |
| Fonte de código | Aroli Mono; NF identifica o pacote com Nerd Fonts |
| Cursores | Aroli Pointer |
| Wallpapers | Aroli Backdrops |

Usar “Aroli for Zed” ou “Aroli para Zed” conforme o idioma. Não criar logos por integração. IDs históricos são detalhados no registro de migração.

## Assets distintivos

1. **Encaixe:** corpo orgânico compacto com reentrância no alto à direita e peça curva separada. Duas massas, uma cor, sem contorno.
2. **Intervalo:** superfícies com curvas complementares mantêm espaço negativo legível. Aparece em fundos sem repetir literalmente o logo.
3. **Acomodação:** deslocamento curto da peça até seu alinhamento, seguido de repouso.

Apoios: assinatura proporcional Aroli Sans, hierarquia por tamanho/peso, margens constantes e neutros dominantes. Associação espontânea ainda não foi medida.

## Construção e reprodução

`branding/aroli/geometry.ts` é a fonte de verdade. ViewBox 192 × 192; BODY e PIECE são compartilhados com o glifo U+100000 da Mono. `build.ts` gera SVGs, PNGs, ícones e provas.

- Preservar posição da peça, abertura, assimetria e base orgânica; não espelhar.
- Margem livre mínima: 24 unidades além da silhueta, ampliada perto de texto.
- Símbolo isolado: 24 px recomendado; em 16 px usar somente favicon, sem wordmark.
- Assinatura completa: largura recomendada de 140 px ou mais na web.
- Avatar utiliza área livre própria. Símbolo transparente não recebe fundo automático.
- Monocromia em `#C5C7C5` sobre escuro ou `#050505` sobre claro. Sem metal, brilho, textura, perspectiva ou degradê no logo.

A assinatura usa Aroli Sans Medium convertida em curvas. Os glifos são desenhos próprios do projeto, com curvas suaves e espaços internos abertos que acompanham o Encaixe.

## Tipografia

Aroli Sans para comunicação/interface: 400 para texto, 500–600 para títulos e 700 para ênfase. Quatro pesos estáticos autorais em OTF/WOFF2, versionados e servidos localmente. Preparar com `cd web && bun run setup:fonts`. Desenho, prova e limitações no [guia da fonte](fonts/aroli-sans/README.md). Versão 0.1: baixo contraste, curvas levemente ovais, `a` de dois andares, `g` de um andar e kerning GPOS. A referência Switzer orienta o território visual, sem reutilização de contornos.

Títulos em caixa normal, até duas linhas, entrelinha 1,08–1,15 e tracking de -0,025 a -0,035 em em tamanhos grandes. Corpo 16–18 px, entrelinha 1,5–1,65, 45–70 caracteres por linha. Rótulos 13–16 px, sem tracking extremo.

Aroli Mono permanece um protótipo autoral independente para código. Esta migração altera família, metadados, espécime e glifo da marca; não redesenha o alfabeto inteiro. Não impor fontes às configurações de editores externos.

## Cor: valores preservados

| Função | Valores existentes |
| --- | --- |
| Fundo profundo / base | `#050505` / `#101111` |
| Superfícies auxiliares | `#0E1010`, `#161919`, `#191C1C`, `#202424` |
| Seleção / bordas | `#29252F`, `#252727`, `#3B4242` |
| Texto | `#C5C7C5`, `#AEB9BC`, `#858A89`, `#697271`, `#555B5A` |
| Acentos | `#00A6C7`, `#9D7FD1`, `#C78995`, `#CDA27C`, `#7FB8CC`, `#83B89A` |
| Tokens de integrações | `#9AB7B0`, `#B79BDD`, `#A9B4C8`, `#D0B07C`, `#B4BEC0` |

Cada configuração de tema é sua fonte de verdade: não normalizar cores entre plataformas nesta migração. Antigos nomes de pigmentos podem aparecer em código/tabelas; não nomeiam produtos.

Em marca, 85–90% de neutros escuros; restante em texto/formas, acentos pontuais. Em sintaxe, preservar o mapeamento anterior. Contraste de foco, leitura e estados prevalece; não depender só de cor.

## Forma, composição e imagens

Uma relação dominante entre duas superfícies. Título à esquerda, forma/intervalo à direita; margens de 6–7%, espaçamento em múltiplos de 4 px. No mobile, deslocar a forma para fora da leitura.

Wallpapers sem assinatura usam planos curvos e campo livre para ícones/janelas. Capturas legadas documentam a paleta, não demonstram instalação do rebranding. Não editar screenshots para simular testes em aplicativos.

## Movimento e interação

Acomodação em 280 ms, `cubic-bezier(0.2,0,0,1)`: deslocamento curto, sem quique ou loop decorativo. Site implementa acomodação de um plano do fundo. Três frames documentam o gesto do símbolo; não são um arquivo animado.

Movimento reduzido mostra estado final. Texto, foco e controles ficam disponíveis sem animação. Notebook e laboratórios existentes são preservados. Cursores mantêm formas funcionais e hotspots; não transformar seta em logo.

## Provas e reconhecimento

`system.svg` inclui uma aplicação sem logo, nome ou slogan no painel 05; o rótulo é editorial. `stress.svg` mostra 16/24/32/64/128 px, inversão e desfoque. `applications/competitor-swap.svg` testa Nord e não representa colaboração.

Inspeção interna avalia silhueta/parentesco, não exclusividade. A troca de nome ainda pode parecer plausível sem exposição anterior: a paleta é compartilhada com outros sistemas e a Aroli Sans ainda não tem associação medida. Repetir intervalo e acomodação para construir associação.

Teste humano a executar: mostrar por cinco segundos a 5–8 pessoas, ocultar, pedir desenho/descrição e depois associação de peça sem assinatura. Não realizado nesta migração.

Notas internas de potencial (0–10): distintividade 6; reconhecimento 7; coerência 8; forma 7; propriedade tipográfica 7; composição 6; movimento 6; flexibilidade 8; consistência 8; acessibilidade 7; longevidade 7. Não são métricas de público.

## Antipadrões

Evitar marcas Apple, botão de energia, anel de loading, letras escondidas, paletas/logos por integração, Switzer renomeada como fonte autoral, texto essencial em cinza decorativo, loops constantes e dependência exclusiva do preto. O arquivo histórico não orienta novos assets.
