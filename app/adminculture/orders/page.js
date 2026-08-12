"use client";

import { useEffect, useState, useCallback } from "react";
import { formatUSD } from "@/lib/format";

const STATUS_COLORS = {
  pending:   "bg-stud/20 text-stud-dark",
  confirmed: "bg-brand-100 text-brand-700",
  shipped:   "bg-leaf/20 text-leaf",
  delivered: "bg-leaf text-white",
  cancelled: "bg-clay/20 text-clay",
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function Badge({ status }) {
  return (
    <span className={`text-[10px] font-data uppercase tracking-wide px-2 py-0.5 font-semibold ${STATUS_COLORS[status] || "bg-line text-ink-muted"}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState(null);
  const [updating, setUpdating]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setUpdating(null);
  }

  const filtered = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) =>
      !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase())
    );

  // Summary counts
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>
          <p className="text-sm text-ink-muted">{orders.length} total orders</p>
        </div>
        <button
          onClick={load}
          className="border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-paper transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${filter === "all" ? "bg-ink text-white border-ink" : "border-line text-ink-soft hover:bg-paper"}`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${filter === s ? "bg-ink text-white border-ink" : "border-line text-ink-soft hover:bg-paper"}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by order number, name, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-line bg-paper px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-ink-muted">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-line bg-paper py-16 text-center">
          <p className="text-sm text-ink-muted">No orders found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => {
            const isOpen = expanded === order.id;
            const items  = Array.isArray(order.items) ? order.items : [];
            const wa     = `https://wa.me/18287911525?text=${encodeURIComponent(`Hi ${order.customer_name}, your LegoBricksLink order ${order.order_number} update:`)}`;

            return (
              <div key={order.id} className="border border-line bg-surface shadow-card">
                {/* Row header — always visible */}
                <div
                  className="flex flex-wrap items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-paper/60 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-data text-sm font-semibold text-ink">{order.order_number}</span>
                      <Badge status={order.status} />
                      {order.payment_method && (
                        <span className="text-[10px] font-data uppercase tracking-wide px-2 py-0.5 bg-paper border border-line text-ink-muted">
                          {order.payment_method}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">
                      {order.customer_name} · {order.customer_email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-sm font-semibold text-ink">
                      {formatUSD(order.subtotal_usd)}
                    </p>
                    <p className="text-[10px] text-ink-muted">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 text-ink-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-line px-4 py-4 flex flex-col gap-5">

                    {/* Customer info */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                      {[
                        ["Name",    order.customer_name],
                        ["Email",   order.customer_email],
                        ["Phone",   order.customer_phone],
                        ["Address", [order.customer_address, order.customer_city, order.customer_country].filter(Boolean).join(", ")],
                        ["Payment", order.payment_method],
                        ["Note",    order.customer_note],
                      ].filter(([, v]) => v).map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[9px] font-data uppercase tracking-wide text-ink-muted">{label}</p>
                          <p className="text-xs text-ink mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Items list */}
                    <div className="border border-line overflow-hidden">
                      <div className="bg-paper border-b border-line px-3 py-2">
                        <p className="text-[10px] font-data uppercase tracking-wide text-ink-muted">
                          Items ({items.length})
                        </p>
                      </div>
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-2.5 border-b border-line last:border-0 text-sm">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-ink truncate">{item.name}</p>
                            <p className="text-[10px] text-ink-muted">#{item.number} · {item.theme}</p>
                          </div>
                          <span className="text-ink-muted text-xs shrink-0">× {item.quantity}</span>
                          <span className="font-semibold text-ink text-xs shrink-0 w-16 text-right">
                            {item.rrp || "—"}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between px-3 py-2.5 bg-paper text-sm font-semibold text-ink border-t border-line">
                        <span>Subtotal</span>
                        <span>{formatUSD(order.subtotal_usd)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-ink-muted">Update status:</label>
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border border-line bg-paper px-2 py-1.5 text-xs font-semibold focus:outline-none disabled:opacity-60"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        {updating === order.id && (
                          <span className="text-xs text-ink-muted">Saving…</span>
                        )}
                      </div>

                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 border border-[#25D366] bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                        </svg>
                        WhatsApp customer
                      </a>

                      <a
                        href={`mailto:${order.customer_email}?subject=Your LegoBricksLink Order ${order.order_number}`}
                        className="border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-paper transition-colors"
                      >
                        ✉ Email customer
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
