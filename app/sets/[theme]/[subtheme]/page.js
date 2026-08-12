import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { getProducts, getSubtheme, getTheme } from "@/lib/data";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export async function generateMetadata({ params }) {
  const sub = await getSubtheme("set", params.theme, params.subtheme);
  if (!sub) return {};
  return {
    title: `${sub.name} Sets — ${sub.theme} — LegoBricksLink`,
    description: `Shop ${sub.name} LEGO sets from the ${sub.theme} theme.`,
  };
}

export default async function SetSubthemePage({ params, searchParams }) {
  const [theme, subtheme, allProducts] = await Promise.all([
    getTheme("set", params.theme),
    getSubtheme("set", params.theme, params.subtheme),
    getProducts("set", params.theme, params.subtheme),
  ]);
  if (!theme || !subtheme) notFound();

  const highlightId = searchParams?.highlight || null;

  // If a highlight id is present, find which page that product is on
  // and override the page param so the user lands on the right page.
  let currentPage = Math.max(1, Number(searchParams?.page) || 1);
  if (highlightId) {
    const idx = allProducts.findIndex((p) => p.id === highlightId);
    if (idx !== -1) {
      currentPage = Math.ceil((idx + 1) / PAGE_SIZE);
    }
  }

  const totalPages  = Math.max(1, Math.ceil(allProducts.length / PAGE_SIZE));
  const start       = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = allProducts.slice(start, start + PAGE_SIZE);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs
        trail={[
          { label: "Home",       href: "/" },
          { label: "Sets",       href: "/sets" },
          { label: theme.name,   href: `/sets/${theme.slug}` },
          { label: subtheme.name },
        ]}
      />
      <div className="mt-4 mb-10">
        <p className="eyebrow">{theme.name}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {subtheme.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          {allProducts.length} set{allProducts.length === 1 ? "" : "s"} in this subtheme
        </p>
      </div>
      <ProductGrid products={pageProducts} highlightId={highlightId} />
      <Pagination
        basePath={`/sets/${theme.slug}/${subtheme.slug}`}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
