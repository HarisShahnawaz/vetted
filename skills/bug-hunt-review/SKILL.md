---
name: bug-hunt-review
description: Reviews code or a diff for real defects, meaning inputs or states that produce wrong results, crashes, data loss, or security holes, and reports each with a concrete failure scenario. Use when asked to review code, a pull request, a diff, or a change before merge. Leaves out style nitpicks unless asked.
license: MIT
---

# Bug-hunt review

A review is worth the bugs it catches before users do. A list of twenty style
suggestions with one real bug in the middle is a worse review than the one bug
alone, because the reader has to dig for it and may never find it.

## What counts as a finding

A finding is a defect you can describe as **input or state, then wrong
outcome**:

> `parsePrice("1,299.00")` returns `1` because `parseFloat` stops at the comma,
> so any order over $999 is charged $1.

Look hardest at:

- boundaries: empty, zero, one, max, negative, unicode, duplicate, null
- error paths: what happens when the call fails, times out, or partly succeeds
- concurrency and ordering: races, re-entrancy, stale reads, retries
- trust boundaries: user input reaching SQL, shell, file paths, HTML, redirects
- resource handling: leaks, unbounded growth, missing cleanup on error
- contracts: callers that now receive something they don't expect

## Verify before you report

For each candidate, trace the code path that produces the failure. If you can
run code, write the smallest reproduction. Drop anything you can't back with a
concrete scenario, or list it separately as "uncertain" with what would confirm
it. A false positive costs the author time and costs your review credibility.

## Output

Most severe first. For each finding:

```
[severity] file:line: one-sentence defect
  Scenario: concrete input/state → wrong outcome
  Fix: the smallest change that removes it
```

Severity: **critical** (data loss, security, crash in a common path), **high**
(wrong results users will hit), **medium** (edge cases, degraded behavior),
**low** (latent issues that need an unlikely trigger).

If you find nothing, say so plainly and name the areas you checked. Don't pad
the review with style comments to look thorough. If the user asked for style
feedback too, put it in a separate short section after the defects.
