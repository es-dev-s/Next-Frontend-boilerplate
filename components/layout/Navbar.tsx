"use client";

import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { getPageMeta } from "@/lib/navigation";
import { useUIStore } from "@/store/use-ui-store";
import { NavbarSearch } from "./NavbarSearch";
import { NotificationMenu } from "./NotificationMenu";
import { ProfileMenu } from "./ProfileMenu";

type OpenMenu = "notifications" | "profile" | null;

function NavbarComponent() {
  const pathname = usePathname();
  const openMobileNav = useUIStore((s) => s.openMobileNav);
  const pageMetaOverride = useUIStore((s) => s.pageMetaOverride);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const pageMeta = useMemo(() => {
    if (pageMetaOverride) return pageMetaOverride;
    return getPageMeta(pathname);
  }, [pathname, pageMetaOverride]);

  useEffect(() => {
    startTransition(() => setOpenMenu(null));
  }, [pathname]);

  const onNotificationsOpenChange = useCallback((open: boolean) => {
    startTransition(() => {
      setOpenMenu(open ? "notifications" : null);
    });
  }, []);

  const onProfileOpenChange = useCallback((open: boolean) => {
    startTransition(() => {
      setOpenMenu(open ? "profile" : null);
    });
  }, []);

  return (
    <header className="smp-navbar">
      <div className="smp-navbar__left">
        <button
          type="button"
          className="smp-icon-btn smp-navbar__mobile-toggle"
          onClick={openMobileNav}
          aria-label="Open navigation"
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>

        <div className="smp-navbar__title-block">
          <span className="smp-navbar__eyebrow">{pageMeta.eyebrow}</span>
          <h1 className="smp-navbar__title">{pageMeta.title}</h1>
        </div>
      </div>

      <div className="smp-navbar__right">
        <NavbarSearch />

        <NotificationMenu
          open={openMenu === "notifications"}
          onOpenChange={onNotificationsOpenChange}
        />

        <div className="smp-navbar__divider" aria-hidden="true" />

        <ProfileMenu
          open={openMenu === "profile"}
          onOpenChange={onProfileOpenChange}
        />
      </div>
    </header>
  );
}

export const Navbar = memo(NavbarComponent);
