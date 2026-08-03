"use client";

import { memo, useDeferredValue, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

function NavbarSearchComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  // Keeps typing instant; consumers of deferredQuery won't block keystrokes
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Hook point for realtime search — deferred value is the safe input lane
  useEffect(() => {
    if (!deferredQuery) return;
    // Future: stream search against campus index without blocking input
  }, [deferredQuery]);

  return (
    <label className="smp-search">
      <span className="smp-search__icon" aria-hidden="true">
        <Search strokeWidth={1.75} />
      </span>
      <span className="smp-sr-only">Search campus</span>
      <input
        ref={inputRef}
        type="search"
        className="smp-search__input"
        placeholder="Search campus"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <span className="smp-search__keys" aria-hidden="true">
        <kbd className="smp-kbd">⌘</kbd>
        <kbd className="smp-kbd">K</kbd>
      </span>
    </label>
  );
}

export const NavbarSearch = memo(NavbarSearchComponent);
