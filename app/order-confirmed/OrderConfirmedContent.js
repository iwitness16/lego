"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderConfirmedContent() {
  const params      = useSearchParams();
  const orderNumber = params.get("order") || "";
  const whatsappUrl = params.get("whatsapp") ? decodeURIComponent(params.get("whatsapp")) : "";
  const redirected  = useRef(false);

  // Auto-open WhatsApp once on mount
  useEffect(() => {
    if (whatsappUrl && !redirected.current) {
      redirected.current = true;
      const t = setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [whatsappUrl]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-lg border border-line bg-surface shadow-card text-center">

        {/* Green header */}
        <div className="bg-leaf px-8 py-8">
          <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
          </svg>
          <h1 className="font-display text-2xl font-semibold text-white">Order placed!</h1>
          <p className="mt-1 text-sm text-white/80">We&apos;ve received your order successfully.</p>
        </div>

        <div className="px-8 py-8 flex flex-col gap-6">

          {/* Order number */}
          <div className="border border-line bg-paper px-4 py-3">
            <p className="text-xs font-data uppercase tracking-widest text-ink-muted">Order reference</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{orderNumber}</p>
          </div>

          {/* Step list */}
          <div className="flex flex-col gap-4 text-left">
            {[
              { icon: "✉️", title: "Confirmation email sent",   desc: "Check your inbox — we&apos;ve emailed your full order summary." },
              { icon: "💬", title: "WhatsApp chat opening…",    desc: "A WhatsApp chat with your order details is opening now. Just tap Send to confirm with our team." },
              { icon: "📦", title: "We&apos;ll confirm shipping", desc: "Our team will reply on WhatsApp with shipping cost and payment instructions within 24 hours." },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{step.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: step.desc }} />
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Open WhatsApp to confirm order
            </a>
          )}

          <div className="flex gap-3">
            <Link href="/sets"
              className="flex-1 border border-line py-2.5 text-center text-sm font-semibold text-ink hover:bg-paper transition-colors">
              Continue shopping
            </Link>
            <Link href="/"
              className="flex-1 border border-ink bg-ink py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
