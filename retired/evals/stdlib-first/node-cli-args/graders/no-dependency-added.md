---
type: regex
weight: 1
target:
  source: file
  path: 'package.json'
pattern: '"dependencies"'
match: not_contains
---
