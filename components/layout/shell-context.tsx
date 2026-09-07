"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type ShellContextValue = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({
  sidebarCollapsed,
  toggleSidebar,
  children,
}: {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ sidebarCollapsed, toggleSidebar }),
    [sidebarCollapsed, toggleSidebar],
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
