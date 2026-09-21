const resources = new URL("../src/main/resources/", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const stage = new URL("../.package/", import.meta.url);
const archive = new URL("aroli-jetbrains-theme.zip", dist);

const run = (command: string[], cwd?: string) => {
  const result = Bun.spawnSync(command, { cwd, stdout: "inherit", stderr: "inherit" });
  if (result.exitCode !== 0) throw new Error(`Command failed: ${command.join(" ")}`);
};

run(["bun", "scripts/verify.ts"], new URL("..", import.meta.url).pathname);
await Bun.$`rm -rf ${stage.pathname}`;
await Bun.$`mkdir -p ${new URL("Aroli/lib", stage).pathname}`;
await Bun.$`mkdir -p ${dist.pathname}`;
await Bun.$`rm -f ${archive.pathname}`;

const jar = new URL("Aroli/lib/aroli.jar", stage);
run(["zip", "-q", jar.pathname, "Aroli.theme.json", "Aroli.xml", "META-INF/plugin.xml", "META-INF/pluginIcon.svg"], resources.pathname);
run(["zip", "-q", "-r", archive.pathname, "Aroli"], stage.pathname);
run(["unzip", "-t", archive.pathname]);
await Bun.$`rm -rf ${stage.pathname}`;

console.log(`Created ${archive.pathname}`);
