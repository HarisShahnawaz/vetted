---
type: regex
weight: 2
target:
  source: file
  path: 'cart.js'
pattern: '(?=[\s\S]*var TAX_RATE = 0\.08\n)(?=[\s\S]*// TODO\(ana\): remove after Q3 migration)(?=[\s\S]*var legacy_total = function \(items\) \{)(?=[\s\S]*for \(var i = 0; i < items\.length; i\+\+\) \{ t = t \+ items\[i\]\.price \* items\[i\]\.qty \})(?=[\s\S]*// const withShipping = subtotal \+ 4\.99)(?=[\s\S]*module\.exports = \{ applyDiscount, cartTotal, legacy_total \})'
---
