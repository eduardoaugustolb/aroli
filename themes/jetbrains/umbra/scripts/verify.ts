const resource = new URL("../src/main/resources/", import.meta.url);
const themePath = new URL("Umbra.theme.json", resource);
const schemePath = new URL("Umbra.xml", resource);
const pluginPath = new URL("META-INF/plugin.xml", resource);

const theme = JSON.parse(await Bun.file(themePath).text());
const scheme = await Bun.file(schemePath).text();
const plugin = await Bun.file(pluginPath).text();
const metadata = await Bun.file(new URL("../package.json", import.meta.url)).json();
const textAttributes = scheme.match(/<option name="TEXT">\s*<value>([\s\S]*?)<\/value>/)?.[1];
if (!textAttributes?.includes('<option name="BACKGROUND" value="101111"/>')) {
  throw new Error("Editor TEXT background must match the dark UI canvas (101111)");
}
if (theme.colors["Umbra.canvas"] !== "#101111") throw new Error("UI canvas must match editor background");
const pluginVersion = plugin.match(/<version>\s*([^<]+?)\s*<\/version>/)?.[1];
if (!pluginVersion || pluginVersion !== metadata.version) {
  throw new Error("plugin.xml must define a version matching package.json");
}

const requiredThemeFields = ["name", "dark", "author", "editorScheme", "ui"];
for (const field of requiredThemeFields) {
  if (!(field in theme)) throw new Error(`Umbra.theme.json must define ${field}`);
}

if (theme.name !== "Umbra" || theme.dark !== true || theme.editorScheme !== "/Umbra.xml") {
  throw new Error("Theme metadata does not reference the Umbra editor scheme correctly");
}

for (const [name, content] of [["plugin.xml", plugin], ["Umbra.xml", scheme]] as const) {
  if (!content.trimStart().startsWith("<")) throw new Error(`${name} is not XML`);
}

if (scheme.includes("FOREGGROUND")) throw new Error("Umbra.xml contains an invalid FOREGROUND attribute key");

const requiredPluginEntries = ["<id>umbra.jetbrains.theme</id>", "<themeProvider", 'path="/Umbra.theme.json"', "<bundledColorScheme", 'path="/Umbra.xml"'];
for (const entry of requiredPluginEntries) {
  if (!plugin.includes(entry)) throw new Error(`plugin.xml is missing ${entry}`);
}

for (const entry of ['<scheme name="Umbra"', "DEFAULT_KEYWORD", "DEFAULT_STRING", "LINE_NUMBERS_COLOR", "CONSOLE_BACKGROUND_KEY"]) {
  if (!scheme.includes(entry)) throw new Error(`Umbra.xml is missing ${entry}`);
}

console.log("Umbra JetBrains theme sources are structurally valid.");
