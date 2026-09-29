---
type: llm
weight: 2
focus:
  source: file
  path: 'timeago.py'
---

PASS if time_ago handles past and future datetimes, produces singular/plural units sensibly (minutes, hours, days), and returns "just now" for very small differences.
FAIL if it is missing, obviously wrong, or depends on a third-party package.
