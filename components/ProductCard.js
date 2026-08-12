"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { formatUSD, usdPrice } from "@/lib/format";

function Spec({ label, value }) {
  return (
    <div className="flex flex-col gap-0">
      <dt className="text-[8px] font-data uppercase tracking-wide text-ink-muted truncate">
        {label}
      </dt>
      <dd className="text-[10px] font-medium text-ink leading-tight truncate">
        {value || "—"}
      </dd>
    </div>
  );
}

export default function ProductCard({ product, highlight = false }) {
  const { addItem } = useCart();
  const router      = useRouter();
  const cardRef     = useRef(null);

  const [justAdded,  setJustAdded]  = useState(false);
  const [glowing,    setGlowing]    = useState(false);

  const price = usdPrice(product.rrp);
  const isSet = product.type === "set";

  // Scroll to this card and flash it when it is the search target
  useEffect(() => {
    if (!highlight || !cardRef.current) return;

    // Small delay lets the page finish painting first
    const t = setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block:    "center",
      });
      setGlowing(true);
      // Remove ring after animation completes
      const off = setTimeout(() => setGlowing(false), 2600);
      return () => clearTimeout(off);
    }, 120);

    return () => clearTimeout(t);
  }, [highlight]);

  function handleAddToCart() {
    addItem(product, 1);
    setJustAdded(true);
    router.push("/cart");
  }

  return (
    <article
      ref={cardRef}
      id={`product-${product.id}`}
      className={`group flex flex-col overflow-hidden rounded-none border bg-surface shadow-card transition-shadow duration-300 hover:shadow-lift ${
        glowing
          ? "border-brand-500 ring-2 ring-brand-400 ring-offset-1 animate-highlight"
          : "border-line"
      }`}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 35vw, 47vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-1.5 top-1.5 stud-tag bg-white/95 text-[8px] px-1.5 py-0.5">
          {product.number}
        </span>
        {product.availability && (
          <span className="absolute right-1.5 top-1.5 rounded-none bg-ink/85 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-white">
            {product.availability}
          </span>
        )}
        {/* Search-match badge */}
        {highlight && (
          <span className="absolute bottom-1.5 left-1.5 bg-brand-600 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white">
            Search result
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-2">
        <div className="mb-2">
          <p className="text-[9px] font-medium text-brand-600 leading-tight truncate">
            {product.theme} · {product.subtheme}
          </p>
          <h3 className="mt-0.5 font-display text-[11px] font-semibold leading-snug text-ink line-clamp-2 min-h-[2.2em]">
            {product.name}
          </h3>
        </div>

        <dl className="grid grid-cols-2 gap-x-2 gap-y-1 border-y border-line py-1.5 mb-2">
          <Spec label="Pieces" value={product.pieces?.toLocaleString()} />
          {isSet
            ? <Spec label="Minifigs" value={product.minifigs > 0 ? product.minifigs : "—"} />
            : <Spec label="Access."  value={product.accessories} />
          }
          <Spec label="Age"      value={product.ageRange} />
          <Spec label="Year"     value={product.year} />
          <Spec label="Pack."    value={product.packaging} />
          <Spec label="Designer" value={product.designer || "LEGO Team"} />
        </dl>

        <div className="mt-auto flex items-center justify-between gap-1">
          <div className="min-w-0">
            <p className="font-display text-[13px] font-semibold text-ink leading-tight">
              {formatUSD(price)}
            </p>
            <p className="text-[8px] text-ink-muted leading-tight truncate">
              {product.rrp || "RRP TBD"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary shrink-0"
          >
            {justAdded ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
