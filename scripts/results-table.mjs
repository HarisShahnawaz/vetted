#!/usr/bin/env node
// Turns `claude plugin eval --json` output into the per-skill results table.
//
//   node scripts/results-table.mjs results.json                 # print markdown
//   node scripts/results-table.mjs results.json --update-readme # rewrite README section
//
// Several result files can be passed (for example one per model); cases are
// grouped by the skill directory they live in under evals/.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const updateReadme = args.includes("--update-readme");
const files = args.filter((a) => !a.startsWith("--"));
if (!files.length) {
  console.error("usage: results-table.mjs <aggregate-result.json>... [--update-readme]");
  process.exit(2);
}

// case name -> skill, from the evals/<skill>/<case>/ layout
function caseToSkill() {
  const map = new Map();
  const evalsDir = join(ROOT, "evals");
  if (!existsSync(evalsDir)) return map;
  for (const skill of readdirSync(evalsDir)) {
    const sd = join(evalsDir, skill);
    if (skill === "results" || skill === "mocks" || !statSync(sd).isDirectory()) continue;
    for (const c of readdirSync(sd)) if (statSync(join(sd, c)).isDirectory()) map.set(c, skill);
  }
  return map;
}

const VERDICT = (d) => (d === null ? "–" : d >= 0.1 ? "✅ keeps its place" : d <= -0.05 ? "❌ hurts" : "⚠️ no measurable effect");
const pct = (x) => (x === null || x === undefined ? "–" : `${Math.round(x * 100)}%`);
const signed = (x) => (x === null || x === undefined ? "–" : `${x >= 0 ? "+" : ""}${Math.round(x * 100)}`);

const skillOf = caseToSkill();
const sections = [];
for (const file of files) {
  const r = JSON.parse(readFileSync(file, "utf8"));
  const model = r.config?.model ?? r.model ?? r.cases?.[0]?.model ?? "default model";
  const bySkill = new Map();
  for (const c of r.cases ?? []) {
    const skill = skillOf.get(c.name) ?? "other";
    if (!bySkill.has(skill)) bySkill.set(skill, []);
    const withScore = c.aggregates?.score ?? null;
    const delta = c.aggregates?.delta ?? null;
    bySkill.get(skill).push({ name: c.name, withScore, withoutScore: delta === null || withScore === null ? null : withScore - delta, delta });
  }

  const lines = [];
  lines.push(`**Model under test:** \`${model}\` · **runs per arm:** ${r.config?.runs ?? "3"} · **Claude Code:** ${r.claudeVersion ?? "?"} · **cost:** $${(r.costUsd ?? 0).toFixed(2)}${r.partial ? " · ⚠️ partial run" : ""}`);
  lines.push("");
  lines.push("| Skill | Cases | With skill | Without | Δ (points) | Verdict |");
  lines.push("| --- | ---: | ---: | ---: | ---: | --- |");
  const detail = [];
  for (const [skill, cases] of [...bySkill].sort((a, b) => a[0].localeCompare(b[0]))) {
    const mean = (k) => {
      const v = cases.map((c) => c[k]).filter((x) => x !== null);
      return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
    };
    const d = mean("delta");
    const name = skill.startsWith("_") ? `_${skill.slice(1)}_ (trigger precision)` : `[\`${skill}\`](skills/${skill}/SKILL.md)`;
    lines.push(`| ${name} | ${cases.length} | ${pct(mean("withScore"))} | ${pct(mean("withoutScore"))} | ${signed(d)} | ${skill.startsWith("_") ? "–" : VERDICT(d)} |`);
    for (const c of cases) detail.push(`| ${skill} | \`${c.name}\` | ${pct(c.withScore)} | ${pct(c.withoutScore)} | ${signed(c.delta)} |`);
  }
  lines.push("", "<details><summary>Per-case scores</summary>", "", "| Skill | Case | With | Without | Δ |", "| --- | --- | ---: | ---: | ---: |", ...detail, "", "</details>");
  sections.push(lines.join("\n"));
}

const out = sections.join("\n\n");
if (updateReadme) {
  const readme = join(ROOT, "README.md");
  const text = readFileSync(readme, "utf8");
  const start = "<!-- results:start -->";
  const end = "<!-- results:end -->";
  if (!text.includes(start) || !text.includes(end)) {
    console.error("README.md has no results markers");
    process.exit(1);
  }
  const stamp = `_Last run: ${new Date().toISOString().slice(0, 10)}. Regenerate with \`npm run evals\` then \`node scripts/results-table.mjs <result.json> --update-readme\`._`;
  writeFileSync(readme, text.slice(0, text.indexOf(start) + start.length) + "\n" + out + "\n\n" + stamp + "\n" + text.slice(text.indexOf(end)));
  console.log("README.md updated");
} else {
  console.log(out);
}
