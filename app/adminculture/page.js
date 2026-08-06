"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATS = [
  { label: "Products", href: "/adminculture/products" },
  { label: "Themes", href: "/adminculture/themes" },
  { label: "Subthemes", href: "/adminculture/subthemes" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: "—", sets: "—", minifigures: "—", featured: "—" });

  useEffect(() => {
    fetch("/api/adminculture/products")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setCounts({
          products: data.length,
          sets: data.filter((p) => p.type === "set").length,
          minifigures: data.filter((p) => p.type === "minifigure").length,
          featured: data.filter((p) => p.featured).length,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Total products", value: counts.products, color: "bg-brand-600" },
    { label: "Sets", value: counts.sets, color: "bg-ink" },
    { label: "Minifigures", value: counts.minifigures, color: "bg-brand-800" },
    { label: "Featured", value: counts.featured, color: "bg-leaf" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Overview of your LegoBricksLink catalog.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} p-5 text-white`}>
            <p className="text-3xl font-display font-bold">{c.value}</p>
            <p className="mt-1 text-sm font-medium opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/adminculture/products", title: "Manage Products", desc: "Add, edit or delete sets and minifigures." },
          { href: "/adminculture/themes", title: "Manage Themes", desc: "View all themes grouped by type." },
          { href: "/adminculture/subthemes", title: "Manage Subthemes", desc: "View and navigate subthemes." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-line bg-surface p-5 shadow-card hover:shadow-lift transition-shadow"
          >
            <p className="font-display font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
