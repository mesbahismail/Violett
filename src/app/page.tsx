"use client";

import { Children, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { SidePanel } from "./components/side-panel";
import { initialOrders, initialTickets, initialEvents, selectOrders, money, dateKey, calendarDates, shiftCalendar, type StoreOrder, type OrderStatus, type OrderSort, type Ticket, type CalendarMode, type StoreEvent } from "./store-data";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Monitor,
  Package,
  Ticket as TicketIcon,
  Tag,
  TrendingUp,
  SlidersHorizontal,
  Send,
  Moon,
  ChartColumnIncreasing,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  CircleHelp,
  LayoutDashboard,
  LayoutGrid,
  List,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";

type Screen = "Dashboard" | "Analytics" | "Wallet" | "Products" | "Orders" | "Support tickets" | "Calendar" | "Settings";

const iconNav = [
  { title: "Dashboard" as Screen, icon: LayoutDashboard },
  { title: "Orders" as Screen, icon: List },
  { title: "Wallet" as Screen, icon: Wallet },
  { title: "Products" as Screen, icon: Package },
  { title: "Analytics" as Screen, icon: ChartColumnIncreasing },
  { title: "Support tickets" as Screen, icon: TicketIcon },
  { title: "Calendar" as Screen, icon: CalendarDays },
];

export default function Home() {
  const [navigation, setNavigation] = useState<{ entries: Screen[]; index: number }>({ entries: ["Dashboard"], index: 0 });
  const screen = navigation.entries[navigation.index];
  const canGoBack = navigation.index > 0;
  const canGoForward = navigation.index < navigation.entries.length - 1;
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(productData);
  const [orders, setOrders] = useState(initialOrders);
  const [tickets, setTickets] = useState(initialTickets);
  const [events, setEvents] = useState(initialEvents);
  const [tooltip, setTooltip] = useState<{ text: string; top: number } | null>(null);
  const [dialog, setDialog] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("Month");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const goTo = (nextScreen: Screen) => {
    setNavigation((current) => {
      if (current.entries[current.index] === nextScreen) return current;
      const entries = [...current.entries.slice(0, current.index + 1), nextScreen];
      return { entries, index: entries.length - 1 };
    });
    setSearch("");
    setTooltip(null);
    setMobileNavOpen(false);
    setProfileOpen(false);
    setNoticeOpen(false);
  };
  const navigateHistory = (direction: -1 | 1) => {
    setNavigation((current) => ({ ...current, index: Math.max(0, Math.min(current.entries.length - 1, current.index + direction)) }));
    setSearch("");
    setTooltip(null);
    setMobileNavOpen(false);
    setProfileOpen(false);
    setNoticeOpen(false);
  };

  const railHint = (text: string) => ({
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => setTooltip({ text, top: event.currentTarget.getBoundingClientRect().top + 8 }),
    onPointerLeave: () => setTooltip(null),
    onFocus: (event: React.FocusEvent<HTMLButtonElement>) => setTooltip({ text, top: event.currentTarget.getBoundingClientRect().top + 8 }),
    onBlur: () => setTooltip(null),
  });

  return (
    <main className={`violett-app ${darkMode ? "" : "light-mode"}`}>
      <header className="topbar">
        <button className="mobile-menu icon-button" aria-label="Toggle navigation" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
        <button className="flower-logo" aria-label="Violett home" onClick={() => goTo("Dashboard")}><Image src="/violett.svg" width={23} height={23} alt="" priority /></button>
        <div className="navbar-content">
          <nav className="history-navigation" aria-label="Page history">
            <button className="icon-button" aria-label="Go back" title="Go back" disabled={!canGoBack} onClick={() => navigateHistory(-1)}><ChevronLeft size={18} /></button>
            <span className="history-divider" aria-hidden="true" />
            <button className="icon-button" aria-label="Go forward" title="Go forward" disabled={!canGoForward} onClick={() => navigateHistory(1)}><ChevronRight size={18} /></button>
          </nav>
        <label className="top-search">
          <Search size={14} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={screen === "Orders" ? "Search by order, customer or product..." : screen === "Support tickets" ? "Search for messages..." : screen === "Products" ? "Search products..." : "Search your store..."} aria-label={screen === "Orders" ? "Search by order" : screen === "Support tickets" ? "Search for messages" : "Search your store"} />
        </label>
        <div className="top-actions">
          <button className="icon-button" aria-label="Support tickets" onClick={() => goTo("Support tickets")}><MessageSquare size={15} /></button>
          <div className="relative">
            <button className="icon-button has-indicator" aria-label="Activity" title="Activity" aria-expanded={noticeOpen} onClick={() => setNoticeOpen(!noticeOpen)}><Activity size={16} /><i aria-hidden="true" /></button>
            {noticeOpen && <div className="floating-menu notice-menu"><div className="menu-title">Store activity <button onClick={() => setNoticeOpen(false)} aria-label="Close"><X size={13} /></button></div><button className="notice-row" onClick={() => goTo("Orders")}><span className="round-icon pink"><ShoppingBag size={13} /></span><span><b>New order {orders[0].id}</b><small>{orders[0].customer} · {money(orders[0].total)}</small></span></button><button className="notice-row" onClick={() => goTo("Support tickets")}><span className="round-icon purple"><TicketIcon size={13} /></span><span><b>Support tickets</b><small>{tickets.filter(ticket => ticket.status !== "Resolved").length} conversations need attention</small></span></button><button className="notice-row" onClick={() => goTo("Calendar")}><span className="round-icon pink"><Tag size={13} /></span><span><b>Autumn promotion is live</b><small>View your store calendar</small></span></button></div>}

          </div>
          <button className="add-button" aria-label="Create new" onClick={() => setDialog("Create new")}><Plus size={16} /></button>

        </div>
        </div>
      </header>

      <aside className={`icon-rail ${mobileNavOpen ? "rail-open" : ""}`} aria-label="Main navigation">
        <div className="rail-links">
          {iconNav.map(({ title, icon: Icon }) => (
            <button key={title} className={`rail-button ${screen === title ? "rail-active" : ""}`} aria-label={title} {...railHint(title)} aria-current={screen === title ? "page" : undefined} onClick={() => goTo(title)}>
              <Icon size={16} strokeWidth={1.7} />{title === "Support tickets" && <i className="rail-dot" />}
            </button>
          ))}
        </div>
        <div className="rail-bottom">
          <button className={`rail-button ${screen === "Settings" ? "rail-active" : ""}`} aria-label="Settings" {...railHint("Settings")} onClick={() => goTo("Settings")}><Settings size={20} /></button>
          <button className="rail-button" aria-label="Help" {...railHint("Help")} onClick={() => { setTooltip(null); setDialog("Help"); setProfileOpen(false); }}><CircleHelp size={20} /></button>
          <div className="rail-profile">
            <button className="rail-button profile-button" aria-label="Open profile" aria-expanded={profileOpen} {...railHint("Profile")} onClick={() => { setTooltip(null); setProfileOpen(!profileOpen); }}><span className="profile-photo">BE</span></button>
            {profileOpen && <div className="floating-menu profile-menu"><div className="profile-card"><span className="profile-large">BE</span><b>Bradley Edmur</b><small>Chief Designer</small><span className="edit-tag">EDIT PROFILE</span></div><button onClick={() => { goTo("Settings"); }}>Settings <Settings size={13} /></button><button onClick={() => setDialog("Sign out")}>Sign out <LogOut size={13} /></button></div>}
          </div>
        </div>
      </aside>

      <div className="screen-content">
        {screen === "Dashboard" && <StoreDashboard orders={orders} tickets={tickets} onNavigate={goTo} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {screen === "Analytics" && <AnalyticsScreen orders={orders} onNavigate={goTo} />}
        {screen === "Wallet" && <WalletScreen products={products} />}
        {screen === "Products" && <ProductsScreen search={search} products={products} onCreate={(product) => setProducts((current) => [...current, product])} />}
        {screen === "Orders" && <OrdersScreen orders={orders} search={search} onUpdate={(updated) => setOrders((current) => current.map((order) => order.id === updated.id ? updated : order))} />}
        {screen === "Support tickets" && <SupportScreen search={search} tickets={tickets} onChange={setTickets} onClearSearch={() => setSearch("")} />}
        {screen === "Calendar" && <CalendarScreen mode={calendarMode} setMode={setCalendarMode} events={events} onChange={setEvents} />}
        {screen === "Settings" && <SettingsScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      {tooltip && createPortal(<span className="rail-tooltip" role="tooltip" style={{ top: tooltip.top }}>{tooltip.text}</span>, document.body)}
      {dialog && <Dialog title={dialog} onClose={() => setDialog("")} />}
    </main>
  );
}

function Workspace({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [header, ...content] = Children.toArray(children);
  return <section className={`workspace ${className}`}>{header}<div className="page-body">{content}</div></section>;
}

function ScreenTitle({ children, action, center }: { children: React.ReactNode; action?: React.ReactNode; center?: React.ReactNode }) {
  return <div className={`screen-title ${center ? "has-center-content" : ""}`}><h1>{children}</h1>{center && <div className="screen-title-center">{center}</div>}{action}</div>;
}

function StoreDashboard({ orders, tickets, onNavigate, darkMode, setDarkMode }: { orders: StoreOrder[]; tickets: Ticket[]; onNavigate: (screen: Screen) => void; darkMode: boolean; setDarkMode: (mode: boolean) => void }) {
  return (
    <Workspace className="home-workspace">
      <ScreenTitle action={<HomeCalendarDropdown onNavigate={onNavigate} />}>Morning, Violett</ScreenTitle>
      <div className="home-board">
        <div className="widget-column">
          <article className="tile store-activity-tile">
            <HomeWidgetHead title="Activity" icon={<Activity />} destination="Orders" onNavigate={onNavigate} />
            <div className="store-activity-feed">
              {orders.slice(0, 2).map((order) => <button key={order.id} onClick={() => onNavigate("Orders")}><span className="feed-icon"><ShoppingBag size={16} /></span><span><b>New order {order.id}</b><small>{order.customer} · {money(order.total)}</small></span><time>Just now</time></button>)}
              <button onClick={() => onNavigate("Calendar")}><span className="feed-icon"><Tag size={16} /></span><span><b>Autumn promotion is live</b><small>20% off selected collections</small></span><time>1h ago</time></button>
              <button onClick={() => onNavigate("Support tickets")}><span className="feed-icon"><TicketIcon size={16} /></span><span><b>{tickets.filter(ticket => ticket.status !== "Resolved").length} tickets need attention</b><small>Keep your customers up to date</small></span><time>Today</time></button>
            </div>
          </article>
          <article className="tile visits-tile">
            <HomeWidgetHead title="Visits" icon={<ChartColumnIncreasing />} destination="Analytics" onNavigate={onNavigate} />
            <div className="visits-summary"><strong>8,492</strong><span>+18% <small>This week</small></span></div>
            <div className="visits-bars" role="img" aria-label="Daily visits: Monday 520, Tuesday 740, Wednesday 630, Thursday 980, Friday 820, Saturday 1120, Sunday 940">
              {[{ day: "Mon", value: 520 }, { day: "Tue", value: 740 }, { day: "Wed", value: 630 }, { day: "Thu", value: 980 }, { day: "Fri", value: 820 }, { day: "Sat", value: 1120 }, { day: "Sun", value: 940 }].map(({ day, value }) => <div className="visits-bar-column" key={day}><div className="visits-bar-track"><i style={{ height: `${value / 12}%` }} /></div><span>{day}</span></div>)}
            </div>
          </article>
        </div>
        <div className="widget-column">
          <article className="tile gradient-tile">
            <HomeWidgetHead title="Desktop users" icon={<Monitor />} />
            <div className="desktop-breakdown"><div className="pie-chart" /><div><strong>35%</strong><small>Of all visitors</small></div></div>
          </article>
          <article className="tile earnings-tile">
            <HomeWidgetHead title="Revenue" icon={<CreditCard />} destination="Wallet" onNavigate={onNavigate} />
            <div className="earnings-content"><b className="earnings-amount">$12,487</b><small className="tile-caption">+$864 compared to last month</small></div>
            <MiniChart />
            <span className="revenue-change">↗ +24%<small>This month</small></span>
          </article>
        </div>
        <div className="widget-column funds-column">
          <article className="tile funds-tile">
            <HomeWidgetHead title="Funds" icon={<Wallet />} destination="Wallet" onNavigate={onNavigate} />
            <div className="funds-head"><span>Funds Mngr.</span><span>26 Oct<small>Today</small></span></div>
            <MiniChart />
            <div className="funds-stats"><span><i className="ring pink-ring" /><b>+13%</b><small>Earnings</small></span><span><i className="ring gray-ring" /><b>-28%</b><small>Expenses</small></span></div>
          </article>
          <div className="bottom-widget-pair">
            <article className="tile sale-tile">
              <HomeWidgetHead title="Sales" icon={<ShoppingBag />} destination="Orders" onNavigate={onNavigate} />
              <div className="compact-tile-content"><strong>New Sale!</strong><small>Alexandria</small></div>
            </article>
            <article className="tile dark-mode-tile">
              <HomeWidgetHead title="Dark mode" icon={<Moon />} />
              <div className="compact-tile-content"><small>{darkMode ? "Enabled" : "Disabled"}</small></div>
              <button className={`toggle ${darkMode ? "toggle-on" : ""}`} role="switch" aria-checked={darkMode} aria-label="Toggle dark mode" onClick={() => setDarkMode(!darkMode)}><i /></button>
            </article>
          </div>
        </div>
      </div>
    </Workspace>
  );
}

function HomeCalendarDropdown({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const dropdown = useRef<HTMLDetailsElement>(null);
  const [today] = useState(() => {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const part = (type: string) => Number(parts.find((entry) => entry.type === type)?.value);
    return new Date(part("year"), part("month") - 1, part("day"));
  });
  const [range, setRange] = useState({ start: today, end: today });
  const [preset, setPreset] = useState("Today");
  const [pickingEnd, setPickingEnd] = useState(false);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const formatDate = (date: Date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const moveDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  const presets = ["Today", "Last 24 hours", "Yesterday", "Last 7 days", "Last week", "Last 30 days", "This month", "Last month"];

  useEffect(() => {
    const close = (event: PointerEvent) => { if (event.target instanceof Node && !dropdown.current?.contains(event.target)) dropdown.current?.removeAttribute("open"); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { dropdown.current?.removeAttribute("open"); dropdown.current?.querySelector("summary")?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const selectPreset = (label: string) => {
    let start = today;
    let end = today;
    if (label === "Last 24 hours") start = moveDays(today, -1);
    if (label === "Yesterday") start = end = moveDays(today, -1);
    if (label === "Last 7 days") start = moveDays(today, -6);
    if (label === "Last 30 days") start = moveDays(today, -29);
    if (label === "Last week") {
      const monday = moveDays(today, -((today.getDay() + 6) % 7));
      start = moveDays(monday, -7); end = moveDays(monday, -1);
    }
    if (label === "This month") start = new Date(today.getFullYear(), today.getMonth(), 1);
    if (label === "Last month") { start = new Date(today.getFullYear(), today.getMonth() - 1, 1); end = new Date(today.getFullYear(), today.getMonth(), 0); }
    setRange({ start, end }); setPreset(label); setPickingEnd(false);
    setMonth(new Date(end.getFullYear(), end.getMonth() - 1, 1));
  };
  const selectDate = (date: Date) => {
    setPreset("Custom range");
    if (!pickingEnd) { setRange({ start: date, end: date }); setPickingEnd(true); }
    else { setRange({ start: date < range.start ? date : range.start, end: date < range.start ? range.start : date }); setPickingEnd(false); }
  };

  return <details className="home-calendar-dropdown" ref={dropdown}>
    <summary><CalendarDays size={16} /><span>{preset === "Custom range" ? `${formatDate(range.start)} – ${formatDate(range.end)}` : preset}</span><ChevronDown size={14} /></summary>
    <div className="home-calendar-popover range-calendar-popover" aria-label="Choose date range">
      <div className="range-calendar-content">
        <div className="dual-calendars">
          {[0, 1].map((offset) => {
            const displayMonth = new Date(month.getFullYear(), month.getMonth() + offset, 1);
            const firstWeekday = (displayMonth.getDay() + 6) % 7;
            const count = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
            return <section className="range-calendar-month" key={offset} aria-label={displayMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}>
              <div className="home-calendar-month">
                {offset === 0 ? <button aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={16} /></button> : <span className="calendar-nav-spacer" />}
                <strong>{displayMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>
                {offset === 1 ? <button aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={16} /></button> : <span className="calendar-nav-spacer" />}
              </div>
              <div className="home-calendar-dates">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span className="home-calendar-weekday" key={index}>{day}</span>)}
                {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
                {Array.from({ length: count }, (_, index) => {
                  const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), index + 1);
                  const endpoint = +date === +range.start || +date === +range.end;
                  const inside = date > range.start && date < range.end;
                  return <button key={index} className={`${endpoint ? "date-selected" : inside ? "date-in-range" : ""} ${+date === +today ? "date-today" : ""}`} aria-pressed={endpoint || inside} aria-label={date.toLocaleDateString("en-GB", { dateStyle: "full" })} onClick={() => selectDate(date)}>{index + 1}</button>;
                })}
              </div>
            </section>;
          })}
        </div>
        <aside className="date-range-presets" aria-label="Quick date ranges">
          {presets.map((label) => <button key={label} className={preset === label ? "preset-selected" : ""} aria-pressed={preset === label} onClick={() => selectPreset(label)}>{label}{preset === label && <Check size={14} />}</button>)}
          <button className={preset === "Custom range" ? "preset-selected" : ""} aria-pressed={preset === "Custom range"} onClick={() => { setPreset("Custom range"); setPickingEnd(false); }}>Custom range</button>
        </aside>
      </div>
      <div className="date-range-footer">
        <span aria-live="polite">{pickingEnd ? "Choose an end date" : `${formatDate(range.start)} – ${formatDate(range.end)}`}</span>
        <button className="date-range-open" onClick={() => onNavigate("Calendar")} aria-label="Open calendar page"><CalendarDays size={16} /></button>
        <button className="date-range-apply" onClick={() => { setPickingEnd(false); dropdown.current?.removeAttribute("open"); }}>Apply</button>
      </div>
    </div>
  </details>;
}

function HomeWidgetHead({ title, icon, destination, onNavigate }: { title: string; icon: React.ReactNode; destination?: Screen; onNavigate?: (screen: Screen) => void }) {
  return <div className="board-widget-head">
    <h2><span className="widget-title-icon" aria-hidden="true">{icon}</span><span>{title}</span></h2>
    {destination && onNavigate && <button aria-label={`Open ${title} in ${destination}`} title={`Open ${destination}`} onClick={() => onNavigate(destination)}><ArrowUpRight size={18} /></button>}
  </div>;
}

function MiniChart() {
  return <svg className="mini-chart" viewBox="0 0 170 60" aria-label="Funds management trend"><path d="M1 48 C18 45 26 37 39 38 S62 22 75 28 S94 10 109 18 S126 37 139 33 S153 48 169 53" fill="none" stroke="#ce4cb5" strokeWidth="1.5" /><circle cx="109" cy="18" r="2.5" fill="#df65d0" /></svg>;
}

function AnalyticsScreen({ orders, onNavigate }: { orders: StoreOrder[]; onNavigate: (screen: Screen) => void }) {
  return <Workspace>
    <ScreenTitle action={<HomeCalendarDropdown onNavigate={onNavigate} />}>Analytics</ScreenTitle>
    <div className="analytics-layout">
      <article className="widget store-stats"><WidgetHead title="Store visits" icon={<ChartColumnIncreasing size={16} />} /><div className="widget-title-row"><span>8,492 visits</span><span className="metric-change">+18%<small>This week</small></span></div><div className="bar-chart"><div className="bar-grid"><i /><i /><i /><i /></div><div className="bar purple-bar" /><div className="bar pink-bar" /></div><div className="chart-legend"><span><i className="legend-line pink-line" />76% Organic search</span><span><i className="legend-line gray-line" />24% Other sources</span></div></article>
      <article className="widget sales-widget"><WidgetHead title="Recent sales" icon={<ShoppingBag size={16} />} /><div className="analytics-sales-list">{orders.filter(order => order.status !== "Cancelled").map(order => <div className="sale-row" key={order.id}><div><b>{order.customer}</b><small>{order.product} · {order.id}</small><em>{order.payment.split(" ")[0]}</em></div><strong>{money(order.total)}</strong></div>)}</div></article>
      <article className="widget analytics-small"><WidgetHead title="Sales over time" icon={<TrendingUp size={16} />} /><div className="chart-summary"><strong>$12,487</strong><span className="metric-change">+24% this month</span></div><TrendChart /><div className="chart-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></article>
      <article className="widget analytics-small"><WidgetHead title="Purchase times" icon={<Activity size={16} />} /><div className="chart-summary"><strong>14:00–18:00</strong><span>Peak hours</span></div><div className="purchase-hours" role="img" aria-label="Purchases peak between 2 PM and 6 PM">{[8, 5, 10, 22, 45, 68, 85, 96, 88, 64, 38, 18].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="chart-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div></article>
    </div>
  </Workspace>;
}

function TrendChart({ area = false, flat = false }: { area?: boolean; flat?: boolean }) {
  const id = useId();
  return <svg className="store-trend-chart" viewBox="0 0 480 160" preserveAspectRatio="none" role="img" aria-label={flat ? "No sales yet" : "Sales trend"}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dc4ac4" stopOpacity=".6" /><stop offset="1" stopColor="#a647dd" stopOpacity=".03" /></linearGradient></defs>{[40, 80, 120, 159].map(y => <path key={y} d={`M0 ${y}H480`} stroke="#ffffff0a" />)}{area && !flat && <path d="M0 130 C30 140 50 88 85 104 S140 25 185 40 S245 85 290 58 S350 98 380 45 S435 65 480 20 V160 H0Z" fill={`url(#${id})`} />}<path d={flat ? "M0 155H480" : "M0 130 C30 140 50 88 85 104 S140 25 185 40 S245 85 290 58 S350 98 380 45 S435 65 480 20"} fill="none" stroke="#d94dc6" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
}

function WidgetHead({ title, icon = <Activity size={16} />, action }: { title: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return <div className="store-widget-head"><h2>{icon}<span>{title}</span></h2>{action}</div>;
}

function WalletScreen({ products }: { products: Product[] }) {
  const best = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  return <Workspace><ScreenTitle>Wallet</ScreenTitle><div className="wallet-store-layout">
    <article className="widget wallet-balance"><WidgetHead title="Balance" icon={<Wallet size={16} />} /><strong className="store-balance-number">$372,941<span>.00</span></strong><small className="metric-change">+7% compared to last week</small><TrendChart area /><div className="chart-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div className="wallet-balance-legend"><span><i />Income <b>+11%</b></span><span><i />Expenses <b>−23%</b></span></div></article>
    <article className="widget best-products"><WidgetHead title="Best performing products" icon={<Package size={16} />} /><div className="best-products-list">{best.map((product, index) => <div className="best-product" key={product.name}><div><span><small>{String(index + 1).padStart(2, "0")}</small>{product.name}</span><b>{money(product.sales)}</b></div><div className="horizontal-bar"><i style={{ width: `${best[0].sales ? product.sales / best[0].sales * 100 : 0}%` }} /></div></div>)}</div></article>
    <article className="widget wallet-performance"><WidgetHead title="Performance" icon={<ChartColumnIncreasing size={16} />} /><div className="balance-bottom"><div><strong>$78,192</strong><small>+12% last month</small></div><span>This month</span></div><div className="wallet-bars">{[22, 38, 29, 48, 34, 57, 39, 68, 51, 74, 43, 61, 82, 57, 68].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="chart-legend"><span><i className="legend-line pink-line" />67% Income</span><span><i className="legend-line gray-line" />33% Expenses</span></div></article>
    <article className="widget payout-history"><WidgetHead title="Payout history" icon={<CreditCard size={16} />} /><div className="payout-list">{[{ date: "26 Oct 2026", amount: 2840, status: "Paid" }, { date: "19 Oct 2026", amount: 3195, status: "Paid" }, { date: "12 Oct 2026", amount: 2450, status: "Paid" }].map(payout => <div className="payout-row" key={payout.date}><span className="feed-icon"><ArrowUpRight size={16} /></span><span><b>Store payout</b><small>{payout.date} · Bank •••• 0094</small></span><span><b>{money(payout.amount)}</b><small className="metric-change">{payout.status}</small></span></div>)}</div></article>
  </div></Workspace>;
}

const productData = [
  { name: "Denim Jeans", type: "Men. Pants", color: "jeans", stock: 278, orders: 157, sales: 31491, sizes: "44 — 52", price: "$89" },
  { name: "Colorful Shirt", type: "Men. Tops", color: "shirt", stock: 124, orders: 86, sales: 12840, sizes: "M, L, XL", price: "$65" },
  { name: "Texture Shirt", type: "Men. Shirts", color: "texture", stock: 0, orders: 203, sales: 24765, sizes: "M, L, XL, XXL", price: "$75" },
  { name: "Chelsea Boots", type: "Men. Shoes", color: "boots", stock: 84, orders: 96, sales: 18720, sizes: "40 — 46", price: "$195" },
  { name: "Classic T-Shirt", type: "Men. Basics", color: "tee", stock: 192, orders: 118, sales: 8260, sizes: "S, M, L, XL", price: "$35" },
];

type Product = (typeof productData)[number];

function ProductsScreen({ search, products, onCreate }: { search: string; products: Product[]; onCreate: (product: Product) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState("popular");
  const product = products.find(item => item.name === selected);
  const visible = products.filter(item => `${item.name} ${item.type}`.toLowerCase().includes(search.toLowerCase()) && (stockFilter === "all" || (stockFilter === "in" ? item.stock > 0 : item.stock === 0))).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "price" ? Number(a.price.replace(/[^0-9.]/g, "")) - Number(b.price.replace(/[^0-9.]/g, "")) : b.sales - a.sales);
  return <Workspace><ScreenTitle action={<div className="product-toolbar store-toolbar">
    <div className="product-view-toggle" role="group" aria-label="Product view"><button className={view === "grid" ? "view-selected" : ""} aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={16} /></button><button className={view === "list" ? "view-selected" : ""} aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={16} /></button></div>
    <details className="product-filter-dropdown"><summary className="secondary-button"><SlidersHorizontal size={16} /><span>Filters{stockFilter !== "all" ? " (1)" : ""}</span></summary><div className="product-filter-menu"><label>Availability<select value={stockFilter} onChange={event => setStockFilter(event.target.value)}><option value="all">All products</option><option value="in">In stock</option><option value="out">Out of stock</option></select></label><label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="popular">Best selling</option><option value="name">Name A–Z</option><option value="price">Price: low to high</option></select></label><button className="text-button" onClick={() => { setStockFilter("all"); setSort("popular"); }}>Reset filters</button></div></details>
    <button className="primary-button" onClick={() => setCreateOpen(true)}><Plus size={16} /><span>New product</span></button>
  </div>}>Products</ScreenTitle>
    <div className={`products-collection products-${view}`}>
      {visible.map(item => <article className={`catalog-product ${selected === item.name ? "product-active" : ""}`} key={item.name}>
        <button className={`product-image ${item.color}`} aria-label={`View ${item.name}`} onClick={() => setSelected(item.name)}><ProductIllustration kind={item.color} /><span className="edit-round"><ArrowUpRight size={14} /></span></button>
        <div className="catalog-product-info"><button className="product-name-button" onClick={() => setSelected(item.name)}>{item.name}</button><small>{item.type}</small><div className="catalog-product-options"><span className="product-swatches" aria-label="Available colors"><i /><i /><i /></span><span>{item.sizes || "One size"}</span></div></div>
        <div className="catalog-product-stock"><span className={`inventory ${item.stock > 0 ? "in-stock" : "out-stock"}`}>{item.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}</span></div><span className="catalog-product-price">{item.price}</span>
        <button className="product-stats-trigger" aria-label={`View ${item.name} details`} onClick={() => setSelected(item.name)}><ArrowUpRight size={16} /></button>
      </article>)}
      {!visible.length && <div className="store-empty"><Package size={28} /><h2>No products found</h2><p>Try another search or reset your filters.</p><button className="secondary-button" onClick={() => { setStockFilter("all"); setSort("popular"); }}>Reset filters</button></div>}
    </div>
    {createOpen && <NewProductDialog products={products} onClose={() => setCreateOpen(false)} onCreate={item => { onCreate(item); setCreateOpen(false); }} />}
    {product && <SidePanel title={product.name} subtitle="Product details" onClose={() => setSelected(null)}>
      <div className={`product-detail-art product-image ${product.color}`}><ProductIllustration kind={product.color} /></div>
      <div className="detail-heading"><div><h3>{product.name}</h3><small>{product.type}</small></div><strong>{product.price}</strong></div>
      <div className="detail-data-grid"><span>Availability<b className={product.stock > 0 ? "metric-change" : "negative"}>{product.stock > 0 ? "In stock" : "Out of stock"}</b></span><span>Sizes<b>{product.sizes || "One size"}</b></span></div>
      <div className="product-stats-kpis"><span><b>{product.stock.toLocaleString("en-US")}</b><small>In stock</small></span><span><b>{product.orders.toLocaleString("en-US")}</b><small>Orders</small></span><span><b>{product.sales.toLocaleString("en-US")}</b><small>Sales</small></span></div>
      <WidgetHead title="Earning history" icon={<TrendingUp size={16} />} /><div className="product-stats-range">Last 6 months<small>Total sales: {money(product.sales)}</small></div><TrendChart area flat={product.sales === 0} /><div className="chart-axis"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
    </SidePanel>}
  </Workspace>;
}

function NewProductDialog({ products, onClose, onCreate }: { products: Product[]; onClose: () => void; onCreate: (product: Product) => void }) {
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    form.current?.querySelector<HTMLInputElement>("input")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = form.current?.querySelectorAll<HTMLElement>("input, select, button");
        if (!elements?.length) return;
        const first = elements[0]; const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previousFocus?.focus(); };
  }, [onClose]);
  return createPortal(<div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <form className="dialog new-product-dialog" ref={form} role="dialog" aria-modal="true" aria-labelledby="new-product-title" onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = String(data.get("name")).trim();
      const input = event.currentTarget.elements.namedItem("name") as HTMLInputElement;
      if (!name || products.some((product) => product.name.toLowerCase() === name.toLowerCase())) { input.setCustomValidity(name ? "A product with this name already exists." : "Enter a product name."); input.reportValidity(); return; }
      onCreate({ name, type: String(data.get("category")).trim(), price: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(data.get("price"))), stock: Number(data.get("stock")), sizes: String(data.get("sizes")).trim(), color: String(data.get("style")), orders: 0, sales: 0 });
    }}>
      <div className="dialog-head"><h2 id="new-product-title">New product</h2><button type="button" aria-label="Close new product" onClick={onClose}><X size={18} /></button></div>
      <div className="new-product-fields">
        <label>Product name<input name="name" placeholder="e.g. Classic T-Shirt" required maxLength={80} onInput={(event) => event.currentTarget.setCustomValidity("")} /></label>
        <label>Category<input name="category" placeholder="e.g. Men. Basics" required maxLength={60} /></label>
        <div className="new-product-field-row"><label>Price (USD)<input name="price" type="number" min="0" step="0.01" placeholder="0.00" required /></label><label>Stock quantity<input name="stock" type="number" min="0" step="1" defaultValue="0" required /></label></div>
        <label>Sizes<input name="sizes" placeholder="S, M, L, XL" maxLength={60} /></label>
        <label>Product style<select name="style" defaultValue="tee"><option value="tee">T-shirt</option><option value="shirt">Colorful shirt</option><option value="texture">Texture shirt</option><option value="jeans">Jeans</option><option value="boots">Boots</option></select></label>
      </div>
      <div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button className="confirm-action" type="submit">Create product</button></div>
    </form>
  </div>, document.body);
}

function ProductIllustration({ kind }: { kind: string }) {
  if (kind === "boots") return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M38 12h31l-2 42 21 15q10 8 4 17H14q-6-16 11-26l8-5z" fill="#5a4536" stroke="#382c24" strokeWidth="2"/><path d="M46 16h15l-1 35H43z" fill="#322a26"/><path d="M14 82h78v7H14z" fill="#282321"/></svg>;
  if (kind === "jeans") return <svg viewBox="0 0 80 110" aria-hidden="true"><path d="M22 9h36l9 84-20 4-7-49-7 49-20-4z" fill="#467db5" stroke="#315f8a" strokeWidth="2" /><path d="M23 18h35M39 10v12M29 22l8 6m14-6-8 6" fill="none" stroke="#92b9d8" strokeWidth="2" /><path d="m23 38 12 4m10-4 12 4M19 84h17m9 0h19" stroke="#366d9d" strokeWidth="2" /></svg>;
  return <svg viewBox="0 0 90 100" aria-hidden="true"><path d="m26 17 15-7 8 7 11-2 17 12-10 15-8-5 2 45H29l2-45-8 5-10-15z" fill={kind === "shirt" ? "#8f7549" : "#34343a"} stroke={kind === "shirt" ? "#705a39" : "#222226"} strokeWidth="2" /><path d="m41 10 7 7-5 12 8 10-7 5-11-27m16 0 8 29" fill="none" stroke="#b6a486" strokeWidth="2" /></svg>;
}

function OrdersScreen({ orders, search, onUpdate }: { orders: StoreOrder[]; search: string; onUpdate: (order: StoreOrder) => void }) {
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState<OrderSort>("newest");
  const [selected, setSelected] = useState<string | null>(null);
  const [addressTab, setAddressTab] = useState("Shipping");
  const visible = selectOrders(orders, search, status, sort);
  const order = orders.find(item => item.id === selected);
  return <Workspace><ScreenTitle action={<div className="store-toolbar"><label className="select-button"><span className="sr-only">Order status</span><select aria-label="Order status" value={status} onChange={event => setStatus(event.target.value)}>{["All statuses", "Processing", "Shipped", "Delivered", "Cancelled"].map(value => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></label><label className="select-button"><span className="sr-only">Sort orders</span><select aria-label="Sort orders" value={sort} onChange={event => setSort(event.target.value as OrderSort)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest total</option><option value="lowest">Lowest total</option></select><ChevronDown size={14} /></label></div>}>Orders</ScreenTitle>
    <div className="store-orders-table"><div className="store-order-header"><span>Order / customer</span><span>Status</span><span>Date</span><span>Total</span><span /></div><div className="store-order-list">{visible.map(item => <button className="store-order-row" key={item.id} onClick={() => { setSelected(item.id); setAddressTab("Shipping"); }}><span><b>Order {item.id}</b><small>{item.customer}</small><small>{item.email}</small></span><span><em className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</em></span><time dateTime={item.placedAt}>{new Date(item.placedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time><b>{money(item.total)}</b><ArrowUpRight size={16} /></button>)}{!visible.length && <div className="store-empty"><List size={28} /><h2>No orders found</h2><p>Try another search or status.</p></div>}</div></div>
    {order && <SidePanel title={`Order ${order.id}`} subtitle={new Date(order.placedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} onClose={() => setSelected(null)}>
      <div className="detail-heading"><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span><strong>{money(order.total)}</strong></div>
      <div className="detail-section"><h3>Items</h3><div className="order-product-detail"><span className="order-item-icon"><Package size={24} /></span><div><b>{order.product}</b><small>Quantity {order.quantity}</small></div><b>{money(order.total)}</b></div><dl className="order-summary"><div><dt>Subtotal</dt><dd>{money(order.total)}</dd></div><div><dt>Shipping</dt><dd>Free</dd></div><div><dt>Total paid</dt><dd>{money(order.total)}</dd></div></dl></div>
      <div className="detail-section"><h3>Customer</h3><b>{order.customer}</b><a href={`mailto:${order.email}`}>{order.email}</a></div>
      <div className="detail-tabs" role="tablist" aria-label="Customer address">{["Shipping", "Billing"].map(tab => <button key={tab} role="tab" aria-selected={addressTab === tab} className={addressTab === tab ? "selected" : ""} onClick={() => setAddressTab(tab)}>{tab}</button>)}</div><div className="detail-section" role="tabpanel" aria-label={`${addressTab} address`}><h3>{addressTab} address</h3><p>{order.customer}<br />{order.address}</p>{addressTab === "Billing" && <small>Payment: {order.payment}</small>}</div>
      <div className="detail-section"><h3>Fulfilment</h3><label className="form-label">Order status<select value={order.status} onChange={event => onUpdate({ ...order, status: event.target.value as OrderStatus })}>{["Processing", "Shipped", "Delivered", "Cancelled"].map(value => <option key={value}>{value}</option>)}</select></label><p className="detail-note">Status changes appear immediately in the orders list.</p></div>
    </SidePanel>}
  </Workspace>;
}

function SupportScreen({ search, tickets, onChange, onClearSearch }: { search: string; tickets: Ticket[]; onChange: (tickets: Ticket[]) => void; onClearSearch: () => void }) {
  const [selected, setSelected] = useState(tickets[0]?.id ?? "");
  const [status, setStatus] = useState("All tickets");
  const [localSearch, setLocalSearch] = useState("");
  const [reply, setReply] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const messages = useRef<HTMLDivElement>(null);
  const visible = tickets.filter(ticket => (status === "All tickets" || ticket.status === status) && [search, localSearch].every(query => `${ticket.id} ${ticket.customer} ${ticket.email} ${ticket.subject} ${ticket.messages.map(message => message.body).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())));
  const ticket = visible.find(item => item.id === selected) ?? visible[0];
  const update = (updated: Ticket) => onChange(tickets.map(item => item.id === updated.id ? updated : item));
  useEffect(() => { if (messages.current) messages.current.scrollTop = messages.current.scrollHeight; }, [ticket?.id, ticket?.messages.length]);
  return <Workspace><ScreenTitle action={<div className="store-toolbar"><label className="select-button"><select aria-label="Ticket status filter" value={status} onChange={event => setStatus(event.target.value)}>{["All tickets", "Open", "Pending", "Resolved"].map(value => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></label><button className="primary-button" onClick={() => setCreateOpen(true)}><Plus size={16} /><span>New ticket</span></button></div>}>Support tickets</ScreenTitle>
    <div className="support-layout"><aside className="support-conversations"><label className="support-list-search"><Search size={14} /><input value={localSearch} onChange={event => setLocalSearch(event.target.value)} placeholder="Search tickets" aria-label="Search ticket list" /></label><div className="support-list-heading"><span>Conversations</span><small>{visible.length}</small></div><div className="support-ticket-list">{visible.map(item => <button className={`support-ticket ${ticket?.id === item.id ? "ticket-selected" : ""}`} key={item.id} onClick={() => { setSelected(item.id); setReply(""); }}><span className="person-pic">{item.customer.split(" ").map(name => name[0]).join("")}</span><span><b>{item.customer}</b><small>{item.subject}</small><em>{item.id} · {item.status}</em></span>{item.priority === "High" && <i className="ticket-priority-dot" aria-label="High priority" />}</button>)}{!visible.length && <div className="store-empty"><TicketIcon size={24} /><p>No matching tickets.</p></div>}</div></aside>
      {ticket ? <section className="support-conversation"><header className="support-chat-head"><div><span>{ticket.id} · {ticket.priority} priority</span><h2>{ticket.subject}</h2><small>{ticket.customer} · {ticket.email}</small></div><label className="select-button"><select aria-label="Ticket status" value={ticket.status} onChange={event => update({ ...ticket, status: event.target.value as Ticket["status"] })}>{["Open", "Pending", "Resolved"].map(value => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></label></header>
        <div className="support-chat-messages" ref={messages} aria-live="polite">{ticket.messages.map(message => <div className={`support-message message-${message.sender}`} key={message.id}><small>{message.sender === "agent" ? "You" : ticket.customer}</small><p>{message.body}</p></div>)}</div>
        <form className="support-reply" onSubmit={event => { event.preventDefault(); if (!reply.trim()) return; update({ ...ticket, status: ticket.status === "Resolved" ? "Open" : ticket.status, messages: [...ticket.messages, { id: crypto.randomUUID(), sender: "agent", body: reply.trim() }] }); setReply(""); }}><label className="sr-only" htmlFor="ticket-reply">Reply to {ticket.customer}</label><textarea id="ticket-reply" placeholder="Write a reply…" value={reply} onChange={event => setReply(event.target.value)} rows={2} /><div><small>Reply to {ticket.customer.split(" ")[0]}</small><button className="primary-button" disabled={!reply.trim()} type="submit"><Send size={14} />Send reply</button></div></form>
      </section> : <section className="support-conversation store-empty"><MessageSquare size={32} /><h2>No conversation selected</h2><p>Choose a ticket or create a new one.</p></section>}
    </div>
    {createOpen && <SidePanel title="New ticket" subtitle="Start a customer support conversation" onClose={() => setCreateOpen(false)}><form className="store-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const newTicket: Ticket = { id: `T-${Math.max(1042, ...tickets.map(item => Number(item.id.slice(2)))) + 1}`, customer: String(data.get("customer")).trim(), email: String(data.get("email")).trim(), subject: String(data.get("subject")).trim(), priority: data.get("priority") as Ticket["priority"], status: "Open", messages: [{ id: crypto.randomUUID(), sender: "agent", body: String(data.get("message")).trim() }] }; if (!newTicket.customer || !newTicket.subject || !newTicket.messages[0].body) return; onChange([newTicket, ...tickets]); onClearSearch(); setSelected(newTicket.id); setStatus("All tickets"); setLocalSearch(""); setCreateOpen(false); }}><label>Customer name<input name="customer" required maxLength={80} /></label><label>Email address<input name="email" type="email" required /></label><label>Subject<input name="subject" required maxLength={140} /></label><label>Priority<select name="priority"><option>Normal</option><option>High</option></select></label><label>Message<textarea name="message" rows={5} required /></label><button className="primary-button" type="submit"><Plus size={16} />Create ticket</button></form></SidePanel>}
  </Workspace>;
}

function CalendarScreen({ mode, setMode, events, onChange }: { mode: CalendarMode; setMode: (mode: CalendarMode) => void; events: StoreEvent[]; onChange: (events: StoreEvent[]) => void }) {
  const [anchor, setAnchor] = useState(() => { const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); });
  const [createOpen, setCreateOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(dateKey(anchor));
  const [selectedEvent, setSelectedEvent] = useState<StoreEvent | null>(null);
  const dates = calendarDates(anchor, mode);
  const label = mode === "Day" ? anchor.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : mode === "Week" ? `${dates[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${dates[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : anchor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const addEvent = (date: string) => { setDraftDate(date); setCreateOpen(true); };
  return <Workspace><ScreenTitle center={<div className="calendar-center-navigation"><button className="icon-button" aria-label={`Previous ${mode.toLowerCase()}`} onClick={() => setAnchor(shiftCalendar(anchor, mode, -1))}><ChevronLeft size={18} /></button><span>{label}</span><button className="icon-button" aria-label={`Next ${mode.toLowerCase()}`} onClick={() => setAnchor(shiftCalendar(anchor, mode, 1))}><ChevronRight size={18} /></button></div>} action={<div className="store-toolbar"><label className="select-button"><select aria-label="Calendar view" value={mode} onChange={event => setMode(event.target.value as CalendarMode)}>{["Month", "Week", "Day"].map(value => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></label><button className="primary-button" onClick={() => addEvent(dateKey(anchor))}><Plus size={16} /><span>Add event</span></button></div>}>Calendar</ScreenTitle>
    {mode === "Month" ? <div className="store-calendar"><div className="store-calendar-weekdays">{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => <span key={day}>{day}</span>)}</div><div className="store-calendar-month-grid" style={{ gridTemplateRows: `repeat(${dates.length / 7}, minmax(88px, 1fr))` }}>{dates.map(date => <div className={`store-calendar-cell ${date.getMonth() !== anchor.getMonth() ? "outside-month" : ""} ${dateKey(date) === dateKey(anchor) ? "calendar-anchor" : ""}`} key={dateKey(date)}><button className="calendar-date-number" aria-label={`Add event on ${date.toLocaleDateString("en-GB", { dateStyle: "full" })}`} onClick={() => addEvent(dateKey(date))}>{date.getDate()}</button><div className="calendar-cell-events">{events.filter(event => event.date === dateKey(date)).sort((a, b) => a.time.localeCompare(b.time)).map(event => <button className={`calendar-event event-${event.kind}`} key={event.id} onClick={() => setSelectedEvent(event)}><time>{event.time}</time>{event.title}</button>)}</div></div>)}</div></div> : <div className={`calendar-agenda agenda-${mode.toLowerCase()}`}>{dates.map(date => <section className="agenda-day" key={dateKey(date)}><header><span>{date.toLocaleDateString("en-GB", { weekday: "short" })}</span><b>{date.getDate()}</b><button aria-label={`Add event ${dateKey(date)}`} onClick={() => addEvent(dateKey(date))}><Plus size={14} /></button></header><div>{events.filter(event => event.date === dateKey(date)).sort((a, b) => a.time.localeCompare(b.time)).map(event => <button className={`agenda-event event-${event.kind}`} key={event.id} onClick={() => setSelectedEvent(event)}><time>{event.time}</time><strong>{event.title}</strong><small>{event.kind}</small></button>)}{!events.some(event => event.date === dateKey(date)) && <p className="agenda-empty">No events</p>}</div></section>)}</div>}
    {createOpen && <SidePanel title="Add event" onClose={() => setCreateOpen(false)}><form className="store-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const title = String(data.get("title")).trim(); if (!title) return; onChange([...events, { id: crypto.randomUUID(), title, date: String(data.get("date")), time: String(data.get("time")), kind: data.get("kind") as StoreEvent["kind"] }]); setCreateOpen(false); }}><label>Title<input name="title" required maxLength={120} /></label><label>Date<input name="date" type="date" defaultValue={draftDate} required /></label><label>Time<input name="time" type="time" defaultValue="09:00" required /></label><label>Type<select name="kind"><option value="task">Task</option><option value="promotion">Promotion</option><option value="payout">Payout</option></select></label><button className="primary-button" type="submit">Create event</button></form></SidePanel>}
    {selectedEvent && <SidePanel title={selectedEvent.title} subtitle="Calendar event" onClose={() => setSelectedEvent(null)}><div className="detail-data-grid"><span>Date<b>{selectedEvent.date}</b></span><span>Time<b>{selectedEvent.time}</b></span><span>Type<b>{selectedEvent.kind}</b></span></div><button className="secondary-button" onClick={() => { onChange(events.filter(event => event.id !== selectedEvent.id)); setSelectedEvent(null); }}>Remove event</button></SidePanel>}
  </Workspace>;
}

function SettingsScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) {
  const [section, setSection] = useState("Customizations");
  return <Workspace><ScreenTitle>Settings</ScreenTitle><div className="settings-layout"><aside className="settings-menu"><label><Search size={13} /><input placeholder="Search for something" /></label>{["General", "Customizations", "Manage Contacts", "Private Settings", "Linked Accounts", "Updates"].map((name) => <button className={section === name ? "settings-selected" : ""} onClick={() => setSection(name)} key={name}><span><Settings size={14} /></span><b>{name}<small>SUB-TITLE</small></b><ChevronRight size={13} /></button>)}</aside><div className="settings-main"><div className="settings-heading"><span><h2>{section}</h2><small>CONTROL COLORS, FONTS AND LOOK</small></span><button onClick={() => setDarkMode(true)}><ArrowLeft size={12} /> Reset all</button></div><SettingRow label="Main display theme" caption="DARK MODE"><button className={`toggle ${darkMode ? "toggle-on" : ""}`} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme"><i /></button></SettingRow><SettingRow label="Search bar" caption="ENABLED IN ALL SCREENS"><button className="toggle toggle-on" aria-label="Toggle search"><i /></button></SettingRow><SettingRow label="Subtitles + Text font" caption="INTER"><button className="select-setting">Inter <ChevronDown size={13} /></button></SettingRow><SettingRow label="General font size" caption="14–26PX"><input className="range-setting" type="range" min="14" max="26" defaultValue="19" /></SettingRow><SettingRow label="Main titles font size" caption="46PX"><input className="range-setting" type="range" min="24" max="46" defaultValue="40" /></SettingRow><SettingRow label="Sidebar" caption="SIDEBAR WITH ICONS"><span className="radio-setting"><i /> Sidebar with text <i className="checked" /> Sidebar with icons</span></SettingRow></div></div></Workspace>;
}

function SettingRow({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return <div className="setting-row"><span><b>{label}</b><small>{caption}</small></span>{children}</div>;
}

function Dialog({ title, onClose }: { title: string; onClose: () => void }) {
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [onClose]);
  return <div className="dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="dialog" role="dialog" aria-modal="true" aria-label={title}><div className="dialog-head"><b>{title}</b><button onClick={onClose} aria-label="Close"><X size={16} /></button></div><p className="dialog-copy">{title === "Help" ? "Manage your store with Dashboard, Orders, Wallet, Products, Analytics, Support tickets, and Calendar. Search adapts to the page you’re viewing. Use the arrows in the top bar to return to previously visited pages." : title === "Sign out" ? "You’re viewing a local store preview. Account sign-in is not connected yet." : "Create products from Products, support tickets from Support tickets, or events from Calendar."}</p><div className="dialog-actions"><button className="confirm-action" onClick={onClose}>Got it</button></div></section></div>;
}
