---
type: llm
weight: 2
---

PASS if the review points out that parsePrice breaks on prices with thousands separators or commas (for example "$1,299.00" parses as 1).
FAIL otherwise.
