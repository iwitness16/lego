import Image from "next/image";
import Link from "next/link";
import { getThemes } from "@/lib/data";

export default async function Footer() {
  const [setThemes, minifigThemes] = await Promise.all([
    getThemes("set").then((t) => t.slice(0, 5)),
    getThemes("minifigure").then((t) => t.slice(0, 5)),
  ]);

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr,1fr,1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 overflow-hidden rounded-xl2">
                <Image src="/logo.jpg" alt="LegoBricksLink logo" fill sizes="36px" className="object-cover" />
              </span>
              <span className="font-display text-lg font-semibold text-ink">
                LegoBricks<span className="text-brand-600">Link</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              An independent marketplace for LEGO® sets and minifigures,
              organized by theme so you can go from browsing to building
              faster. Every listing shows the real spec sheet — pieces,
              packaging, and price — before you add to cart.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {["X", "IG", "YT", "TT"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-xs font-semibold text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ink">Shop Sets</p>
            <ul className="mt-4 space-y-2.5">
              {setThemes.map((theme) => (
                <li key={theme.slug}>
                  <Link
                    href={`/sets/${theme.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {theme.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sets" className="text-sm font-medium text-brand-600">
                  View all themes →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ink">Shop Minifigures</p>
            <ul className="mt-4 space-y-2.5">
              {minifigThemes.map((theme) => (
                <li key={theme.slug}>
                  <Link
                    href={`/minifigures/${theme.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {theme.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/minifigures" className="text-sm font-medium text-brand-600">
                  View all themes →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ink">Support</p>
            <ul className="mt-4 space-y-2.5">
              {["Shipping & delivery", "Returns policy", "Order tracking", "FAQs", "Privacy policy", "Terms of service"].map(
                (label) => (
                  <li key={label}>
                    <a href="#" className="text-sm text-ink-muted transition-colors hover:text-brand-700">
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="stud-strip mt-12 h-6 opacity-30" aria-hidden="true" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} LegoBricksLink. Built by fans, for
            fans. Not affiliated with or endorsed by the LEGO Group.
          </p>
          <div className="flex items-center gap-4">
            <span>Secure checkout</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide shipping</span>
            <span aria-hidden="true">·</span>
            <span>Verified sellers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
