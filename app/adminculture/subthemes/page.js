"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSubthemes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("set");
  const [themeFilter, setThemeFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/adminculture/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const typed = products.filter((p) => p.type === typeFilter);

  // Distinct themes for this type
  const themeOptions = Array.from(
    new Map(typed.map((p) => [p.themeSlug, p.theme])).entries()
  ).sort((a, b) => a[1].localeCompare(b[1]));

  // Build subtheme rows
  const subMap = new Map();
  for (const p of typed) {
    if (themeFilter !== "all" && p.themeSlug !== themeFilter) continue;
    if (search && !p.subtheme.toLowerCase().includes(search.toLowerCase()) && !p.theme.toLowerCase().includes(search.toLowerCase())) continue;
    const key = `${p.themeSlug}::${p.subthemeSlug}`;
    if (!subMap.has(key)) {
      subMap.set(key, {
        theme: p.theme, themeSlug: p.themeSlug,
        subtheme: p.subtheme, subthemeSlug: p.subthemeSlug,
        count: 0, heroImage: p.image,
      });
    }
    subMap.get(key).count += 1;
  }
  const rows = Array.from(subMap.values()).sort((a, b) =>
    a.theme.localeCompare(b.theme) || a.subtheme.localeCompare(b.subtheme)
  );

  const base = typeFilter === "set" ? "sets" : "minifigures";

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Subthemes</h1>
        <p className="text-sm text-ink-muted mt-1">
          Subthemes are derived from your products. Adding a product with a new subtheme creates it automatically.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setThemeFilter("all"); }}
          className="border border-line bg-paper px-3 py-2 text-sm focus:outline-none"
        >
          <option value="set">Sets</option>
          <option value="minifigure">Minifigures</option>
        </select>

        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="border border-line bg-paper px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All themes</option>
          {themeOptions.map(([slug, name]) => (
            <option key={slug} value={slug}>{name}</option>
          ))}
        </select>

        <input
          type="search"
          placeholder="Search subtheme or theme…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] border border-line bg-paper px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <p className="mb-3 text-sm text-ink-muted">{rows.length} subtheme{rows.length !== 1 ? "s" : ""}</p>

      {loading ? (
        <p className="py-10 text-center text-sm text-ink-muted">Loading…</p>
      ) : (
        <div className="border border-line bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper border-b border-line">
              <tr>
                {["Theme","Subtheme","Products","Browse","Add Product"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-data uppercase tracking-wide text-ink-muted whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.themeSlug}-${row.subthemeSlug}`} className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="px-3 py-2.5 text-ink-soft">{row.theme}</td>
                  <td className="px-3 py-2.5 font-medium text-ink">{row.subtheme}</td>
                  <td className="px-3 py-2.5 text-ink-muted">{row.count}</td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/${base}/${row.themeSlug}/${row.subthemeSlug}`}
                      target="_blank"
                      className="text-xs text-brand-600 hover:underline"
                    >
                      View ↗
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/adminculture/products?theme=${encodeURIComponent(row.theme)}&subtheme=${encodeURIComponent(row.subtheme)}&type=${typeFilter}`}
                      className="text-xs text-ink-soft hover:text-brand-700 hover:underline"
                    >
                      + Add
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-sm text-ink-muted">
                    No subthemes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 border border-line bg-brand-50 p-4">
        <p className="font-semibold text-brand-800 text-sm">How to add a new subtheme</p>
        <p className="mt-1 text-sm text-brand-700">
          Go to{" "}
          <Link href="/adminculture/products" className="underline">Products</Link>
          {" "}→ Add product → type a new subtheme name. It appears here automatically once saved.
        </p>
      </div>
    </div>
  );
}
