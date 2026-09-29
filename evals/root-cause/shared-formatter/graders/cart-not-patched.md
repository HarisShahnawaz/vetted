---
type: regex
weight: 1
target:
  source: file
  path: 'src/cart.js'
pattern: 'return `\$\{item\.name\} x\$\{item\.qty\}: \$\{formatPrice\(item\.cents \* item\.qty\)\}`;'
---
