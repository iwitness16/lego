import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/search?q=<query>&limit=8
// Searches products by:
//   1. Exact / prefix match on `number`  (highest priority)
//   2. Case-insensitive match on `name`
//   3. Case-insensitive match on `theme` or `subtheme`
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q     = (searchParams.get("q") || "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "8", 10), 20);

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  try {
    // Run three targeted queries in parallel, then merge + deduplicate
    const [byNumber, byName, byTheme] = await Promise.all([
      // 1. Number match — ilike so "604" matches "60442-1" etc.
      supabase
        .from("products")
        .select("id, number, name, type, theme, subtheme, theme_slug, subtheme_slug, image, rrp, availability")
        .ilike("number", `${q}%`)
        .order("number")
        .limit(limit),

      // 2. Name contains
      supabase
        .from("products")
        .select("id, number, name, type, theme, subtheme, theme_slug, subtheme_slug, image, rrp, availability")
        .ilike("name", `%${q}%`)
        .order("name")
        .limit(limit),

      // 3. Theme or subtheme contains
      supabase
        .from("products")
        .select("id, number, name, type, theme, subtheme, theme_slug, subtheme_slug, image, rrp, availability")
        .or(`theme.ilike.%${q}%,subtheme.ilike.%${q}%`)
        .order("name")
        .limit(limit),
    ]);

    // Merge, deduplicate by id, cap at limit
    const seen = new Set();
    const results = [];

    for (const row of [
      ...(byNumber.data || []),
      ...(byName.data   || []),
      ...(byTheme.data  || []),
    ]) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        results.push(row);
      }
      if (results.length >= limit) break;
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
