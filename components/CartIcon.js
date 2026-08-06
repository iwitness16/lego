"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-brand-300"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="text-ink"
      >
        <circle cx="9" cy="21" r="1.4" />
        <circle cx="18" cy="21" r="1.4" />
        <path
          d="M2.5 3h2.2l2.6 12.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7.5H6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-semibold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
