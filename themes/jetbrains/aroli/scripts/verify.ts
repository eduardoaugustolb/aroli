const resource = new URL("../src/main/resources/", import.meta.url);
const themePath = new URL("Aroli.theme.json", resource);
const schemePath = new URL("Aroli.xml", resource);
const pluginPath = new URL("META-INF/plugin.xml", resource);

const theme = JSON.parse(await Bun.file(themePath).text());
const scheme = await Bun.file(schemePath).text();
const plugin = await Bun.file(pluginPath).text();
const metadata = await Bun.file(new URL("../package.json", import.meta.url)).json();
const textAttributes = scheme.match(/<option name="TEXT">\s*<value>([\s\S]*?)<\/value>/)?.[1];
if (!textAttributes?.includes('<option name="BACKGROUND" value="101111"/>')) {
  throw new Error("Editor TEXT background must match the dark UI canvas (101111)");
}
if (theme.colors["Aroli.canvas"] !== "#101111") throw new Error("UI canvas must match editor background");
const pluginVersion = plugin.match(/<version>\s*([^<]+?)\s*<\/version>/)?.[1];
if (!pluginVersion || pluginVersion !== metadata.version) {
  throw new Error("plugin.xml must define a version matching package.json");
}

const requiredThemeFields = ["name", "dark", "author", "editorScheme", "ui"];
for (const field of requiredThemeFields) {
  if (!(field in theme)) throw new Error(`Aroli.theme.json must define ${field}`);
}

if (theme.name !== "Aroli Dark" || theme.dark !== true || theme.editorScheme !== "/Aroli.xml") {
  throw new Error("Theme metadata does not reference the Aroli editor scheme correctly");
}

for (const [name, content] of [["plugin.xml", plugin], ["Aroli.xml", scheme]] as const) {
  if (!content.trimStart().startsWith("<")) throw new Error(`${name} is not XML`);
}

if (scheme.includes("FOREGGROUND")) throw new Error("Aroli.xml contains an invalid FOREGROUND attribute key");

const requiredPluginEntries = ["<id>aroli.jetbrains.theme</id>", "<themeProvider", 'path="/Aroli.theme.json"', "<bundledColorScheme", 'path="/Aroli.xml"'];
for (const entry of requiredPluginEntries) {
  if (!plugin.includes(entry)) throw new Error(`plugin.xml is missing ${entry}`);
}

for (const entry of ['<scheme name="Aroli Dark"', "DEFAULT_KEYWORD", "DEFAULT_STRING", "LINE_NUMBERS_COLOR", "CONSOLE_BACKGROUND_KEY"]) {
  if (!scheme.includes(entry)) throw new Error(`Aroli.xml is missing ${entry}`);
}

console.log("Aroli JetBrains theme sources are structurally valid.");
