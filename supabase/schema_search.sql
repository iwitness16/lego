-- ============================================================
--  LegoBricksLink — Search Indexes
--  Run this in Supabase SQL Editor to speed up live search.
--  These indexes make ILIKE queries on number, name, theme fast.
-- ============================================================

-- pg_trgm extension enables fast trigram-based ILIKE searches
create extension if not exists pg_trgm;

-- Trigram index on number (e.g. "604" instantly finds "60442-1")
create index if not exists products_number_trgm
  on products using gin (number gin_trgm_ops);

-- Trigram index on name
create index if not exists products_name_trgm
  on products using gin (name gin_trgm_ops);

-- Trigram index on theme
create index if not exists products_theme_trgm
  on products using gin (theme gin_trgm_ops);

-- Trigram index on subtheme
create index if not exists products_subtheme_trgm
  on products using gin (subtheme gin_trgm_ops);
