import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const baseline = "71464ec"; // Preserved worktree immediately before the migration.
const before = (path: string) => {
  const r = Bun.spawnSync(["git", "show", `${baseline}:${path}`], {
    cwd: root,
  });
  assert.equal(r.exitCode, 0, `Missing baseline ${path}`);
  return r.stdout.toString();
};
const after = (path: string) => readFileSync(resolve(root, path), "utf8");
const json = (path: string) => JSON.parse(after(path));
for (const [oldName, newName] of [
  ["umbra", "aroli"],
  ["umbra-ink", "aroli-black"],
]) {
  const old = JSON.parse(
    before(`themes/vscode/umbra/themes/${oldName}-color-theme.json`),
  );
  const next = json(`themes/vscode/aroli/themes/${newName}-color-theme.json`);
  for (const key of [
    "colors",
    "tokenColors",
    "semanticTokenColors",
    "semanticHighlighting",
  ])
    assert.deepEqual(next[key], old[key], `VS Code palette changed: ${key}`);
}
assert.deepEqual(
  json("themes/zed/aroli/themes/aroli.json").themes[0].style,
  JSON.parse(before("themes/zed/umbra/themes/umbra.json")).themes[0].style,
  "Zed style changed",
);
for (const dir of ["umbra", "umbra-ink"])
  assert.deepEqual(
    json(`themes/chrome/${dir}/manifest.json`).theme,
    JSON.parse(before(`themes/chrome/${dir}/manifest.json`)).theme,
    "Chrome color/image mapping changed",
  );
const oldJb = JSON.parse(
  before(
    "themes/jetbrains/umbra/src/main/resources/Umbra.theme.json",
  ).replaceAll("Umbra", "Aroli"),
);
const newJb = json(
  "themes/jetbrains/aroli/src/main/resources/Aroli.theme.json",
);
for (const k of ["colors", "ui", "icons"])
  assert.deepEqual(newJb[k], oldJb[k], `JetBrains palette changed: ${k}`);
const hex = (s: string) =>
  s.match(/#[\da-fA-F]{6,8}\b/g)?.map((s) => s.toLowerCase());
assert.deepEqual(
  hex(after("themes/jetbrains/aroli/src/main/resources/Aroli.xml")),
  hex(before("themes/jetbrains/umbra/src/main/resources/Umbra.xml")),
);
for (const [dir, file] of [
  ["kitty", "kitty.conf"],
  ["starship", "starship.toml"],
])
  assert.deepEqual(
    hex(after(`themes/${dir}/aroli/${file}`)),
    hex(before(`themes/${dir}/umbra/${file}`)),
    `${dir} palette changed`,
  );
const vscode = json("themes/vscode/aroli/package.json");
assert.equal(vscode.name, "umbra-charcoal-theme");
assert.equal(vscode.publisher, "DevEduardo");
assert.deepEqual(
  vscode.contributes.themes.map((t: { id: string }) => t.id),
  ["Umbra", "Umbra Ink"],
);
for (const theme of vscode.contributes.themes)
  assert.ok(
    existsSync(resolve(root, "themes/vscode/aroli", theme.path)),
    `Missing theme: ${theme.path}`,
  );
assert.match(
  after("themes/zed/aroli/extension.toml"),
  /id = "umbra-charcoal-theme"/,
);
assert.match(
  after("themes/jetbrains/aroli/src/main/resources/META-INF/plugin.xml"),
  /<id>umbra.jetbrains.theme<\/id>/,
);
const list = Bun.spawnSync(
  [
    "rg",
    "--files",
    "--hidden",
    "-g",
    "!.git",
    "-g",
    "!node_modules",
    "-g",
    "!.next",
  ],
  { cwd: root },
)
  .stdout.toString()
  .trim()
  .split("\n");
let links = 0,
  svgs = 0;
for (const p of list) {
  if (
    p.startsWith("branding/archive/") ||
    p.startsWith("output/") ||
    p === "rebranding_conversation.md" ||
    p.endsWith("CHANGELOG.md")
  )
    continue;
  if (p.endsWith(".svg")) {
    assert.ok(
      !/NaN|undefined|Infinity/.test(after(p)),
      `Invalid SVG coordinates: ${p}`,
    );
    svgs++;
  }
  if (!p.endsWith(".md")) continue;
  for (const match of after(p).matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const link = match[1];
    if (/^(https?:|mailto:|#|\/)/.test(link)) continue;
    const local = decodeURIComponent(link.split("#")[0]);
    if (!local) continue;
    assert.ok(
      existsSync(resolve(root, dirname(p), local)),
      `Broken link in ${p}: ${link}`,
    );
    links++;
  }
}
const tracked = Bun.spawnSync(
  ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { cwd: root },
)
  .stdout.toString()
  .split("\0");
assert.ok(
  !tracked.some((p) => /Switzer.*\.(woff2?|otf|ttf)$/.test(p)),
  "Switzer binaries must not be versioned",
);
console.log(
  `Palette invariant across 8 integrations/variants; stable IDs; ${links} local links; ${svgs} SVGs; no Switzer redistribution.`,
);
