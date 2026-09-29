---
description: 'Module with two real bugs and some style noise. Are both bugs found, with scenarios?'
max_turns: 12
timeout_seconds: 300
allowed_tools: [Read, Skill]
tags: [bug-hunt-review]
---

Can you review this module before I merge it? It's used by the orders page.

```js
// orders.js
function parsePrice(input) {
  return parseFloat(input.replace("$", ""));
}

function pageOfOrders(orders, page, size) {
  return orders.slice(page * size, size);
}

function orderTotal(order) {
  var total = 0
  for (let i = 0; i < order.items.length; i++) {
    total += parsePrice(order.items[i].price) * order.items[i].qty
  }
  return total
}

module.exports = { parsePrice, pageOfOrders, orderTotal }
```
