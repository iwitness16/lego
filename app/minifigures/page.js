import Breadcrumbs from "@/components/Breadcrumbs";
import ThemeGrid from "@/components/ThemeGrid";
import { getThemes } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop LEGO Minifigures by Theme — LegoBricksLink",
  description: "Browse LEGO minifigures organized by theme, then subtheme.",
};

export default async function MinifiguresPage() {
  const themes = await getThemes("minifigure");

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Minifigures" }]} />
      <div className="mt-4 mb-10">
        <p className="eyebrow">Minifigures</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Browse minifigures by theme
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          Choose a universe to see its subthemes, then drill into the full
          collectible lineup — accessories and piece counts included.
        </p>
      </div>
      <ThemeGrid type="minifigure" themes={themes} />
    </div>
  );
}
