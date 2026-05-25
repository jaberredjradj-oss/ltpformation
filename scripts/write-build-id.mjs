import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "build-id.json");
const LOG_PREFIX = "[build:id]";

function resolveGitCommit() {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

const gitCommit = resolveGitCommit();
const timestamp = new Date().toISOString();
const id = process.env.NEXT_PUBLIC_BUILD_ID?.trim() || gitCommit || `ts-${timestamp.slice(0, 19).replace(/[:T]/g, "")}`;

const payload = {
  id,
  time: timestamp,
  gitCommit,
};

writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.info(`${LOG_PREFIX} ${id} (${timestamp})`);
