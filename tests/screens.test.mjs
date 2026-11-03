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
const screens = loadTs(resolve(root, "src/app/page.tsx"), "\nexport { StoreDashboard, OrdersScreen, ProductsScreen, WalletScreen, AnalyticsScreen, SupportScreen, CalendarScreen, HomeCalendarDropdown, HelpScreen, SettingsScreen, productData };\n");
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
  assert.equal((html.match(/class="catalog-product /g) ?? []).length, 8);
  assert.equal(screens.productData.length, 12);
  assert.ok(html.includes('aria-label="Next products page"'));
  assert.ok(html.includes('alt="Denim Jeans"'));
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
  assert.ok(html.includes('aria-label="Mark as solved"'));
  assert.ok(html.includes("New ticket"));
  assert.ok(html.includes("Send reply"));
  assert.ok(!html.includes("Where is my order?"));
});
test("calendar renders year, month, week, and day structures", () => {
  for (const mode of ["Year", "Month", "Week", "Day"]) {
    const html = render(screens.CalendarScreen, { mode, setMode: noop, events: initialEvents, onChange: noop });
    assert.ok(html.includes(`aria-label="Next ${mode.toLowerCase()}"`));
    assert.ok(html.includes('aria-label="Calendar view"'));
    assert.ok(html.includes('class="screen-title calendar-heading"'));
    assert.ok(!html.includes("<span>Add event</span>"));
    if (mode === "Year") assert.equal((html.match(/class="calendar-year-month"/g) ?? []).length, 12);
    else if (mode === "Month") assert.ok((html.match(/store-calendar-cell/g) ?? []).length >= 28);
    else assert.equal((html.match(/class="agenda-day"/g) ?? []).length, mode === "Week" ? 7 : 1);
  }
});

test("home uses store-specific widgets and computed figures rather than generic mock metrics", () => {
  const html = render(screens.StoreDashboard, { orders: initialOrders, tickets: initialTickets, events: initialEvents, products: screens.productData, onNavigate: noop });
  for (const title of ["Store updates", "Order volume", "Fulfilment", "Gross sales", "Sales overview", "Latest order", "Stock alerts"]) assert.ok(html.includes(title), title);
  for (const figure of ["$667.00", "$133.40", "40%", "2/5 delivered", "1 out of stock"]) assert.ok(html.includes(figure), figure);
  assert.ok(!html.includes("Desktop users"));
  assert.ok(!html.includes("8,492"));
  assert.ok(!html.includes("Dark mode"));
});


test("all twelve catalog photographs are bundled locally", () => {
  for (const product of screens.productData) {
    const extension = ["jeans", "boots"].includes(product.color) ? "jpg" : "webp";
    const bytes = readFileSync(resolve(root, `public/products/${product.color}.${extension}`));
    assert.ok(bytes.length > 1000, product.name);
  }
});
test("recent sales omit payment brands and support uses one central search", () => {
  const analytics = render(screens.AnalyticsScreen, { orders: initialOrders, onNavigate: noop });
  for (const brand of ["Visa", "PayPal", "Mastercard"]) assert.ok(!analytics.includes(brand));
  const support = render(screens.SupportScreen, { search: "", tickets: initialTickets, onChange: noop, onClearSearch: noop });
  assert.ok(!support.includes("support-list-search"));
  for (const action of ["Mark as solved", "Archive ticket", "Edit ticket", "Delete ticket"]) assert.ok(support.includes(action));
});
test("archived tickets are excluded from the default inbox", () => {
  const tickets = initialTickets.map(ticket => ({ ...ticket, archived: ticket.customer === "Sarah Morgan" }));
  const html = render(screens.SupportScreen, { search: "", tickets, onChange: noop, onClearSearch: noop });
  assert.ok(!html.includes("Where is my order?"));
  assert.ok(html.includes("Exchange shirt size"));
});
test("help and settings use central search to select relevant content", () => {
  const help = render(screens.HelpScreen, { search: "fulfilment", onNavigate: noop });
  assert.ok(help.includes("Orders and payments"));
  assert.ok(!help.includes("Getting started"));
  const settings = render(screens.SettingsScreen, { search: "typography", darkMode: true, setDarkMode: noop });
  assert.ok(settings.includes("Customizations"));
  assert.ok(settings.includes('aria-label="Text size"'));
  assert.ok(!settings.includes("SUB-TITLE"));
});


test("calendar labels stay identical across runtime date punctuation differences", (t) => {
  const original = Date.prototype.toLocaleDateString;
  let includeComma = false;
  t.mock.method(Date.prototype, "toLocaleDateString", function (locale, options) {
    const formatted = original.call(this, locale, options);
    if (locale !== "en-GB" || options?.dateStyle !== "full") return formatted;
    const withoutComma = formatted.replace(/,/g, "");
    return includeComma ? withoutComma.replace(" ", ", ") : withoutComma;
  });
  const components = [
    [screens.HomeCalendarDropdown, { onNavigate: noop }],
    [screens.CalendarScreen, { mode: "Month", setMode: noop, events: initialEvents, onChange: noop }],
  ];
  for (const [Component, props] of components) {
    includeComma = false;
    const serverMarkup = render(Component, props);
    includeComma = true;
    const browserMarkup = render(Component, props);
    assert.equal(browserMarkup, serverMarkup, `${Component.name} must render identical date labels`);
  }
});
