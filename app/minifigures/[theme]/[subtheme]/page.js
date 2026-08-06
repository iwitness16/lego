import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { getProducts, getSubtheme, getTheme } from "@/lib/data";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export async function generateMetadata({ params }) {
  const sub = await getSubtheme("minifigure", params.theme, params.subtheme);
  if (!sub) return {};
  return {
    title: `${sub.name} Minifigures — ${sub.theme} — LegoBricksLink`,
    description: `Shop ${sub.name} LEGO minifigures from the ${sub.theme} theme.`,
  };
}

export default async function MinifigureSubthemePage({ params, searchParams }) {
  const [theme, subtheme, allProducts] = await Promise.all([
    getTheme("minifigure", params.theme),
    getSubtheme("minifigure", params.theme, params.subtheme),
    getProducts("minifigure", params.theme, params.subtheme),
  ]);
  if (!theme || !subtheme) notFound();

  const currentPage = Math.max(1, Number(searchParams?.page) || 1);
  const totalPages = Math.max(1, Math.ceil(allProducts.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = allProducts.slice(start, start + PAGE_SIZE);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Minifigures", href: "/minifigures" },
          { label: theme.name, href: `/minifigures/${theme.slug}` },
          { label: subtheme.name },
        ]}
      />
      <div className="mt-4 mb-10">
        <p className="eyebrow">{theme.name}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {subtheme.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          {allProducts.length} minifigure{allProducts.length === 1 ? "" : "s"} in this subtheme
        </p>
      </div>
      <ProductGrid products={pageProducts} />
      <Pagination
        basePath={`/minifigures/${theme.slug}/${subtheme.slug}`}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
