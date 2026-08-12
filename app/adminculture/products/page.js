"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { slugify } from "@/lib/slugify";

const EMPTY = {
  number: "", name: "", type: "set",
  theme: "", themeSlug: "", subtheme: "", subthemeSlug: "",
  themeGroup: "", year: "", pieces: "", minifigs: "", accessories: "",
  designer: "", rrp: "", ageRange: "", packaging: "", packagingSize: "",
  availability: "", image: "", sourceUrl: "", featured: false,
};

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-data uppercase tracking-wide text-ink-muted">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }) {
  return (
    <input
      type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder}
      className="w-full border border-line bg-paper px-2.5 py-1.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
    />
  );
}

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/adminculture/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Pre-fill form if redirected from subthemes page
  useEffect(() => {
    const qTheme = searchParams.get("theme");
    const qSub   = searchParams.get("subtheme");
    const qType  = searchParams.get("type");
    if (qTheme && qSub) {
      setForm((prev) => ({
        ...prev,
        theme: qTheme, themeSlug: slugify(qTheme),
        subtheme: qSub, subthemeSlug: slugify(qSub),
        type: qType || "set",
      }));
      setEditId(null);
      setShowForm(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = products
    .filter((p) => typeFilter === "all" || p.type === typeFilter)
    .filter((p) =>
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.number?.toLowerCase().includes(search.toLowerCase()) ||
      p.theme?.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function openAdd() {
    setForm(EMPTY); setEditId(null); setError(""); setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      number: p.number, name: p.name, type: p.type,
      theme: p.theme, themeSlug: p.themeSlug,
      subtheme: p.subtheme, subthemeSlug: p.subthemeSlug,
      themeGroup: p.themeGroup || "", year: p.year || "",
      pieces: p.pieces || "", minifigs: p.minifigs ?? "",
      accessories: p.accessories || "", designer: p.designer || "",
      rrp: p.rrp || "", ageRange: p.ageRange || "",
      packaging: p.packaging || "", packagingSize: p.packagingSize || "",
      availability: p.availability || "", image: p.image || "",
      sourceUrl: p.sourceUrl || "", featured: p.featured || false,
    });
    setEditId(p.id); setError(""); setShowForm(true);
  }

  function set(key) {
    return (e) => {
      const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => {
        const next = { ...prev, [key]: val };
        if (key === "theme") next.themeSlug = slugify(val);
        if (key === "subtheme") next.subthemeSlug = slugify(val);
        return next;
      });
    };
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    if (!form.number || !form.name || !form.theme || !form.subtheme) {
      setError("Number, name, theme, and subtheme are required."); return;
    }

    // Client-side duplicate check — warn before hitting the API
    if (!editId) {
      const duplicate = products.find(
        (p) => p.number?.toLowerCase() === form.number.trim().toLowerCase()
             && p.type === form.type
      );
      if (duplicate) {
        setError(
          `Product number "${form.number}" already exists as a ${form.type} ("${duplicate.name}"). ` +
          `Each number must be unique per type. Use a different number or edit the existing product.`
        );
        return;
      }
    }

    setSaving(true);
    try {
      const url = editId ? `/api/adminculture/products/${editId}` : "/api/adminculture/products";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json();
        // Surface duplicate key error from Postgres in a friendly way
        const msg = j.error || "Save failed";
        if (msg.includes("products_number_type_idx") || msg.includes("duplicate key")) {
          setError(
            `Product number "${form.number}" already exists for type "${form.type}". ` +
            `Please use a different number or switch the type.`
          );
        } else {
          setError(msg);
        }
        return;
      }
      await load();
      setShowForm(false);
    } catch (err) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/adminculture/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Products</h1>
          <p className="text-sm text-ink-muted">{products.length} total</p>
        </div>
        <button onClick={openAdd} className="bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Add product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="search" placeholder="Search name, number, theme…"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[180px] border border-line bg-paper px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <select
          value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="border border-line bg-paper px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All types</option>
          <option value="set">Sets</option>
          <option value="minifigure">Minifigures</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-ink-muted py-10 text-center">Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper">
              <tr>
                {["Number","Name","Type","Theme","Subtheme","Featured","Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-data uppercase tracking-wide text-ink-muted whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="px-3 py-2 font-data text-xs text-ink-muted whitespace-nowrap">{p.number}</td>
                  <td className="px-3 py-2 text-ink font-medium max-w-[200px] truncate">{p.name}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-data uppercase px-1.5 py-0.5 ${p.type === "set" ? "bg-brand-100 text-brand-700" : "bg-stud/20 text-stud-dark"}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-ink-soft whitespace-nowrap">{p.theme}</td>
                  <td className="px-3 py-2 text-ink-soft whitespace-nowrap">{p.subtheme}</td>
                  <td className="px-3 py-2 text-center">{p.featured ? "★" : "–"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="mr-3 text-brand-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-clay hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-10 text-center text-sm text-ink-muted">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-end">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-line disabled:opacity-40 hover:bg-paper">‹ Prev</button>
          <span className="text-sm text-ink-muted">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-line disabled:opacity-40 hover:bg-paper">Next ›</button>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 px-4 py-10">
          <div className="w-full max-w-2xl bg-surface border border-line shadow-lift">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">
                {editId ? "Edit product" : "Add product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-ink text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleSave} className="p-5 grid grid-cols-2 gap-4">
              {error && <p className="col-span-2 border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}

              <Field label="Number *">
                <Input value={form.number} onChange={set("number")} placeholder="e.g. 10351-1" />
                {/* Live duplicate indicator */}
                {!editId && form.number && (() => {
                  const dup = products.find(
                    (p) => p.number?.toLowerCase() === form.number.trim().toLowerCase()
                         && p.type === form.type
                  );
                  return dup
                    ? <span className="text-[10px] text-clay font-semibold mt-0.5">
                        ⚠ Already exists: "{dup.name}"
                      </span>
                    : <span className="text-[10px] text-leaf font-semibold mt-0.5">✓ Available</span>;
                })()}
              </Field>
              <Field label="Type *">
                <select value={form.type} onChange={set("type")} className="w-full border border-line bg-paper px-2.5 py-1.5 text-sm focus:outline-none">
                  <option value="set">Set</option>
                  <option value="minifigure">Minifigure</option>
                </select>
              </Field>

              <Field label="Name *"><Input value={form.name} onChange={set("name")} placeholder="Product name" /></Field>
              <Field label="Year"><Input value={form.year} onChange={set("year")} type="number" placeholder="2025" /></Field>

              <Field label="Theme *">
                <Input value={form.theme} onChange={set("theme")} placeholder="e.g. Icons" />
                <span className="text-[9px] text-ink-muted mt-0.5">Slug: {form.themeSlug || "—"}</span>
              </Field>
              <Field label="Subtheme *">
                <Input value={form.subtheme} onChange={set("subtheme")} placeholder="e.g. Miscellaneous" />
                <span className="text-[9px] text-ink-muted mt-0.5">Slug: {form.subthemeSlug || "—"}</span>
              </Field>

              <Field label="Theme Group"><Input value={form.themeGroup} onChange={set("themeGroup")} placeholder="e.g. Model making" /></Field>
              <Field label="Pieces"><Input value={form.pieces} onChange={set("pieces")} type="number" /></Field>

              {form.type === "set" ? (
                <Field label="Minifigs"><Input value={form.minifigs} onChange={set("minifigs")} type="number" /></Field>
              ) : (
                <Field label="Accessories"><Input value={form.accessories} onChange={set("accessories")} placeholder="e.g. Wand, glasses" /></Field>
              )}
              <Field label="Designer"><Input value={form.designer} onChange={set("designer")} /></Field>

              <Field label="RRP"><Input value={form.rrp} onChange={set("rrp")} placeholder="£9.99, $9.99, €9.99" /></Field>
              <Field label="Age Range"><Input value={form.ageRange} onChange={set("ageRange")} placeholder="6+" /></Field>

              <Field label="Packaging"><Input value={form.packaging} onChange={set("packaging")} placeholder="Box / Polybag / Paper bag" /></Field>
              <Field label="Packaging Size"><Input value={form.packagingSize} onChange={set("packagingSize")} placeholder="26.2 x 19.1 x 6.1 cm" /></Field>

              <Field label="Availability"><Input value={form.availability} onChange={set("availability")} placeholder="Retail / LEGO exclusive" /></Field>
              <Field label="Image URL">
                <Input value={form.image} onChange={set("image")} placeholder="https://images.brickset.com/…" />
              </Field>

              <div className="col-span-2">
                <Field label="Source URL"><Input value={form.sourceUrl} onChange={set("sourceUrl")} /></Field>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="featured" checked={!!form.featured} onChange={set("featured")} className="h-4 w-4" />
                <label htmlFor="featured" className="text-sm text-ink">Mark as featured</label>
              </div>

              <div className="col-span-2 flex justify-end gap-3 border-t border-line pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm border border-line hover:bg-paper">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-ink hover:bg-brand-700 disabled:opacity-60">
                  {saving ? "Saving…" : editId ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
