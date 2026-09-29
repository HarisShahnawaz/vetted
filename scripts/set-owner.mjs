#!/usr/bin/env node
// Replaces the __OWNER__ placeholder with a GitHub user or org name across
// the repo. Run once after forking or creating the repository:
//
//   node scripts/set-owner.mjs <github-login>

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const owner = process.argv[2];
if (!owner || !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(owner)) {
  console.error("usage: set-owner.mjs <github-login>");
  process.exit(2);
}
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set([".git", "node_modules", "results"]);
const EXT = new Set([".md", ".json", ".yml", ".yaml", ".mjs", ".js", ""]);
let changed = 0;

(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(p)) && p !== fileURLToPath(import.meta.url)) {
      const text = readFileSync(p, "utf8");
      if (text.includes("__OWNER__")) {
        writeFileSync(p, text.replaceAll("__OWNER__", owner));
        changed++;
      }
    }
  }
})(ROOT);
console.log(`replaced __OWNER__ with ${owner} in ${changed} files`);
