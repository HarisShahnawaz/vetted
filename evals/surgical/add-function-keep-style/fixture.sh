#!/usr/bin/env bash
# Seeds the workspace for this case. Runs only with --scaffold.
set -euo pipefail
cat > inventory.py <<'FIXTURE_EOF'
import os, sys
from typing import Dict,List

# NOTE: keep camelCase names, the Java bridge depends on them
def getStock(db: Dict[str,int], sku: str) -> int:
    return db.get(sku, 0)

def restock(db, sku, qty):
    if qty<=0: raise ValueError("qty must be positive")
    db[sku] = db.get(sku,0)+qty
    return db[sku]
FIXTURE_EOF
