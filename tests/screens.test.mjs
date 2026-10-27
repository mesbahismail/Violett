import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
function loadTs(file, extra = "") {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = readFileSync(file, "utf8") + extra;
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  const localRequire = name => name.startsWith(".") ? loadTs(resolve(dirname(file), name + (name.includes("side-panel") ? ".tsx" : ".ts"))) : require(name);
  new Function("exports", "require", outputText)(exports, localRequire);
  return exports;
}
const screens = loadTs(resolve(root, "src/app/page.tsx"), "\nexport { OrdersScreen, ProductsScreen, WalletScreen, AnalyticsScreen, SupportScreen, CalendarScreen, productData };\n");
const { initialOrders, initialTickets, initialEvents } = loadTs(resolve(root, "src/app/store-data.ts"));
const noop = () => {};
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

test("orders render actual search results, status/sort controls, and the shared page shell", () => {
  const html = render(screens.OrdersScreen, { orders: initialOrders, search: "#239", onUpdate: noop });
  assert.ok(html.includes('class="page-body"'));
  assert.ok(html.includes('aria-label="Order status"'));
  assert.ok(html.includes('aria-label="Sort orders"'));
  assert.ok(html.includes("Order #239"));
  assert.ok(!html.includes("Order #238"));
  assert.ok(!html.includes("Filter by"));
});
test("products show the catalog without an always-visible statistics panel", () => {
  const html = render(screens.ProductsScreen, { search: "", products: screens.productData, onCreate: noop });
  assert.equal((html.match(/class="catalog-product /g) ?? []).length, 5);
  assert.ok(html.includes('aria-label="Grid view"'));
  assert.ok(html.includes('aria-label="List view"'));
  assert.ok(html.includes("New product"));
  assert.ok(html.includes("Filters"));
  assert.ok(!html.includes("product-stats-popover"));
  assert.ok(!html.includes('role="dialog"'));
});
test("product search can find a specific product or show an empty state", () => {
  const found = render(screens.ProductsScreen, { search: "chelsea", products: screens.productData, onCreate: noop });
  assert.equal((found.match(/class="catalog-product /g) ?? []).length, 1);
  assert.ok(found.includes("Chelsea Boots"));
  const empty = render(screens.ProductsScreen, { search: "not-a-product", products: screens.productData, onCreate: noop });
  assert.ok(empty.includes("No products found"));
});
test("wallet renders balance, performance, top five products, and payouts", () => {
  const html = render(screens.WalletScreen, { products: screens.productData });
  for (const title of ["Balance", "Performance", "Best performing products", "Payout history"]) assert.ok(html.includes(title));
  assert.equal((html.match(/class="best-product"/g) ?? []).length, 5);
  assert.ok(!html.includes("My Cards"));
});
test("analytics contains both original widgets and both additional charts", () => {
  const html = render(screens.AnalyticsScreen, { orders: initialOrders, onNavigate: noop });
  for (const title of ["Store visits", "Recent sales", "Sales over time", "Purchase times"]) assert.ok(html.includes(title));
  assert.equal((html.match(/class="store-widget-head"/g) ?? []).length, 4);
});
test("support search opens the matching conversation and provides reply/status controls", () => {
  const html = render(screens.SupportScreen, { search: "exchange", tickets: initialTickets, onChange: noop, onClearSearch: noop });
  assert.ok(html.includes("Exchange shirt size"));
  assert.ok(html.includes("Could I exchange"));
  assert.ok(html.includes('aria-label="Ticket status"'));
  assert.ok(html.includes("New ticket"));
  assert.ok(html.includes("Send reply"));
  assert.ok(!html.includes("Where is my order?"));
});
test("calendar renders real month, week, and day structures", () => {
  for (const mode of ["Month", "Week", "Day"]) {
    const html = render(screens.CalendarScreen, { mode, setMode: noop, events: initialEvents, onChange: noop });
    assert.ok(html.includes(`aria-label="Next ${mode.toLowerCase()}"`));
    assert.ok(html.includes('aria-label="Calendar view"'));
    if (mode === "Month") assert.ok((html.match(/store-calendar-cell/g) ?? []).length >= 28);
    else assert.equal((html.match(/class="agenda-day"/g) ?? []).length, mode === "Week" ? 7 : 1);
  }
});
