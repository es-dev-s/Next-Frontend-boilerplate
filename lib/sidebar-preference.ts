export const SIDEBAR_COOKIE = "smp-sidebar";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Legacy zustand persist key — migrated once to the cookie. */
export const LEGACY_UI_STORAGE_KEY = "smp-ui";

export function sidebarCookieValue(collapsed: boolean): "1" | "0" {
  return collapsed ? "1" : "0";
}

export function parseSidebarCookie(value: string | undefined): boolean {
  return value === "1";
}

/** Client-only: persist preference for the next server render. */
export function writeSidebarCookie(collapsed: boolean) {
  if (typeof document === "undefined") return;
  const value = sidebarCookieValue(collapsed);
  document.cookie = `${SIDEBAR_COOKIE}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Blocking script: if the cookie is missing, mirror legacy localStorage into
 * the cookie + html attribute so the first paint matches icon-rail mode.
 */
export const SIDEBAR_BOOTSTRAP_SCRIPT = `(function(){try{var c=document.cookie.split("; ").find(function(x){return x.indexOf("${SIDEBAR_COOKIE}=")==0});var collapsed=c?c.split("=")[1]==="1":null;if(collapsed===null){var r=localStorage.getItem("${LEGACY_UI_STORAGE_KEY}");if(r){var p=JSON.parse(r);if(p&&p.state&&p.state.sidebarCollapsed===true){collapsed=true;document.cookie="${SIDEBAR_COOKIE}=1; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax";}}}if(collapsed===true){document.documentElement.setAttribute("data-sidebar-collapsed","true");}else if(collapsed===false){document.documentElement.setAttribute("data-sidebar-collapsed","false");}}catch(e){}})();`;
