// Parses the YAML frontmatter of a SKILL.md file.
//
// Supports the subset of YAML that skill files use in practice: scalars (plain,
// quoted, folded `>` and literal `|` blocks, multi-line plain), inline and
// block lists, and nested maps. Anything else is reported through `warnings`
// instead of throwing, so one odd file never stops a scan.

export function splitFrontmatter(text) {
  const src = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const lines = src.split("\n");
  if (lines[0].trim() !== "---") {
    return { raw: null, body: src, bodyStartLine: 1 };
  }
  for (let i = 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === "---" || t === "...") {
      return {
        raw: lines.slice(1, i),
        body: lines.slice(i + 1).join("\n"),
        bodyStartLine: i + 2,
      };
    }
  }
  return { raw: null, body: src, bodyStartLine: 1, unterminated: true };
}

export function parseFrontmatter(text) {
  const { raw, body, bodyStartLine, unterminated } = splitFrontmatter(text);
  if (!raw) return { data: null, body, bodyStartLine, warnings: [], unterminated: !!unterminated };
  const warnings = [];
  const parser = new Parser(raw, warnings);
  const data = parser.parseMap(0);
  return { data, body, bodyStartLine, warnings, unterminated: false };
}

const indentOf = (line) => line.match(/^ */)[0].length;
const isBlank = (line) => line.trim() === "" || /^\s*#/.test(line);

class Parser {
  constructor(lines, warnings) {
    this.lines = lines;
    this.i = 0;
    this.warnings = warnings;
  }

  skipBlank() {
    while (this.i < this.lines.length && isBlank(this.lines[this.i])) this.i++;
  }

  parseMap(indent) {
    const out = {};
    for (;;) {
      this.skipBlank();
      if (this.i >= this.lines.length) return out;
      const line = this.lines[this.i];
      const ind = indentOf(line);
      if (ind < indent) return out;
      if (ind > indent) {
        this.warnings.push(`line ${this.i + 2}: unexpected indentation`);
        this.i++;
        continue;
      }
      const m = line.slice(ind).match(/^("[^"]*"|'[^']*'|[^:#\s][^:]*?)\s*:(?:\s+(.*))?$/);
      if (!m) {
        this.warnings.push(`line ${this.i + 2}: could not parse "${line.trim().slice(0, 40)}"`);
        this.i++;
        continue;
      }
      const key = m[1].replace(/^["']|["']$/g, "");
      const rest = (m[2] ?? "").trimEnd();
      this.i++;
      if (key in out) this.warnings.push(`duplicate key "${key}"`);
      out[key] = this.parseValue(rest, indent);
    }
  }

  parseValue(rest, parentIndent) {
    const v = stripComment(rest);
    if (v === "") {
      // Nested block: a list or a map, indented further than the key.
      this.skipBlank();
      if (this.i >= this.lines.length) return null;
      const next = this.lines[this.i];
      const ind = indentOf(next);
      if (ind <= parentIndent && !next.slice(ind).startsWith("- ")) return null;
      if (next.slice(ind).startsWith("- ") || next.trim() === "-") return this.parseList(ind);
      const first = next.slice(ind);
      // A scalar that starts on the line after its key.
      if (first.startsWith('"') || first.startsWith("'")) {
        this.i++;
        return this.parseQuoted(first.trimEnd(), parentIndent);
      }
      if (!/^("[^"]*"|'[^']*'|[^:#\s][^:]*?)\s*:(\s|$)/.test(first)) {
        this.i++;
        return typed(this.continuePlain(stripComment(first), parentIndent));
      }
      return this.parseMap(ind);
    }
    if (/^[|>][+-]?\d*$/.test(v)) return this.parseBlockScalar(v, parentIndent);
    if (v.startsWith('"') || v.startsWith("'")) return this.parseQuoted(v, parentIndent);
    if (v.startsWith("[")) return parseInlineList(v);
    if (v.startsWith("{")) return parseInlineMap(v);
    return typed(this.continuePlain(v, parentIndent));
  }

  parseList(indent) {
    const out = [];
    for (;;) {
      this.skipBlank();
      if (this.i >= this.lines.length) return out;
      const line = this.lines[this.i];
      const ind = indentOf(line);
      const item = line.slice(ind);
      if (ind !== indent || !(item.startsWith("- ") || item === "-")) return out;
      this.i++;
      const val = item.slice(1).trim();
      const kv = val.match(/^([^:#\s][^:]*?)\s*:(?:\s+(.*))?$/);
      if (kv && !val.startsWith('"') && !val.startsWith("'")) {
        // "- key: value" starts a map item; its siblings sit at indent + 2.
        const obj = { [kv[1]]: this.parseValue((kv[2] ?? "").trimEnd(), indent + 2) };
        Object.assign(obj, this.parseMap(indent + 2));
        out.push(obj);
      } else {
        out.push(this.parseValue(val, indent));
      }
    }
  }

  parseBlockScalar(header, parentIndent) {
    const folded = header[0] === ">";
    const chomp = header.includes("-") ? "strip" : header.includes("+") ? "keep" : "clip";
    const collected = [];
    let blockIndent = null;
    while (this.i < this.lines.length) {
      const line = this.lines[this.i];
      if (line.trim() === "") {
        collected.push("");
        this.i++;
        continue;
      }
      const ind = indentOf(line);
      if (ind <= parentIndent) break;
      if (blockIndent === null) blockIndent = ind;
      if (ind < blockIndent) break;
      collected.push(line.slice(blockIndent));
      this.i++;
    }
    // Trailing blank lines belong to chomping, not content.
    let trailing = 0;
    while (collected.length && collected[collected.length - 1] === "") {
      collected.pop();
      trailing++;
    }
    let text;
    if (folded) {
      text = "";
      for (let k = 0; k < collected.length; k++) {
        const cur = collected[k];
        if (k === 0) text = cur;
        else if (cur === "") text += "\n";
        else if (collected[k - 1] === "" || /^\s/.test(cur) || /^\s/.test(collected[k - 1])) text += (text.endsWith("\n") ? "" : "\n") + cur;
        else text += " " + cur;
      }
    } else {
      text = collected.join("\n");
    }
    if (chomp === "clip" && text !== "") text += "\n";
    if (chomp === "keep") text += "\n".repeat(trailing + 1);
    return text;
  }

  parseQuoted(v, parentIndent) {
    const q = v[0];
    let buf = v;
    // A quoted scalar may continue onto more-indented lines.
    while (!closesQuote(buf, q) && this.i < this.lines.length) {
      const line = this.lines[this.i];
      if (line.trim() !== "" && indentOf(line) <= parentIndent) break;
      buf += "\n" + line.trim();
      this.i++;
    }
    const end = closingIndex(buf, q);
    if (end < 0) {
      this.warnings.push("unterminated quoted string");
      return buf.slice(1);
    }
    const inner = buf.slice(1, end).replace(/\n(\n*)/g, (_, extra) => (extra ? extra : " "));
    return q === "'" ? inner.replace(/''/g, "'") : unescapeDouble(inner);
  }

  continuePlain(v, parentIndent) {
    let text = v;
    while (this.i < this.lines.length) {
      const line = this.lines[this.i];
      if (line.trim() === "") {
        // A blank line inside a multi-line plain scalar is a paragraph break
        // only if the scalar continues afterwards.
        let j = this.i + 1;
        while (j < this.lines.length && this.lines[j].trim() === "") j++;
        if (j < this.lines.length && indentOf(this.lines[j]) > parentIndent) {
          text += "\n";
          this.i = j;
          continue;
        }
        break;
      }
      if (indentOf(line) <= parentIndent) break;
      text += (text.endsWith("\n") ? "" : " ") + stripComment(line.trim());
      this.i++;
    }
    return text;
  }
}

function stripComment(s) {
  if (s.startsWith('"') || s.startsWith("'")) return s.trim();
  const idx = s.search(/\s#/);
  return (idx >= 0 ? s.slice(0, idx) : s).trim();
}

function closingIndex(s, q) {
  for (let k = 1; k < s.length; k++) {
    if (q === '"' && s[k] === "\\") {
      k++;
      continue;
    }
    if (s[k] === q) {
      if (q === "'" && s[k + 1] === "'") {
        k++;
        continue;
      }
      return k;
    }
  }
  return -1;
}
const closesQuote = (s, q) => closingIndex(s, q) >= 0;

function unescapeDouble(s) {
  return s.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, e) => {
    if (e[0] === "u" || e[0] === "x") return String.fromCharCode(parseInt(e.slice(1), 16));
    return { n: "\n", t: "\t", r: "\r", "0": "\0", '"': '"', "\\": "\\", "/": "/", " ": " " }[e] ?? e;
  });
}

function splitTopLevel(s) {
  const parts = [];
  let depth = 0;
  let cur = "";
  let quote = null;
  for (const ch of s) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    if (ch === "[" || ch === "{") depth++;
    if (ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

const unquote = (s) => {
  if (s.startsWith('"') && s.endsWith('"')) return unescapeDouble(s.slice(1, -1));
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  return typed(s);
};

function parseInlineList(v) {
  const inner = v.trim().replace(/^\[/, "").replace(/\]$/, "");
  return splitTopLevel(inner).map(unquote);
}

function parseInlineMap(v) {
  const inner = v.trim().replace(/^\{/, "").replace(/\}$/, "");
  const out = {};
  for (const part of splitTopLevel(inner)) {
    const idx = part.indexOf(":");
    if (idx < 0) continue;
    out[unquote(part.slice(0, idx).trim())] = unquote(part.slice(idx + 1).trim());
  }
  return out;
}

function typed(s) {
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null" || s === "~") return null;
  return s;
}
