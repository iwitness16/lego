"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ── Simple session context ──────────────────────────────────────────────────
const AdminCtx = createContext(null);
export function useAdmin() { return useContext(AdminCtx); }

const NAV = [
  { href: "/adminculture", label: "Dashboard", exact: true },
  { href: "/adminculture/products", label: "Products" },
  { href: "/adminculture/themes", label: "Themes" },
  { href: "/adminculture/subthemes", label: "Subthemes" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authed");
    if (stored === "1") setAuthed(true);
    setChecking(false);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/adminculture/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Invalid credentials"); return; }
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    router.push("/adminculture");
  }

  if (checking) return null;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="w-full max-w-sm border border-line bg-surface shadow-card">
          <div className="border-b border-line bg-ink px-6 py-5">
            <p className="text-xs font-data uppercase tracking-widest text-white/60">Admin</p>
            <h1 className="mt-1 font-display text-xl font-semibold text-white">Sign in</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6">
            {error && (
              <p className="border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
            )}
            <input
              type="email" required placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <input
              type="password" required placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-ink py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminCtx.Provider value={{ handleLogout }}>
      <div className="flex min-h-screen bg-paper">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-ink lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-xs font-data uppercase tracking-widest text-white/50">LegoBricksLink</p>
            <p className="mt-0.5 font-display text-base font-semibold text-white">Admin</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-3">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-sm text-white/50 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          {/* Mobile topbar */}
          <header className="flex items-center justify-between border-b border-line bg-ink px-4 py-3 lg:hidden">
            <p className="font-display text-sm font-semibold text-white">Admin</p>
            <div className="flex items-center gap-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-white/60 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white">
                Out
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 sm:p-8">{children}</main>
        </div>
      </div>
    </AdminCtx.Provider>
  );
}
