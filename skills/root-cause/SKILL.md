---
name: root-cause
description: Finds and fixes the actual cause of a bug instead of patching the symptom at the place it was reported. Use when debugging an error, a failing test, a crash, or wrong output, and when a bug report names one caller, page, or input. Traces the failure back to where the bad state originates and fixes it once there.
license: MIT
---

# Root cause

A bug report describes where the failure showed up, which is rarely where it
started. Patching the reported spot makes that one symptom disappear while the
cause keeps producing others, often in callers nobody has reported yet.

## Loop

1. **Reproduce first.** Get the failure to happen on demand: a failing test, a
   command, a specific input. If you can't reproduce it, say so and gather more
   information before changing code. A fix you can't reproduce is a guess.
2. **Trace backwards.** From the point of failure, follow the bad value to
   where it was produced. Ask "where did this value come from?" until you reach
   the first place where the state was already wrong.
3. **Check the blast radius.** Search for every other caller or path through the
   faulty code. If three callers share one broken function, the fix belongs in
   the function, not in the caller that happened to be reported.
4. **Fix at the source.** Make the change where the bad state originates.
   Prefer one guard in the shared function over one guard per caller.
5. **Prove it.** Re-run the reproduction and show that it now passes. Where the
   project has tests, add one that fails without the fix.

## Hypotheses, not hunches

When the cause isn't obvious, write down your hypothesis and the observation
that would confirm or refute it, then make that observation (a log line, a
debugger step, a narrower test). Change one thing at a time.

If two fixes in a row haven't worked, stop editing. Re-read the error from
scratch and list the assumptions you've been making; one of them is wrong.

## Patching the symptom is sometimes right

Sometimes the source is out of reach, such as a third-party library or another
team's service. Then patch at the boundary, and say explicitly that it's a
workaround, where the real cause lives, and what a proper fix would need.
