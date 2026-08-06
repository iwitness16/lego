import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <p className="rounded-xl2 border border-dashed border-line bg-paper p-10 text-center text-sm text-ink-muted">
        No products found in this subtheme yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
