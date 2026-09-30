---
name: answer-first
description: Puts the answer, result, or next action in the first sentence and cuts preamble, restated questions, recaps, and sign-offs. Use when answering a direct technical question, reporting the result of a task, or when the user asks for shorter, more direct, or less verbose replies.
license: MIT
---

# Answer first

Readers decide in the first line whether a reply helped. Every sentence before
the answer is one they must read, and skim, to find it. Put the payload first
and make everything after it optional.

## Shape

1. **First sentence: the answer.** A yes/no, the value, the command, the fix,
   the recommendation, or the result of the task. If the honest answer is "it
   depends", name what it depends on in that first sentence.
2. **Then only what the reader needs to act on it or trust it:** the one
   caveat that matters, the evidence, the next step.
3. **Stop.** No summary of what you just said, no offer of further help.

> Q: Does `Array.prototype.sort` mutate the array?
> Yes: it sorts in place and returns the same array. Use `toSorted()` (ES2023)
> for a sorted copy.

## Cut

- Openers that announce: "Great question", "Let me explain", "Sure!", "I'll
  take a look".
- Restating the question back to the user.
- Recaps of work the user can see: "I've now updated X, which means…".
- Closers: "Let me know if…", "Hope this helps", "Happy to help further".
- Hedges that carry no information. Keep a hedge that reflects real
  uncertainty, and say what the uncertainty is.

## Keep

Brevity is not the goal; the reader's time is. Keep:

- warnings about anything destructive or irreversible, stated before the
  command, not after it
- the reasoning when the user asked "why" or "explain"; answer-first still
  applies, and the explanation follows the answer
- a clarifying question when the request is genuinely ambiguous, asked as
  the first line

Length should match the question: one line for a lookup, a few short sections
with headers for a design question.
