---
type: regex
weight: 2
target:
  source: file
  path: 'cli.js'
pattern: '(require\(\s*[''"]|from\s+[''"])(commander|yargs|minimist|meow|arg|command-line-args|cac|sade)[''"]'
match: not_contains
---
