"use client";

import { create } from "zustand";

type PageMetaOverride = {
  title: string;
  eyebrow: string;
};

type UIState = {
  mobileNavOpen: boolean;
  pageMetaOverride: PageMetaOverride | null;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  setPageMetaOverride: (meta: { title: string; eyebrow?: string } | null) => void;
};

/** Transient UI only — sidebar open/close lives in ShellProvider (cookie + SSR). */
export const useUIStore = create<UIState>((set, get) => ({
  mobileNavOpen: false,
  pageMetaOverride: null,

  openMobileNav: () => set({ mobileNavOpen: true }),

  closeMobileNav: () => {
    if (!get().mobileNavOpen) return;
    set({ mobileNavOpen: false });
  },

  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

  setPageMetaOverride: (meta) =>
    set({
      pageMetaOverride: meta
        ? { title: meta.title, eyebrow: meta.eyebrow ?? "Workspace" }
        : null,
    }),
}));
