import { spawnSync } from "node:child_process";

const command = process.env.VERCEL === "1" ? "node" : "bun";
const args =
  command === "node"
    ? ["node_modules/next/dist/bin/next", "build"]
    : ["--bun", "next", "build"];

const result = spawnSync(command, args, { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
