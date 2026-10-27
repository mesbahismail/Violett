export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type StoreOrder = { id: string; customer: string; email: string; address: string; placedAt: string; total: number; status: OrderStatus; product: string; quantity: number; payment: string };
export const initialOrders: StoreOrder[] = [
  { id: "#239", customer: "Alexa Lacruz", email: "alexa@example.com", address: "932 Saint Marys Avenue, Syracuse, NY 13202", placedAt: "2026-10-27T10:42:00", total: 178, status: "Processing", product: "Denim Jeans", quantity: 2, payment: "Visa •••• 0094" },
  { id: "#238", customer: "Samuel Davis", email: "sam@example.com", address: "8 Kane Road, Morgantown, PA 19543", placedAt: "2026-10-26T14:30:00", total: 195, status: "Delivered", product: "Chelsea Boots", quantity: 1, payment: "PayPal" },
  { id: "#237", customer: "Megan Bowen", email: "megan@example.com", address: "41 Madison Avenue, New York, NY 10010", placedAt: "2026-10-26T09:10:00", total: 130, status: "Shipped", product: "Colorful Shirt", quantity: 2, payment: "Visa •••• 4182" },
  { id: "#236", customer: "Sarah Morgan", email: "sarah@example.com", address: "27 Oak Street, Austin, TX 78701", placedAt: "2026-10-25T16:05:00", total: 75, status: "Delivered", product: "Texture Shirt", quantity: 1, payment: "Mastercard •••• 7153" },
  { id: "#235", customer: "Alexandria Cole", email: "alex@example.com", address: "19 Pine Street, Seattle, WA 98101", placedAt: "2026-10-24T11:45:00", total: 105, status: "Cancelled", product: "Classic T-Shirt", quantity: 3, payment: "PayPal" },
  { id: "#234", customer: "Daniel Kim", email: "daniel@example.com", address: "52 Market Street, San Francisco, CA 94103", placedAt: "2026-10-23T13:20:00", total: 89, status: "Processing", product: "Denim Jeans", quantity: 1, payment: "Visa •••• 8834" },
];
export type OrderSort = "newest" | "oldest" | "highest" | "lowest";
export function selectOrders(orders: StoreOrder[], search: string, status: string, sort: OrderSort) {
  const query = search.trim().toLowerCase();
  return orders.filter(order => (status === "All statuses" || order.status === status) && `${order.id} ${order.customer} ${order.email} ${order.product}`.toLowerCase().includes(query)).sort((a, b) => sort === "highest" ? b.total - a.total : sort === "lowest" ? a.total - b.total : sort === "oldest" ? +new Date(a.placedAt) - +new Date(b.placedAt) : +new Date(b.placedAt) - +new Date(a.placedAt));
}
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
export type TicketMessage = { id: string; body: string; sender: "customer" | "agent" };
export type Ticket = { id: string; customer: string; email: string; subject: string; status: "Open" | "Pending" | "Resolved"; priority: "Normal" | "High"; messages: TicketMessage[] };
export const initialTickets: Ticket[] = [
  { id: "T-1042", customer: "Sarah Morgan", email: "sarah@example.com", subject: "Where is my order?", status: "Open", priority: "High", messages: [{ id: "1", sender: "customer", body: "Hi! Could you help me check the delivery of order #236?" }, { id: "2", sender: "agent", body: "Of course, Sarah. I’m checking the delivery details for you." }, { id: "3", sender: "customer", body: "Thank you! The tracking link hasn’t updated yet." }] },
  { id: "T-1041", customer: "Megan Bowen", email: "megan@example.com", subject: "Exchange shirt size", status: "Pending", priority: "Normal", messages: [{ id: "1", sender: "customer", body: "Could I exchange my Colorful Shirt for a size L?" }] },
  { id: "T-1040", customer: "Daniel Kim", email: "daniel@example.com", subject: "Payment confirmation", status: "Open", priority: "Normal", messages: [{ id: "1", sender: "customer", body: "Can you confirm that my payment for #234 was received?" }] },
  { id: "T-1039", customer: "Samuel Davis", email: "sam@example.com", subject: "Thanks for your help", status: "Resolved", priority: "Normal", messages: [{ id: "1", sender: "customer", body: "Everything arrived today. Thank you for your help!" }, { id: "2", sender: "agent", body: "You’re very welcome. Enjoy your new boots!" }] },
];
export type CalendarMode = "Month" | "Week" | "Day";
export type StoreEvent = { id: string; title: string; date: string; time: string; kind: "promotion" | "payout" | "task" };
export const initialEvents: StoreEvent[] = [
  { id: "1", title: "Autumn promotion launches", date: "2026-10-27", time: "09:00", kind: "promotion" },
  { id: "2", title: "Review pending orders", date: "2026-10-27", time: "11:00", kind: "task" },
  { id: "3", title: "Weekly store payout", date: "2026-10-29", time: "10:00", kind: "payout" },
  { id: "4", title: "New collection photography", date: "2026-10-30", time: "14:00", kind: "task" },
  { id: "5", title: "November campaign planning", date: "2026-11-02", time: "12:00", kind: "promotion" },
];
export function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
export function calendarDates(anchor: Date, mode: CalendarMode) {
  if (mode === "Day") return [new Date(anchor)];
  const first = mode === "Month" ? new Date(anchor.getFullYear(), anchor.getMonth(), 1) : new Date(anchor);
  const offset = (first.getDay() + 6) % 7;
  first.setDate(first.getDate() - offset);
  const count = mode === "Week" ? 7 : Math.ceil((offset + new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate()) / 7) * 7;
  return Array.from({ length: count }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index));
}
export function shiftCalendar(anchor: Date, mode: CalendarMode, direction: number) {
  if (mode === "Month") return new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1);
  return new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + direction * (mode === "Week" ? 7 : 1));
}
