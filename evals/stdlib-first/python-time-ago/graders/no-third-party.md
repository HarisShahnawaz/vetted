---
type: regex
weight: 2
target:
  source: file
  path: 'timeago.py'
pattern: '^\s*(import|from)\s+(humanize|arrow|pendulum|dateutil|babel|timeago|maya)\b'
flags: m
match: not_contains
---
