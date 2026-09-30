#!/usr/bin/env bash
# Seeds the workspace for this case. Runs only with --scaffold.
set -euo pipefail
cat > cart.js <<'FIXTURE_EOF'
// Shopping cart helpers. Legacy code: keep behavior stable for the mobile app.
var TAX_RATE = 0.08

function applyDiscount(total, code) {
  if (code === "SAVE10") return total * 0.9
  if (code === "SAVE20") return total * 0.9
  return total
}

// TODO(ana): remove after Q3 migration
var legacy_total = function (items) {
  var t = 0
  for (var i = 0; i < items.length; i++) { t = t + items[i].price * items[i].qty }
  return t
}

function cartTotal(items, code) {
  const subtotal = legacy_total(items)
  // const withShipping = subtotal + 4.99
  return applyDiscount(subtotal, code) * (1 + TAX_RATE)
}

module.exports = { applyDiscount, cartTotal, legacy_total }
FIXTURE_EOF
