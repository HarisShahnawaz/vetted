---
description: 'Add one function to a Python module with unusual conventions. Are the conventions and neighbors kept?'
max_turns: 12
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Write, Edit, Skill]
tags: [surgical]
---

Add a function to inventory.py that sells stock: it takes db, sku and qty, decreases the stock, and raises ValueError if there isn't enough.
