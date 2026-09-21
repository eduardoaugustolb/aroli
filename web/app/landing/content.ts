export const REPO = "https://github.com/eduardoaugustolb/umbra";

export type NotebookApp = {
  id: string;
  name: string;
  role: string;
};

export const NOTEBOOK_APPS: NotebookApp[] = [
  { id: "vscode", name: "VS Code", role: "Editor" },
  { id: "zed", name: "Zed", role: "Editor" },
  { id: "kitty", name: "Kitty", role: "Terminal" },
];

export const themeGuideUrl = (id: string) =>
  `${REPO}/tree/main/themes/${id}/aroli`;

export type ThemeEntry = {
  name: string;
  role: string;
  detail: string;
  path: string;
};

export const THEMES: ThemeEntry[] = [
  {
    name: "VS Code",
    role: "Editor",
    detail: "Tema escuro com sintaxe semântica.",
    path: "themes/vscode/aroli",
  },
  {
    name: "Zed",
    role: "Editor",
    detail: "Tema escuro com sintaxe semântica.",
    path: "themes/zed/aroli",
  },
  {
    name: "Kitty",
    role: "Terminal",
    detail: "Terminal com a mesma paleta.",
    path: "themes/kitty/aroli",
  },
  {
    name: "Starship",
    role: "Prompt",
    detail: "Prompt compacto com Git e runtimes.",
    path: "themes/starship/aroli",
  },
  {
    name: "Aroli Backdrops",
    role: "Coleção",
    detail: "Fundos escuros na mesma linguagem.",
    path: "wallpapers",
  },
];

export const themeUrl = (path: string) => `${REPO}/tree/main/${path}`;
