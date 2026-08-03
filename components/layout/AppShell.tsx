"use client";

import {
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { afterPaint, runIdle } from "@/lib/schedule";
import {
  LEGACY_UI_STORAGE_KEY,
  writeSidebarCookie,
} from "@/lib/sidebar-preference";
import { useUIStore } from "@/store/use-ui-store";
import { Navbar } from "./Navbar";
import { PageFallback } from "./PageFallback";
import { ShellProvider } from "./shell-context";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
  initialCollapsed: boolean;
};

function readLegacyCollapsed(): boolean {
  try {
    const raw = window.localStorage.getItem(LEGACY_UI_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      state?: { sidebarCollapsed?: boolean };
    };
    window.localStorage.removeItem(LEGACY_UI_STORAGE_KEY);
    return parsed?.state?.sidebarCollapsed === true;
  } catch {
    return false;
  }
}

function persistCollapsed(next: boolean) {
  writeSidebarCookie(next);
  document.documentElement.setAttribute(
    "data-sidebar-collapsed",
    next ? "true" : "false",
  );
}

export function AppShell({ children, initialCollapsed }: AppShellProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery(MOBILE_NAV_QUERY);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const closeMobileNav = useUIStore((s) => s.closeMobileNav);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      startTransition(() => setAnimationsReady(true));
    });

    if (!initialCollapsed && readLegacyCollapsed()) {
      persistCollapsed(true);
      startTransition(() => setSidebarCollapsed(true));
    }

    return () => window.cancelAnimationFrame(id);
  }, [initialCollapsed]);

  const toggleSidebar = useCallback(() => {
    // Urgent visual update; persist off the critical path
    startTransition(() => {
      setSidebarCollapsed((current) => {
        const next = !current;
        afterPaint(() => persistCollapsed(next));
        return next;
      });
    });
  }, []);

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!isMobile && mobileNavOpen) closeMobileNav();
  }, [isMobile, mobileNavOpen, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen || !isMobile) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileNav();
    };

    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen, isMobile, closeMobileNav]);

  // Warm idle lane — keeps interaction frames free under load
  useEffect(() => {
    runIdle(() => {
      // placeholder for prefetch / telemetry hooks
    });
  }, []);

  return (
    <ShellProvider
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      isMobile={isMobile}
    >
      <div
        className="smp-shell"
        data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}
        data-mobile-nav={mobileNavOpen && isMobile ? "true" : "false"}
        data-ready={animationsReady ? "true" : "false"}
      >
        <Sidebar />
        <button
          type="button"
          className="smp-overlay"
          aria-label="Close navigation"
          tabIndex={mobileNavOpen && isMobile ? 0 : -1}
          onClick={closeMobileNav}
        />
        <div className="smp-shell__canvas">
          <Navbar />
          <main className="smp-main">
            <div className="smp-main__inner">
              {/* Chrome stays mounted; page work is interruptible */}
              <Suspense fallback={<PageFallback />}>{children}</Suspense>
            </div>
          </main>
        </div>
      </div>
    </ShellProvider>
  );
}
