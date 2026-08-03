"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/use-ui-store";

type PageMetaProps = {
  title: string;
  eyebrow?: string;
};

/** Optional override when a page needs a navbar title outside the nav map. */
export function PageMeta({ title, eyebrow }: PageMetaProps) {
  const setPageMetaOverride = useUIStore((s) => s.setPageMetaOverride);

  useEffect(() => {
    setPageMetaOverride({ title, eyebrow });
    return () => setPageMetaOverride(null);
  }, [title, eyebrow, setPageMetaOverride]);

  return null;
}
