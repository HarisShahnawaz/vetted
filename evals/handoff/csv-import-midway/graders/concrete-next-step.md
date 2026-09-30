---
type: llm
weight: 1
focus:
  source: file
  path: 'HANDOFF.md'
---

PASS if the next steps are concrete enough to start on immediately: the first step names a specific command to run (such as re-running `npm test -- import`) or a specific file or function to change (such as readRows or splitRow).
FAIL if the next steps are vague, like "continue fixing the parser" or "finish the CSV work".
