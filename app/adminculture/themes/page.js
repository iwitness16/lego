"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminThemes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/adminculture/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Build themes map from live products
  const build = (type) => {
    const map = new Map();
    for (const p of products.filter((x) => x.type === type)) {
      if (!map.has(p.themeSlug)) {
        map.set(p.themeSlug, { name: p.theme, slug: p.themeSlug, subthemes: new Set(), count: 0 });
      }
      const entry = map.get(p.themeSlug);
      entry.subthemes.add(p.subthemeSlug);
      entry.count += 1;
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const setThemes = build("set");
  const figThemes = build("minifigure");

  if (loading) return <p className="text-sm text-ink-muted py-10 text-center">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Themes</h1>
          <p className="text-sm text-ink-muted">Themes are derived from your products. To add a theme, add a product with that theme name.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {[{ label: "Set Themes", themes: setThemes, base: "sets" }, { label: "Minifigure Themes", themes: figThemes, base: "minifigures" }].map(({ label, themes, base }) => (
          <div key={label}>
            <h2 className="font-display text-base font-semibold text-ink mb-3 border-b border-line pb-2">{label} ({themes.length})</h2>
            {themes.length === 0 ? (
              <p className="text-sm text-ink-muted">No themes yet.</p>
            ) : (
              <div className="border border-line bg-surface overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-paper border-b border-line">
                    <tr>
                      {["Theme", "Subthemes", "Products", "Browse"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] font-data uppercase tracking-wide text-ink-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {themes.map((t) => (
                      <tr key={t.slug} className="border-b border-line last:border-0 hover:bg-paper/60">
                        <td className="px-3 py-2 font-medium text-ink">{t.name}</td>
                        <td className="px-3 py-2 text-ink-muted">{t.subthemes.size}</td>
                        <td className="px-3 py-2 text-ink-muted">{t.count}</td>
                        <td className="px-3 py-2">
                          <Link href={`/${base}/${t.slug}`} target="_blank" className="text-xs text-brand-600 hover:underline">
                            View ↗
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 border border-line bg-brand-50 p-5">
        <p className="font-semibold text-brand-800 text-sm">How to add a new theme</p>
        <p className="mt-1 text-sm text-brand-700">
          Go to <Link href="/adminculture/products" className="underline">Products</Link> → Add product → fill in a new theme name.
          The theme will appear automatically once any product with that theme is saved.
        </p>
      </div>
    </div>
  );
}
