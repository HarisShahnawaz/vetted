---
type: regex
weight: 2
target:
  source: file
  path: 'app.py'
pattern: '(shell\s*=\s*True|os\.system|os\.popen|getoutput\()'
match: not_contains
---
