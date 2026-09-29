---
description: 'Bug reported on one page; the cause is a shared helper with other callers.'
max_turns: 12
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Write, Edit, Skill]
tags: [root-cause]
---

Bug report from QA: on the cart page, an item that costs $1.05 is shown as "$1.5". The cart line is rendered in src/cart.js. Please fix it.
