import Image from "next/image";
import Link from "next/link";
import { getThemes } from "@/lib/data";

export default async function BrowseSection() {
  const [setThemes, minifigThemes] = await Promise.all([
    getThemes("set"),
    getThemes("minifigure"),
  ]);

  const categories = [
    {
      href: "/sets",
      title: "Sets",
      image: "/sets.jpg",
      description:
        "Buildable sets across every theme, from pocket-sized polybags to premium display models.",
      meta: `${setThemes.length} themes`,
      cta: "Browse sets",
    },
    {
      href: "/minifigures",
      title: "Minifigures",
      image: "/minifigures.jpg",
      description:
        "Collectible characters and accessories, cataloged by universe and series.",
      meta: `${minifigThemes.length} themes`,
      cta: "Browse minifigures",
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12">
          <p className="eyebrow">Start here</p>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            What are you building today?
          </h2>
          <p className="max-w-xl text-sm text-ink-muted sm:text-base">
            Two collections, one clean path from theme to subtheme to product.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-56 w-full overflow-hidden sm:h-64">
                <Image
                  src={cat.image}
                  alt={`${cat.title} collection`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 stud-tag bg-white/90">
                  {cat.meta}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {cat.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
                  {cat.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
