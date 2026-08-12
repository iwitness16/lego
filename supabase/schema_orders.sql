-- ============================================================
--  LegoBricksLink — Orders Schema
--  Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

create table if not exists orders (
  id              uuid        primary key default uuid_generate_v4(),
  order_number    text        unique not null,   -- e.g. LBL-20260804-0001

  -- Customer details
  customer_name   text        not null,
  customer_email  text        not null,
  customer_phone  text,
  customer_address text,
  customer_city   text,
  customer_country text,
  customer_note   text,

  -- Payment method chosen by customer
  payment_method  text,

  -- Order data (full cart snapshot as JSON)
  items           jsonb       not null default '[]',
  subtotal_usd    numeric(10,2) not null,
  shipping_note   text        default 'Calculated separately',

  -- Status
  status          text        not null default 'pending'
                  check (status in ('pending','confirmed','shipped','delivered','cancelled')),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_status_idx      on orders (status);
create index if not exists orders_customer_email  on orders (customer_email);
create index if not exists orders_created_at_idx  on orders (created_at desc);

-- auto-update updated_at
drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

-- RLS
alter table orders enable row level security;

-- Public: INSERT only (customers place orders without being logged in)
drop policy if exists "public can insert orders" on orders;
create policy "public can insert orders"
  on orders for insert
  with check (true);

-- Service-role: full access (admin API)
drop policy if exists "service role full access orders" on orders;
create policy "service role full access orders"
  on orders for all
  using     (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================
-- Migration: add payment_method column if it doesn't exist
-- Safe to run even if table was already created above.
-- ============================================================
alter table orders
  add column if not exists payment_method text;
