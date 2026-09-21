# Avaliação da reconstrução

2026-09-05. Fonte metodológica: [memorable-visual-identity](/home/eduardoaugustolb/.agents/skills/memorable-visual-identity/SKILL.md). Contexto, auditoria, conceito, assets, sistema, provas e documentação seguem a sequência da skill. Notas e proporções são decisões de projeto, não resultados científicos.

## Contexto e auditoria

Umbra reúne temas e wallpapers para pessoas que personalizam ferramentas de desenvolvimento. Os arquivos do projeto estabelecem preto OLED e interfaces acromáticas como restrições. O problema informado pelo usuário é leitura MU no símbolo empilhado. Objetivo: tornar a ordem UM explícita, mantendo uma linguagem repetível nos demais materiais.

Consulta textual às páginas oficiais em 2026-09-05:

| Referência | Evidência | Decisão para Umbra |
| --- | --- | --- |
| [Nord](https://www.nordtheme.com/) | Paleta azulada de inspiração ártica, grupos de cores e catálogo de ports | Não usar cor fria como assinatura |
| [Catppuccin](https://catppuccin.com/) | Posicionamento pastel, esquema comunitário e catálogo de ports | Evitar organizar a identidade em sabores cromáticos |
| [Dracula](https://draculatheme.com/) | Catálogo de temas, metáforas de castelo e caixão | Tema noturno sozinho não distingue Umbra |

Limite: a consulta confirma posicionamento e conteúdo; não permite atribuir com segurança fontes, animações ou uma auditoria visual completa dessas marcas. Monoespaçadas, preto e metáforas noturnas são convenções apontadas pela skill, não uma descoberta quantitativa desta consulta. A oportunidade autoral é a combinação do limiar curvo/angular e composição de campo escuro. Exclusividade não foi comprovada.

## Decisão e refinamento

Na revisão 0.5.0, o feedback do usuário escolheu o limiar aberto como símbolo principal após comparar o UM, o limiar e uma tentativa de M abstrato conectado. A opção conectada foi descartada: em tamanhos pequenos, sua leitura se aproximava de um zigue-zague. O percurso final `M24 20V72Q24 108 60 108H100L148 44` preserva a curva à esquerda, uma base curta e a saída diagonal. O traço é 16, a curva é a única transição arredondada e não há ramificações.

O símbolo não busca representar letras. Ele traduz a passagem curva/ângulo do limiar entre sombra e conteúdo. A coruja, os monogramas e o V sobre U deixaram de orientar o sistema.

## Matriz de assets

As colunas de reconhecimento e exclusividade são hipóteses internas. Fame e uniqueness reais: não medidas.

| Asset | Potencial de reconhecimento | Potencial de exclusividade | Coerência | Repetibilidade |
| --- | --- | --- | --- | --- |
| Limiar aberto com curva esquerda e saída diagonal direita | Médio/alto | Médio: formas abertas são frequentes | Alta | Alta |
| Título curto / campo vazio / forma à direita | Médio | Baixo isoladamente | Alta | Alta |
| Caixa baixa na assinatura e metadados espaçados | Baixo isoladamente | Baixo | Média | Alta |
| Preto e cinzas | Baixo isoladamente | Baixo | Alta | Alta |

## Provas e limites

`system.svg` e `stress.svg` foram renderizados com Inkscape e inspecionados visualmente.

| Teste | Resultado da inspeção interna |
| --- | --- |
| Silhueta | Curva à esquerda, abertura superior e diagonal direita preservadas sem dependência de cor |
| Monocromia / inversão | Forma legível em Bone sobre Ink e Ink sobre Bone |
| Redução em 16, 24, 32, 64 e 128 px | Em 16 px, curva e diagonal ficam pouco definidas. Recomendar 32 px ou mais |
| Desfoque | A oposição entre curva esquerda e diagonal direita sobrevive; detalhes dos terminais se perdem |
| Oclusão | A abertura e a diagonal deixam de comunicar a silhueta. Proibir recorte do símbolo |
| Retirada de logo, nome e slogan | Peça direita da prancha mantém limiar, hierarquia e distribuição. Há parentesco visual; isso não comprova identificação de Umbra |
| Troca por concorrente | `applications/competitor-swap.svg`: a composição continua plausível com Nord. O layout isolado tem exclusividade baixa; manter o limiar e construir associação por repetição |
| Entre suportes | Prancha editorial, avatar quadrado e wallpaper panorâmico materializados; aplicação real em interface não avaliada nesta entrega |
| Cinco segundos | Não realizado com participantes; protocolo abaixo |

Não declarar reconhecimento comprovado nem atribuir respostas a participantes inexistentes. Não buscar resolver a baixa exclusividade da paleta adicionando ornamentos.

## Notas internas de potencial (0–10)

| Critério | Nota | Motivo |
| --- | --- | --- |
| Distintividade | 6 | Silhueta específica, mas território de formas abertas concorrido |
| Potencial de reconhecimento | 7 | Curva e diagonal contrastantes, repetíveis entre suportes |
| Coerência semântica | 8 | Sombra, limite e revelação conectam forma e aplicação |
| Força da forma | 7 | Funciona em monocromia e desfoque; frágil sob recorte |
| Identidade tipográfica | 4 | Comportamento consistente, fonte não exclusiva |
| Identidade compositiva | 6 | Limiar repete-se, mas layout aceita outra marca |
| Identidade de movimento | 3 | Regra documentada, sem protótipo animado |
| Flexibilidade entre meios | 7 | Vetor, avatar e wallpaper; impressão não testada |
| Consistência | 8 | Dois assets primários e poucas regras |
| Acessibilidade | 7 | Marca contrastante; tamanho mínimo e uso funcional precisam ser respeitados |
| Longevidade | 7 | Sem efeitos de moda; associação depende de exposição |

## Teste humano a executar

Apresentar o símbolo isolado durante cinco segundos, ocultar e pedir que a pessoa desenhe ou descreva a forma. Não explicar o conceito antes. Repetir em 32 px, perguntar sobre dificuldade e registrar literalmente a resposta. Com 5–8 pessoas é possível detectar ambiguidades, não estimar reconhecimento populacional.

Mostrar uma peça assinada e, após outra tarefa, uma peça sem nome, logo e slogan, isolada do cabeçalho da prancha e misturada a referências. Perguntar o que recorda e a qual marca associa, aceitando “não sei”. Registrar participante anônimo, tamanho, tempo, resposta espontânea e familiaridade prévia. Se “recipiente”, “rampa” ou “marca de verificação” aparecerem repetidamente, refinar proporções antes de aumentar a exposição.
