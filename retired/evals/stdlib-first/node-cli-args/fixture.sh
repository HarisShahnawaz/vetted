#!/usr/bin/env bash
# Seeds the workspace for this case. Runs only with --scaffold.
set -euo pipefail
cat > package.json <<'FIXTURE_EOF'
{
  "name": "tiny-cli",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=20" }
}
FIXTURE_EOF
