---
name: secure-defaults
description: Applies secure defaults when writing code that handles untrusted input, such as SQL queries, shell commands, file paths, HTML output, redirects, auth, secrets, or deserialization. Use when writing or changing code in web handlers, CLIs, database access, file uploads, or anything that touches user-supplied data or credentials.
license: MIT
---

# Secure defaults

Most vulnerabilities in new code are not clever. They're a user-controlled
string reaching an interpreter: SQL, a shell, a path, or HTML. The secure
version is usually the same length as the insecure one, so write it that way
the first time.

## Defaults

| Sink | Default | Never |
| --- | --- | --- |
| SQL | Parameterized queries or the ORM's query builder | String concatenation or interpolation of input |
| Shell | Argument arrays (`execFile`, `subprocess.run([...])`) | `shell=True` / `exec` with interpolated input |
| File paths | Resolve, then check it stays under the allowed root | Joining user input onto a path unchecked |
| HTML | The framework's escaping; sanitize if rich text is required | `innerHTML` / `dangerouslySetInnerHTML` with input |
| Redirects | Allow-list of hosts or relative paths only | Redirecting to a user-supplied URL |
| Secrets | Environment or a secret manager | Literals in code, logs, errors, or URLs |
| Deserialization | JSON with schema validation | `pickle`, `yaml.load`, `eval` on untrusted data |
| Crypto / tokens | `crypto.randomBytes`, `secrets`, vetted libraries | `Math.random`, hand-rolled crypto |
| Comparisons of secrets | Constant-time compare | `==` on tokens or HMACs |

## Also

- Validate input at the boundary: type, length, range, format. Reject rather
  than "fix up" malformed input.
- Fail closed: on an auth or permission error, deny.
- Keep error messages to users generic; log the detail server-side without
  secrets or personal data.
- Set timeouts on outbound calls and limits on request sizes.

## When the existing code does it differently

If the surrounding code uses an insecure pattern, don't copy it into new code.
Write the new code securely, and point out the existing issue in one line
rather than refactoring it unasked.
