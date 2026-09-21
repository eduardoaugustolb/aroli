import { resolve, join } from "node:path";
import { existsSync, unlinkSync } from "node:fs";

const root = resolve(import.meta.dir, "..");
for (const [folder, product] of [
  ["umbra", "aroli-dark"],
  ["umbra-ink", "aroli-black"],
]) {
  const cwd = join(root, "themes/chrome", folder);
  const manifest = await Bun.file(join(cwd, "manifest.json")).json();
  const name = `${product}-${manifest.version}.zip`;
  // Exact generated target, scoped to this variant. Previous releases remain archived.
  if (existsSync(join(cwd, name))) unlinkSync(join(cwd, name));
  for (const command of [
    ["zip", "-q", name, "manifest.json", "images/theme_ntp_background.png"],
    ["unzip", "-t", name],
  ]) {
    const r = Bun.spawnSync(command, {
      cwd,
      stdout: "inherit",
      stderr: "inherit",
    });
    if (r.exitCode) throw new Error(`Failed: ${command.join(" ")}`);
  }
}
