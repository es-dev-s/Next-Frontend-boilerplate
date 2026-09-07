import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export function formatBadgeCount(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return "";
  if (count > 99) return "99+";
  return String(Math.floor(count));
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type PageMeta = {
  title: string;
  eyebrow: string;
};

export const NAVIGATION: NavGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { label: "Overview", href: "/", icon: LayoutDashboard },
      { label: "Calendar", href: "/calendar", icon: CalendarDays },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    items: [
      { label: "Classes", href: "/classes", icon: BookOpen },
      { label: "Attendance", href: "/attendance", icon: ClipboardList, badge: 3 },
      { label: "Assessments", href: "/assessments", icon: GraduationCap },
    ],
  },
  {
    id: "people",
    label: "People",
    items: [{ label: "Directory", href: "/directory", icon: Users }],
  },
  {
    id: "operations",
    label: "Operations",
    items: [{ label: "Finance", href: "/finance", icon: Wallet }],
  },
];

/** Pinned to the sidebar foot — always visible, outside the scroll groups. */
export const UTILITY_NAV: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

const UTILITY_GROUP: NavGroup = {
  id: "utility",
  label: "Settings",
  items: UTILITY_NAV,
};

function findMatchedNav(pathname: string): { group: NavGroup; item: NavItem } | null {
  let best: { group: NavGroup; item: NavItem } | null = null;
  let bestLength = -1;

  for (const group of [...NAVIGATION, UTILITY_GROUP]) {
    for (const item of group.items) {
      if (!isNavItemActive(pathname, item.href)) continue;
      if (item.href.length <= bestLength) continue;
      bestLength = item.href.length;
      best = { group, item };
    }
  }

  return best;
}

export function getPageMeta(pathname: string): PageMeta {
  const match = findMatchedNav(pathname);
  return match
    ? { title: match.item.label, eyebrow: match.group.label }
    : { title: "Overview", eyebrow: "Workspace" };
}

function titleizeSegment(segment: string): string {
  let value = segment;
  try {
    value = decodeURIComponent(segment);
  } catch {
    value = segment;
  }

  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parentHref(pathname: string, eyebrow: string): string | undefined {
  if (eyebrow === "Workspace" && pathname !== "/") return "/";
  return undefined;
}

export function getBreadcrumbs(
  pathname: string,
  override?: PageMeta | null,
): Breadcrumb[] {
  if (override) {
    const crumbs: Breadcrumb[] = [];
    if (override.eyebrow && override.eyebrow !== override.title) {
      crumbs.push({ label: override.eyebrow });
    }
    crumbs.push({ label: override.title });
    return crumbs;
  }

  const match = findMatchedNav(pathname);
  const meta = match
    ? { title: match.item.label, eyebrow: match.group.label, href: match.item.href }
    : { title: "Overview", eyebrow: "Workspace", href: "/" };

  const crumbs: Breadcrumb[] = [];
  if (meta.eyebrow && meta.eyebrow !== meta.title) {
    crumbs.push({
      label: meta.eyebrow,
      href: parentHref(pathname, meta.eyebrow),
    });
  }

  const extra =
    match && pathname.startsWith(`${match.item.href}/`)
      ? pathname.slice(match.item.href.length).split("/").filter(Boolean)
      : [];

  if (extra.length === 0) {
    crumbs.push({ label: meta.title });
    return crumbs;
  }

  crumbs.push({ label: meta.title, href: meta.href });
  extra.forEach((segment, index) => {
    const href = `${meta.href}/${extra.slice(0, index + 1).join("/")}`;
    crumbs.push({
      label: titleizeSegment(segment),
      href: index < extra.length - 1 ? href : undefined,
    });
  });

  return crumbs;
}
