"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Activity,
  Archive,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Ellipsis,
  FileText,
  Folder,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Power,
  Search,
  Settings,
  ShoppingBag,
  UserRound,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

type Screen = "What's new" | "Dashboard" | "My Wallet" | "My Products" | "Orders" | "Messages" | "Calendar" | "Settings";

const orderData = [
  { id: "#239", customer: "Alexa Lacruz", email: "info@allex.ru", address: "932 Saint Marys Avenue, Syracuse, NY 13202", date: "24/5", amount: "$875", status: "DELIVERED", color: "pink" },
  { id: "#238", customer: "Alexa Lacruz", email: "info@allex.ru", address: "932 Saint Marys Avenue, Syracuse, NY 13202", date: "24/5", amount: "$195", status: "DELIVERED", color: "green" },
  { id: "#237", customer: "Alexa Lacruz", email: "info@allex.ru", address: "932 Saint Marys Avenue, Syracuse, NY 13202", date: "23/5", amount: "$420", status: "DELIVERED", color: "green" },
  { id: "#236", customer: "Megan Bowen", email: "megan@studio.com", address: "41 Madison Avenue, New York, NY 10010", date: "22/5", amount: "$249", status: "PROCESSING", color: "blue" },
];

const iconNav = [
  { title: "What's new" as Screen, icon: LayoutDashboard },
  { title: "Dashboard" as Screen, icon: Activity },
  { title: "My Wallet" as Screen, icon: Wallet },
  { title: "My Products" as Screen, icon: Folder },
  { title: "Orders" as Screen, icon: Archive },
  { title: "Messages" as Screen, icon: List },
  { title: "Calendar" as Screen, icon: CalendarDays },
  { title: "Settings" as Screen, icon: Wrench },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("What's new");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [calendarMode, setCalendarMode] = useState("Month");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredOrders = orderData.filter((order) =>
    `${order.id} ${order.customer} ${order.email} ${order.status}`.toLowerCase().includes(search.toLowerCase()),
  );
  const goTo = (nextScreen: Screen) => {
    setScreen(nextScreen);
    setMobileNavOpen(false);
    setProfileOpen(false);
  };

  return (
    <main className={`violett-app ${darkMode ? "" : "light-mode"}`}>
      <header className="topbar">
        <button className="mobile-menu icon-button" aria-label="Toggle navigation" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
        <button className="flower-logo" aria-label="Violett home" onClick={() => goTo("What's new")}><Image src="/violett.svg" width={23} height={23} alt="" priority /></button>
        <label className="top-search">
          <Search size={14} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for a number..." aria-label="Search" />
        </label>
        <div className="top-actions">
          <button className="icon-button" aria-label="Messages" onClick={() => goTo("Messages")}><MessageSquare size={15} /></button>
          <div className="relative">
            <button className="icon-button has-indicator" aria-label="Notifications" onClick={() => setNoticeOpen(!noticeOpen)}><Bell size={15} /><i /></button>
            {noticeOpen && <div className="floating-menu notice-menu"><div className="menu-title">Activity <button onClick={() => setNoticeOpen(false)} aria-label="Close"><X size={13} /></button></div><div className="notice-row"><span className="round-icon pink"><Wallet size={13} /></span><span><b>Funds request</b><small>Antalya sent you a new request</small></span></div><div className="notice-row"><span className="round-icon purple"><MessageSquare size={13} /></span><span><b>New message</b><small>Christopher sent you a message</small></span></div><div className="notice-row"><span className="round-icon pink"><Activity size={13} /></span><span><b>New statistics</b><small>Your sales are up 12%</small></span></div></div>}
          </div>
          <button className="add-button" aria-label="Create new" onClick={() => setDialog("Create new")}><Plus size={16} /></button>
          <span className="top-divider" />
          <div className="relative">
            <button className="profile-button" aria-label="Open profile" onClick={() => setProfileOpen(!profileOpen)}><span className="profile-photo">BE</span><ChevronDown size={11} /></button>
            {profileOpen && <div className="floating-menu profile-menu"><div className="profile-card"><span className="profile-large">BE</span><b>Bradley Edmur</b><small>Chief Designer</small><span className="edit-tag">EDIT PROFILE</span></div><button onClick={() => { goTo("Settings"); }}>Settings <Settings size={13} /></button><button onClick={() => setDialog("Sign out")}>Sign out <LogOut size={13} /></button></div>}
          </div>
        </div>
      </header>

      <aside className={`icon-rail ${mobileNavOpen ? "rail-open" : ""}`} aria-label="Main navigation">
        <div className="rail-links">
          {iconNav.map(({ title, icon: Icon }) => (
            <button key={title} className={`rail-button ${screen === title ? "rail-active" : ""}`} aria-label={title} title={title} onClick={() => goTo(title)}>
              <Icon size={16} strokeWidth={1.7} />{title === "Messages" && <i className="rail-dot" />}
            </button>
          ))}
        </div>
        <div className="rail-bottom">
          <button className="rail-button" aria-label="Tools" onClick={() => setDialog("Tools")}><Wrench size={16} /></button>
          <button className="rail-button" aria-label="Power" onClick={() => setDialog("Sign out")}><Power size={16} /></button>
        </div>
      </aside>

      <div className="screen-content">
        {screen === "What's new" && <WhatsNew onNavigate={goTo} onOpen={setDialog} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {screen === "Dashboard" && <Dashboard />}
        {screen === "My Wallet" && <WalletScreen onOpen={setDialog} />}
        {screen === "My Products" && <ProductsScreen onOpen={setDialog} />}
        {screen === "Orders" && <OrdersScreen orders={filteredOrders} onOpen={setDialog} />}
        {screen === "Messages" && <MessagesScreen />}
        {screen === "Calendar" && <CalendarScreen mode={calendarMode} setMode={setCalendarMode} onOpen={setDialog} />}
        {screen === "Settings" && <SettingsScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      {dialog && <Dialog title={dialog} onClose={() => setDialog("")} />}
    </main>
  );
}

function ScreenTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="screen-title"><h1>{children}</h1>{action}</div>;
}

function WhatsNew({ onNavigate, onOpen, darkMode, setDarkMode }: { onNavigate: (screen: Screen) => void; onOpen: (title: string) => void; darkMode: boolean; setDarkMode: (mode: boolean) => void }) {
  return (
    <section className="workspace home-workspace">
      <ScreenTitle action={<div className="home-board-actions"><button onClick={() => onOpen("Add a tile")}><Plus size={16} /> Add a tile</button><button aria-label="Widget settings" onClick={() => onNavigate("Settings")}><Settings size={16} /></button></div>}>What&apos;s new</ScreenTitle>
      <div className="home-board">
        <div className="widget-column">
          <article className="tile meeting-tile">
            <div className="board-widget-head"><h2>Activity</h2><button aria-label="Meeting options" onClick={() => onOpen("Meeting details")}><Ellipsis size={18} /></button></div>
            <p>Meet Mr. Raul Atwood<br />in the office after</p>
            <button className="meeting-countdown" onClick={() => onOpen("Meeting details")}>1 Hour</button>
            <div className="tile-date">16 Apr<small>Monday</small></div>
            <div className="tile-actions"><button aria-label="Share meeting" onClick={() => onOpen("Share meeting")}><ArrowRight size={16} /></button><button aria-label="Edit meeting" onClick={() => onOpen("Edit meeting")}><FileText size={16} /></button></div>
          </article>
          <article className="tile visits-tile">
            <div className="board-widget-head"><h2>Visits</h2><button aria-label="View visits" onClick={() => onNavigate("Dashboard")}><Ellipsis size={18} /></button></div>
            <div className="visits-summary"><strong>8,492</strong><span>+18% <small>This week</small></span></div>
            <div className="visits-bars" role="img" aria-label="Daily visits: Monday 520, Tuesday 740, Wednesday 630, Thursday 980, Friday 820, Saturday 1120, Sunday 940">
              {[{ day: "Mon", value: 520 }, { day: "Tue", value: 740 }, { day: "Wed", value: 630 }, { day: "Thu", value: 980 }, { day: "Fri", value: 820 }, { day: "Sat", value: 1120 }, { day: "Sun", value: 940 }].map(({ day, value }) => <div className="visits-bar-column" key={day}><div className="visits-bar-track"><i style={{ height: `${value / 12}%` }} /></div><span>{day}</span></div>)}
            </div>
          </article>
        </div>
        <div className="widget-column">
          <article className="tile gradient-tile">
            <div className="board-widget-head"><h2>Desktop users</h2><button aria-label="User statistics options" onClick={() => onOpen("Statistics options")}><Ellipsis size={18} /></button></div>
            <div className="desktop-breakdown"><div className="pie-chart" /><div><strong>35%</strong><small>Of all visitors</small></div></div>
          </article>
          <article className="tile earnings-tile">
            <div className="board-widget-head"><h2>Revenue</h2><button aria-label="Revenue options" onClick={() => onOpen("Earnings")}><Ellipsis size={18} /></button></div>
            <div className="earnings-content"><b className="earnings-amount">$12,487</b><small className="tile-caption">+$864 compared to last month</small></div>
            <MiniChart />
            <span className="revenue-change">↗ +24%<small>This month</small></span>
          </article>
        </div>
        <div className="widget-column funds-column">
          <article className="tile funds-tile">
            <div className="board-widget-head"><h2>Funds</h2><button aria-label="Funds options" onClick={() => onOpen("Funds Request")}><Ellipsis size={18} /></button></div>
            <div className="funds-head"><span>Funds Mngr.</span><span>26 Oct<small>Today</small></span></div>
            <MiniChart />
            <div className="funds-stats"><span><i className="ring pink-ring" /><b>+13%</b><small>Earnings</small></span><span><i className="ring gray-ring" /><b>-28%</b><small>Expenses</small></span></div>
          </article>
          <div className="bottom-widget-pair">
            <article className="tile sale-tile">
              <div className="board-widget-head"><h2>Sales</h2><ShoppingBag size={16} /></div>
              <div className="compact-tile-content"><strong>New Sale!</strong><small>Alexandria</small></div><button className="sale-arrow" aria-label="View sale" onClick={() => onOpen("Sale details")}><ArrowRight size={16} /></button>
            </article>
            <article className="tile dark-mode-tile">
              <div className="board-widget-head"><h2>Dark mode</h2></div>
              <div className="compact-tile-content"><small>{darkMode ? "Enabled" : "Disabled"}</small></div>
              <button className={`toggle ${darkMode ? "toggle-on" : ""}`} role="switch" aria-checked={darkMode} aria-label="Toggle dark mode" onClick={() => setDarkMode(!darkMode)}><i /></button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniChart() {
  return <svg className="mini-chart" viewBox="0 0 170 60" aria-label="Funds management trend"><path d="M1 48 C18 45 26 37 39 38 S62 22 75 28 S94 10 109 18 S126 37 139 33 S153 48 169 53" fill="none" stroke="#ce4cb5" strokeWidth="1.5" /><circle cx="109" cy="18" r="2.5" fill="#df65d0" /></svg>;
}

function Dashboard() {
  return (
    <section className="workspace">
      <ScreenTitle>Dashboard</ScreenTitle>
      <div className="dashboard-grid">
        <article className="widget store-stats">
          <WidgetHead title="Store Stats" />
          <div className="widget-title-row"><span>Views PD</span><span>26 Oct<small>Today</small></span></div>
          <div className="bar-chart"><div className="bar-grid"><i /><i /><i /><i /></div><div className="bar purple-bar" /><div className="bar pink-bar" /></div>
          <div className="chart-legend"><span><i className="legend-line pink-line" />76% Organic Search</span><span><i className="legend-line gray-line" />24% Other Parts</span></div>
          <div className="dots">•　•　•　•</div>
        </article>
        <article className="widget sales-widget">
          <WidgetHead title="Sales" />
          {["Sylvia", "Kazaar", "Kazaar", "Kazaar"].map((name, index) => <div className="sale-row" key={`${name}-${index}`}><div><b>{name}</b><small>Allien Durs — 11:30 AM</small><em>PAYPAL</em></div><strong>+{index === 0 ? "27" : "31"}.06</strong><button onClick={() => {}} aria-label="Sale options"><Ellipsis size={14} /></button></div>)}
        </article>
      </div>
    </section>
  );
}

function WidgetHead({ title }: { title: string }) {
  return <div className="widget-head"><span>{title}</span><button aria-label={`${title} options`}><Ellipsis size={14} /></button></div>;
}

function WalletScreen({ onOpen }: { onOpen: (title: string) => void }) {
  return (
    <section className="workspace">
      <ScreenTitle>My Wallet</ScreenTitle>
      <div className="wallet-grid">
        <article className="widget card-widget">
          <WidgetHead title="My Cards" />
          <div className="credit-card-art"><span>VISA</span><strong>2374 •••• •••• 0094</strong><small>Rae Shmidt</small><small>4/26</small></div>
          <div className="balance-bottom"><div><strong>$78.192</strong><small>+12% last Month</small></div><span>Date<small>This Month</small></span></div>
          <div className="wallet-bars">{[22, 38, 29, 48, 34, 57, 39, 68, 51, 74, 43, 61, 82, 57, 68].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
          <div className="chart-legend"><span><i className="legend-line pink-line" />67% Income</span><span><i className="legend-line gray-line" />33% Expenses</span></div>
        </article>
        <div className="wallet-right">
          <article className="widget balance-widget">
            <WidgetHead title="Balance" />
            <strong className="balance-number">$372,941</strong><small className="tile-caption">+7% last week</small>
            <div className="balance-chart"><svg viewBox="0 0 360 144" preserveAspectRatio="none" role="img" aria-label="Income and expenses over the last week"><defs><linearGradient id="income-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f64c9c" /><stop offset="1" stopColor="#d848db" /></linearGradient></defs><path d="M0 112 C32 128 48 92 76 98 S116 48 148 56 S200 22 236 58 S276 60 300 82 S340 98 360 104 V144 H0Z" fill="#9f48e5"/><path d="M0 108 C28 124 52 84 80 96 S116 32 156 28 S200 56 232 72 S268 88 296 100 S336 102 360 108 V144 H0Z" fill="url(#income-fill)"/><circle cx="156" cy="28" r="4" fill="#444" stroke="#ef69bf" strokeWidth="2"/></svg></div>
            <div className="chart-legend"><span><i className="legend-line pink-line" />Income +11%</span><span><i className="legend-line purple-line" />Expenses -23%</span></div>
          </article>
          <article className="widget history-widget">
            <WidgetHead title="History" />
            <HistoryItem icon={<ShoppingBag size={12} />} name="Mcdonald's" date="29 April — 11:30 AM" amount="+27.98" />
            <HistoryItem icon={<CreditCard size={12} />} name="Server Fees" date="29 April — 11:30 AM" amount="-34.58" negative />
          </article>
        </div>
      </div>
      <button className="small-action" onClick={() => onOpen("Add a card")}><Plus size={13} /> Add a card</button>
    </section>
  );
}

function HistoryItem({ icon, name, date, amount, negative }: { icon: React.ReactNode; name: string; date: string; amount: string; negative?: boolean }) {
  return <div className="history-item"><span className="round-icon purple">{icon}</span><span><b>{name}</b><small>{date}</small></span><strong className={negative ? "negative" : "positive"}>{amount}</strong></div>;
}

function ProductsScreen({ onOpen }: { onOpen: (title: string) => void }) {
  const products = [
    { name: "Denim Jeans", type: "Men. Pants", color: "jeans", stock: "IN STOCK" },
    { name: "Colorful Shirt", type: "Men. Tops", color: "shirt", stock: "IN STOCK" },
    { name: "Texture Shirt", type: "Men. Shirts", color: "texture", stock: "OUT OF STOCK" },
  ];
  return (
    <section className="workspace">
      <ScreenTitle action={<button className="filter-button" onClick={() => onOpen("Filter products")}>Filter by <ChevronDown size={13} /><small>POPULAR</small></button>}>My Products</ScreenTitle>
      <div className="product-layout">
        {products.map((product) => <article className="product-card" key={product.name}>
          <button className={`product-image ${product.color}`} aria-label={`Edit ${product.name}`} onClick={() => onOpen(`Edit ${product.name}`)}><ProductIllustration kind={product.color} /><span className="edit-round"><Wrench size={11} /></span></button>
          <strong>{product.name}</strong><small>{product.type}</small><div className="product-options"><span>●●●</span><span>{product.color === "jeans" ? "44 — 52" : "M, L, XL"}</span></div><span className={`inventory ${product.stock === "IN STOCK" ? "in-stock" : "out-stock"}`}>{product.stock}</span>
        </article>)}
        <article className="widget earning-widget">
          <div className="mini-kpis"><span><b>278</b><small>In Stock</small></span><span><b>157</b><small>Orders</small></span><span><b>31,491</b><small>Sales</small></span></div>
          <WidgetHead title="Earning History" />
          <div className="earn-range">26 Oct - 12 Apr<small>Last 6 Months</small></div>
          <MiniChart />
          <div className="chart-ticks">↙　↗　↙　↗　↙　↗</div>
        </article>
      </div>
    </section>
  );
}

function ProductIllustration({ kind }: { kind: string }) {
  if (kind === "jeans") return <svg viewBox="0 0 80 110" aria-hidden="true"><path d="M22 9h36l9 84-20 4-7-49-7 49-20-4z" fill="#467db5" stroke="#315f8a" strokeWidth="2" /><path d="M23 18h35M39 10v12M29 22l8 6m14-6-8 6" fill="none" stroke="#92b9d8" strokeWidth="2" /><path d="m23 38 12 4m10-4 12 4M19 84h17m9 0h19" stroke="#366d9d" strokeWidth="2" /></svg>;
  return <svg viewBox="0 0 90 100" aria-hidden="true"><path d="m26 17 15-7 8 7 11-2 17 12-10 15-8-5 2 45H29l2-45-8 5-10-15z" fill={kind === "shirt" ? "#8f7549" : "#34343a"} stroke={kind === "shirt" ? "#705a39" : "#222226"} strokeWidth="2" /><path d="m41 10 7 7-5 12 8 10-7 5-11-27m16 0 8 29" fill="none" stroke="#b6a486" strokeWidth="2" /></svg>;
}

function OrdersScreen({ orders, onOpen }: { orders: typeof orderData; onOpen: (title: string) => void }) {
  return <section className="workspace orders-workspace"><ScreenTitle action={<button className="filter-button" onClick={() => onOpen("Filter orders")}>Filter by <ChevronDown size={13} /><small>POPULAR</small></button>}>Orders <span className="title-muted">Completed</span><ChevronDown className="title-chevron" size={14} /></ScreenTitle>
    <div className="orders-toolbar"><span>Orders　⌄</span><span>Ship to　⌄</span><span>Date　⌄</span><span>Price　⌄</span></div>
    <div className="orders-table">{orders.map((order) => <button className="order-row" key={order.id} onClick={() => onOpen(`Order ${order.id}`)}><span><b>Order {order.id}</b><small>{order.customer}</small><small>{order.email}</small><em className={`delivery ${order.color}`}>{order.status}</em></span><span>{order.address}</span><span>{order.date}</span><span><b>{order.amount}</b><small>Paypal</small></span></button>)}{orders.length === 0 && <div className="no-orders">No orders found.</div>}</div>
  </section>;
}

function MessagesScreen() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  return <section className="workspace"><ScreenTitle>Messages</ScreenTitle><div className="messages-layout"><aside className="conversations"><label><Search size={12} /><input placeholder="Search for messages" /></label><small className="list-label">Active</small>{[["SM", "Sarah Morgan", "That's just amazing!", "4m ago"], ["JB", "Jesus Bojian", "Didn't see that coming!", "11m ago"], ["AS", "Antalya Simons", "I'll call you in a sec.", "1h ago"], ["BS", "Benjamin Selmy", "Looking forward to it", "3h ago"]].map((person) => <button className="conversation" key={person[1]}><span className="person-pic">{person[0]}</span><span><b>{person[1]}</b><small>{person[2]}</small></span><small>{person[3]}</small></button>)}</aside><div className="chat"><div className="chat-head"><span className="person-pic">SM</span><span><b>Sarah Morgan</b><small>ACTIVE</small></span><div><button><Settings size={14} /></button><button><UserRound size={14} /></button><button><Ellipsis size={15} /></button></div></div><div className="chat-messages"><small className="chat-time">10:46 AM</small><div className="bubble bubble-pink">Maecenas eu mauris sit amet nisl cursus volutpat...</div><div className="bubble bubble-light">Donec placerat dolor</div><div className="bubble bubble-pink">Donec placerat dolor ut enim...</div><div className="typing-bubble">•••</div>{sent.map((text, index) => <div className="bubble bubble-light" key={index}>{text}</div>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); if (message.trim()) { setSent([...sent, message]); setMessage(""); } }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type Something..." /><button type="button" aria-label="Attach file"><Plus size={14} /></button><button className="send-button" aria-label="Send"><ArrowRight size={15} /></button></form></div></div></section>;
}

function CalendarScreen({ mode, setMode, onOpen }: { mode: string; setMode: (mode: string) => void; onOpen: (title: string) => void }) {
  return <section className="workspace"><ScreenTitle action={<button className="filter-button" onClick={() => setMode(mode === "Month" ? "Week" : mode === "Week" ? "Day" : "Month")}>{mode} <ChevronDown size={13} /></button>}>Calendar <span className="title-muted">{mode}</span><div className="calendar-month"><button onClick={() => onOpen("Previous month")}><ChevronLeft size={14} /></button>April 2018<button onClick={() => onOpen("Next month")}><ChevronRight size={14} /></button></div></ScreenTitle><div className="calendar-grid"><div className="calendar-days">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>{Array.from({ length: 5 }, (_, week) => <div className="calendar-week" key={week}>{Array.from({ length: 7 }, (_, day) => { const date = week * 7 + day - 2; const actual = date < 1 ? 26 + date : date > 30 ? date - 30 : date; const event = actual === 4 ? "Release Violett 2.0" : actual === 12 ? "Publish Ad Copies" : actual === 17 ? "Rearrange the office and finalize the new look" : actual === 25 ? "Meeting to discuss..." : ""; return <button className={`calendar-day ${date < 1 || date > 30 ? "day-muted" : ""} ${actual === 4 ? "selected-day" : ""}`} key={day}><span>{actual}</span>{event && <i>{event}</i>}</button>; })}</div>)}</div><button className="small-action" onClick={() => onOpen("Add an event")}><Plus size={13} /> Add an event</button></section>;
}

function SettingsScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) {
  const [section, setSection] = useState("Customizations");
  return <section className="workspace"><ScreenTitle>Settings</ScreenTitle><div className="settings-layout"><aside className="settings-menu"><label><Search size={13} /><input placeholder="Search for something" /></label>{["General", "Customizations", "Manage Contacts", "Private Settings", "Linked Accounts", "Updates"].map((name) => <button className={section === name ? "settings-selected" : ""} onClick={() => setSection(name)} key={name}><span><Settings size={14} /></span><b>{name}<small>SUB-TITLE</small></b><ChevronRight size={13} /></button>)}</aside><div className="settings-main"><div className="settings-heading"><span><h2>{section}</h2><small>CONTROL COLORS, FONTS AND LOOK</small></span><button onClick={() => setDarkMode(true)}><ArrowLeft size={12} /> Reset all</button></div><SettingRow label="Main display theme" caption="DARK MODE"><button className={`toggle ${darkMode ? "toggle-on" : ""}`} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme"><i /></button></SettingRow><SettingRow label="Search bar" caption="ENABLED IN ALL SCREENS"><button className="toggle toggle-on" aria-label="Toggle search"><i /></button></SettingRow><SettingRow label="Subtitles + Text font" caption="INTER"><button className="select-setting">Inter <ChevronDown size={13} /></button></SettingRow><SettingRow label="General font size" caption="14–26PX"><input className="range-setting" type="range" min="14" max="26" defaultValue="19" /></SettingRow><SettingRow label="Main titles font size" caption="46PX"><input className="range-setting" type="range" min="24" max="46" defaultValue="40" /></SettingRow><SettingRow label="Sidebar" caption="SIDEBAR WITH ICONS"><span className="radio-setting"><i /> Sidebar with text <i className="checked" /> Sidebar with icons</span></SettingRow></div></div></section>;
}

function SettingRow({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return <div className="setting-row"><span><b>{label}</b><small>{caption}</small></span>{children}</div>;
}

function Dialog({ title, onClose }: { title: string; onClose: () => void }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  return <div className={`dialog-backdrop ${title.startsWith("Order") ? "order-backdrop" : ""}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="dialog" role="dialog" aria-modal="true" aria-label={title}><div className="dialog-head"><b>{title}</b><button onClick={onClose} aria-label="Close"><X size={15} /></button></div>{title.startsWith("Order") ? <><div className="dialog-subtitle">Payment via PayPal, 24/11/2018 at 00:16</div><div className="order-details"><b>Customer: PE. 12.132.250.148</b><span className="delivery green">DELIVERED</span><div className="detail-item"><span className="product-thumb">👟</span><span>Chelsea Boots<small>MEN. SHOES</small></span><b>×1　$195</b></div><div className="detail-total"><span>Total</span><b>$195</b></div></div><div className="billing-tabs"><button className="selected">BILLING</button><button>SHIPPING</button></div><div className="billing-info">Craig Hafer Walksy 8 Kane Road<br />Morgantown, PA 19543<br /><br />cdh@hafer.me<br /><br />610-750-4463</div><button className="edit-button" onClick={() => setDone(true)}>{done ? "SAVED" : "EDIT"}</button></> : title === "Funds Request" ? <><p className="request-copy">Samuel L. Davis Requested a loan of <b>10,000$</b> from you.</p><div className="request-fields"><span>Account<b>sam@davis.me</b></span><span>Due Date<b>27 May</b></span><span>Method<b>PayPal</b></span></div><div className="dialog-actions"><button onClick={() => { setDone(true); }}>{done ? <Check size={17} /> : <X size={16} />}</button><button className="confirm-action" onClick={() => { setDone(true); }}><Check size={17} /></button></div></> : <><p className="dialog-copy">{done ? `${title} saved.` : "Choose an option to continue."}</p><div className="dialog-actions"><button onClick={onClose}>Cancel</button><button className="confirm-action" onClick={() => setDone(true)}>{done ? <Check size={16} /> : "Continue"}</button></div></>}</section></div>;
}
