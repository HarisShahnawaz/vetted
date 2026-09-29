#!/usr/bin/env bash
# Seeds the workspace for this case. Runs only with --scaffold.
set -euo pipefail
mkdir -p src
cat > src/money.js <<'FIXTURE_EOF'
function formatPrice(cents) {
  const dollars = Math.floor(cents / 100);
  const rest = cents % 100;
  return "$" + dollars + "." + rest;
}
module.exports = { formatPrice };
FIXTURE_EOF
mkdir -p src
cat > src/cart.js <<'FIXTURE_EOF'
const { formatPrice } = require("./money");
function cartLine(item) {
  return `${item.name} x${item.qty}: ${formatPrice(item.cents * item.qty)}`;
}
module.exports = { cartLine };
FIXTURE_EOF
mkdir -p src
cat > src/invoice.js <<'FIXTURE_EOF'
const { formatPrice } = require("./money");
function invoiceTotal(lines) {
  const cents = lines.reduce((s, l) => s + l.cents, 0);
  return "Total due: " + formatPrice(cents);
}
module.exports = { invoiceTotal };
FIXTURE_EOF
mkdir -p src
cat > src/email.js <<'FIXTURE_EOF'
const { formatPrice } = require("./money");
function receiptEmail(order) {
  return `Thanks! You paid ${formatPrice(order.cents)}.`;
}
module.exports = { receiptEmail };
FIXTURE_EOF
