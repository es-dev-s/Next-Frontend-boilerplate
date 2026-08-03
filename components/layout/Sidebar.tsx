"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, PanelLeftClose, Sparkles } from "lucide-react";
import { NAVIGATION } from "@/lib/navigation";
import { useUIStore } from "@/store/use-ui-store";
import { useShell } from "./shell-context";

function SidebarComponent() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, isMobile } = useShell();
  const closeMobileNav = useUIStore((s) => s.closeMobileNav);

  const onBrandControlClick = useCallback(() => {
    if (isMobile) return;
    toggleSidebar();
  }, [isMobile, toggleSidebar]);

  const onNavClick = useCallback(() => {
    closeMobileNav();
  }, [closeMobileNav]);

  return (
    <aside className="smp-sidebar" aria-label="Primary">
      <div className="smp-sidebar__brand">
        <button
          type="button"
          className="smp-sidebar__brand-control"
          onClick={onBrandControlClick}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={sidebarCollapsed}
          title={
            isMobile
              ? "Schola"
              : sidebarCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
          tabIndex={isMobile ? -1 : 0}
        >
          <span
            className="smp-sidebar__brand-face smp-sidebar__brand-face--mark"
            aria-hidden="true"
          >
            <Sparkles strokeWidth={1.75} />
          </span>
          <span
            className="smp-sidebar__brand-face smp-sidebar__brand-face--action"
            aria-hidden="true"
          >
            {sidebarCollapsed ? (
              <PanelLeft strokeWidth={1.75} />
            ) : (
              <PanelLeftClose strokeWidth={1.75} />
            )}
          </span>
        </button>

        <div
          className="smp-sidebar__brand-copy"
          aria-hidden={sidebarCollapsed && !isMobile}
        >
          <span className="smp-sidebar__brand-name">Schola</span>
          <span className="smp-sidebar__brand-meta">Campus OS</span>
        </div>
      </div>

      <div className="smp-sidebar__scroll">
        {NAVIGATION.map((group) => (
          <div key={group.id} className="smp-sidebar__group">
            <div className="smp-sidebar__group-label">{group.label}</div>
            <nav className="smp-sidebar__nav" aria-label={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="smp-nav-item"
                    data-active={active ? "true" : "false"}
                    onClick={onNavClick}
                    title={item.label}
                    prefetch
                    aria-current={active ? "page" : undefined}
                    aria-label={
                      typeof item.badge === "number"
                        ? `${item.label}, ${item.badge} pending`
                        : item.label
                    }
                  >
                    <span className="smp-nav-item__icon" aria-hidden="true">
                      <Icon strokeWidth={1.75} />
                      {typeof item.badge === "number" ? (
                        <span className="smp-nav-item__dot" />
                      ) : null}
                    </span>
                    <span className="smp-nav-item__label">{item.label}</span>
                    {typeof item.badge === "number" ? (
                      <span className="smp-nav-item__badge">{item.badge}</span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

export const Sidebar = memo(SidebarComponent);
