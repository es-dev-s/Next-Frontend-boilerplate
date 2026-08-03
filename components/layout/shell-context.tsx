"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type ShellContextValue = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({
  sidebarCollapsed,
  toggleSidebar,
  isMobile,
  children,
}: {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ sidebarCollapsed, toggleSidebar, isMobile }),
    [sidebarCollapsed, toggleSidebar, isMobile],
  );

  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShell must be used within ShellProvider");
  }
  return ctx;
}
