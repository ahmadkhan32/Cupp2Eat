-- ==============================================================================
-- 8. Complete Row Level Security (RLS) Policies (Idempotent & Safe)
-- ==============================================================================

-- Ensure carts and cart_items exist in case migration 005 was run out of order
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity int not null default 1,
  price_snapshot numeric(12,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS across all tables safely with IF EXISTS
alter table if exists public.profiles enable row level security;
alter table if exists public.user_roles enable row level security;
alter table if exists public.addresses enable row level security;
alter table if exists public.carts enable row level security;
alter table if exists public.cart_items enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.order_items enable row level security;
alter table if exists public.payments enable row level security;
alter table if exists public.invoices enable row level security;
alter table if exists public.shipments enable row level security;
alter table if exists public.notifications enable row level security;
alter table if exists public.reviews enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.product_images enable row level security;
alter table if exists public.product_variants enable row level security;
alter table if exists public.inventory enable row level security;

-- Public read catalog
drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories for select using (is_active = true);

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products" on public.products for select using (is_published = true);

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images" on public.product_images for select using (true);

drop policy if exists "Public can read product variants" on public.product_variants;
create policy "Public can read product variants" on public.product_variants for select using (is_active = true);

-- Profiles policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Addresses policies
drop policy if exists "Users manage own addresses" on public.addresses;
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- Cart policies
drop policy if exists "Users manage own carts" on public.carts;
create policy "Users manage own carts" on public.carts for all using (auth.uid() = user_id);

drop policy if exists "Users manage own cart items" on public.cart_items;
create policy "Users manage own cart items" on public.cart_items for all using (
  cart_id in (select id from public.carts where user_id = auth.uid())
);

-- Orders policies
drop policy if exists "Customers can view own orders" on public.orders;
create policy "Customers can view own orders" on public.orders for select using (auth.uid() = customer_id);

drop policy if exists "Customers can view own order items" on public.order_items;
create policy "Customers can view own order items" on public.order_items for select using (
  order_id in (select id from public.orders where customer_id = auth.uid())
);

-- Notifications
drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications" on public.notifications for all using (auth.uid() = user_id);

-- Reviews
drop policy if exists "Approved reviews are public" on public.reviews;
create policy "Approved reviews are public" on public.reviews for select using (is_approved = true);

drop policy if exists "Users manage own reviews" on public.reviews;
create policy "Users manage own reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Admin Master Access (Admins can view and manage across tables)
drop policy if exists "Admins full access to products" on public.products;
create policy "Admins full access to products" on public.products for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins full access to categories" on public.categories;
create policy "Admins full access to categories" on public.categories for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins full access to orders" on public.orders;
create policy "Admins full access to orders" on public.orders for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins full access to inventory" on public.inventory;
create policy "Admins full access to inventory" on public.inventory for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins full access to payments" on public.payments;
create policy "Admins full access to payments" on public.payments for all using (public.is_admin(auth.uid()));

drop policy if exists "Admins full access to shipments" on public.shipments;
create policy "Admins full access to shipments" on public.shipments for all using (public.is_admin(auth.uid()));

drop policy if exists "Super admins manage roles" on public.user_roles;
create policy "Super admins manage roles" on public.user_roles for all using (public.is_super_admin(auth.uid()));
