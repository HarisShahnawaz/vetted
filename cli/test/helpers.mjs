import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { after } from "node:test";

// Builds throwaway skill directories under the OS temp dir. Hostile test
// content is generated here instead of being committed to the repo.
export function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "vetted-test-"));
  after(() => rmSync(root, { recursive: true, force: true }));
  return {
    root,
    skill(dirName, frontmatter, body = "\n# Title\n\nDo the thing.\n", extra = {}) {
      const dir = join(root, dirName);
      mkdirSync(dir, { recursive: true });
      const fmText = frontmatter === null ? "" : `---\n${frontmatter}\n---\n`;
      writeFileSync(join(dir, "SKILL.md"), fmText + body);
      for (const [rel, content] of Object.entries(extra)) {
        const p = join(dir, rel);
        mkdirSync(dirname(p), { recursive: true });
        writeFileSync(p, content);
      }
      return join(dir, "SKILL.md");
    },
  };
}

export const GOOD_DESC =
  "Formats changelog entries from merged pull requests. Use when preparing a release or when the user asks for release notes.";

export const rules = (result) => result.findings.map((f) => `${f.severity}:${f.rule}`);
