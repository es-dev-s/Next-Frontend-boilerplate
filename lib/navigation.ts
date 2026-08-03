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

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
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
    items: [
      { label: "Finance", href: "/finance", icon: Wallet },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function getPageMeta(pathname: string): { title: string; eyebrow: string } {
  for (const group of NAVIGATION) {
    for (const item of group.items) {
      if (item.href === pathname) {
        return { title: item.label, eyebrow: group.label };
      }
    }
  }

  return { title: "Overview", eyebrow: "Workspace" };
}
