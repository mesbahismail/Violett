import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const api = {};
const source = readFileSync(new URL("../src/app/store-data.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
new Function("exports", "require", outputText)(api, require);
const { initialOrders, selectOrders, dateKey, calendarDates, shiftCalendar, money } = api;

test("order search matches a number, customer, email, or product without case sensitivity", () => {
  for (const query of ["#239", "ALEXA", "alexa@example.com", "denim"]) {
    assert.ok(selectOrders(initialOrders, query, "All statuses", "newest").some(order => order.id === "#239"));
  }
});
test("status and search filters combine", () => {
  assert.deepEqual(selectOrders(initialOrders, "Denim", "Processing", "newest").map(order => order.id), ["#239", "#234"]);
  assert.equal(selectOrders(initialOrders, "Denim", "Delivered", "newest").length, 0);
});
test("each sort orders actual numeric totals or timestamps, preserving the source array", () => {
  const before = structuredClone(initialOrders);
  for (const sort of ["newest", "oldest", "highest", "lowest"]) {
    const result = selectOrders(initialOrders, "", "All statuses", sort);
    const values = result.map(order => ["highest", "lowest"].includes(sort) ? order.total : +new Date(order.placedAt));
    for (let i = 1; i < values.length; i++) {
      assert.ok(["newest", "highest"].includes(sort) ? values[i - 1] >= values[i] : values[i - 1] <= values[i]);
    }
  }
  assert.deepEqual(initialOrders, before);
});
test("search trims whitespace and handles no matches", () => {
  assert.equal(selectOrders(initialOrders, " #238 ", "All statuses", "newest")[0].id, "#238");
  assert.equal(selectOrders(initialOrders, "nonexistent", "All statuses", "newest").length, 0);
});
test("money uses numeric currency formatting", () => { assert.equal(money(1234.5), "$1,234.50"); });
test("month grid includes all days, Monday first, with complete weeks", () => {
  for (const [year, month] of [[2026, 9], [2024, 1], [2026, 1], [2026, 7], [2026, 11]]) {
    const result = calendarDates(new Date(year, month, 20), "Month");
    assert.equal(result[0].getDay(), 1);
    assert.equal(result.length % 7, 0);
    assert.equal(result.filter(date => date.getMonth() === month).length, new Date(year, month + 1, 0).getDate());
    assert.equal(new Set(result.map(dateKey)).size, result.length);
  }
});
test("six-week months do not truncate dates", () => {
  const result = calendarDates(new Date(2026, 7, 1), "Month");
  assert.equal(result.length, 42);
  assert.ok(result.some(date => dateKey(date) === "2026-08-31"));
});
test("week view crosses year boundaries correctly", () => {
  const result = calendarDates(new Date(2026, 0, 1), "Week");
  assert.deepEqual(result.map(dateKey), ["2025-12-29", "2025-12-30", "2025-12-31", "2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04"]);
});
test("day view returns exactly the selected date without mutating it", () => {
  const anchor = new Date(2026, 9, 27);
  const result = calendarDates(anchor, "Day");
  assert.equal(result.length, 1); assert.equal(dateKey(result[0]), "2026-10-27"); assert.notEqual(result[0], anchor);
});
test("month navigation from the 31st does not skip February", () => {
  assert.equal(dateKey(shiftCalendar(new Date(2026, 0, 31), "Month", 1)), "2026-02-01");
  assert.equal(dateKey(shiftCalendar(new Date(2026, 0, 31), "Month", -1)), "2025-12-01");
});
test("week and day navigation advance by the chosen interval", () => {
  const anchor = new Date(2026, 9, 27);
  assert.equal(dateKey(shiftCalendar(anchor, "Week", 1)), "2026-11-03");
  assert.equal(dateKey(shiftCalendar(anchor, "Day", -1)), "2026-10-26");
  assert.equal(dateKey(anchor), "2026-10-27");
});

test("store overview derives sales, delivery progress, and stock alerts from records", () => {
  const before = structuredClone(initialOrders);
  const result = api.storeOverview(initialOrders, [{ name: "Sold out", stock: 0 }, { name: "Low", stock: 5 }, { name: "Healthy", stock: 100 }]);
  assert.equal(result.totalOrders, 6);
  assert.equal(result.successfulOrders, 5);
  assert.equal(result.grossSales, 667);
  assert.equal(result.averageOrder, 133.4);
  assert.equal(result.delivered, 2);
  assert.equal(result.fulfilmentPercent, 40);
  assert.equal(result.processing, 2);
  assert.equal(result.stockAlerts.length, 2);
  assert.equal(result.outOfStock, 1);
  assert.equal(result.days.reduce((sum, day) => sum + day.sales, 0), result.grossSales);
  assert.equal(result.days.reduce((sum, day) => sum + day.orders, 0), result.totalOrders);
  assert.equal(result.latestSale.id, "#239");
  assert.deepEqual(initialOrders, before);
});
test("store overview handles an empty store without invalid percentages", () => {
  const result = api.storeOverview([], []);
  assert.equal(result.totalOrders, 0); assert.equal(result.grossSales, 0);
  assert.equal(result.averageOrder, 0); assert.equal(result.fulfilmentPercent, 0);
  assert.equal(result.latestSale, undefined); assert.equal(result.stockAlerts.length, 0);
});
