import Link from "next/link";
import Image from "next/image";

export default function SubthemeGrid({ type, subthemes }) {
  const base = type === "set" ? "sets" : "minifigures";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {subthemes.map((sub) => (
        <Link
          key={sub.slug}
          href={`/${base}/${sub.themeSlug}/${sub.slug}`}
          className="group flex items-center gap-4 overflow-hidden rounded-none border border-line bg-surface p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-none bg-paper">
            {sub.heroImage && (
              <Image
                src={sub.heroImage}
                alt={sub.name}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-semibold text-ink">
              {sub.name}
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              {sub.productCount} products
            </p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-600">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
