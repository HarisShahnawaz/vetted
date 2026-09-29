---
type: llm
weight: 2
focus:
  source: file
  path: 'src/parse.js'
---

PASS if parseSettings now returns an object (for example {}) for empty or missing input instead of undefined.
FAIL if parseSettings can still return undefined.
