---
type: regex
weight: 2
target:
  source: file
  path: 'users.js'
pattern: '(\$\{\s*name|[''"`]\s*\+\s*name)'
match: not_contains
---
