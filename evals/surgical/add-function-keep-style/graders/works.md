---
type: llm
weight: 2
focus:
  source: file
  path: 'inventory.py'
---

PASS if the file has a new function that decreases stock for a sku by qty and raises ValueError when stock is insufficient, and the function name follows the file's camelCase convention (for example sellStock or sell).
FAIL if the function is missing, wrong, or uses snake_case with an underscore (for example sell_stock).
