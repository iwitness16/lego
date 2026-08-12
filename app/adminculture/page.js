"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatUSD } from "@/lib/format";

export default function AdminDashboard() {
  const [productCounts, setProductCounts] = useState({
    products: "—", sets: "—", minifigures: "—", featured: "—",
  });
  const [orderCounts, setOrderCounts] = useState({
    total: "—", pending: "—", confirmed: "—", revenue: "—",
  });

  useEffect(() => {
    // Load products
    fetch("/api/adminculture/products")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setProductCounts({
          products:    data.length,
          sets:        data.filter((p) => p.type === "set").length,
          minifigures: data.filter((p) => p.type === "minifigure").length,
          featured:    data.filter((p) => p.featured).length,
        });
      })
      .catch(() => {});

    // Load orders
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const revenue = data.reduce((sum, o) => sum + (parseFloat(o.subtotal_usd) || 0), 0);
        setOrderCounts({
          total:     data.length,
          pending:   data.filter((o) => o.status === "pending").length,
          confirmed: data.filter((o) => o.status === "confirmed" || o.status === "shipped" || o.status === "delivered").length,
          revenue:   formatUSD(revenue),
        });
      })
      .catch(() => {});
  }, []);

  const productCards = [
    { label: "Total products", value: productCounts.products, color: "bg-brand-600" },
    { label: "Sets",           value: productCounts.sets,     color: "bg-ink" },
    { label: "Minifigures",    value: productCounts.minifigures, color: "bg-brand-800" },
    { label: "Featured",       value: productCounts.featured, color: "bg-leaf" },
  ];

  const orderCards = [
    { label: "Total orders",  value: orderCounts.total,     color: "bg-stud-dark" },
    { label: "Pending",       value: orderCounts.pending,   color: "bg-clay" },
    { label: "Active orders", value: orderCounts.confirmed, color: "bg-leaf" },
    { label: "Total revenue", value: orderCounts.revenue,   color: "bg-brand-700" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">LegoBricksLink admin overview.</p>

      {/* Orders stats */}
      <h2 className="mt-8 mb-3 font-display text-base font-semibold text-ink-soft uppercase tracking-wide text-xs">
        Orders
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {orderCards.map((c) => (
          <div key={c.label} className={`${c.color} p-5 text-white`}>
            <p className="text-3xl font-display font-bold">{c.value}</p>
            <p className="mt-1 text-sm font-medium opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Products stats */}
      <h2 className="mt-8 mb-3 font-display text-base font-semibold text-ink-soft uppercase tracking-wide text-xs">
        Catalog
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {productCards.map((c) => (
          <div key={c.label} className={`${c.color} p-5 text-white`}>
            <p className="text-3xl font-display font-bold">{c.value}</p>
            <p className="mt-1 text-sm font-medium opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/adminculture/orders",    title: "Manage Orders",    desc: "View, update status and contact customers.",   badge: orderCounts.pending !== "—" && orderCounts.pending > 0 ? `${orderCounts.pending} pending` : null },
          { href: "/adminculture/products",  title: "Manage Products",  desc: "Add, edit or delete sets and minifigures.",    badge: null },
          { href: "/adminculture/themes",    title: "Manage Themes",    desc: "View all themes grouped by type.",             badge: null },
          { href: "/adminculture/subthemes", title: "Manage Subthemes", desc: "Filter and navigate subthemes.",              badge: null },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative border border-line bg-surface p-5 shadow-card hover:shadow-lift transition-shadow"
          >
            {item.badge && (
              <span className="absolute top-3 right-3 bg-clay text-white text-[10px] font-semibold px-2 py-0.5">
                {item.badge}
              </span>
            )}
            <p className="font-display font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
