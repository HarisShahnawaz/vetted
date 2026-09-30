#!/usr/bin/env bash
# Seeds the workspace for this case. Runs only with --scaffold.
set -euo pipefail
cat > math.js <<'FIXTURE_EOF'
function calc(items) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}
module.exports = { calc };
FIXTURE_EOF
cat > app.js <<'FIXTURE_EOF'
const { calc } = require("./math");
console.log(calc([{ price: 2, qty: 3 }]));
FIXTURE_EOF
