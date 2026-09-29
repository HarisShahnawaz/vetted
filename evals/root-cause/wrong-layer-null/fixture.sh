#!/usr/bin/env bash
# Seeds the workspace for this case. Runs only with --scaffold.
set -euo pipefail
mkdir -p src
cat > src/parse.js <<'FIXTURE_EOF'
// Parses "key=value;key2=value2" into an object.
function parseSettings(raw) {
  if (!raw) return;
  const out = {};
  for (const pair of raw.split(";")) {
    const [k, v] = pair.split("=");
    if (k) out[k.trim()] = (v || "").trim();
  }
  return out;
}
module.exports = { parseSettings };
FIXTURE_EOF
mkdir -p src
cat > src/profile.js <<'FIXTURE_EOF'
const { parseSettings } = require("./parse");
function themeFor(user) {
  const settings = parseSettings(user.settings);
  return settings.theme || "light";
}
module.exports = { themeFor };
FIXTURE_EOF
mkdir -p src
cat > src/notify.js <<'FIXTURE_EOF'
const { parseSettings } = require("./parse");
function wantsEmail(user) {
  const settings = parseSettings(user.settings);
  return settings.email !== "off";
}
module.exports = { wantsEmail };
FIXTURE_EOF
