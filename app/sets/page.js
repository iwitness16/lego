import Breadcrumbs from "@/components/Breadcrumbs";
import ThemeGrid from "@/components/ThemeGrid";
import { getThemes } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop LEGO Sets by Theme — LegoBricksLink",
  description: "Browse LEGO sets organized by theme, then subtheme.",
};

export default async function SetsPage() {
  const themes = await getThemes("set");

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Sets" }]} />
      <div className="mt-4 mb-10">
        <p className="eyebrow">Sets</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Browse sets by theme
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          Choose a theme to see its subthemes, then drill into the full
          product listing — every set includes its real spec sheet.
        </p>
      </div>
      <ThemeGrid type="set" themes={themes} />
    </div>
  );
}
