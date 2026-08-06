import Link from "next/link";
import Image from "next/image";

// themes and subthemes are now passed as props — no direct data calls here.
export default function ThemeGrid({ type, themes }) {
  const base = type === "set" ? "sets" : "minifigures";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme) => (
        <Link
          key={theme.slug}
          href={`/${base}/${theme.slug}`}
          className="group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="relative h-40 w-full overflow-hidden bg-paper">
            {theme.heroImage && (
              <Image
                src={theme.heroImage}
                alt={theme.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between gap-3 p-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                {theme.name}
              </h3>
              <p className="mt-1 text-xs text-ink-muted">
                {theme.subthemeCount} subthemes · {theme.productCount} products
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              Explore theme
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
