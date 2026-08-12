"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatUSD, usdPrice } from "@/lib/format";
import Breadcrumbs from "@/components/Breadcrumbs";

const MIN_ORDER = 100;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, hydrated, clearCart } =
    useCart();

  if (!hydrated) {
    return <div className="container-page py-24" />;
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <div className="mt-4 mb-10">
        <p className="eyebrow">Your bag</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Shopping cart
        </h1>
        <p className="mt-3 text-sm text-ink-muted sm:text-base">
          {items.length === 0
            ? "Your cart is empty — let's fix that."
            : `${items.reduce((n, i) => n + i.quantity, 0)} item${
                items.reduce((n, i) => n + i.quantity, 0) === 1 ? "" : "s"
              } ready for checkout`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Nothing in your cart yet
          </p>
          <p className="max-w-sm text-sm text-ink-muted">
            Browse sets and minifigures by theme to find your next build.
          </p>
          <div className="mt-2 flex gap-3">
            <Link href="/sets" className="btn-primary">
              Shop sets
            </Link>
            <Link href="/minifigures" className="btn-outline">
              Shop minifigures
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const price = usdPrice(item.rrp) || 0;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl2 border border-line bg-surface p-4 shadow-card sm:flex-row sm:items-center"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-medium text-brand-600">
                      {item.theme} · {item.subtheme}
                    </p>
                    <p className="font-display text-base font-semibold text-ink">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-data text-[11px] text-ink-muted">
                      #{item.number}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-brand-700"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-brand-700"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-20 text-right font-display text-sm font-semibold text-ink">
                      {formatUSD(price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      className="text-ink-muted transition-colors hover:text-clay"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between">
              <Link href="/sets" className="btn-outline">
                ← Continue shopping
              </Link>
              <button type="button" onClick={clearCart} className="text-sm font-medium text-ink-muted hover:text-clay">
                Clear cart
              </button>
            </div>
          </div>

          <div className="h-fit rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink">
              Order summary
            </h2>
            <div className="mt-4 flex justify-between text-sm text-ink-soft">
              <span>Subtotal</span>
              <span className="font-medium text-ink">{formatUSD(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-ink-soft">
              <span>Shipping</span>
              <span className="font-medium text-ink">Calculated at checkout</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-base font-semibold text-ink">
              <span>Estimated total</span>
              <span>{formatUSD(subtotal)}</span>
            </div>

            {/* Minimum order progress */}
            {subtotal < MIN_ORDER && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-ink-soft">Minimum order progress</p>
                  <p className="text-xs font-semibold text-ink">{formatUSD(subtotal)} / $100.00</p>
                </div>
                <div className="h-2 w-full overflow-hidden bg-line">
                  <div
                    className="h-full bg-stud transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / MIN_ORDER) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-stud-dark">
                  Add <span className="font-semibold">{formatUSD(MIN_ORDER - subtotal)}</span> more to reach the $100.00 minimum.
                </p>
              </div>
            )}

            {subtotal >= MIN_ORDER ? (
              <button
                type="button"
                className="btn-accent mt-6 w-full"
                onClick={() => window.location.href = "/checkout"}
              >
                Proceed to checkout
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 w-full bg-line py-2.5 text-sm font-semibold text-ink-muted cursor-not-allowed"
              >
                $100.00 minimum required
              </button>
            )}
            <p className="mt-3 text-center text-[11px] text-ink-muted">
              Taxes calculated at checkout. Secure payment processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
