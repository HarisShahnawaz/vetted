import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { installedLocations, findSkillFiles } from "../lib/discover.mjs";
import { sandbox, GOOD_DESC } from "./helpers.mjs";

const box = sandbox();

test("installed locations discover Cascade, Kiro, and Cline project skills", () => {
  const roots = [".devin/skills", ".windsurf/skills", ".kiro/skills", ".cline/skills"];
  for (const [index, root] of roots.entries()) {
    box.skill(`${root}/skill-${index}`, `name: skill-${index}\ndescription: ${GOOD_DESC}`);
  }

  const projectLocations = installedLocations(box.root).filter((location) => location.scope === "project");
  for (const root of roots) {
    const path = join(box.root, root);
    const location = projectLocations.find((item) => item.path === path);
    assert.ok(location, `missing ${root}`);
    assert.equal(findSkillFiles(location.path).length, 1);
  }
});
