export type Workspace = {
  files: Record<string, string>;
  directories: string[];
  cwd: string;
};
export const INITIAL_WORKSPACE: Workspace = {
  cwd: "/aroli",
  directories: ["/", "/aroli", "/aroli/docs"],
  files: {
    "/aroli/hello.js":
      '// Um ambiente que responde a você.\n// Experimente os sinais: -> => != <= >= ==\nconst nome = "Aroli";\nconst mensagem = "Olá, " + nome;\nconsole.log(mensagem);\nconsole.log("Menos ruído. Mais espaço.");',
    "/aroli/theme.json":
      '{\n  "name": "Aroli",\n  "background": "#050505",\n  "foreground": "#C5C7C5",\n  "font": "Aroli Mono NF"\n}',
    "/aroli/README.md":
      "# Um lugar para experimentar\n\nEdite hello.js e execute com bun hello.js.\nOs arquivos são compartilhados entre o editor e o terminal.\n\nAcentos: ação, coração, funções, útil, variável.\nLigaduras: -> => != <= >= ==\n",
    "/aroli/docs/guia.md":
      "Use help para conhecer os comandos.\nUse Tab para completar comandos e caminhos.\nUse as setas para percorrer o histórico.\n",
  },
};
export function resolvePath(cwd: string, path: string) {
  const parts = (path.startsWith("/") ? path : `${cwd}/${path}`).split("/");
  const result: string[] = [];
  for (const part of parts) {
    if (part === "..") result.pop();
    else if (part && part !== ".") result.push(part);
  }
  return "/" + result.join("/");
}
export function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let word = "",
    quote = "",
    started = false;
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (c === "\\" && command[i + 1]) {
      word += command[++i];
      started = true;
    } else if (quote) {
      if (c === quote) quote = "";
      else word += c;
    } else if (c === '"' || c === "'") {
      quote = c;
      started = true;
    } else if (/\s/.test(c)) {
      if (started) {
        tokens.push(word);
        word = "";
        started = false;
      }
    } else {
      word += c;
      started = true;
    }
  }
  if (quote) throw new Error("Aspas não fechadas.");
  if (started) tokens.push(word);
  return tokens;
}
// A deliberately bounded interpreter for the demo. Never eval user input.
export function runDemo(source: string): string[] {
  const variables: Record<string, string | number | boolean> = {};
  const output: string[] = [];
  const value = (expression: string): string | number | boolean => {
    const terms =
      expression.match(
        /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_$][\w$]*|-?\d+(?:\.\d+)?|\+|\S/g,
      ) ?? [];
    if (!terms.length || terms.length % 2 === 0)
      throw new Error("Expressão incompleta.");
    let result: string | number | boolean = "";
    for (let i = 0; i < terms.length; i += 2) {
      if (i && terms[i - 1] !== "+")
        throw new Error("A simulação aceita valores e concatenação com +.");
      const term = terms[i];
      let v: string | number | boolean;
      if (term.startsWith('"')) v = JSON.parse(term);
      else if (term.startsWith("'")) v = term.slice(1, -1).replace(/\\'/g, "'");
      else if (/^-?\d/.test(term)) v = Number(term);
      else if (term === "true" || term === "false") v = term === "true";
      else if (Object.hasOwn(variables, term)) v = variables[term];
      else throw new Error(`Variável desconhecida: ${term}`);
      result = i
        ? typeof result === "number" && typeof v === "number"
          ? result + v
          : String(result) + String(v)
        : v;
    }
    return result;
  };
  try {
    for (const [index, raw] of source.split("\n").entries()) {
      const line = raw.trim().replace(/;$/, "");
      if (!line || line.startsWith("//")) continue;
      const assign = line.match(/^(?:const|let)\s+(\w+)\s*=\s*(.+)$/);
      const log = line.match(/^console\.log\((.*)\)$/);
      if (assign) variables[assign[1]] = value(assign[2]);
      else if (log) output.push(String(value(log[1])));
      else
        throw new Error(
          `Linha ${index + 1}: use const/let e console.log nesta simulação.`,
        );
    }
    return output.length ? output : ["Programa concluído sem saída."];
  } catch (error) {
    return [...output, `Erro: ${(error as Error).message}`];
  }
}
export const COMMANDS = [
  "help",
  "ls",
  "pwd",
  "cd",
  "cat",
  "echo",
  "touch",
  "mkdir",
  "rm",
  "clear",
  "whoami",
  "bun",
  "history",
];
export function execute(
  command: string,
  workspace: Workspace,
): { workspace: Workspace; output: string[]; clear?: boolean } {
  const next = {
    ...workspace,
    files: { ...workspace.files },
    directories: [...workspace.directories],
  };
  try {
    const [cmd, ...args] = tokenize(command);
    const path = resolvePath(next.cwd, args[0] ?? ".");
    let output: string[] = [];
    if (!cmd) return { workspace: next, output };
    switch (cmd) {
      case "help":
        output = [
          "Arquivos em memória, compartilhados com o editor.",
          "ls [pasta] · pwd · cd [pasta] · cat arquivo",
          'echo "texto" [> arquivo] · touch arquivo · mkdir pasta · rm arquivo',
          "bun hello.js · clear · whoami · history",
          "↑/↓ histórico · Tab completa · Ctrl+L limpa · Ctrl+C cancela",
          "Execução simulada: const/let, valores, + e console.log.",
        ];
        break;
      case "pwd":
        output = [next.cwd];
        break;
      case "whoami":
        output = ["visitante@aroli"];
        break;
      case "clear":
        return { workspace: next, output: [], clear: true };
      case "ls": {
        if (next.files[path] !== undefined) {
          output = [path.split("/").pop()!];
          break;
        }
        if (!next.directories.includes(path))
          throw new Error("Pasta não encontrada.");
        const prefix = path === "/" ? "/" : path + "/";
        output = [
          ...next.directories
            .filter(
              (p) =>
                p.startsWith(prefix) &&
                p.slice(prefix.length) &&
                !p.slice(prefix.length).includes("/"),
            )
            .map((p) => p.slice(prefix.length) + "/"),
          ...Object.keys(next.files)
            .filter(
              (p) =>
                p.startsWith(prefix) && !p.slice(prefix.length).includes("/"),
            )
            .map((p) => p.slice(prefix.length)),
        ];
        break;
      }
      case "cd": {
        const dest = args.length ? path : "/aroli";
        if (!next.directories.includes(dest))
          throw new Error("Pasta não encontrada.");
        next.cwd = dest;
        break;
      }
      case "cat":
        if (next.files[path] === undefined)
          throw new Error("Arquivo não encontrado.");
        output = [next.files[path]];
        break;
      case "bun":
        if (next.files[path] === undefined)
          throw new Error("Arquivo não encontrado.");
        output = runDemo(next.files[path]);
        break;
      case "echo": {
        const at = args.indexOf(">");
        if (at < 0) output = [args.join(" ")];
        else {
          if (!args[at + 1]) throw new Error("Informe o arquivo de destino.");
          const dest = resolvePath(next.cwd, args[at + 1]);
          if (
            !next.directories.includes(
              dest.slice(0, dest.lastIndexOf("/")) || "/",
            ) ||
            next.directories.includes(dest)
          )
            throw new Error("Destino inválido.");
          next.files[dest] = args.slice(0, at).join(" ") + "\n";
        }
        break;
      }
      case "touch":
      case "mkdir": {
        if (!args[0]) throw new Error("Informe um nome.");
        if (
          !next.directories.includes(
            path.slice(0, path.lastIndexOf("/")) || "/",
          )
        )
          throw new Error("Pasta pai não encontrada.");
        if (cmd === "mkdir") {
          if (next.files[path] !== undefined)
            throw new Error("Já existe um arquivo.");
          if (!next.directories.includes(path)) next.directories.push(path);
        } else {
          if (next.directories.includes(path))
            throw new Error("O caminho é uma pasta.");
          next.files[path] ??= "";
        }
        break;
      }
      case "rm":
        if (next.files[path] === undefined)
          throw new Error("Arquivo não encontrado.");
        delete next.files[path];
        break;
      default:
        output = [`Comando não encontrado: ${cmd}. Digite help.`];
    }
    return { workspace: next, output };
  } catch (error) {
    return { workspace, output: [`Erro: ${(error as Error).message}`] };
  }
}
