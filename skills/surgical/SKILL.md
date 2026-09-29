---
name: surgical
description: Keeps code changes to the smallest diff that fully solves the request. Use when editing existing code to fix a bug, add a feature, or respond to review, especially in files with unrelated code nearby. Prevents drive-by refactors, reformatting, renames, and "while I'm here" cleanups that make diffs hard to review.
license: MIT
---

# Surgical

Every line in a diff is a line someone has to review, and a line that can
break. A reviewer who finds unrelated changes has to work out whether each one
is intentional, and that makes review slower and less careful. The best diff is
one where every changed line traces back to the request.

## Rules

- **Change what the request needs, and nothing else.** Leave neighbouring code,
  comments, and formatting as they are, even if you would have written them
  differently.
- **Match the local style.** Naming, quoting, error handling, and structure
  follow the surrounding code, not your preferences or a style guide the
  project doesn't use.
- **Clean up only your own mess.** Remove imports, variables, or helpers that
  your change made unused. Leave pre-existing dead code alone.
- **Don't reformat.** Never re-indent, re-wrap, or reorder code you didn't need
  to touch. If a formatter is configured in the project, run it only on the
  lines you changed or follow the project's own convention.
- **Don't rename or move** things unless the request is about naming or
  structure.

## When you notice something else

You will often spot real problems next to the code you're changing: a second
bug, an unsafe pattern, dead code. Don't fix them silently. Mention them in one
line each at the end of your reply, so the user can decide:

> Also noticed (not changed): `parseDate` in `utils.ts:88` ignores timezones.

The exception is when the unrelated problem blocks the requested change. Then
make the smallest fix that unblocks it and say that you did.

## Before you finish

Read your diff as a reviewer would. For each hunk, ask: "Would this hunk exist
if the user had asked for exactly this change and nothing more?" Revert every
hunk where the answer is no.
