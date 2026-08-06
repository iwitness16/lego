import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubthemeGrid from "@/components/SubthemeGrid";
import { getSubthemes, getTheme } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const theme = await getTheme("minifigure", params.theme);
  if (!theme) return {};
  return {
    title: `${theme.name} Minifigures — LegoBricksLink`,
    description: `Browse ${theme.name} subthemes and LEGO minifigures.`,
  };
}

export default async function MinifigureThemePage({ params }) {
  const [theme, subthemes] = await Promise.all([
    getTheme("minifigure", params.theme),
    getSubthemes("minifigure", params.theme),
  ]);
  if (!theme) notFound();

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Minifigures", href: "/minifigures" },
          { label: theme.name },
        ]}
      />
      <div className="mt-4 mb-10">
        <p className="eyebrow">Theme</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {theme.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          {theme.subthemeCount} subthemes · {theme.productCount} minifigures available
        </p>
      </div>
      <SubthemeGrid type="minifigure" subthemes={subthemes} />
    </div>
  );
}
