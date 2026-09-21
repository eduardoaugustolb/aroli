import { mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = resolve(root, "web/public/playground");
await mkdir(`${output}/cursors`, { recursive: true });
for (const name of [
  "arrow",
  "hover",
  "text",
  "grab",
  "grabbing",
  "ew-resize",
  "ns-resize",
  "nwse-resize",
  "crosshair",
  "help",
  "no-drop",
  "copy",
  "zoom-in",
  "zoom-out",
  "wait",
  "progress",
]) {
  await copyFile(
    `${root}/themes/cursor/aroli/src/${name}.svg`,
    `${output}/cursors/${name}.svg`,
  );
}
const result = spawnSync(
  "fonttools",
  [
    "ttLib.woff2",
    "compress",
    `${root}/fonts/aroli/dist/AroliMonoNF-Regular.otf`,
    "-o",
    `${output}/AroliMonoNF.woff2`,
  ],
  { stdio: "inherit" },
);
if (result.status !== 0) throw new Error("WOFF2 conversion failed");
await copyFile(
  `${root}/fonts/aroli/dist/NERD-FONTS-LICENSE.txt`,
  `${output}/NERD-FONTS-LICENSE.txt`,
);
console.log("Playground assets synchronized from Aroli sources.");
