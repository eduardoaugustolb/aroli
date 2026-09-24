# Migração Aroli — 2026-09-20

Nova identidade Encaixe, nomes públicos e documentação Aroli. Paleta preservada. Consulte o registro em docs/migrations/2026-09-20-aroli.md na raiz. Releases anteriores abaixo são históricas.

# Changelog

## 0.903 — 2026-09-23

- Vírgula com o ponto do final mais o rabicho descendente; antes era só o rabicho e se confundia com o ponto em tamanho de código.
- Metade inferior do `;` passa a ser a mesma vírgula, mantendo o ponto superior.
- Verificação de regressão: `.` na base, `,`/`;` descendentes, pares `.`/`,` e `,`/`;` distintos; linha de pontuação na prova visual.

## 0.902 — 2026-09-23

- Piso nivelado na construção: barras horizontais e ápices diagonais deslocados por |dx|/len*hw para a borda externa alinhar em 0, sem escala vertical por glifo.
- Removida a normalização por escala do 0.901, que distorcia contornos e deixava o hinting inconsistente entre pesos.
- SemiBold volta a ter hints reais; m/0/o/E com haste de base em todos os pesos.
- Outlines: planos em 0, ápices com overshoot de até -5 dentro do fuzz [-16,0].
- Raster Pillow/FreeType: 15 px exato nos três pesos; 12/14/16/24 px dentro de 1 px.
- Verificação de base permite overshoot óptico [-17,1]; altura-x permite [1064,1082].

## 0.901 — 2026-09-23

- Corrigida a linha de base irregular: as bordas reais dos contornos agora terminam em y=0, independentemente da orientação das hastes.
- Altura das minúsculas e maiúsculas normalizada; descendentes preservados abaixo da base.
- Zonas de hinting atualizadas para os novos extremos e verificações de regressão para base e altura-x.
- A validação da 0.9 não detectou o desnivelamento observado depois no Zed; a 0.901 acrescenta provas específicas de alinhamento.

## 0.9 — 2026-09-23

- Redesenho de i, I, j e l, preservando células fixas e diferenciação de 1.
- Minúsculas maiores e pesos ópticos 78/92/106 para leitura em tamanho de código.
- União de contornos textuais e hinting CFF obrigatório antes da entrega.
- Metadados de família, peso e largura fixa corrigidos para os três OTFs.
- Cada peso passa por validação do próprio binário e prova visual em 10–24 px.
- Licença autoral proprietária, com distribuição exclusiva pelo titular e preservação das licenças dos ícones externos.
- Teste real no Zed/HiDPI permanece requisito para 1.0.

## Prova 02

- Ponto do j alinhado à haste em x=390.
- Maior separação dos acentos das maiúsculas e espaço vertical correspondente.
- Contornos de !=, <= e >= corrigidos.
- Avanço das ligaduras exatamente igual a duas células inteiras.
- Prova visual do OTF final por Pango/HarfBuzz: acentos, i/j, ligaduras ligadas/desligadas, código, ícones e tamanhos de uso real.
- Inspeção visual obrigatória documentada em LLMS.md.
