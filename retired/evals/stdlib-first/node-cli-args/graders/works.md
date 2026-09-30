---
type: llm
weight: 2
focus:
  source: file
  path: 'cli.js'
---

PASS if cli.js parses --port as a number defaulting to 3000 and --verbose as a boolean, and prints the options as JSON.
FAIL otherwise.
