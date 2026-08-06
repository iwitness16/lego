/**
 * lib/data.js — async Supabase data layer.
 * All functions are async and return plain objects / arrays
 * matching the same shape the rest of the app expects.
 */
import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Map a Supabase row to the shape ProductCard / pages expect. */
function toProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    number: row.number,
    name: row.name,
    type: row.type,
    theme: row.theme,
    themeSlug: row.theme_slug,
    subtheme: row.subtheme,
    subthemeSlug: row.subtheme_slug,
    themeGroup: row.theme_group,
    year: row.year,
    launch: row.launch,
    pieces: row.pieces,
    minifigs: row.minifigs,
    designer: row.designer,
    rrp: row.rrp,
    pricePerPiece: row.price_per_piece,
    ageRange: row.age_range,
    packaging: row.packaging,
    packagingSize: row.packaging_size,
    accessories: row.accessories,
    availability: row.availability,
    image: row.image,
    sourceUrl: row.source_url,
    featured: row.featured,
  };
}

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

export async function getThemes(type) {
  const { data, error } = await supabase
    .from("themes_view")
    .select("*")
    .eq("type", type)
    .order("theme");

  if (error) { console.error("getThemes", error); return []; }

  // Fetch hero images: first image per theme from subthemes_view
  const { data: subData } = await supabase
    .from("subthemes_view")
    .select("theme_slug, hero_image")
    .eq("type", type)
    .order("subtheme");

  // Build a map: themeSlug → first hero_image found
  const heroMap = {};
  for (const row of subData || []) {
    if (!heroMap[row.theme_slug] && row.hero_image) {
      heroMap[row.theme_slug] = row.hero_image;
    }
  }

  return data.map((row) => ({
    name: row.theme,
    slug: row.theme_slug,
    subthemeCount: Number(row.subtheme_count),
    productCount: Number(row.product_count),
    heroImage: heroMap[row.theme_slug] || null,
  }));
}

export async function getTheme(type, themeSlug) {
  const themes = await getThemes(type);
  return themes.find((t) => t.slug === themeSlug) || null;
}

// ---------------------------------------------------------------------------
// Subthemes
// ---------------------------------------------------------------------------

export async function getSubthemes(type, themeSlug) {
  const { data, error } = await supabase
    .from("subthemes_view")
    .select("*")
    .eq("type", type)
    .eq("theme_slug", themeSlug)
    .order("subtheme");

  if (error) { console.error("getSubthemes", error); return []; }

  return data.map((row) => ({
    name: row.subtheme,
    slug: row.subtheme_slug,
    theme: row.theme,
    themeSlug: row.theme_slug,
    productCount: Number(row.product_count),
    heroImage: row.hero_image,
  }));
}

export async function getSubtheme(type, themeSlug, subthemeSlug) {
  const subs = await getSubthemes(type, themeSlug);
  return subs.find((s) => s.slug === subthemeSlug) || null;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProducts(type, themeSlug, subthemeSlug) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("type", type)
    .eq("theme_slug", themeSlug)
    .eq("subtheme_slug", subthemeSlug)
    .order("name");

  if (error) { console.error("getProducts", error); return []; }
  return data.map(toProduct);
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) { console.error("getProductById", error); return null; }
  return toProduct(data);
}

export async function getFeaturedProducts(count = 8) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(count);

  if (error) { console.error("getFeaturedProducts", error); return []; }
  return data.map(toProduct);
}

// ---------------------------------------------------------------------------
// Admin CRUD — called from API routes with the service-role client
// ---------------------------------------------------------------------------

export async function adminGetAllProducts(adminClient) {
  const { data, error } = await adminClient
    .from("products")
    .select("*")
    .order("theme")
    .order("subtheme")
    .order("name");
  if (error) throw error;
  return data.map(toProduct);
}

export async function adminCreateProduct(adminClient, fields) {
  const { data, error } = await adminClient
    .from("products")
    .insert(toRow(fields))
    .select()
    .single();
  if (error) throw error;
  return toProduct(data);
}

export async function adminUpdateProduct(adminClient, id, fields) {
  const { data, error } = await adminClient
    .from("products")
    .update(toRow(fields))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toProduct(data);
}

export async function adminDeleteProduct(adminClient, id) {
  const { error } = await adminClient
    .from("products")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

/** Convert camelCase fields back to snake_case for inserts/updates. */
function toRow(f) {
  return {
    number:         f.number,
    name:           f.name,
    type:           f.type,
    theme:          f.theme,
    theme_slug:     f.themeSlug,
    subtheme:       f.subtheme,
    subtheme_slug:  f.subthemeSlug,
    theme_group:    f.themeGroup ?? null,
    year:           f.year ? Number(f.year) : null,
    launch:         f.launch ?? null,
    pieces:         f.pieces ? Number(f.pieces) : null,
    minifigs:       f.minifigs != null ? Number(f.minifigs) : null,
    designer:       f.designer ?? null,
    rrp:            f.rrp ?? null,
    price_per_piece: f.pricePerPiece ?? null,
    age_range:      f.ageRange ?? null,
    packaging:      f.packaging ?? null,
    packaging_size: f.packagingSize ?? null,
    accessories:    f.accessories ?? null,
    availability:   f.availability ?? null,
    image:          f.image ?? null,
    source_url:     f.sourceUrl ?? null,
    featured:       f.featured ?? false,
  };
}
