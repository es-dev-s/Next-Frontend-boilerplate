"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type VirtualListProps<T> = {
  items: readonly T[];
  /** Fixed row height in px — keeps scroll math O(1). */
  rowHeight: number;
  height: number;
  overscan?: number;
  className?: string;
  getKey: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
};

/**
 * Windowed list for high-volume feeds.
 * Only mounts rows in the viewport (+ overscan). Scroll handler is rAF-batched
 * so rapid streams never thrash React on every pixel.
 */
export function VirtualList<T>({
  items,
  rowHeight,
  height,
  overscan = 6,
  className,
  getKey,
  renderItem,
}: VirtualListProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;

    if (rafRef.current != null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const next = node.scrollTop;
      setScrollTop((prev) => (prev === next ? prev : next));
    });
  }, []);

  const totalHeight = items.length * rowHeight;

  const { start, end } = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(height / rowHeight) + overscan * 2;
    const endIndex = Math.min(items.length, startIndex + visibleCount);
    return { start: startIndex, end: endIndex };
  }, [scrollTop, rowHeight, height, overscan, items.length]);

  const slice = items.slice(start, end);

  return (
    <div
      ref={scrollerRef}
      className={className}
      onScroll={onScroll}
      style={
        {
          height,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          contain: "strict",
          willChange: "scroll-position",
        } satisfies CSSProperties
      }
    >
      <div
        aria-hidden="true"
        style={{ height: totalHeight, position: "relative", width: "100%" }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translate3d(0, ${start * rowHeight}px, 0)`,
            contain: "layout style",
          }}
        >
          {slice.map((item, offset) => {
            const index = start + offset;
            return (
              <div
                key={getKey(item, index)}
                style={{
                  height: rowHeight,
                  contain: "layout paint style",
                  contentVisibility: "auto",
                  containIntrinsicSize: `auto ${rowHeight}px`,
                }}
              >
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
