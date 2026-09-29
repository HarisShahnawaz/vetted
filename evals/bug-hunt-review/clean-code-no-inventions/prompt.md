---
description: 'Correct code. Does the reviewer resist inventing bugs?'
max_turns: 12
timeout_seconds: 300
allowed_tools: [Read, Skill]
tags: [bug-hunt-review]
---

Review this helper for bugs before I merge it.

```python
def chunk(items: list, size: int) -> list[list]:
    """Split items into consecutive lists of at most `size` elements."""
    if size <= 0:
        raise ValueError("size must be positive")
    return [items[i:i + size] for i in range(0, len(items), size)]
```
