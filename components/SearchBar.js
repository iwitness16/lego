"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usdPrice, formatUSD } from "@/lib/format";

function useDebounce(value, delay = 280) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function TypeTag({ type }) {
  return (
    <span className={`text-[9px] font-data uppercase tracking-wide px-1.5 py-0.5 shrink-0 ${
      type === "set"
        ? "bg-brand-100 text-brand-700"
        : "bg-stud/20 text-stud-dark"
    }`}>
      {type === "set" ? "Set" : "Fig"}
    </span>
  );
}

export default function SearchBar({ onClose, autoFocus = false }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(-1); // keyboard nav index
  const [open,    setOpen]    = useState(false);

  const inputRef      = useRef(null);
  const dropdownRef   = useRef(null);
  const debouncedQuery = useDebounce(query, 280);

  // Fetch results whenever debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setResults(Array.isArray(data) ? data : []);
          setOpen(true);
          setActive(-1);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  function buildHref(product) {
    const base = product.type === "set" ? "sets" : "minifigures";
    // The subtheme page paginates at PAGE_SIZE=12.
    // We need to figure out which page this product is on so we can
    // deep-link directly to it. We pass ?highlight=<id> so the page
    // can scroll to and flash the specific card.
    return `/${base}/${product.theme_slug}/${product.subtheme_slug}?highlight=${product.id}`;
  }

  const handleKeyDown = useCallback((e) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      const product = results[active];
      window.location.href = buildHref(product);    } else if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
    }
  }, [open, results, active, onClose]);

  function handleSelect() {
    setQuery("");
    setOpen(false);
    onClose?.();
  }

  const showEmpty = open && !loading && query.trim() && results.length === 0;

  return (
    <div className="relative w-full">
      {/* Input */}
      <div className="flex items-center border border-line bg-paper px-3 py-2 focus-within:border-brand-500 transition-colors">
        {loading ? (
          <svg className="mr-2 shrink-0 text-brand-500 animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg className="mr-2 shrink-0 text-ink-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
        )}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setOpen(false); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search by set number, name or theme…"
          autoComplete="off"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          aria-label="Search products"
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="ml-1 shrink-0 text-ink-muted hover:text-ink transition-colors"
            aria-label="Clear search"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {(open && results.length > 0) || showEmpty ? (
        <div
          ref={dropdownRef}
          role="listbox"
          className="absolute left-0 right-0 top-full z-[200] mt-1 border border-line bg-surface shadow-lift overflow-hidden"
        >
          {showEmpty ? (
            <div className="px-4 py-5 text-center">
              <p className="text-sm font-medium text-ink">No products found</p>
              <p className="mt-1 text-xs text-ink-muted">
                Try a set number like <span className="font-data">10351-1</span> or a theme like <span className="font-data">City</span>
              </p>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="border-b border-line bg-paper px-3 py-2 flex items-center justify-between">
                <p className="text-[10px] font-data uppercase tracking-wide text-ink-muted">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <p className="text-[10px] text-ink-muted hidden sm:block">↑↓ navigate · Enter select · Esc close</p>
              </div>

              {results.map((product, idx) => {
                const price = usdPrice(product.rrp);
                const href  = buildHref(product);
                const isActive = idx === active;

                return (
                  <Link
                    key={product.id}
                    href={href}
                    role="option"
                    aria-selected={isActive}
                    onClick={handleSelect}
                    onMouseEnter={() => setActive(idx)}
                    className={`flex items-center gap-3 px-3 py-2.5 transition-colors border-b border-line last:border-0 ${
                      isActive ? "bg-brand-50" : "hover:bg-paper/80"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-paper border border-line">
                      {product.image && !product.image.includes("blankbox") ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted">
                            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <TypeTag type={product.type} />
                        <span className="font-data text-[10px] text-ink-muted truncate">
                          {product.number}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-ink leading-tight truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-ink-muted truncate">
                        {product.theme} · {product.subtheme}
                      </p>
                    </div>

                    {/* Price + availability */}
                    <div className="shrink-0 text-right">
                      {price ? (
                        <p className="text-sm font-semibold text-ink">{formatUSD(price)}</p>
                      ) : (
                        <p className="text-xs text-ink-muted">—</p>
                      )}
                      {product.availability && (
                        <p className="text-[9px] text-ink-muted uppercase tracking-wide">
                          {product.availability.replace(" - ", " ")}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Footer hint */}
              <div className="border-t border-line bg-paper px-3 py-2 text-center">
                <p className="text-[10px] text-ink-muted">
                  Click any result to go to its product page and add to cart
                </p>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
