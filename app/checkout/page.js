"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatUSD, usdPrice } from "@/lib/format";
import Breadcrumbs from "@/components/Breadcrumbs";

const MIN_ORDER = 100;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, hydrated } = useCart();

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", country: "",
    paymentMethod: "", note: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function set(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email) {
      setError("Full name and email are required.");
      return;
    }
    if (!form.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (subtotal < MIN_ORDER) {
      setError(`Minimum order amount is $100.00. Your cart is currently ${formatUSD(subtotal)}. Please add more items.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      clearCart();
      router.push(
        `/order-confirmed?order=${data.orderNumber}&whatsapp=${encodeURIComponent(data.whatsappUrl)}`
      );
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) return <div className="container-page py-24" />;

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="font-display text-xl font-semibold text-ink">Your cart is empty.</p>
        <Link href="/sets" className="mt-4 inline-block btn-primary">Shop sets</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs trail={[
        { label: "Home", href: "/" },
        { label: "Cart", href: "/cart" },
        { label: "Checkout" },
      ]} />

      <div className="mt-4 mb-10">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Checkout
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">

        {/* ── Customer form ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {error && (
            <p className="border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
              {error}
            </p>
          )}

          <fieldset className="flex flex-col gap-4">
            <legend className="font-display text-base font-semibold text-ink mb-2">
              Contact information
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Full name <span className="text-clay">*</span>
                </label>
                <input id="name" type="text" autoComplete="name" required
                  value={form.name} onChange={set("name")} placeholder="Jane Smith"
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Email address <span className="text-clay">*</span>
                </label>
                <input id="email" type="email" autoComplete="email" required
                  value={form.email} onChange={set("email")} placeholder="you@example.com"
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Phone number
              </label>
              <input id="phone" type="tel" autoComplete="tel"
                value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000"
                className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none" />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="font-display text-base font-semibold text-ink mb-2">
              Shipping address
            </legend>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Street address
              </label>
              <input id="address" type="text" autoComplete="street-address"
                value={form.address} onChange={set("address")} placeholder="123 Main St, Apt 4"
                className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  City / State
                </label>
                <input id="city" type="text" autoComplete="address-level2"
                  value={form.city} onChange={set("city")} placeholder="New York, NY"
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Country
                </label>
                <input id="country" type="text" autoComplete="country-name"
                  value={form.country} onChange={set("country")} placeholder="United States"
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none" />
              </div>
            </div>
          </fieldset>

          {/* ── Payment method ── */}
          <fieldset className="flex flex-col gap-2">
            <legend className="font-display text-base font-semibold text-ink mb-1">
              Payment method <span className="text-clay text-xs">*</span>
            </legend>
            <p className="text-xs text-ink-muted">
              Our team will send payment instructions for your chosen method via WhatsApp after your order is received.
            </p>
            <div className="relative">
              <select
                id="paymentMethod"
                value={form.paymentMethod}
                onChange={set("paymentMethod")}
                required
                className={`w-full appearance-none border bg-paper px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-brand-500 transition-colors ${
                  form.paymentMethod ? "border-brand-500 text-ink" : "border-line text-ink-muted"
                }`}
              >
                <option value="" disabled>Select a payment method…</option>
                <option value="Zelle">💜  Zelle — Send via Zelle</option>
                <option value="Cash App">💚  Cash App — Send via $Cashtag</option>
                <option value="Apple Pay">🍎  Apple Pay</option>
                <option value="Chime">🔵  Chime</option>
                <option value="Bank Transfer">🏦  Bank Transfer — Wire / ACH</option>
                <option value="Crypto">₿  Crypto — BTC / ETH / USDT</option>
              </select>
              {/* Chevron icon */}
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {form.paymentMethod && (
              <p className="text-xs text-brand-600 font-medium">
                ✓ Payment via <strong>{form.paymentMethod}</strong> selected. Instructions will be sent on WhatsApp.
              </p>
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-display text-base font-semibold text-ink mb-1">
              Order note <span className="text-xs font-normal text-ink-muted">(optional)</span>
            </legend>            <textarea id="note" rows={3} value={form.note} onChange={set("note")}
              placeholder="Any special instructions, delivery preferences, or questions…"
              className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none resize-none" />
          </fieldset>

          <div className="border-t border-line pt-4">
            <p className="mb-4 text-xs text-ink-muted leading-relaxed">
              By placing your order you agree to our terms. After submitting you will receive a
              confirmation email and be redirected to WhatsApp to confirm with our team.
            </p>
            {subtotal < MIN_ORDER && (
              <div className="mb-4 flex items-start gap-2 border border-stud/40 bg-stud/10 px-4 py-3">
                <svg className="mt-0.5 shrink-0 text-stud-dark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
                </svg>
                <p className="text-sm text-stud-dark leading-snug">
                  <span className="font-semibold">Minimum order is $100.00.</span>{" "}
                  Your cart total is <span className="font-semibold">{formatUSD(subtotal)}</span>.
                  You need <span className="font-semibold">{formatUSD(MIN_ORDER - subtotal)}</span> more to place an order.{" "}
                  <Link href="/sets" className="underline hover:text-stud-dark">Continue shopping →</Link>
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || subtotal < MIN_ORDER}
              className="w-full bg-ink py-3.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Placing order…" : subtotal < MIN_ORDER ? `Minimum $100.00 required` : `Place order · ${formatUSD(subtotal)}`}
            </button>
          </div>
        </form>

        {/* ── Order summary ── */}
        <div className="h-fit border border-line bg-surface shadow-card">
          <div className="border-b border-line bg-paper px-5 py-4">
            <h2 className="font-display text-base font-semibold text-ink">
              Order summary ({items.reduce((n, i) => n + i.quantity, 0)} items)
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-line">
            {items.map((item) => {
              const price = usdPrice(item.rrp) || 0;
              return (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-paper">
                    <Image src={item.image} alt={item.name} fill sizes="56px"
                      className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">{item.name}</p>
                    <p className="text-[10px] text-ink-muted">#{item.number} · qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink shrink-0">
                    {formatUSD(price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-line px-5 py-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-ink-soft">
              <span>Subtotal</span>
              <span className="font-medium text-ink">{formatUSD(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-soft">
              <span>Shipping</span>
              <span className="text-ink-muted">Confirmed via WhatsApp</span>
            </div>
            {form.paymentMethod && (
              <div className="flex justify-between text-sm text-ink-soft">
                <span>Payment</span>
                <span className="font-medium text-ink">{form.paymentMethod}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3 font-display text-base font-semibold text-ink">
              <span>Estimated total</span>
              <span>{formatUSD(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
