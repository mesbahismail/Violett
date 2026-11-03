"use client";

import { Children, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { SidePanel } from "./components/side-panel";
import { initialOrders, initialTickets, initialEvents, selectOrders, storeOverview, money, dateKey, formatCalendarDate, calendarDates, shiftCalendar, type StoreOrder, type OrderStatus, type OrderSort, type Ticket, type CalendarMode, type StoreEvent } from "./store-data";
import {
  Activity,
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
  RotateCcw,
  BookOpen,
  ArrowUpRight,
  Package,
  PackageCheck,
  Ticket as TicketIcon,
  TrendingUp,
  SlidersHorizontal,
  Send,
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
  LockKeyhole,
  UserRound,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";

type Screen = "Dashboard" | "Analytics" | "Wallet" | "Products" | "Orders" | "Support tickets" | "Calendar" | "Settings" | "Help";

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
  const [profile, setProfile] = useState({ name: "Bradley Edmur", role: "Store owner", email: "bradley@violett.store", phone: "+1 610 750 4463", timezone: "Africa/Casablanca" });
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [createTarget, setCreateTarget] = useState("");
  const [createVersion, setCreateVersion] = useState(0);
  const [customWidget, setCustomWidget] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [activityRead, setActivityRead] = useState(false);
  const [requestDecision, setRequestDecision] = useState<"approved" | "declined" | null>(null);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [darkMode, setDarkMode] = useState(true);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("Month");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const goTo = (nextScreen: Screen) => {
    setNavigation((current) => {
      if (current.entries[current.index] === nextScreen) return current;
      const entries = [...current.entries.slice(0, current.index + 1), nextScreen];
      return { entries, index: entries.length - 1 };
    });
    setCreateMenuOpen(false);
    setCreateTarget("");
    setSearch("");
    setTooltip(null);
    setMobileNavOpen(false);
    setProfileOpen(false);
    setNoticeOpen(false);
  };
  const navigateHistory = (direction: -1 | 1) => {
    setNavigation((current) => ({ ...current, index: Math.max(0, Math.min(current.entries.length - 1, current.index + direction)) }));
    setCreateMenuOpen(false);
    setCreateTarget("");
    setSearch("");
    setTooltip(null);
    setMobileNavOpen(false);
    setProfileOpen(false);
    setNoticeOpen(false);
  };

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--text-base", `${preferences.fontSize}px`);
    root.setProperty("--text-sm", `${preferences.fontSize - 2}px`);
    root.setProperty("--text-xs", `${preferences.fontSize - 4}px`);
    root.setProperty("--text-title", `${preferences.titleSize}px`);
  }, [preferences.fontSize, preferences.titleSize]);

  const railHint = (text: string) => ({
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => setTooltip(sidebarExpanded || mobileNavOpen ? null : { text, top: event.currentTarget.getBoundingClientRect().top + 8 }),
    onPointerLeave: () => setTooltip(null),
    onFocus: (event: React.FocusEvent<HTMLButtonElement>) => setTooltip(sidebarExpanded || mobileNavOpen ? null : { text, top: event.currentTarget.getBoundingClientRect().top + 8 }),
    onBlur: () => setTooltip(null),
  });

  return (
    <main className={`violett-app ${darkMode ? "" : "light-mode"} ${preferences.compact ? "compact-lists" : ""} ${sidebarExpanded ? "sidebar-expanded" : ""}`} style={{ "--text-base": `${preferences.fontSize}px`, "--text-sm": `${preferences.fontSize - 2}px`, "--text-xs": `${preferences.fontSize - 4}px`, "--text-title": `${preferences.titleSize}px` } as React.CSSProperties}>
      <header className="topbar">
        <button className="mobile-menu icon-button sidebar-logo-toggle" aria-label={mobileNavOpen ? "Collapse navigation" : "Expand navigation"} aria-expanded={mobileNavOpen} aria-controls="main-navigation" onClick={() => { setTooltip(null); setMobileNavOpen(!mobileNavOpen); }}>
          <Image src="/violett.svg" width={23} height={23} alt="" priority />
        </button>
        <button className="flower-logo" aria-label={sidebarExpanded ? "Collapse navigation" : "Expand navigation"} title={sidebarExpanded ? "Collapse navigation" : "Expand navigation"} aria-expanded={sidebarExpanded} aria-controls="main-navigation" onClick={() => { setTooltip(null); setSidebarExpanded(!sidebarExpanded); }}><Image src="/violett.svg" width={23} height={23} alt="" priority /><span className="rail-label brand-name">Violett</span>{sidebarExpanded && <ChevronLeft className="sidebar-collapse-icon" size={16} />}</button>
        <div className="navbar-content">
          <nav className="history-navigation" aria-label="Page history">
            <button className="icon-button" aria-label="Go back" title="Go back" disabled={!canGoBack} onClick={() => navigateHistory(-1)}><ChevronLeft size={18} /></button>
            <span className="history-divider" aria-hidden="true" />
            <button className="icon-button" aria-label="Go forward" title="Go forward" disabled={!canGoForward} onClick={() => navigateHistory(1)}><ChevronRight size={18} /></button>
          </nav>
        <label className="top-search">
          <Search size={14} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={screen === "Orders" ? "Search by order, customer or product..." : screen === "Support tickets" ? "Search for support tickets..." : screen === "Products" ? "Search products..." : screen === "Settings" ? "Search settings..." : screen === "Help" ? "Search help articles..." : "Search your store..."} aria-label={screen === "Orders" ? "Search by order" : screen === "Support tickets" ? "Search for support tickets" : "Search your store"} />
        </label>
        <div className="top-actions">
          <button className="icon-button" aria-label="Support tickets" onClick={() => goTo("Support tickets")}><MessageSquare size={15} /></button>
          <div className="relative">
            <button className="icon-button has-indicator" aria-label="Activity" title="Activity" aria-expanded={noticeOpen} onClick={() => { setProfileOpen(false); setCreateMenuOpen(false); setNoticeOpen(!noticeOpen); }}><Activity size={16} />{!activityRead && preferences.salesUpdates && <i aria-hidden="true" />}</button>
            {noticeOpen && <ActivityPanel orders={orders} products={products} requestDecision={requestDecision} onDecision={setRequestDecision} read={activityRead} onMarkRead={() => setActivityRead(true)} onNavigate={goTo} onClose={() => setNoticeOpen(false)} />}
          </div>
          <div className="relative"><button className="add-button" aria-label="Create new" aria-expanded={createMenuOpen} onClick={() => { setNoticeOpen(false); setCreateMenuOpen(!createMenuOpen); }}><Plus size={16} /></button>
            {createMenuOpen && <AnchoredPopover title="Create new" className="create-menu" onClose={() => setCreateMenuOpen(false)}>{[{ name: "New product", icon: Package, screen: "Products" }, { name: "New event", icon: CalendarDays, screen: "Calendar" }, { name: "New ticket", icon: TicketIcon, screen: "Support tickets" }, { name: "New widget", icon: LayoutGrid, screen: "Dashboard" }].map(({ name, icon: Icon, screen: destination }) => <button className="create-menu-item" key={name} onClick={() => { goTo(destination as Screen); setCreateTarget(name); setCreateVersion(value => value + 1); }}><Icon size={16} /><span>{name}</span><ChevronRight size={14} /></button>)}</AnchoredPopover>}
          </div>

        </div>
        </div>
      </header>

      <aside id="main-navigation" className={`icon-rail ${mobileNavOpen ? "rail-open" : ""}`} aria-label="Main navigation">
        <div className="rail-links">
          {iconNav.map(({ title, icon: Icon }) => (
            <button key={title} className={`rail-button ${screen === title ? "rail-active" : ""}`} aria-label={title} {...railHint(title)} aria-current={screen === title ? "page" : undefined} onClick={() => goTo(title)}>
              <Icon size={16} strokeWidth={1.7} /><span className="rail-label">{title}</span>{title === "Support tickets" && preferences.ticketUpdates && <i className="rail-dot" />}
            </button>
          ))}
        </div>
        <hr className="rail-divider" />
        <div className="rail-bottom">
          <button className={`rail-button ${screen === "Settings" ? "rail-active" : ""}`} aria-label="Settings" {...railHint("Settings")} aria-current={screen === "Settings" ? "page" : undefined} onClick={() => goTo("Settings")}><Settings size={20} /><span className="rail-label">Settings</span></button>
          <button className={`rail-button ${screen === "Help" ? "rail-active" : ""}`} aria-current={screen === "Help" ? "page" : undefined} aria-label="Help" {...railHint("Help")} onClick={() => goTo("Help")}><CircleHelp size={20} /><span className="rail-label">Help</span></button>
          <div className="rail-profile">
            <button className="rail-button profile-button" aria-label="Open profile" aria-expanded={profileOpen} {...railHint("Profile")} onClick={() => { setTooltip(null); setNoticeOpen(false); setProfileOpen(!profileOpen); }}><span className="profile-photo">{profile.name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("")}</span><span className="rail-label profile-nav-label">Profile<small>{profile.name}</small></span></button>

          </div>
        </div>
      </aside>

      <div className="screen-content">
        {screen === "Dashboard" && <StoreDashboard customWidget={customWidget} orders={orders} tickets={tickets} products={products} events={events} onNavigate={goTo} />}
        {screen === "Analytics" && <AnalyticsScreen orders={orders} onNavigate={goTo} />}
        {screen === "Wallet" && <WalletScreen products={products} />}
        {screen === "Products" && <ProductsScreen search={search} products={products} onCreate={(product) => setProducts((current) => [...current, product])} />}
        {screen === "Orders" && <OrdersScreen orders={orders} search={search} onUpdate={(updated) => setOrders((current) => current.map((order) => order.id === updated.id ? updated : order))} />}
        {screen === "Support tickets" && <SupportScreen key={createVersion} initiallyCreate={createTarget === "New ticket"} search={search} tickets={tickets} onChange={setTickets} onClearSearch={() => setSearch("")} />}
        {screen === "Calendar" && <CalendarScreen key={createVersion} initiallyCreate={createTarget === "New event"} mode={calendarMode} setMode={setCalendarMode} events={events} onChange={setEvents} />}
        {screen === "Settings" && <SettingsScreen preferences={preferences} onPreferences={setPreferences} search={search} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {screen === "Help" && <HelpScreen search={search} onNavigate={goTo} />}
      </div>

      {createTarget === "New product" && <NewProductDialog products={products} onClose={() => setCreateTarget("")} onCreate={product => { setProducts(current => [...current, product]); setCreateTarget(""); }} />}
      {createTarget === "New widget" && <SidePanel title="Add a widget" subtitle="Choose what to see on your dashboard" onClose={() => setCreateTarget("")}><div className="widget-preview"><WidgetHead title="Performance" icon={<TrendingUp size={16} />} /><strong>{money(storeOverview(orders, products).grossSales)}</strong><MiniChart area values={storeOverview(orders, products).days.map(day => day.sales)} /><p>Your sales performance over the last seven days.</p></div><button className="primary-button" disabled={customWidget} onClick={() => { setCustomWidget(true); setCreateTarget(""); }}>{customWidget ? "Already on dashboard" : "Add performance widget"}</button></SidePanel>}

      {profileOpen && <ProfilePanel profile={profile} onSave={setProfile} products={products.length} orders={orders.length} tickets={tickets.filter(ticket => ticket.status !== "Resolved").length} onClose={() => setProfileOpen(false)} onSettings={() => goTo("Settings")} onSignOut={() => { setProfileOpen(false); setDialog("Sign out"); }} />}
      {tooltip && createPortal(<span className="rail-tooltip" role="tooltip" style={{ top: tooltip.top }}>{tooltip.text}</span>, document.body)}
      {dialog && <Dialog title={dialog} onClose={() => setDialog("")} />}
    </main>
  );
}

function ActivityPanel({ orders, products, requestDecision, onDecision, read, onMarkRead, onNavigate, onClose }: { orders: StoreOrder[]; products: Product[]; requestDecision: "approved" | "declined" | null; onDecision: (decision: "approved" | "declined") => void; read: boolean; onMarkRead: () => void; onNavigate: (screen: Screen) => void; onClose: () => void }) {
  const summary = storeOverview(orders, products);
  const latestOrder = summary.latestSale;
  return <AnchoredPopover title="Activity" subtitle={read ? "You’re all caught up" : "4 unread updates"} className="activity-side-panel" onClose={onClose} footer={<button className="activity-mark-read" onClick={onMarkRead} disabled={read}><Check size={16} />{read ? "All updates read" : "Mark all as read"}</button>}>
    <div className="activity-timeline">
      <article className="activity-event-card"><span className="activity-event-icon event-icon-pink"><Wallet size={16} /></span><time>4 min ago</time><h3>Antalya Saint sent you a new funds request</h3><div className="activity-request-details"><div><strong>$16,000</strong><small>Via credit card</small></div>{requestDecision ? <span className={`activity-request-result ${requestDecision}`} role="status">{requestDecision === "approved" ? "Approved" : "Declined"}<small>Preview only</small></span> : <div className="activity-request-actions"><button aria-label="Decline funds request in preview" title="Decline request" onClick={() => onDecision("declined")}><X size={14} /></button><button className="request-approve" aria-label="Approve funds request in preview" title="Approve request" onClick={() => onDecision("approved")}><Check size={14} /></button></div>}</div></article>
      <article className="activity-event-card"><span className="activity-event-icon event-icon-purple"><MessageSquare size={16} /></span><time>4 min ago</time><button className="activity-event-link" onClick={() => onNavigate("Support tickets")}><h3>Christopher Shultz sent you a new message</h3><ArrowUpRight size={14} /></button><p>Can you help me with my order?</p></article>
      <article className="activity-event-card"><span className="activity-event-icon event-icon-pink"><ChartColumnIncreasing size={16} /></span><time>4 min ago</time><button className="activity-event-link" onClick={() => onNavigate("Analytics")}><h3>You have new sales statistics</h3><ArrowUpRight size={14} /></button><div className="activity-sales-summary"><div className="activity-stat-chart"><span>{money(Math.max(0, ...summary.days.map(day => day.sales)))}</span><MiniChart values={summary.days.map(day => day.sales)} /></div><span><b>{summary.successfulOrders}</b><small>Orders</small></span></div><div className="activity-event-meta"><span>Last 7 days</span><b>{money(summary.grossSales)}</b></div></article>
      <article className="activity-event-card"><span className="activity-event-icon event-icon-purple"><ShoppingBag size={16} /></span><time>Today</time><button className="activity-event-link" onClick={() => onNavigate("Orders")}><h3>{latestOrder ? `New order ${latestOrder.id}` : "Your orders are up to date"}</h3><ArrowUpRight size={14} /></button>{latestOrder && <><p>{latestOrder.customer} ordered {latestOrder.product}</p><div className="activity-event-meta"><span>{latestOrder.payment.split(" ")[0]}</span><b>{money(latestOrder.total)}</b></div></>}</article>
    </div>
  </AnchoredPopover>;
}

type StoreProfile = { name: string; role: string; email: string; phone: string; timezone: string };

function ProfilePanel({ profile, onSave, products, orders, tickets, onClose, onSettings, onSignOut }: { profile: StoreProfile; onSave: (profile: StoreProfile) => void; products: number; orders: number; tickets: number; onClose: () => void; onSettings: () => void; onSignOut: () => void }) {
  const [view, setView] = useState<"overview" | "edit" | "password">("overview");
  const [notice, setNotice] = useState("");
  const initials = profile.name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("");
  const footer = view === "overview" ? <div className="profile-account-links"><button onClick={() => { setView("edit"); setNotice(""); }}><UserRound size={16} /><span>Edit information</span><ChevronRight size={16} /></button><button onClick={() => { setView("password"); setNotice(""); }}><LockKeyhole size={16} /><span>Change password</span><ChevronRight size={16} /></button><button onClick={onSettings}><Settings size={16} /><span>Account preferences</span><ChevronRight size={16} /></button><button onClick={onSignOut}><LogOut size={16} /><span>Sign out</span><ChevronRight size={16} /></button></div> : <button className="profile-back-link" onClick={() => { setView("overview"); setNotice(""); }}><ChevronLeft size={16} />Back to profile</button>;
  return <SidePanel title={view === "overview" ? "My profile" : view === "edit" ? "Edit information" : "Change password"} className="profile-side-panel" footer={footer} onClose={onClose}>
    {view === "overview" ? <div className="profile-panel-overview"><div className="profile-hero"><div className="profile-avatar-halo"><span className="profile-panel-avatar">{initials}</span><button aria-label="Edit profile" onClick={() => setView("edit")}><UserRound size={14} /></button></div><h3>{profile.name}</h3><p>{profile.role}</p><button className="primary-button" onClick={() => setView("edit")}>Edit profile</button></div><div className="profile-store-stats"><span><b>{products}</b><small>Products</small></span><span><b>{orders}</b><small>Orders</small></span><span><b>{tickets}</b><small>Open tickets</small></span></div><div className="profile-info-section"><h3>Account details</h3><div><Mail size={16} /><span><small>Email</small><b>{profile.email}</b></span></div><div><UserRound size={16} /><span><small>Phone</small><b>{profile.phone || "Not added"}</b></span></div><div><CalendarDays size={16} /><span><small>Time zone</small><b>{profile.timezone}</b></span></div></div>{notice && <p className="profile-save-notice" role="status">{notice}</p>}</div> : view === "edit" ? <form className="store-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const name = String(data.get("name")).trim(); if (!name) return; onSave({ name, role: String(data.get("role")).trim(), email: String(data.get("email")).trim(), phone: String(data.get("phone")).trim(), timezone: String(data.get("timezone")) }); setView("overview"); setNotice("Profile updated for this session."); }}><label>Full name<input name="name" defaultValue={profile.name} required maxLength={80} autoComplete="name" /></label><label>Role<input name="role" defaultValue={profile.role} maxLength={60} /></label><label>Email<input name="email" type="email" defaultValue={profile.email} required autoComplete="email" /></label><label>Phone<input name="phone" type="tel" defaultValue={profile.phone} autoComplete="tel" /></label><label>Time zone<select name="timezone" defaultValue={profile.timezone}><option>Africa/Casablanca</option><option>Europe/London</option><option>Europe/Paris</option><option>America/New_York</option><option>America/Los_Angeles</option><option>UTC</option></select></label><button className="primary-button" type="submit">Save changes</button></form> : <div className="profile-password-view"><span className="profile-security-icon"><LockKeyhole size={24} /></span><h3>Password & security</h3><p>Connect an account provider to change your password securely. Password changes are unavailable in this local preview.</p><button className="secondary-button" onClick={onSettings}><Settings size={16} />Account settings</button></div>}
  </SidePanel>;
}

function Workspace({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [header, ...content] = Children.toArray(children);
  return <section className={`workspace ${className}`}>{header}<div className="page-body">{content}</div></section>;
}

function ScreenTitle({ children, action, center }: { children: React.ReactNode; action?: React.ReactNode; center?: React.ReactNode }) {
  return <div className={`screen-title ${center ? "has-center-content" : ""}`}><h1>{children}</h1>{center && <div className="screen-title-center">{center}</div>}{action}</div>;
}

function StoreDashboard({ orders, tickets, products, events, onNavigate, customWidget = false }: { customWidget?: boolean; orders: StoreOrder[]; tickets: Ticket[]; products: Product[]; events: StoreEvent[]; onNavigate: (screen: Screen) => void }) {
  const [activityIndex, setActivityIndex] = useState(0);
  const summary = storeOverview(orders, products);
  const latestSale = summary.latestSale;
  const openTickets = tickets.filter(ticket => ticket.status !== "Resolved");
  const promotion = events.filter(event => event.kind === "promotion").sort((a, b) => a.date.localeCompare(b.date))[0];
  const activityDate = latestSale ? new Date(latestSale.placedAt) : new Date();
  const activities: { sentence: string; detail: string; destination: Screen; date: Date }[] = [
    { sentence: latestSale ? `${latestSale.customer} ordered ${latestSale.quantity} × ${latestSale.product}.` : "Your store is ready for its first order.", detail: latestSale ? `Order ${latestSale.id}` : "View orders", destination: "Orders", date: activityDate },
    { sentence: promotion ? `“${promotion.title}” is scheduled.` : "Plan your next promotion in the store calendar.", detail: promotion ? `${promotion.time} · Calendar` : "Open calendar", destination: "Calendar", date: promotion ? new Date(`${promotion.date}T12:00:00`) : activityDate },
    { sentence: openTickets.length ? `${openTickets[0].customer} needs help with an order.` : "You’re all caught up with your customer conversations.", detail: `${openTickets.length} open tickets`, destination: "Support tickets", date: activityDate },
  ];
  const activity = activities[activityIndex];
  const maxOrders = Math.max(1, ...summary.days.map(day => day.orders));
  return <Workspace className="home-workspace">
    <ScreenTitle action={<HomeCalendarDropdown onNavigate={onNavigate} />}>Morning, Violett</ScreenTitle>
    <div className={`home-board ${customWidget ? "with-performance-widget" : ""}`}>
      <div className="widget-column updates-column">
        <article className="tile store-activity-tile sentence-activity">
          <HomeWidgetHead title="Store updates" icon={<Activity />} destination={activity.destination} onNavigate={onNavigate} />
          <p className="activity-sentence">{activity.sentence}</p><button className="activity-detail-link" onClick={() => onNavigate(activity.destination)}>{activity.detail}</button>
          <div className="activity-bottom"><time dateTime={dateKey(activity.date)}><span>{activity.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span><small>{activity.date.toLocaleDateString("en-GB", { weekday: "long" })}</small></time><div className="activity-pagination" role="group" aria-label="Store activity">{activities.map((item, index) => <button key={item.destination} className={index === activityIndex ? "activity-dot-active" : ""} aria-label={`Show ${index === 0 ? "latest order" : index === 1 ? "promotion" : "support update"}`} aria-pressed={index === activityIndex} onClick={() => setActivityIndex(index)}><span /></button>)}</div></div>
        </article>
        <article className="tile visits-tile">
          <HomeWidgetHead title="Order volume" icon={<ChartColumnIncreasing />} destination="Orders" onNavigate={onNavigate} />
          <div className="visits-summary"><strong>{summary.totalOrders}</strong><span className="home-metric-caption">Last 7 days</span></div>
          <div className="visits-bars" role="img" aria-label={`Daily orders: ${summary.days.map(day => `${day.date}: ${day.orders}`).join(", ")}`}>{summary.days.map(day => <div className="visits-bar-column" key={day.date}><div className="visits-bar-track"><i title={`${day.label}: ${day.orders} orders`} style={{ height: `${day.orders / maxOrders * 100}%` }} /></div><span>{day.label}</span></div>)}</div>
        </article>
      </div>
      <div className="widget-column">
        <article className="tile gradient-tile">
          <HomeWidgetHead title="Fulfilment" icon={<PackageCheck />} destination="Orders" onNavigate={onNavigate} />
          <div className="desktop-breakdown"><div className="pie-chart fulfilment-pie" style={{ background: `conic-gradient(#f6daee 0 ${summary.fulfilmentPercent}%, #ffffff26 ${summary.fulfilmentPercent}% 100%)` }} /><div><strong>{summary.fulfilmentPercent}%</strong><small>{summary.delivered}/{summary.successfulOrders} delivered</small></div></div>
        </article>
        <article className="tile earnings-tile">
          <HomeWidgetHead title="Gross sales" icon={<CreditCard />} destination="Analytics" onNavigate={onNavigate} />
          <div className="earnings-content"><b className="earnings-amount">{money(summary.grossSales)}</b><small className="tile-caption">{summary.successfulOrders} orders</small></div>
          <MiniChart area values={summary.days.map(day => day.sales)} />
          <span className="revenue-change home-sales-context"><span>Last 7 days</span><small>Avg. {money(summary.averageOrder)}</small></span>
        </article>
      </div>
      <div className="widget-column funds-column">
        <article className="tile funds-tile">
          <HomeWidgetHead title="Sales overview" icon={<TrendingUp />} destination="Analytics" onNavigate={onNavigate} />
          <div className="funds-head"><span>Avg. order</span><span>{money(summary.averageOrder)}<small>Last 7 days</small></span></div>
          <MiniChart area axes values={summary.days.map(day => day.sales)} />
          <div className="funds-stats"><span><i className="ring pink-ring" /><b>{summary.successfulOrders}</b><small>Orders</small></span><span><i className="ring gray-ring" /><b>{summary.processing}</b><small>Processing</small></span></div>
        </article>
        <div className="bottom-widget-pair">
          <article className="tile sale-tile sentence-sale"><HomeWidgetHead title="Latest order" icon={<ShoppingBag />} destination="Orders" onNavigate={onNavigate} /><div className="sale-sentence-bottom"><p>{latestSale ? `${latestSale.customer} ordered` : "No orders yet"}</p>{latestSale && <><button onClick={() => onNavigate("Products")}>{latestSale.product}</button><time dateTime={latestSale.placedAt}>{new Date(latestSale.placedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {money(latestSale.total)}</time></>}</div></article>
          <article className="tile stock-alert-tile"><HomeWidgetHead title="Stock alerts" icon={<Package />} destination="Products" onNavigate={onNavigate} /><div className="stock-alert-content"><strong>{summary.stockAlerts.length}</strong><p>{summary.stockAlerts.length ? "To restock" : "All stocked"}</p><small>{summary.outOfStock} out of stock</small></div></article>
        </div>
      </div>
      {customWidget && <article className="tile added-performance-widget"><HomeWidgetHead title="Performance" icon={<TrendingUp />} destination="Analytics" onNavigate={onNavigate} /><div className="chart-summary"><strong>{money(summary.grossSales)}</strong><span>Last 7 days</span></div><MiniChart area values={summary.days.map(day => day.sales)} /><div className="performance-totals"><span><b>{summary.successfulOrders}</b>Orders</span><span><b>{money(summary.averageOrder)}</b>Average order</span></div></article>}
    </div>
  </Workspace>;
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
                  return <button key={index} className={`${endpoint ? "date-selected" : inside ? "date-in-range" : ""} ${+date === +today ? "date-today" : ""}`} aria-pressed={endpoint || inside} aria-label={formatCalendarDate(date)} onClick={() => selectDate(date)}>{index + 1}</button>;
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

function MiniChart({ area = false, axes = false, values }: { area?: boolean; axes?: boolean; values?: number[] }) {
  const gradientId = useId();
  const maximum = Math.max(1, ...(values ?? []));
  const points = values?.map((value, index) => ({ x: 8 + index / Math.max(1, values.length - 1) * 284, y: 144 - value / maximum * 112 }));
  const curve = points?.length ? points.map((point, index) => index ? `C${(points[index - 1].x + point.x) / 2} ${points[index - 1].y}, ${(points[index - 1].x + point.x) / 2} ${point.y}, ${point.x} ${point.y}` : `M${point.x} ${point.y}`).join(" ") : "M8 106 C32 100 45 88 69 88 S102 64 122 71 S154 36 181 54 S218 91 240 82 S269 103 292 114";
  const peak = points?.reduce((best, point) => point.y < best.y ? point : best, points[0]) ?? { x: 181, y: 54 };
  return <svg className={`mini-chart ${axes ? "funds-area-chart" : ""}`} viewBox="0 0 300 160" preserveAspectRatio="none" role="img" aria-label={values ? `Daily sales: ${values.map(value => money(value)).join(", ")}` : "Sales trend"}>
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d84dc1" stopOpacity=".26" /><stop offset="65%" stopColor="#ae3fa8" stopOpacity=".07" /><stop offset="100%" stopColor="#ae3fa8" stopOpacity="0" /></linearGradient></defs>
    {area && <path d={`${curve} L292 152 H8 Z`} fill={`url(#${gradientId})`} />}
    {axes && <path d="M4 8V152H296" fill="none" stroke="#ffffff24" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
    <path d={curve} fill="none" stroke="#d64abd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    <circle cx={peak.x} cy={peak.y} r="3.5" fill="#e56bce" />
  </svg>;
}

function AnalyticsScreen({ orders, onNavigate }: { orders: StoreOrder[]; onNavigate: (screen: Screen) => void }) {
  return <Workspace>
    <ScreenTitle action={<HomeCalendarDropdown onNavigate={onNavigate} />}>Analytics</ScreenTitle>
    <div className="analytics-layout">
      <article className="widget store-stats"><WidgetHead title="Store visits" icon={<ChartColumnIncreasing size={16} />} /><div className="widget-title-row"><span>8,492 visits</span><span className="metric-change">+18%<small>This week</small></span></div><div className="bar-chart"><div className="bar-grid"><i /><i /><i /><i /></div><div className="bar purple-bar" /><div className="bar pink-bar" /></div><div className="chart-legend"><span><i className="legend-line pink-line" />76% Organic search</span><span><i className="legend-line gray-line" />24% Other sources</span></div></article>
      <article className="widget sales-widget"><WidgetHead title="Recent sales" icon={<ShoppingBag size={16} />} /><div className="analytics-sales-list">{orders.filter(order => order.status !== "Cancelled").map(order => <div className="sale-row" key={order.id}><div><b>{order.customer}</b><small>{order.product} · {order.id}</small></div><strong>{money(order.total)}</strong></div>)}</div></article>
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
    <article className="widget wallet-balance"><WidgetHead title="Balance" icon={<Wallet size={16} />} /><div className="balance-summary"><div><strong className="store-balance-number">$372,941<span>.00</span></strong><small className="metric-change">+7% compared to last week</small></div><div className="wallet-balance-legend"><span><i />Income <b>+11%</b></span><span><i />Expenses <b>−23%</b></span></div></div><TrendChart area /><div className="chart-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></article>
    <article className="widget best-products"><WidgetHead title="Best performing products" icon={<Package size={16} />} /><div className="best-products-list">{best.map((product, index) => <div className="best-product" key={product.name}><div><span><small>{String(index + 1).padStart(2, "0")}</small>{product.name}</span><b>{money(product.sales)}</b></div><div className="horizontal-bar"><i style={{ width: `${best[0].sales ? product.sales / best[0].sales * 100 : 0}%` }} /></div></div>)}</div></article>
    <article className="widget wallet-performance"><WidgetHead title="Performance" icon={<ChartColumnIncreasing size={16} />} /><div className="balance-bottom"><div><strong>$78,192</strong><small>+12% last month</small></div><div className="performance-key"><span><i />67% Income</span><span><i />33% Expenses</span></div></div><div className="wallet-bars" role="img" aria-label="Monthly performance, income 67 percent and expenses 33 percent">{[22, 38, 29, 48, 34, 57, 39, 68, 51, 74, 43, 61, 82, 57, 68].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article>
    <article className="widget payout-history"><WidgetHead title="Payout history" icon={<CreditCard size={16} />} /><div className="payout-list">{[{ date: "26 Oct 2026", amount: 2840, status: "Paid" }, { date: "19 Oct 2026", amount: 3195, status: "Paid" }, { date: "12 Oct 2026", amount: 2450, status: "Paid" }].map(payout => <div className="payout-row" key={payout.date}><span className="feed-icon"><ArrowUpRight size={16} /></span><span><b>Store payout</b><small>{payout.date} · Bank •••• 0094</small></span><span><b>{money(payout.amount)}</b><small className="metric-change">{payout.status}</small></span></div>)}</div></article>
  </div></Workspace>;
}

const productData = [
  { name: "Denim Jeans", type: "Men. Pants", color: "jeans", stock: 278, orders: 157, sales: 31491, sizes: "44 — 52", price: "$89" },
  { name: "Colorful Shirt", type: "Men. Tops", color: "shirt", stock: 124, orders: 86, sales: 12840, sizes: "M, L, XL", price: "$65" },
  { name: "Texture Shirt", type: "Men. Shirts", color: "texture", stock: 0, orders: 203, sales: 24765, sizes: "M, L, XL, XXL", price: "$75" },
  { name: "Chelsea Boots", type: "Men. Shoes", color: "boots", stock: 84, orders: 96, sales: 18720, sizes: "40 — 46", price: "$195" },
  { name: "Classic T-Shirt", type: "Men. Basics", color: "tee", stock: 192, orders: 118, sales: 8260, sizes: "S, M, L, XL", price: "$35" },
  { name: "Linen Shirt", type: "Men. Shirts", color: "linen", stock: 68, orders: 54, sales: 4320, sizes: "S, M, L, XL", price: "$80" },
  { name: "Check Shirt", type: "Men. Shirts", color: "check", stock: 96, orders: 45, sales: 2925, sizes: "S, M, L", price: "$65" },
  { name: "Puma Future Rider", type: "Men. Shoes", color: "trainers", stock: 42, orders: 62, sales: 7440, sizes: "40 — 46", price: "$120" },
  { name: "Air Jordan Sneakers", type: "Men. Shoes", color: "sneakers", stock: 36, orders: 48, sales: 7200, sizes: "40 — 45", price: "$150" },
  { name: "Everyday Dress", type: "Women. Dresses", color: "dress", stock: 74, orders: 38, sales: 2660, sizes: "S, M, L", price: "$70" },
  { name: "Leather Handbag", type: "Women. Bags", color: "bag", stock: 24, orders: 32, sales: 3840, sizes: "One size", price: "$120" },
  { name: "Everyday Backpack", type: "Women. Bags", color: "backpack", stock: 56, orders: 28, sales: 1960, sizes: "One size", price: "$70" },
];

type Product = (typeof productData)[number];

function ProductsScreen({ search, products, onCreate }: { search: string; products: Product[]; onCreate: (product: Product) => void }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const collection = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState("popular");
  const product = products.find(item => item.name === selected);
  const visible = products.filter(item => `${item.name} ${item.type}`.toLowerCase().includes(search.toLowerCase()) && (stockFilter === "all" || (stockFilter === "in" ? item.stock > 0 : item.stock === 0))).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "price" ? Number(a.price.replace(/[^0-9.]/g, "")) - Number(b.price.replace(/[^0-9.]/g, "")) : b.sales - a.sales);
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const activePage = Math.min(page, pageCount);
  const pageProducts = visible.slice((activePage - 1) * pageSize, activePage * pageSize);
  useEffect(() => { setPage(1); }, [search, stockFilter, sort, pageSize]);
  useEffect(() => { collection.current?.parentElement?.scrollTo({ top: 0 }); }, [activePage, pageSize]);
  return <Workspace><ScreenTitle action={<div className="product-toolbar store-toolbar">
    <div className="product-view-toggle" role="group" aria-label="Product view"><button className={view === "grid" ? "view-selected" : ""} aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={16} /></button><button className={view === "list" ? "view-selected" : ""} aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={16} /></button></div>
    <details className="product-filter-dropdown"><summary className="secondary-button"><SlidersHorizontal size={16} /><span>Filters{stockFilter !== "all" ? " (1)" : ""}</span></summary><div className="product-filter-menu"><label>Availability<select value={stockFilter} onChange={event => setStockFilter(event.target.value)}><option value="all">All products</option><option value="in">In stock</option><option value="out">Out of stock</option></select></label><label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="popular">Best selling</option><option value="name">Name A–Z</option><option value="price">Price: low to high</option></select></label><button className="text-button" onClick={() => { setStockFilter("all"); setSort("popular"); }}>Reset filters</button></div></details>
    <button className="primary-button" onClick={() => setCreateOpen(true)}><Plus size={16} /><span>New product</span></button>
  </div>}>Products</ScreenTitle>
    <div ref={collection} className={`products-collection products-${view}`}>
      {pageProducts.map(item => <article className={`catalog-product ${selected === item.name ? "product-active" : ""}`} key={item.name}>
        <button className={`product-image ${item.color}`} aria-label={`View ${item.name}`} onClick={() => setSelected(item.name)}><ProductPhoto product={item} /><span className="edit-round"><ArrowUpRight size={14} /></span></button>
        <div className="catalog-product-info"><button className="product-name-button" onClick={() => setSelected(item.name)}>{item.name}</button><small>{item.type}</small><div className="catalog-product-options"><span className="product-swatches" aria-label="Available colors"><i /><i /><i /></span><span>{item.sizes || "One size"}</span></div></div>
        <div className="catalog-product-stock"><span className={`inventory ${item.stock > 0 ? "in-stock" : "out-stock"}`}>{item.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}</span></div><span className="catalog-product-price">{item.price}</span>
        <button className="product-stats-trigger" aria-label={`View ${item.name} details`} onClick={() => setSelected(item.name)}><ArrowUpRight size={16} /></button>
      </article>)}
      {!visible.length && <div className="store-empty"><Package size={28} /><h2>No products found</h2><p>Try another search or reset your filters.</p><button className="secondary-button" onClick={() => { setStockFilter("all"); setSort("popular"); }}>Reset filters</button></div>}
    </div>
    <nav className="catalog-pagination" aria-label="Product pagination"><span>{visible.length ? `${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, visible.length)}` : "0"} of {visible.length} products</span><label>Per page<select aria-label="Products per page" value={pageSize} onChange={event => setPageSize(Number(event.target.value))}><option value={8}>8</option><option value={12}>12</option></select></label><div><button className="icon-button" aria-label="Previous products page" disabled={activePage === 1} onClick={() => setPage(activePage - 1)}><ChevronLeft size={16} /></button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={activePage === index + 1 ? "page-selected" : ""} aria-label={`Products page ${index + 1}`} aria-current={activePage === index + 1 ? "page" : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button className="icon-button" aria-label="Next products page" disabled={activePage === pageCount} onClick={() => setPage(activePage + 1)}><ChevronRight size={16} /></button></div></nav>
    {createOpen && <NewProductDialog products={products} onClose={() => setCreateOpen(false)} onCreate={item => { onCreate(item); setCreateOpen(false); }} />}
    {product && <SidePanel title={product.name} subtitle="Product details" onClose={() => setSelected(null)}>
      <div className={`product-detail-art product-image ${product.color}`}><ProductPhoto product={product} /></div>
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

function ProductPhoto({ product }: { product: Product }) {
  return <Image src={`/products/${product.color}.${["jeans", "boots"].includes(product.color) ? "jpg" : "webp"}`} alt={product.name} fill sizes="(max-width: 600px) 45vw, (max-width: 1100px) 30vw, 23vw" className={`catalog-photo photo-${product.color}`} />;
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

function SupportScreen({ search, tickets, onChange, onClearSearch, initiallyCreate = false }: { initiallyCreate?: boolean; search: string; tickets: Ticket[]; onChange: (tickets: Ticket[]) => void; onClearSearch: () => void }) {
  const [selected, setSelected] = useState(tickets[0]?.id ?? "");
  const [status, setStatus] = useState("All tickets");
  const [editing, setEditing] = useState(false);
  const [deletedTicket, setDeletedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [createOpen, setCreateOpen] = useState(initiallyCreate);
  const messages = useRef<HTMLDivElement>(null);
  const visible = tickets.filter(ticket => (status === "Archived" ? ticket.archived : !ticket.archived && (status === "All tickets" || ticket.status === status)) && [search].every(query => `${ticket.id} ${ticket.customer} ${ticket.email} ${ticket.subject} ${ticket.messages.map(message => message.body).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())));
  const ticket = visible.find(item => item.id === selected) ?? visible[0];
  const update = (updated: Ticket) => onChange(tickets.map(item => item.id === updated.id ? updated : item));
  useEffect(() => { if (messages.current) messages.current.scrollTop = messages.current.scrollHeight; }, [ticket?.id, ticket?.messages.length]);
  return <Workspace><ScreenTitle action={<div className="store-toolbar"><label className="select-button"><select aria-label="Ticket status filter" value={status} onChange={event => setStatus(event.target.value)}>{["All tickets", "Open", "Pending", "Resolved", "Archived"].map(value => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></label><button className="primary-button" onClick={() => setCreateOpen(true)}><Plus size={16} /><span>New ticket</span></button></div>}>Support tickets</ScreenTitle>
    <div className="support-layout"><aside className="support-conversations"><div className="support-list-heading"><span>Conversations</span><small>{visible.length}</small></div><div className="support-ticket-list">{visible.map(item => <button className={`support-ticket ${ticket?.id === item.id ? "ticket-selected" : ""}`} key={item.id} onClick={() => { setSelected(item.id); setReply(""); }}><span className="person-pic">{item.customer.split(" ").map(name => name[0]).join("")}</span><span><b>{item.customer}</b><small>{item.subject}</small><em>{item.id} · {item.status}</em></span>{item.priority === "High" && <i className="ticket-priority-dot" aria-label="High priority" />}</button>)}{!visible.length && <div className="store-empty"><TicketIcon size={24} /><p>No matching tickets.</p></div>}</div></aside>
      {ticket ? <section className="support-conversation"><header className="support-chat-head"><div><h2>{ticket.subject}</h2><small>{ticket.customer} · {ticket.email}</small></div><div className="conversation-actions" role="group" aria-label="Conversation actions"><button className={`icon-button ${ticket.status === "Resolved" ? "action-active" : ""}`} aria-label={ticket.status === "Resolved" ? "Reopen ticket" : "Mark as solved"} title={ticket.status === "Resolved" ? "Reopen ticket" : "Mark as solved"} onClick={() => update({ ...ticket, status: ticket.status === "Resolved" ? "Open" : "Resolved" })}><Check size={17} /></button><button className="icon-button" aria-label={ticket.archived ? "Restore ticket" : "Archive ticket"} title={ticket.archived ? "Restore ticket" : "Archive ticket"} onClick={() => update({ ...ticket, archived: !ticket.archived })}>{ticket.archived ? <ArchiveRestore size={17} /> : <Archive size={17} />}</button><button className="icon-button" aria-label="Edit ticket" title="Edit ticket" onClick={() => setEditing(true)}><Pencil size={16} /></button><button className="icon-button" aria-label="Delete ticket" title="Delete ticket" onClick={() => { setDeletedTicket(ticket); onChange(tickets.filter(item => item.id !== ticket.id)); }}><Trash2 size={16} /></button></div></header>
        <div className="support-chat-messages" ref={messages} aria-live="polite">{ticket.messages.map(message => <div className={`support-message message-${message.sender}`} key={message.id}><small>{message.sender === "agent" ? "You" : ticket.customer}</small><p>{message.body}</p></div>)}</div>
        <form className="support-reply" onSubmit={event => { event.preventDefault(); if (!reply.trim()) return; update({ ...ticket, status: ticket.status === "Resolved" ? "Open" : ticket.status, messages: [...ticket.messages, { id: crypto.randomUUID(), sender: "agent", body: reply.trim() }] }); setReply(""); }}><label className="sr-only" htmlFor="ticket-reply">Reply to {ticket.customer}</label><textarea id="ticket-reply" placeholder="Write a reply…" value={reply} onChange={event => setReply(event.target.value)} rows={2} /><div><small>Reply to {ticket.customer.split(" ")[0]}</small><button className="primary-button" disabled={!reply.trim()} type="submit"><Send size={14} />Send reply</button></div></form>
      </section> : <section className="support-conversation store-empty"><MessageSquare size={32} /><h2>No conversation selected</h2><p>Choose a ticket or create a new one.</p></section>}
    </div>
    {deletedTicket && <div className="undo-notice" role="status">Ticket deleted<button onClick={() => { onChange([deletedTicket, ...tickets]); setSelected(deletedTicket.id); setDeletedTicket(null); }}>Undo</button><button className="icon-button" aria-label="Dismiss notification" onClick={() => setDeletedTicket(null)}><X size={14} /></button></div>}
    {editing && ticket && <SidePanel title="Edit ticket" onClose={() => setEditing(false)}><form className="store-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const subject = String(data.get("subject")).trim(); if (!subject) return; update({ ...ticket, subject, priority: data.get("priority") as Ticket["priority"], status: data.get("status") as Ticket["status"] }); setEditing(false); }}><label>Subject<input name="subject" defaultValue={ticket.subject} required maxLength={140} /></label><label>Priority<select name="priority" defaultValue={ticket.priority}><option>Normal</option><option>High</option></select></label><label>Status<select name="status" defaultValue={ticket.status}><option>Open</option><option>Pending</option><option>Resolved</option></select></label><button className="primary-button">Save changes</button></form></SidePanel>}
    {createOpen && <SidePanel title="New ticket" subtitle="Start a customer support conversation" onClose={() => setCreateOpen(false)}><form className="store-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const newTicket: Ticket = { id: `T-${Math.max(1042, ...tickets.map(item => Number(item.id.slice(2)))) + 1}`, customer: String(data.get("customer")).trim(), email: String(data.get("email")).trim(), subject: String(data.get("subject")).trim(), priority: data.get("priority") as Ticket["priority"], status: "Open", messages: [{ id: crypto.randomUUID(), sender: "agent", body: String(data.get("message")).trim() }] }; if (!newTicket.customer || !newTicket.subject || !newTicket.messages[0].body) return; onChange([newTicket, ...tickets]); onClearSearch(); setSelected(newTicket.id); setStatus("All tickets"); setCreateOpen(false); }}><label>Customer name<input name="customer" required maxLength={80} /></label><label>Email address<input name="email" type="email" required /></label><label>Subject<input name="subject" required maxLength={140} /></label><label>Priority<select name="priority"><option>Normal</option><option>High</option></select></label><label>Message<textarea name="message" rows={5} required /></label><button className="primary-button" type="submit"><Plus size={16} />Create ticket</button></form></SidePanel>}
  </Workspace>;
}

function CalendarScreen({ mode, setMode, events, onChange, initiallyCreate = false }: { initiallyCreate?: boolean; mode: CalendarMode; setMode: (mode: CalendarMode) => void; events: StoreEvent[]; onChange: (events: StoreEvent[]) => void }) {
  const [anchor, setAnchor] = useState(() => { const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); });
  const [createOpen, setCreateOpen] = useState(initiallyCreate);
  const [draftDate, setDraftDate] = useState(dateKey(anchor));
  const [selectedEvent, setSelectedEvent] = useState<StoreEvent | null>(null);
  const viewMenu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (!viewMenu.current?.contains(event.target as Node)) viewMenu.current?.removeAttribute("open"); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && viewMenu.current?.open) { viewMenu.current.removeAttribute("open"); viewMenu.current.querySelector("summary")?.focus(); } };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, []);
  const dates = calendarDates(anchor, mode);
  const label = mode === "Year" ? String(anchor.getFullYear()) : mode === "Day" ? anchor.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : mode === "Week" ? `${dates[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${dates[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : anchor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const addEvent = (date: string) => { setDraftDate(date); setCreateOpen(true); };
  return <Workspace className="calendar-workspace">
    <div className="screen-title calendar-heading">
      <div className="calendar-heading-title"><h1>Calendar</h1><details className="calendar-view-menu" ref={viewMenu}><summary aria-label="Calendar view">{mode}<ChevronDown size={16} /></summary><div className="calendar-view-options" role="group" aria-label="Choose calendar view">{(["Year", "Month", "Week", "Day"] as CalendarMode[]).map(view => <button key={view} aria-pressed={mode === view} className={mode === view ? "selected" : ""} onClick={() => { setMode(view); viewMenu.current?.removeAttribute("open"); viewMenu.current?.querySelector("summary")?.focus(); }}>{view}</button>)}</div></details></div>
      <div className="calendar-date-navigation"><button className="icon-button" aria-label={`Previous ${mode.toLowerCase()}`} onClick={() => setAnchor(shiftCalendar(anchor, mode, -1))}><ChevronLeft size={16} /></button><span>{label}</span><button className="icon-button" aria-label={`Next ${mode.toLowerCase()}`} onClick={() => setAnchor(shiftCalendar(anchor, mode, 1))}><ChevronRight size={16} /></button></div>
    </div>
    {mode === "Year" ? <div className="calendar-year-grid">{dates.map(month => <section className="calendar-year-month" key={dateKey(month)}><button className="calendar-month-link" onClick={() => { setAnchor(month); setMode("Month"); }}>{month.toLocaleDateString("en-GB", { month: "long" })}<ArrowUpRight size={14} /></button><div className="calendar-mini-grid">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`weekday-${index}`}>{day}</span>)}{calendarDates(month, "Month").map(date => date.getMonth() === month.getMonth() ? <button key={dateKey(date)} aria-label={`View ${formatCalendarDate(date)}`} className={events.some(event => event.date === dateKey(date)) ? "has-events" : ""} onClick={() => { setAnchor(date); setMode("Day"); }}>{date.getDate()}</button> : <span key={dateKey(date)} />)}</div></section>)}</div> : mode === "Month" ? <div className="store-calendar"><div className="store-calendar-weekdays">{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => <span key={day}>{day}</span>)}</div><div className="store-calendar-month-grid" style={{ gridTemplateRows: `repeat(${dates.length / 7}, minmax(88px, 1fr))` }}>{dates.map(date => <div className={`store-calendar-cell ${date.getMonth() !== anchor.getMonth() ? "outside-month" : ""} ${dateKey(date) === dateKey(anchor) ? "calendar-anchor" : ""}`} key={dateKey(date)}><button className="calendar-date-number" aria-label={`Add event on ${formatCalendarDate(date)}`} onClick={() => addEvent(dateKey(date))}>{date.getDate()}</button><div className="calendar-cell-events">{events.filter(event => event.date === dateKey(date)).sort((a, b) => a.time.localeCompare(b.time)).map(event => <button className={`calendar-event event-${event.kind}`} key={event.id} onClick={() => setSelectedEvent(event)}><time>{event.time}</time>{event.title}</button>)}</div></div>)}</div></div> : <div className={`calendar-agenda agenda-${mode.toLowerCase()}`}>{dates.map(date => <section className="agenda-day" key={dateKey(date)}><header><span>{date.toLocaleDateString("en-GB", { weekday: "short" })}</span><b>{date.getDate()}</b><button aria-label={`Add event ${dateKey(date)}`} onClick={() => addEvent(dateKey(date))}><Plus size={14} /></button></header><div>{events.filter(event => event.date === dateKey(date)).sort((a, b) => a.time.localeCompare(b.time)).map(event => <button className={`agenda-event event-${event.kind}`} key={event.id} onClick={() => setSelectedEvent(event)}><time>{event.time}</time><strong>{event.title}</strong><small>{event.kind}</small></button>)}{!events.some(event => event.date === dateKey(date)) && <p className="agenda-empty">No events</p>}</div></section>)}</div>}
    {createOpen && <SidePanel title="Add event" onClose={() => setCreateOpen(false)}><form className="store-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const title = String(data.get("title")).trim(); if (!title) return; onChange([...events, { id: crypto.randomUUID(), title, date: String(data.get("date")), time: String(data.get("time")), kind: data.get("kind") as StoreEvent["kind"] }]); setCreateOpen(false); }}><label>Title<input name="title" required maxLength={120} /></label><label>Date<input name="date" type="date" defaultValue={draftDate} required /></label><label>Time<input name="time" type="time" defaultValue="09:00" required /></label><label>Type<select name="kind"><option value="task">Task</option><option value="promotion">Promotion</option><option value="payout">Payout</option></select></label><button className="primary-button" type="submit">Create event</button></form></SidePanel>}
    {selectedEvent && <SidePanel title={selectedEvent.title} subtitle="Calendar event" onClose={() => setSelectedEvent(null)}><div className="detail-data-grid"><span>Date<b>{selectedEvent.date}</b></span><span>Time<b>{selectedEvent.time}</b></span><span>Type<b>{selectedEvent.kind}</b></span></div><button className="secondary-button" onClick={() => { onChange(events.filter(event => event.id !== selectedEvent.id)); setSelectedEvent(null); }}>Remove event</button></SidePanel>}
  </Workspace>;
}

function AnchoredPopover({ title, subtitle, children, footer, className = "", onClose }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode; className?: string; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  const headingId = useId();
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.current?.focus();
    const outside = (event: PointerEvent) => { if (!panel.current?.parentElement?.contains(event.target as Node)) close.current(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { close.current(); trigger?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  return <section className={`anchored-popover ${className}`} ref={panel} tabIndex={-1} role="dialog" aria-labelledby={headingId}><header className="popover-heading"><div><h2 id={headingId}>{title}</h2>{subtitle && <small>{subtitle}</small>}</div><button className="icon-button" aria-label={`Close ${title}`} onClick={onClose}><X size={17} /></button></header><div className="popover-body">{children}</div>{footer && <footer>{footer}</footer>}</section>;
}

const settingsSections = [
  { name: "Customizations", caption: "Theme and typography", icon: SlidersHorizontal },
  { name: "General", caption: "Workspace preferences", icon: Settings },
  { name: "Notifications", caption: "Store activity", icon: Activity },
  { name: "Privacy", caption: "Data and permissions", icon: LockKeyhole },
];
type Preferences = { fontSize: number; titleSize: number; compact: boolean; salesUpdates: boolean; ticketUpdates: boolean };
const defaultPreferences: Preferences = { fontSize: 14, titleSize: 24, compact: false, salesUpdates: true, ticketUpdates: true };
function SettingsScreen({ darkMode, setDarkMode, search = "", preferences = defaultPreferences, onPreferences = () => {} }: { darkMode: boolean; setDarkMode: (mode: boolean) => void; search?: string; preferences?: Preferences; onPreferences?: (value: Preferences) => void }) {
  const [section, setSection] = useState("Customizations");
  const visible = settingsSections.filter(item => `${item.name} ${item.caption}`.toLowerCase().includes(search.toLowerCase()));
  const active = visible.find(item => item.name === section) ?? visible[0];
  const toggle = (field: "compact" | "salesUpdates" | "ticketUpdates") => onPreferences({ ...preferences, [field]: !preferences[field] });
  return <Workspace><ScreenTitle>Settings</ScreenTitle><div className="settings-layout split-workspace"><aside className="settings-menu"><div className="support-list-heading"><span>Preferences</span><small>{visible.length}</small></div>{visible.map(({ name, caption, icon: Icon }) => <button className={active?.name === name ? "settings-selected" : ""} aria-pressed={active?.name === name} onClick={() => setSection(name)} key={name}><span><Icon size={16} /></span><b>{name}<small>{caption}</small></b><ChevronRight size={14} /></button>)}</aside><div className="settings-main">{active ? <><div className="settings-heading"><span><h2>{active.name}</h2><small>{active.caption}</small></span><button onClick={() => { setDarkMode(true); onPreferences(defaultPreferences); }}><RotateCcw size={14} />Reset all</button></div>
    {active.name === "Customizations" && <><SettingRow label="Main display theme" caption={darkMode ? "Dark mode" : "Light mode"}><button className={`toggle ${darkMode ? "toggle-on" : ""}`} role="switch" aria-checked={darkMode} onClick={() => setDarkMode(!darkMode)} aria-label="Dark mode"><i /></button></SettingRow><SettingRow label="Typography" caption="One typeface across your workspace"><span className="setting-value">Inter</span></SettingRow><SettingRow label="Text size" caption={`${preferences.fontSize}px · Body and interface text`}><input aria-label="Text size" className="range-setting" type="range" min="12" max="16" value={preferences.fontSize} onChange={event => onPreferences({ ...preferences, fontSize: Number(event.target.value) })} /></SettingRow><SettingRow label="Page title size" caption={`${preferences.titleSize}px · Page headings`}><input aria-label="Page title size" className="range-setting" type="range" min="22" max="30" value={preferences.titleSize} onChange={event => onPreferences({ ...preferences, titleSize: Number(event.target.value) })} /></SettingRow><div className="typography-preview"><small>TYPOGRAPHY PREVIEW</small><h3>Your store, at a glance</h3><p>A consistent rhythm for every product, conversation, and insight.</p><span>Secondary information and labels</span></div></>}
    {active.name === "General" && <><SettingRow label="Compact lists" caption="Reduce spacing in sales and conversation lists"><button role="switch" aria-checked={preferences.compact} className={`toggle ${preferences.compact ? "toggle-on" : ""}`} onClick={() => toggle("compact")} aria-label="Compact lists"><i /></button></SettingRow><SettingRow label="Store currency" caption="Used for prices, sales, and payouts"><span className="setting-value">USD · US Dollar</span></SettingRow><SettingRow label="Time zone" caption="Calendar and store dates"><span className="setting-value">Africa/Casablanca</span></SettingRow><SettingRow label="Central search" caption="Search products, orders, tickets, settings, and help"><span className="setting-value">Contextual</span></SettingRow></>}
    {active.name === "Notifications" && <><SettingRow label="Sales updates" caption="Show the activity indicator for new sales"><button role="switch" aria-checked={preferences.salesUpdates} className={`toggle ${preferences.salesUpdates ? "toggle-on" : ""}`} onClick={() => toggle("salesUpdates")} aria-label="Sales updates"><i /></button></SettingRow><SettingRow label="Support updates" caption="Show the support indicator in navigation"><button role="switch" aria-checked={preferences.ticketUpdates} className={`toggle ${preferences.ticketUpdates ? "toggle-on" : ""}`} onClick={() => toggle("ticketUpdates")} aria-label="Support updates"><i /></button></SettingRow></>}
    {active.name === "Privacy" && <div className="settings-explanation"><LockKeyhole size={28} /><h3>Your workspace data</h3><p>This template uses sample store data. Product edits, conversations, and events stay in this browser session. Reloading resets the session.</p><p>Payments, account authentication, and external messages are not connected.</p></div>}
  </> : <div className="store-empty"><Search size={28} /><h2>No settings found</h2><p>Try “theme”, “typography”, or “activity”.</p></div>}</div></div></Workspace>;
}

const helpArticles = [
  { title: "Getting started", category: "Your workspace", icon: LayoutDashboard, destination: "Dashboard" as Screen, text: "Your dashboard brings together store updates, order volume, sales, and stock alerts. Open any widget’s arrow to see more detail.", steps: ["Use the sidebar to move between pages.", "Search from the top bar; results adapt to the page you’re viewing.", "Use the back and forward arrows to revisit your pages."] },
  { title: "Manage your products", category: "Catalog and inventory", icon: Package, destination: "Products" as Screen, text: "Explore your catalog in grid or list view, filter availability, and track each product’s performance.", steps: ["Use Add → New product to create a product.", "Choose a page or change the number of products shown.", "Open a product to view inventory, orders, and earnings."] },
  { title: "Orders and payments", category: "Sales and payouts", icon: Wallet, destination: "Orders" as Screen, text: "Find orders by customer, product, or order number. The Wallet page brings your balance, performance, and payouts into one view.", steps: ["Filter orders by status or sort by date and total.", "Open an order to see items and customer details.", "Update fulfilment status from the order details panel."] },
  { title: "Customer conversations", category: "Support tickets", icon: MessageSquare, destination: "Support tickets" as Screen, text: "Keep the conversation in focus while browsing customer tickets in the left-hand list.", steps: ["Search for support tickets from the top navigation.", "Choose a conversation and write your reply below the messages.", "Use the header icons to solve, archive, edit, or delete. Deleted tickets can be undone."] },
  { title: "Plan your calendar", category: "Events and tasks", icon: CalendarDays, destination: "Calendar" as Screen, text: "Plan promotions, payouts, and store tasks in year, month, week, or day view.", steps: ["Move between dates with the arrow buttons.", "Use Add → New event or select a date to schedule an event.", "Open an event to review its date, time, and type."] },
  { title: "Make it yours", category: "Appearance and preferences", icon: SlidersHorizontal, destination: "Settings" as Screen, text: "Keep a consistent look across every screen with shared typography, colors, and spacing.", steps: ["Choose your display theme and typography sizes in Settings.", "Use Add → New widget to feature Performance on your dashboard.", "Open Activity in the top bar to review updates and mark them as read."] },
];
function HelpScreen({ search, onNavigate }: { search: string; onNavigate: (screen: Screen) => void }) {
  const [selected, setSelected] = useState("Getting started");
  const visible = helpArticles.filter(article => `${article.title} ${article.category} ${article.text} ${article.steps.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  const article = visible.find(item => item.title === selected) ?? visible[0];
  return <Workspace><ScreenTitle>Help center</ScreenTitle><div className="settings-layout help-layout split-workspace"><aside className="settings-menu"><div className="support-list-heading"><span>Browse guides</span><small>{visible.length}</small></div>{visible.map(({ title, category, icon: Icon }) => <button key={title} className={article?.title === title ? "settings-selected" : ""} aria-pressed={article?.title === title} onClick={() => setSelected(title)}><span><Icon size={16} /></span><b>{title}<small>{category}</small></b><ChevronRight size={14} /></button>)}</aside><article className="settings-main help-article">{article ? <><div className="settings-heading"><span><h2>{article.title}</h2><small>{article.category}</small></span><BookOpen size={20} /></div><p className="help-intro">{article.text}</p><ol>{article.steps.map(step => <li key={step}>{step}</li>)}</ol><button className="primary-button" onClick={() => onNavigate(article.destination)}>Open {article.destination}<ArrowUpRight size={16} /></button><div className="help-note"><CircleHelp size={18} /><p>Changes are available for this session. This store template uses sample data.</p></div></> : <div className="store-empty"><Search size={28} /><h2>No guides found</h2><p>Try “products”, “tickets”, or “calendar”.</p></div>}</article></div></Workspace>;
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
