# Eval suites

One directory per skill, one subdirectory per case, in the format
[`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals) reads. Each case runs with
the plugin loaded and again without it. The difference in score (Δ) is what the skill adds over
the model on its own.

| Skill | Cases | What the cases check |
| --- | --- | --- |
| `prove-it` | 2 | With no shell, does the final report admit nothing was run, instead of claiming it works or is safe to merge? |
| `root-cause` | 2 | Does a bug reported on one page get fixed in the shared helper, and does the reply name the other callers it affected? |
| `bug-hunt-review` | 2 | Two planted bugs found with concrete scenarios; on correct code, no invented bugs. |
| `grill` | 2 | Questions come a few at a time, each with a recommended answer, and no code gets written. |
| `handoff` | 1 | Is the verification state accurate ("not re-run since…"), with dead ends and the exact failure kept? |
| `_precision` | 2 | Non-coding and conceptual prompts: no workflow skill should fire. |

The suites for the four retired skills (`surgical`, `stdlib-first`, `answer-first`, `secure-defaults`)
are kept in [`retired/evals/`](../retired/evals/). To re-test one on a new model, copy its skill and
evals back and run the suite.

## Running

```bash
# everything: 11 cases × 3 runs × 2 arms
npm run evals

# one skill
claude plugin eval . --tag root-cause --trust-plugin --scaffold --allow-tools Write Edit --no-publish

# pin the model under test and use a stronger judge
claude plugin eval . --model claude-opus-5-5 --judge-model claude-sonnet-5-5 \
  --trust-plugin --scaffold --allow-tools Write Edit --no-publish --json result.json

# update the README table from a result file
node scripts/results-table.mjs result.json --update-readme
```

`--scaffold` runs each case's `fixture.sh`, which only writes the starting files for the task.
Read them first if you're running a fork's suite. The suites grant `Write` and `Edit` but never
`Bash`, so they run on any OS without the eval sandbox.

## Reading the numbers

- Each case runs 3 times per arm by default. Differences of a few points are noise. The README
  calls a skill useful at roughly +10 points and above.
- `skill-fired` graders are indicators. They're excluded from the score in both arms, so Δ
  measures outcomes, not whether the skill loaded.
- A case where both arms score 100% says the model already does this. That's the most common
  way a skill ends up cut.
