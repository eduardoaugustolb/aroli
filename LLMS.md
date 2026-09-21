# Aroli — guia de navegação para agentes

## Leitura mínima

Leia este arquivo primeiro. Em seguida, localize o diretório afetado e leia
somente o `LLMS.md` mais específico dele. Não carregue documentação de outros
temas, do site ou da identidade sem necessidade.

| Escopo | Instrução |
| --- | --- |
| Marca e assets | `branding/LLMS.md`, depois `branding/aroli/LLMS.md` |
| Qualquer tema | `themes/LLMS.md` |
| Cursor Linux | `themes/cursor/LLMS.md` e, para Aroli, `themes/cursor/aroli/LLMS.md` |
| Chrome | `themes/chrome/LLMS.md`, depois a variante |
| Kitty | `themes/kitty/LLMS.md`, depois `aroli/LLMS.md` |
| Starship | `themes/starship/LLMS.md`, depois `aroli/LLMS.md` |
| VS Code | `themes/vscode/LLMS.md`, depois `aroli/LLMS.md` |
| Zed | `themes/zed/LLMS.md`, depois `aroli/LLMS.md` |
| Site | `web/LLMS.md`, depois `web/AGENTS.md` |

## Segurança e privacidade

- Nunca expor, registrar, versionar ou incluir em prompts credenciais, tokens,
  cookies, chaves privadas, dados pessoais, arquivos `.env` ou conteúdo de
  diretórios fora do escopo da tarefa.
- Não copiar temas para diretórios do usuário, alterar configurações da sessão,
  instalar dependências globais, publicar pacotes, criar releases ou fazer push
  sem pedido explícito.
- Antes de comandos destrutivos, resolver e mostrar o alvo exato. Não usar
  remoção recursiva ampla, reset forçado ou sobrescrever alterações alheias.
- Tratar artefatos binários e extensões como saída gerada: só atualizá-los
  quando a fonte e a validação correspondente também forem atualizadas.

## Mudanças em configurações de usuários

Estas regras valem quando a tarefa incluir instalação, atualização, remoção ou
diagnóstico no computador de alguém:

- Antes de escrever, identificar o aplicativo, sistema, configuração exata e
  método suportado pelo módulo. Não procurar a partir de `/` ou de uma pasta
  pessoal inteira.
- Fazer um backup datado do alvo antes de uma alteração e registrar somente
  caminho, ação e resultado; não registrar conteúdo de configurações, variáveis
  de ambiente, tokens ou senhas.
- Preservar comentários, ordem, fonte, atalhos, plugins e preferências que não
  pertençam ao tema. Fazer a menor alteração possível.
- Validar a saída. Em caso de falha, restaurar o backup exato e validar a
  restauração. Não escolher backups por curingas ou ordem alfabética.
- Sem instrução explícita para alterar o sistema, limitar-se a explicar e
  preparar passos reversíveis no repositório.

## Regras de trabalho

- Preserve mudanças não relacionadas já presentes no worktree.
- Use `rg` para localizar conteúdo. Use Bun para runtime, scripts e pacotes.
- Para detalhes atuais de ferramentas ou plataformas, consultar a documentação
  oficial antes de escrever instruções versionadas.
- Quando editar um módulo, atualize sua documentação e rode apenas a validação
  indicada pelo respectivo `LLMS.md`.
- Ao responder, diferencie validação local, inspeção visual e teste em software
  real. Não alegue uma etapa que não foi executada.
