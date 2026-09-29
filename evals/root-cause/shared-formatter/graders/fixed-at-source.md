---
type: llm
weight: 2
focus:
  source: file
  path: 'src/money.js'
---

PASS if formatPrice now always renders two digits after the decimal point (105 → "$1.05", 100 → "$1.00", 5 → "$0.05").
FAIL if formatPrice still produces "$1.5" for 105 cents.
