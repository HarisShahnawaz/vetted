# Working on this repo (for coding agents)

- `skills/<name>/SKILL.md`: the skills. Markdown only, no scripts. Keep bodies
  around 300–600 tokens, calm wording, and a description that says what and
  when, in the third person.
- `evals/<skill>/<case>/`: `claude plugin eval` cases. Graders should check
  outcomes, not the skill's own formatting. `evals/_precision/` holds cases
  where no skill should fire.
- `cli/`: the `vet` scanner. Zero dependencies, Node 18+, ES modules.
  `cli/lib/rules.mjs` holds every rule; each new rule needs a test in
  `cli/test/rules.test.mjs`. Hostile test content is generated at test time in
  a temp dir, never committed.
- `scripts/`: maintenance scripts (results table, owner placeholder).

Before finishing a change:

```bash
npm test
node cli/vet.mjs vet skills --strict
```

Don't commit anything under `evals/results/`.
