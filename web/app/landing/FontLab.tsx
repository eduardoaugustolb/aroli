"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  COMMANDS,
  INITIAL_WORKSPACE,
  execute,
  runDemo,
} from "./mock-workspace";

const SAMPLE =
  "A sombra delimita.\nO conteúdo aparece.\n\nação, coração, funções, útil, variável\ni j ij ji · 0 O o · 1 I l\n->  =>  !=  <=  >=  ==";
const TABS = [
  ["text", "Texto livre"],
  ["editor", "Editor"],
  ["terminal", "Terminal"],
] as const;
type Tab = (typeof TABS)[number][0];

function Highlight({ source }: { source: string }) {
  return (
    <>
      {source
        .split(
          /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|let|return|if|true|false)\b|\b\d+\b)/g,
        )
        .map((part, index) => (
          <span
            key={index}
            className={
              part.startsWith("//")
                ? "token-comment"
                : /^["']/.test(part)
                  ? "token-string"
                  : /^(const|let|return|if|true|false)$/.test(part)
                    ? "token-keyword"
                    : /^\d+$/.test(part)
                      ? "token-number"
                      : undefined
            }
          >
            {part}
          </span>
        ))}
    </>
  );
}

export function FontLab() {
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState(SAMPLE);
  const [size, setSize] = useState(28);
  const [ligatures, setLigatures] = useState(true);
  const [fontStatus, setFontStatus] = useState("Carregando fonte…");
  const [workspace, setWorkspace] = useState(INITIAL_WORKSPACE);
  const [activeFile, setActiveFile] = useState("/umbra/hello.js");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("Abra um arquivo. Faça dele o seu.");
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<string[]>([
    "Umbra Shell / sessão de demonstração",
    "Arquivos compartilhados com o editor. Digite help.",
  ]);
  const editor = useRef<HTMLTextAreaElement>(null);
  const highlight = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const terminal = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const find = useRef<HTMLInputElement>(null);
  const pendingCommand = useRef("");
  const source = drafts[activeFile] ?? workspace.files[activeFile] ?? "";
  const dirty =
    Object.hasOwn(drafts, activeFile) &&
    drafts[activeFile] !== workspace.files[activeFile];
  const fontStyle = {
    fontSize: tab === "text" ? size : Math.min(size, 22),
    fontFeatureSettings: `"calt" ${ligatures ? 1 : 0}, "liga" ${ligatures ? 1 : 0}`,
  } as CSSProperties;
  useEffect(() => {
    let mounted = true;
    document.fonts
      .load('16px "Umbra Limiar"')
      .then((fonts) => {
        if (mounted)
          setFontStatus(
            fonts.length ? "Umbra Limiar Mono NF" : "Fonte indisponível",
          );
      })
      .catch(() => {
        if (mounted) setFontStatus("Fonte indisponível");
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (terminal.current)
      terminal.current.scrollTop = terminal.current.scrollHeight;
  }, [lines, tab]);
  useEffect(() => {
    if (showSearch) find.current?.focus();
  }, [showSearch]);
  const save = () => {
    setWorkspace((w) => ({
      ...w,
      files: { ...w.files, [activeFile]: source },
    }));
    setDrafts((d) => {
      const next = { ...d };
      delete next[activeFile];
      return next;
    });
    setNotice("Arquivo salvo. Já disponível no terminal.");
  };
  const run = () => {
    save();
    setRunOutput(
      activeFile.endsWith(".js")
        ? runDemo(source)
        : ["Abra um arquivo .js para executar."],
    );
  };
  const searchNext = () => {
    if (!search || !editor.current) return;
    const start = editor.current.selectionEnd;
    let index = source.toLowerCase().indexOf(search.toLowerCase(), start);
    if (index < 0) index = source.toLowerCase().indexOf(search.toLowerCase());
    if (index < 0) {
      setNotice("Nenhuma ocorrência encontrada.");
      return;
    }
    editor.current.focus();
    editor.current.setSelectionRange(index, index + search.length);
    setNotice(`Encontrado na posição ${index + 1}.`);
  };
  const editorKeys = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      save();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      run();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
      event.preventDefault();
      setShowSearch(true);
    }
    if (event.key === "Escape") {
      setShowSearch(false);
      editor.current?.focus();
    }
  };
  const submit = () => {
    if (!command.trim()) return;
    const result =
      command.trim() === "history"
        ? { workspace, output: history.map((c, i) => `${i + 1}  ${c}`) }
        : execute(command, workspace);
    setWorkspace(result.workspace);
    setLines((previous) =>
      "clear" in result && result.clear
        ? []
        : [
            ...previous,
            `${workspace.cwd} ❯ ${command}`,
            ...result.output,
          ].slice(-180),
    );
    setHistory((previous) => [...previous, command].slice(-100));
    setHistoryIndex(-1);
    setCommand("");
    pendingCommand.current = "";
  };
  const terminalKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!history.length) return;
      if (historyIndex === -1) pendingCommand.current = command;
      const next =
        event.key === "ArrowUp"
          ? historyIndex < 0
            ? history.length - 1
            : Math.max(0, historyIndex - 1)
          : historyIndex >= history.length - 1
            ? -1
            : historyIndex + 1;
      setHistoryIndex(next);
      setCommand(next < 0 ? pendingCommand.current : history[next]);
    }
    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
    }
    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "c" &&
      !window.getSelection()?.toString()
    ) {
      event.preventDefault();
      setLines((l) => [...l, `${workspace.cwd} ❯ ${command}^C`]);
      setCommand("");
      setHistoryIndex(-1);
    }
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const word = command.split(/\s/).pop() ?? "";
      const prefix = workspace.cwd === "/" ? "/" : workspace.cwd + "/";
      const paths = [
        ...Object.keys(workspace.files),
        ...workspace.directories.map((p) => p + "/"),
      ]
        .filter((p) => p.startsWith(prefix))
        .map((p) => p.slice(prefix.length));
      const options = (command.includes(" ") ? paths : COMMANDS).filter((p) =>
        p.startsWith(word),
      );
      if (options.length === 1)
        setCommand(
          command.slice(0, command.length - word.length) +
            options[0] +
            (options[0].endsWith("/") ? "" : " "),
        );
      else if (options.length) setLines((l) => [...l, options.join("  ")]);
    }
  };
  return (
    <section
      id="fonte"
      className="experience-section font-lab"
      aria-labelledby="font-heading"
    >
      <div className="experience-heading">
        <p className="eyebrow">02 / O AMBIENTE GANHA VOZ</p>
        <h2 id="font-heading">
          Cada caractere.
          <br />
          <em>Uma intenção.</em>
        </h2>
        <p>
          Do primeiro gesto à primeira linha. Experimente a Umbra Limiar:
          desenho autoral, acentos, ligaduras e símbolos no mesmo ritmo.
        </p>
      </div>
      <div className="experience-panel font-panel">
        <div className="lab-toolbar">
          <div
            className="segmented"
            role="tablist"
            aria-label="Experiência da fonte"
          >
            {TABS.map(([value, label], index) => (
              <button
                id={`tab-${value}`}
                role="tab"
                aria-selected={tab === value}
                aria-controls={`panel-${value}`}
                tabIndex={tab === value ? 0 : -1}
                key={value}
                onClick={() => setTab(value)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? 2
                          : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
                    setTab(TABS[next][0]);
                    document.getElementById(`tab-${TABS[next][0]}`)?.focus();
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="ligature-switch">
            <input
              type="checkbox"
              checked={ligatures}
              onChange={(event) => setLigatures(event.target.checked)}
            />{" "}
            Ligaduras
          </label>
        </div>
        <div className="font-controls">
          <span role="status">{fontStatus}</span>
          <label>
            Tamanho{" "}
            <input
              aria-label="Tamanho da fonte"
              type="range"
              min="14"
              max={tab === "text" ? 44 : 22}
              value={tab === "text" ? size : Math.min(size, 22)}
              onChange={(event) => setSize(Number(event.target.value))}
            />{" "}
            <output>{tab === "text" ? size : Math.min(size, 22)} px</output>
          </label>
        </div>
        <div
          id="panel-text"
          role="tabpanel"
          aria-labelledby="tab-text"
          hidden={tab !== "text"}
        >
          <textarea
            className="type-specimen umbra-font"
            aria-label="Texto livre para testar a fonte"
            data-lenis-prevent
            value={text}
            onChange={(event) => setText(event.target.value)}
            style={fontStyle}
            spellCheck={false}
          />
          <div className="panel-foot">
            <span>Escreva. Selecione. Compare as ligaduras.</span>
            <button type="button" onClick={() => setText(SAMPLE)}>
              Restaurar texto
            </button>
          </div>
        </div>
        <div
          id="panel-editor"
          role="tabpanel"
          aria-labelledby="tab-editor"
          hidden={tab !== "editor"}
          onKeyDown={editorKeys}
        >
          <div className="editor-toolbar">
            <span>
              {activeFile.split("/").pop()}
              {dirty ? " •" : ""}
            </span>
            <div>
              <button
                type="button"
                onClick={() => setShowSearch((v) => !v)}
                aria-expanded={showSearch}
              >
                Buscar
              </button>
              <button type="button" onClick={save}>
                Salvar
              </button>
              <button type="button" onClick={run}>
                Executar ↗
              </button>
            </div>
          </div>
          {showSearch && (
            <form
              className="editor-search"
              onSubmit={(e) => {
                e.preventDefault();
                searchNext();
              }}
            >
              <input
                ref={find}
                aria-label="Buscar no arquivo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar no arquivo"
              />
              <button type="submit">Próxima</button>
              <button type="button" onClick={() => setShowSearch(false)}>
                Fechar
              </button>
            </form>
          )}
          <div className="ide-layout">
            <nav
              className="file-tree"
              aria-label="Arquivos do projeto"
              data-lenis-prevent
            >
              <span>EXPLORER</span>
              {Object.keys(workspace.files).map((path) => (
                <button
                  type="button"
                  key={path}
                  aria-pressed={activeFile === path}
                  onClick={() => {
                    setActiveFile(path);
                    setRunOutput([]);
                    setNotice("Arquivo aberto.");
                  }}
                >
                  {path.replace("/umbra/", "")}
                </button>
              ))}
            </nav>
            <div className="editor-surface umbra-font" style={fontStyle}>
              <div ref={gutter} className="line-numbers" aria-hidden="true">
                {source.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="editor-code">
                <pre ref={highlight} aria-hidden="true">
                  <Highlight source={source + "\n"} />
                </pre>
                <textarea
                  ref={editor}
                  data-lenis-prevent
                  aria-label="Código do arquivo"
                  value={source}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [activeFile]: e.target.value }))
                  }
                  onScroll={(e) => {
                    if (highlight.current) {
                      highlight.current.scrollTop = e.currentTarget.scrollTop;
                      highlight.current.scrollLeft = e.currentTarget.scrollLeft;
                    }
                    if (gutter.current)
                      gutter.current.scrollTop = e.currentTarget.scrollTop;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && !e.shiftKey) {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const start = target.selectionStart;
                      target.setRangeText(
                        "  ",
                        start,
                        target.selectionEnd,
                        "end",
                      );
                      setDrafts((d) => ({ ...d, [activeFile]: target.value }));
                      requestAnimationFrame(() =>
                        target.setSelectionRange(start + 2, start + 2),
                      );
                    }
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  wrap="off"
                />
              </div>
            </div>
          </div>
          <div
            className="run-output umbra-font"
            style={fontStyle}
            data-lenis-prevent
            role="log"
            aria-label="Saída da execução"
          >
            {runOutput.length
              ? runOutput.join("\n")
              : "❯ Pronto para executar hello.js"}
          </div>
          <div className="panel-foot">
            <span role="status">{notice}</span>
            <span>Ctrl/⌘ S salva · Ctrl/⌘ Enter executa</span>
          </div>
        </div>
        <div
          id="panel-terminal"
          role="tabpanel"
          aria-labelledby="tab-terminal"
          hidden={tab !== "terminal"}
        >
          <div className="editor-toolbar">
            <span>umbra / shell</span>
            <button type="button" onClick={() => setLines([])}>
              Limpar terminal
            </button>
          </div>
          <div
            ref={terminal}
            className="terminal-screen umbra-font"
            style={fontStyle}
            data-lenis-prevent
            onClick={(event) => {
              if (
                event.target === event.currentTarget &&
                !window.getSelection()?.toString()
              )
                input.current?.focus();
            }}
          >
            <div role="log" aria-label="Saída do terminal" aria-live="polite">
              {lines.map((line, index) => (
                <div
                  className={
                    line.startsWith("/umbra") ? "terminal-command" : undefined
                  }
                  key={index}
                >
                  {line || " "}
                </div>
              ))}
            </div>
            <form
              className="terminal-prompt"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label htmlFor="terminal-command">
                {workspace.cwd} <span>❯</span>
              </label>
              <input
                ref={input}
                id="terminal-command"
                aria-label="Comando do terminal"
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="off"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={terminalKeys}
              />
              <button type="submit" aria-label="Executar comando">
                ↵
              </button>
            </form>
          </div>
          <div className="panel-foot">
            <span>↑ ↓ histórico · Tab completa · Ctrl L limpa</span>
            <button
              type="button"
              onClick={() => {
                setCommand("help");
                input.current?.focus();
              }}
            >
              Conhecer comandos
            </button>
          </div>
        </div>
        <p className="simulation-note">
          Um pequeno workspace, só seu. Editor e shell simulados, arquivos em
          memória. A execução aceita declarações simples e console.log.
          Recarregar começa uma nova sessão.
        </p>
      </div>
      <p className="font-disclaimer">
        Umbra Limiar está em desenvolvimento. Você está experimentando o desenho
        real da fonte, incluindo os glifos Nerd Font.
      </p>
    </section>
  );
}
