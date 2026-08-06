import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubthemeGrid from "@/components/SubthemeGrid";
import { getSubthemes, getTheme } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const theme = await getTheme("set", params.theme);
  if (!theme) return {};
  return {
    title: `${theme.name} Sets — LegoBricksLink`,
    description: `Browse ${theme.name} subthemes and LEGO sets.`,
  };
}

export default async function SetThemePage({ params }) {
  const [theme, subthemes] = await Promise.all([
    getTheme("set", params.theme),
    getSubthemes("set", params.theme),
  ]);
  if (!theme) notFound();

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Sets", href: "/sets" },
          { label: theme.name },
        ]}
      />
      <div className="mt-4 mb-10">
        <p className="eyebrow">Theme</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {theme.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          {theme.subthemeCount} subthemes · {theme.productCount} sets available
        </p>
      </div>
      <SubthemeGrid type="set" subthemes={subthemes} />
    </div>
  );
}
