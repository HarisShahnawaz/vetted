# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.1] - 2026-09-29

### Added

- `vet` rule `sec/suspicious-install` (warn): flags `npm install`, `pip install`, and `cargo add`
  commands that name a package within edit distance 1–2 of a popular package (`requests`,
  `lodash`, `react`, etc.) but aren't that package. Uses no network and no new dependencies.
  Strips flags, version specifiers, and extras before comparing; stops at shell operators;
  allows known close neighbors (`preact`, `scapy`, `tslint`, `request`, `pandoc`, …).
  Popular names of four characters or fewer are not checked.

### Changed

- npm package renamed to `@menadirali/skill-vet` (the name `vetted` is taken on npm, and `skill-vet` is too close to an existing package). The command is still `skill-vet`.

### Fixed

- `sec/suspicious-install` no longer reads past the closing backtick of inline code, which flagged
  `pytest` as a typosquat of itself in lists like `` `npm test`, `pytest` ``.
- Fenced code blocks indented under a list item are now treated as code, so example links inside
  them no longer raise `spec/broken-reference`.

## [0.1.0] - 2026-09-29

### Added

- Nine skills rebuilt for current models: `prove-it`, `surgical`, `root-cause`,
  `bug-hunt-review`, `stdlib-first`, `grill`, `handoff`, `answer-first`, and
  `secure-defaults` (on probation).
- Eval suites for every skill in `claude plugin eval` format (18 cases,
  including trigger-precision cases).
- `vet`, a zero-dependency scanner with 37 rules across spec, trigger, style,
  cost, and security; text, JSON, Markdown, and GitHub annotation output;
  scanning of local paths, GitHub repos, and installed skills.
- GitHub Action (`uses: nadirali1350/vetted@v0`).
- Claude Code plugin and marketplace, plus Codex and Cursor plugin manifests.
