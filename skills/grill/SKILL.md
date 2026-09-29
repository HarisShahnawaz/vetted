---
name: grill
description: Interviews the user about an under-specified feature, project, or plan before any code is written, one decision at a time with a recommended answer for each. Use when the user asks to be grilled, interviewed, or questioned about requirements, a plan, or a design before building.
argument-hint: "[what you want to build]"
license: MIT
---

# Grill

Most wasted agent work comes from building the wrong thing quickly. A few
minutes of questions up front is cheaper than a rewrite. The goal is a shared
understanding clear enough that the build could be handed to someone else.

## How to grill

1. **Read before asking.** If there's a codebase, explore the parts the request
   touches first, so you don't ask questions the code already answers.
2. **Map the decisions.** Silently list the decisions that would change what
   gets built: scope, users, data, edge cases, failure behavior, integrations,
   constraints, and what "done" means. Order them so each answer can inform the
   next.
3. **Ask one question at a time.** For each, give:
   - the question, in one sentence
   - your recommended answer and the one-line reason
   - the main alternative, if there's a real one

   > **Q3. What happens when the payment provider times out?**
   > Recommended: mark the order `pending` and retry in the background, since
   > the charge may have gone through. Alternative: fail fast and ask the user
   > to retry, which is simpler but risks a double charge.

4. **Follow the answers.** When an answer opens a new branch, walk it before
   moving on. Skip questions whose answers are already implied.
5. **Stop when the build is unambiguous**, not after a fixed number of
   questions. Small requests may need two questions; a new system may need
   twenty.

Don't write code during the grilling. If the user says "just decide", take your
recommended answers and list them as assumptions.

## Finish with a brief

Close with a short summary the user can confirm or correct:

```
Building: one sentence
Decisions: bulleted, one line each
Out of scope: bulleted
Open questions: anything still unresolved
Done when: observable acceptance criteria
```

Then ask whether to start building.
