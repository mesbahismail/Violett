"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function SidePanel({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  const headingId = useId();
  const panel = useRef<HTMLElement>(null);
  const closeCallback = useRef(onClose);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [closing, setClosing] = useState(false);
  useEffect(() => { closeCallback.current = onClose; }, [onClose]);
  const close = () => {
    if (timer.current) return;
    setClosing(true);
    timer.current = setTimeout(() => closeCallback.current(), 180);
  };
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const app = document.querySelector(".violett-app");
    app?.setAttribute("inert", "");
    panel.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setClosing(true); if (!timer.current) timer.current = setTimeout(() => closeCallback.current(), 180); }
      if (event.key === "Tab") {
        const focusable = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, textarea, a[href]') ?? []).filter(node => node.getClientRects().length);
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => { if (timer.current) clearTimeout(timer.current); document.removeEventListener("keydown", keydown); app?.removeAttribute("inert"); previous?.focus(); };
  }, []);
  return createPortal(<div className={`side-panel-layer ${closing ? "panel-closing" : ""}`}>
    <button className="side-panel-scrim" aria-label="Close details" tabIndex={-1} onClick={close} />
    <section className="store-side-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby={headingId} tabIndex={-1}>
      <header className="side-panel-header"><div><h2 id={headingId}>{title}</h2>{subtitle && <small>{subtitle}</small>}</div><button className="icon-button" aria-label="Close details" onClick={close}><X size={20} /></button></header>
      <div className="side-panel-body">{children}</div>
    </section>
  </div>, document.body);
}
