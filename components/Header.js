"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartIcon from "./CartIcon";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
  { href: "/sets",         label: "Sets" },
  { href: "/minifigures",  label: "Minifigures" },
  { href: "/#reviews",     label: "Reviews" },
  { href: "/#newsletter",  label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">

      {/* ── Top row: logo · nav · search · cart · hamburger ── */}
      <div className="container-page flex h-[88px] items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <span className="relative block h-16 w-48 sm:h-20 sm:w-60 md:h-[84px] md:w-72 overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="LegoBricksLink"
              fill
              sizes="(min-width: 768px) 288px, (min-width: 640px) 240px, 192px"
              className="object-contain object-left"
              priority
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop live search — hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-sm relative">
          <SearchBar />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          <CartIcon />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center border border-line lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile search row — full width, below top bar ── */}
      <div className="md:hidden border-t border-line bg-white px-4 py-2">
        <SearchBar onClose={() => setOpen(false)} />
      </div>

      {/* ── Mobile nav drawer ── */}
      {open && (
        <div className="border-t border-line bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
