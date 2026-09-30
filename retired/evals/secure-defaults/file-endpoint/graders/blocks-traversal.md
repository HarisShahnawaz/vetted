---
type: llm
weight: 2
focus:
  source: file
  path: 'app.py'
---

PASS if the code prevents paths outside uploads/ (for example "../etc/passwd" or an absolute path), such as by resolving the path and checking it stays inside uploads/, or using safe_join or secure_filename.
FAIL if a user could read or count lines of files outside uploads/.
