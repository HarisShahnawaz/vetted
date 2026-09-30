---
type: regex
weight: 2
target:
  source: file
  path: 'inventory.py'
pattern: '(?=[\s\S]*import os, sys)(?=[\s\S]*from typing import Dict,List)(?=[\s\S]*def getStock\(db: Dict\[str,int\], sku: str\) -> int:)(?=[\s\S]*if qty<=0: raise ValueError\("qty must be positive"\))(?=[\s\S]*db\[sku\] = db\.get\(sku,0\)\+qty)'
---
