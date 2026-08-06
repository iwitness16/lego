-- ============================================================
--  LegoBricksLink — Supabase Schema
--  Run this ENTIRE file first in the Supabase SQL Editor,
--  then run seed.sql.
--  Safe to re-run (uses IF NOT EXISTS / OR REPLACE / DROP IF EXISTS).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Extensions
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 2. Tables
-- ------------------------------------------------------------

-- products: single table for both sets AND minifigures.
--   type = 'set' | 'minifigure'
create table if not exists products (
  id               uuid        primary key default uuid_generate_v4(),
  number           text        not null,
  name             text        not null,
  type             text        not null check (type in ('set', 'minifigure')),

  -- taxonomy
  theme            text        not null,
  theme_slug       text        not null,
  subtheme         text        not null,
  subtheme_slug    text        not null,
  theme_group      text,

  -- shared metadata
  year             int,
  launch           text,
  pieces           int,
  age_range        text,
  packaging        text,
  packaging_size   text,
  availability     text,
  rrp              text,
  price_per_piece  text,
  image            text,
  source_url       text,
  featured         boolean     not null default false,

  -- sets only
  minifigs         int,
  designer         text,

  -- minifigures only
  accessories      text,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Unique constraint: same set number can't appear twice for the same type
create unique index if not exists products_number_type_idx
  on products (number, type);

-- Index for common query patterns
create index if not exists products_type_idx
  on products (type);

create index if not exists products_theme_slug_idx
  on products (theme_slug);

create index if not exists products_subtheme_slug_idx
  on products (subtheme_slug);

create index if not exists products_featured_idx
  on products (featured)
  where featured = true;


-- admins: simple email + bcrypt-hashed password table.
create table if not exists admins (
  id            uuid        primary key default uuid_generate_v4(),
  email         text        unique not null,
  password_hash text        not null,
  created_at    timestamptz not null default now()
);


-- ------------------------------------------------------------
-- 3. Auto-update updated_at trigger
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row
  execute procedure set_updated_at();


-- ------------------------------------------------------------
-- 4. Row Level Security
-- ------------------------------------------------------------
alter table products enable row level security;
alter table admins   enable row level security;

-- Public: anyone can read products (needed for the store front-end)
drop policy if exists "public can read products" on products;
create policy "public can read products"
  on products
  for select
  using (true);

-- Service-role (admin API routes): full access to products
drop policy if exists "service role full access to products" on products;
create policy "service role full access to products"
  on products
  for all
  using     (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Admins table: service-role only (no public read)
drop policy if exists "service role full access to admins" on admins;
create policy "service role full access to admins"
  on admins
  for all
  using     (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');


-- ------------------------------------------------------------
-- 5. Helper views (used by lib/data.js)
-- ------------------------------------------------------------

-- themes_view: one row per type+theme combination with counts
create or replace view themes_view as
select
  type,
  theme,
  theme_slug,
  count(distinct subtheme_slug) as subtheme_count,
  count(*)                      as product_count
from products
group by type, theme, theme_slug
order by theme;


-- subthemes_view: one row per type+theme+subtheme with counts + hero image
create or replace view subthemes_view as
select
  type,
  theme,
  theme_slug,
  subtheme,
  subtheme_slug,
  count(*)   as product_count,
  min(image) as hero_image
from products
group by type, theme, theme_slug, subtheme, subtheme_slug
order by theme, subtheme;
