import HeroSlider from "@/components/HeroSlider";
import BrowseSection from "@/components/BrowseSection";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import ReviewsSlider from "@/components/ReviewsSlider";
import Newsletter from "@/components/Newsletter";
import { getFeaturedProducts, getThemes } from "@/lib/data";

export const dynamic = "force-dynamic";

const TRUST_POINTS = [
  {
    title: "Verified spec sheets",
    body: "Piece counts, packaging, and designers listed straight from the catalog.",
  },
  {
    title: "Secure checkout",
    body: "Encrypted payments with order confirmation on every purchase.",
  },
  {
    title: "Worldwide shipping",
    body: "Dispatched in reinforced packaging, tracked door to door.",
  },
  {
    title: "Fan-run support",
    body: "Real builders on the other end of every support ticket.",
  },
];

export default async function HomePage() {
  const [featured, setThemes] = await Promise.all([
    getFeaturedProducts(8),
    getThemes("set"),
  ]);

  return (
    <>
      <HeroSlider />

      <section className="border-b border-line bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="text-center sm:text-left">
              <p className="font-display text-sm font-semibold text-ink">
                {point.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <BrowseSection />

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Shop by theme"
            title="Jump straight to a favorite universe"
            description="Every theme below opens into its subthemes, then its full product listing."
          />
          <div className="flex flex-wrap gap-3">
            {setThemes.map((theme) => (
              <a
                key={theme.slug}
                href={`/sets/${theme.slug}`}
                className="stud-tag bg-paper px-4 py-2 text-[13px] text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {theme.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured this week"
            description="A mix of sets and minifigures our team keeps coming back to."
            href="/sets"
            linkLabel="Shop all sets"
          />
          <ProductGrid products={featured} />
        </div>
      </section>

      <ReviewsSlider />

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
