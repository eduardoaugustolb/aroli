import {
  mkdtemp,
  mkdir,
  copyFile,
  rm,
  readFile,
  writeFile,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Each developer obtains their own official copy; font binaries must not enter Git.
const source = "https://api.fontshare.com/v2/fonts/download/switzer";
const target = new URL("../app/fonts/", import.meta.url);
const temp = await mkdtemp(join(tmpdir(), "aroli-switzer-"));
try {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Fontshare returned ${response.status}`);
  await writeFile(
    join(temp, "switzer.zip"),
    Buffer.from(await response.arrayBuffer()),
  );
  const unzip = spawnSync("unzip", [
    "-q",
    join(temp, "switzer.zip"),
    "-d",
    temp,
  ]);
  if (unzip.status !== 0)
    throw new Error("Could not unpack official Switzer archive");
  const base = join(temp, "Switzer_Complete");
  const license = await readFile(join(base, "License/FFL.txt"), "utf8");
  const reviewed = await readFile(
    new URL("../../branding/aroli/SWITZER-LICENSE.txt", import.meta.url),
    "utf8",
  );
  if (license !== reviewed)
    throw new Error(
      "Fontshare license changed: review the new terms before updating the recorded license.",
    );
  await mkdir(target, { recursive: true });
  await copyFile(
    join(base, "Fonts/WEB/fonts/Switzer-Variable.woff2"),
    new URL("Switzer-Variable.woff2", target),
  );
  await copyFile(
    join(base, "Fonts/WEB/fonts/Switzer-Medium.ttf"),
    new URL("Switzer-Medium.ttf", target),
  );
  console.log(
    "Official Switzer files ready locally. Do not commit or redistribute font binaries.",
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
