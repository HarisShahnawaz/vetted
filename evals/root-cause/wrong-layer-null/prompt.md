---
description: 'Crash reported in a view; the bad value comes from a parser that returns undefined on bad input.'
max_turns: 12
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Write, Edit, Skill]
tags: [root-cause]
---

Users with no saved settings crash the profile page: "TypeError: Cannot read properties of undefined (reading 'theme')" in src/profile.js. Please fix.
