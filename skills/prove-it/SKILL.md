---
name: prove-it
description: Separates what was checked from what was only written before a coding task is reported as done. Use when finishing a code change, bug fix, or refactor, and before saying anything is fixed, working, passing, or complete. Pairs each claim with the command and output that backs it, and lists what was not verified.
license: MIT
---

# Prove it

"Done" is a claim about the world, not about what you typed. People act on your
final message: they merge, deploy, and close tickets. An honest "not verified"
costs them a minute. A false "fixed" can cost them a day, and it costs you
their trust in every later report.

## Before you report

1. List the claims your final message will make: "the bug is fixed", "tests
   pass", "the endpoint now returns 404 for unknown users".
2. For each claim, run the strongest check available right now:
   - a test that exercises the change (narrowest target first, then the suite)
   - the build, type-checker, or linter for the files you touched
   - the program or the original reproduction, with the output observed
   - reading code backs claims about structure ("the function is now pure"),
     never claims about behavior ("it works")
3. Checks must run after your last edit. A run from before the final edit does
   not cover it.
4. If a check fails, you are not done. Fix it, or report the failure plainly.

Never make a check pass by weakening it: no skipped or deleted tests, loosened
assertions, swallowed exceptions, or `|| true`. If you believe a test is wrong,
say why and ask.

## How to report

End with a short evidence block. Quote real output such as counts, exit codes,
and error lines, rather than paraphrasing it as "all good".

```
Verified
- `npm test -- auth.spec.ts` → 14 passed (run after the final edit)
- Original repro `curl -i localhost:3000/users/999` → was 500, now 404
Not verified
- Full e2e suite (needs Docker, not available here)
- Windows path handling
```

Wording rules:

- State behavior as fact only when a line under "Verified" backs it.
  Everything else is "should" and goes under "Not verified" with the reason.
- If you could not run anything at all (no shell, no runtime, missing
  dependencies), say so in the first line of the report, not at the end.
- Give the user the exact command to verify it themselves when you could not.

## Scale it to the task

- A one-line change with an obvious check needs one line of evidence.
- A question with no change made: this skill does not apply.
- A long task: verify as you go; the final report covers the final state only.
