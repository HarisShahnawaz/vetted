import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { sandbox, GOOD_DESC } from "./helpers.mjs";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "..", "vet.mjs");
const run = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } });

const box = sandbox();
box.skill("clean/ok-skill", `name: ok-skill\ndescription: ${GOOD_DESC}`);
box.skill("warny/warn-skill", "name: warn-skill\ndescription: Helps with PDFs.");
box.skill("broken/bad-skill", "name: wrong-name\ndescription: " + GOOD_DESC);
const p = (d) => join(box.root, d);

test("exit 0 on a clean skill, with a text summary", () => {
  const r = run("vet", p("clean"));
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /ok-skill/);
  assert.match(r.stdout, /0 errors/);
});

test("exit 1 on errors; warnings fail only with --strict", () => {
  assert.equal(run("vet", p("broken")).status, 1);
  assert.equal(run("vet", p("warny")).status, 0);
  assert.equal(run("vet", p("warny"), "--strict").status, 1);
});

test("--ignore skips rules, including prefixes", () => {
  assert.equal(run("vet", p("broken"), "--ignore", "spec/name-dir-mismatch").status, 0);
  assert.equal(run("vet", p("warny"), "--strict", "--ignore=trigger/*").status, 0);
});

test("json output has a stable shape", () => {
  const r = run("vet", box.root, "--format", "json");
  const j = JSON.parse(r.stdout);
  assert.equal(j.schemaVersion, 1);
  assert.equal(j.summary.skills, 3);
  assert.ok(j.skills.every((s) => Array.isArray(s.findings) && typeof s.cost.descriptionTokens === "number"));
});

test("github format emits workflow annotations", () => {
  const r = run("vet", p("broken"), "--format", "github");
  assert.match(r.stdout, /^::error file=.*SKILL\.md,title=spec\/name-dir-mismatch::/m);
});

test("markdown format renders a table", () => {
  const r = run("vet", p("clean"), "--format", "markdown");
  assert.match(r.stdout, /\| Skill \| Status \|/);
});

test("usage errors exit 2", () => {
  assert.equal(run("vet", "--format", "xml").status, 2);
  assert.equal(run("vet", "--nope").status, 2);
  assert.equal(run("frobnicate").status, 2);
});

test("rules and version commands", () => {
  assert.match(run("rules").stdout, /sec\/remote-exec/);
  assert.match(run("--version").stdout, /^\d+\.\d+\.\d+/);
});

test("an empty directory is not an error", () => {
  const r = run("vet", p("clean/ok-skill/nothing-here"));
  assert.equal(r.status, 0);
});
