-- ==============================================================================
-- 8. Complete Row Level Security (RLS) Policies (100% Self-Healing & Idempotent)
-- ==============================================================================

-- 1. Ensure all tables exist before enabling RLS or adding policies
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  organization_name text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin', 'org_admin', 'admin', 'customer')),
  organization_name text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  base_price numeric(12,2) not null,
  sale_price numeric(12,2),
  currency text default 'INR',
  is_featured boolean default false,
  is_published boolean default true,
  rating numeric(3,2) default 5.0,
  reviews_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique not null,
  flavour text,
  size text,
  weight_grams int,
  price_adjustment numeric(12,2) default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid unique not null references public.product_variants(id) on delete cascade,
  quantity int not null default 0,
  reserved_quantity int not null default 0,
  low_stock_threshold int default 10,
  updated_at timestamptz default now()
);

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

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  street_address text not null,
  landmark text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text default 'India',
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references auth.users(id) on delete set null,
  guest_email text,
  guest_phone text,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  subtotal numeric(12,2) not null,
  discount_amount numeric(12,2) default 0,
  delivery_charge numeric(12,2) default 0,
  gst_tax_amount numeric(12,2) default 0,
  total numeric(12,2) not null,
  payment_method text not null,
  payment_status text not null default 'pending',
  order_status text not null default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  sku text,
  quantity int not null,
  unit_price numeric(12,2) not null,
  total_price numeric(12,2) not null,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(12,2) not null,
  currency text default 'INR',
  method text not null,
  status text not null,
  error_code text,
  error_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_id uuid references auth.users(id),
  subtotal numeric(12,2) not null,
  gst_tax_amount numeric(12,2) not null,
  total numeric(12,2) not null,
  pdf_url text,
  status text default 'issued',
  created_at timestamptz default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  courier_name text,
  awb_number text unique,
  tracking_url text,
  status text default 'label_created',
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'order_update',
  is_read boolean default false,
  reference_link text,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reviewer_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  comment text,
  is_verified_buyer boolean default false,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- 2. Ensure RBAC helper functions exist
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.user_roles
    where user_id = $1 and role in ('super_admin', 'org_admin', 'admin')
  );
$$ language sql security definer;

create or replace function public.is_super_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.user_roles
    where user_id = $1 and role = 'super_admin'
  );
$$ language sql security definer;

-- 3. Enable RLS across all tables safely
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

-- 4. Catalog Policies (Public Read)
drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories for select using (is_active = true);

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products" on public.products for select using (is_published = true);

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images" on public.product_images for select using (true);

drop policy if exists "Public can read product variants" on public.product_variants;
create policy "Public can read product variants" on public.product_variants for select using (is_active = true);

-- 5. Profiles Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 6. Addresses Policies
drop policy if exists "Users manage own addresses" on public.addresses;
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- 7. Cart Policies
drop policy if exists "Users manage own carts" on public.carts;
create policy "Users manage own carts" on public.carts for all using (auth.uid() = user_id);

drop policy if exists "Users manage own cart items" on public.cart_items;
create policy "Users manage own cart items" on public.cart_items for all using (
  cart_id in (select id from public.carts where user_id = auth.uid())
);

-- 8. Orders Policies
drop policy if exists "Customers can view own orders" on public.orders;
create policy "Customers can view own orders" on public.orders for select using (auth.uid() = customer_id);

drop policy if exists "Customers can view own order items" on public.order_items;
create policy "Customers can view own order items" on public.order_items for select using (
  order_id in (select id from public.orders where customer_id = auth.uid())
);

-- 9. Notifications Policies
drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications" on public.notifications for all using (auth.uid() = user_id);

-- 10. Reviews Policies
drop policy if exists "Approved reviews are public" on public.reviews;
create policy "Approved reviews are public" on public.reviews for select using (is_approved = true);

drop policy if exists "Users manage own reviews" on public.reviews;
create policy "Users manage own reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- 11. Admin Master Access Policies
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
