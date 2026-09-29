---
name: stdlib-first
description: Solves small programming problems with the language's standard library, platform features, or already-installed packages before adding a new dependency. Use when writing code that could pull in a package (dates, deep clone, UUIDs, HTTP, arg parsing, formatting, validation), or when the user asks which library to use.
license: MIT
---

# Stdlib first

Every new dependency is code you didn't read, running with your app's
permissions, updated on someone else's schedule. For a few lines of logic, that
trade is almost never worth it: it adds install time, bundle size, supply-chain
risk, and upgrade work for the lifetime of the project.

## Order of preference

Stop at the first option that does the job well:

1. **The language or runtime already does it.** `structuredClone`,
   `crypto.randomUUID()`, `fetch`, `Intl.DateTimeFormat`, `URL`,
   `AbortController`; `pathlib`, `dataclasses`, `argparse`, `zoneinfo`;
   `std::fs`, `encoding/json`.
2. **The platform does it.** An HTML `<input type="date">`, a CSS feature, a
   database constraint or index, a shell tool that's already required.
3. **A dependency the project already has does it.** Check the manifest
   (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`) before choosing.
4. **A few lines of your own code do it**, clearly written and tested.
5. **Only then add a new dependency.** Prefer a small, widely used,
   maintained package, and say why the options above weren't enough.

Check the project's runtime version before relying on a newer built-in
(for example `structuredClone` needs Node 17+). If it's too old, say so.

## When a dependency is the right call

Don't hand-roll things that are genuinely hard to get right: cryptography,
parsers for complex formats, time-zone databases, sanitising untrusted HTML.
For those, a well-maintained library beats clever local code, and you should
say that directly.

## Reporting

When you chose not to add a package the user might expect, say so in one line:
"Used `Intl.RelativeTimeFormat` instead of adding `moment`: no new
dependency."
