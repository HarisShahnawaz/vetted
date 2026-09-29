import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../lib/frontmatter.mjs";

const fm = (yaml, body = "\nBody\n") => parseFrontmatter(`---\n${yaml}\n---${body}`);

test("plain scalars, booleans, and body offset", () => {
  const r = fm("name: my-skill\ndescription: Does a thing. Use when things.\ndisable-model-invocation: true");
  assert.equal(r.data.name, "my-skill");
  assert.equal(r.data.description, "Does a thing. Use when things.");
  assert.equal(r.data["disable-model-invocation"], true);
  assert.equal(r.bodyStartLine, 6);
  assert.deepEqual(r.warnings, []);
});

test("folded and literal block scalars", () => {
  const r = fm("description: >\n  First line\n  continues here.\n\n  New paragraph.\nnotes: |-\n  keep\n  lines");
  assert.equal(r.data.description, "First line continues here.\nNew paragraph.\n");
  assert.equal(r.data.notes, "keep\nlines");
});

test("quoted strings, including multi-line and escapes", () => {
  const r = fm(`a: "say \\"hi\\""\nb: 'it''s'\nc: "spans\n  two lines"`);
  assert.equal(r.data.a, 'say "hi"');
  assert.equal(r.data.b, "it's");
  assert.equal(r.data.c, "spans two lines");
});

test("multi-line plain scalar", () => {
  const r = fm("description: starts here\n  and keeps going\nname: x");
  assert.equal(r.data.description, "starts here and keeps going");
  assert.equal(r.data.name, "x");
});

test("scalar that starts on the line after its key", () => {
  const r = fm('description:\n  "Quoted text that\n  wraps lines."\nname: after\nother:\n  plain text on the\n  next line');
  assert.equal(r.data.description, "Quoted text that wraps lines.");
  assert.equal(r.data.name, "after");
  assert.equal(r.data.other, "plain text on the next line");
  assert.deepEqual(r.warnings, []);
});

test("nested maps and lists", () => {
  const r = fm("metadata:\n  author: me\n  version: \"1.0\"\ntags: [a, 'b c']\nitems:\n  - one\n  - two");
  assert.deepEqual(r.data.metadata, { author: "me", version: "1.0" });
  assert.deepEqual(r.data.tags, ["a", "b c"]);
  assert.deepEqual(r.data.items, ["one", "two"]);
});

test("CRLF line endings and a BOM", () => {
  const r = parseFrontmatter("﻿---\r\nname: crlf\r\n---\r\nbody\r\n");
  assert.equal(r.data.name, "crlf");
  assert.equal(r.body.trim(), "body");
});

test("comments are stripped from plain values but not quoted ones", () => {
  const r = fm('a: value # note\nb: "keep # this"');
  assert.equal(r.data.a, "value");
  assert.equal(r.data.b, "keep # this");
});

test("missing and unterminated frontmatter", () => {
  assert.equal(parseFrontmatter("# Just markdown").data, null);
  const r = parseFrontmatter("---\nname: x\n");
  assert.equal(r.data, null);
  assert.equal(r.unterminated, true);
});
