---
name: handoff
description: Writes a handoff note that lets a fresh agent session or a teammate resume the current task without re-reading the conversation. Use when the user asks for a handoff, summary for later, or context dump, or before ending a long session, switching machines, or clearing context mid-task.
license: MIT
---

# Handoff

The next reader starts with nothing: no conversation, no memory of dead ends,
no sense of what was verified. A good handoff lets them make useful progress in
their first five minutes instead of their first hour. Write for a capable
engineer who has never seen this task.

## Write it to a file

Save it as `HANDOFF.md` in the project root unless the user names another
place. Overwrite an older handoff for the same task and keep the file short.
Prefer pointers (`path:line`, commands, links) over pasted content: the reader
can open files.

## Sections

```markdown
# Handoff: <task in a few words>
_Updated: <date> · Branch: <branch> · Last commit: <short sha or "uncommitted">_

## Goal
What we're trying to achieve and why, in 1–3 sentences. Include the acceptance
criteria if they exist.

## State
- Done and verified: each item with how it was verified
- Done but not verified: each item with what's missing
- In progress: exactly where work stopped, with file and function

## Next steps
1. The very next action, concrete enough to start immediately
2. …

## Decisions and constraints
Choices already made and why, so they don't get relitigated. Constraints from
the user ("don't touch the public API").

## Dead ends
What was tried and didn't work, and why. This saves the most time.

## Key locations
- `path/to/file.ts:120`: why it matters
- Commands to build, test, and reproduce
```

## Rules

- Be precise about verification. "Tests pass" must mean you ran them after the
  last change; otherwise say "not re-run since <change>".
- Include exact error messages for anything still failing.
- Leave out the story of the session. The reader needs the current state, not
  how you got there, except for the dead ends.
- Don't include secrets, tokens, or personal data, even if they appeared in the
  session.
