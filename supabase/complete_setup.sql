-- ==============================================================================
-- CUP2EAT COMPLETE ALL-IN-ONE SUPABASE SETUP SCRIPT (100% Idempotent)
-- Paste this entire script into your Supabase Dashboard > SQL Editor and click RUN.
-- Sets up all extensions, tables, indexes, stock functions, RLS policies,
-- sample product catalog, and pre-confirmed administrative & customer accounts.
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. CREATE SCHEMAS & TABLES
-- ==============================================================================

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
create index if not exists profiles_email_idx on public.profiles(email);

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
create index if not exists user_roles_user_idx on public.user_roles(user_id);
create index if not exists user_roles_role_idx on public.user_roles(role);

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
create index if not exists categories_slug_idx on public.categories(slug);

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
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_featured_idx on public.products(is_featured);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists product_images_product_idx on public.product_images(product_id);

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
create index if not exists product_variants_product_idx on public.product_variants(product_id);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid unique not null references public.product_variants(id) on delete cascade,
  quantity int not null default 0,
  reserved_quantity int not null default 0,
  low_stock_threshold int default 10,
  updated_at timestamptz default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  change_amount int not null,
  reason text not null,
  reference_id uuid,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists carts_user_idx on public.carts(user_id);

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
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

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
create index if not exists addresses_user_idx on public.addresses(user_id);

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
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_number_idx on public.orders(order_number);
create index if not exists orders_status_idx on public.orders(order_status);

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
create index if not exists order_items_order_idx on public.order_items(order_id);

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
create index if not exists payments_order_idx on public.payments(order_id);
create index if not exists payments_rzp_order_idx on public.payments(razorpay_order_id);

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
create index if not exists invoices_order_idx on public.invoices(order_id);

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
create index if not exists shipments_order_idx on public.shipments(order_id);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null,
  min_order_amount numeric(12,2) default 0,
  max_discount_amount numeric(12,2),
  max_uses int,
  uses_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists coupons_code_idx on public.coupons(code);

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
create index if not exists reviews_product_idx on public.reviews(product_id);

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
create index if not exists notifications_user_idx on public.notifications(user_id);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  performed_by uuid references auth.users(id) on delete set null,
  details jsonb,
  created_at timestamptz default now()
);

-- ==============================================================================
-- 3. DROP OLD INVENTORY FUNCTIONS (Prevents ERROR 42P13 return type changes)
-- Note: Do NOT drop is_admin/is_super_admin as RLS policies depend on them.
-- CREATE OR REPLACE updates their logic safely in-place without breaking policies.
-- ==============================================================================

drop function if exists public.reserve_stock(uuid, int) cascade;
drop function if exists public.reserve_stock(uuid, integer) cascade;
drop function if exists public.deduct_stock(uuid, int) cascade;
drop function if exists public.deduct_stock(uuid, integer) cascade;
drop function if exists public.release_stock(uuid, int) cascade;
drop function if exists public.release_stock(uuid, integer) cascade;
drop function if exists public.create_seed_user(text, text, text, text, text) cascade;

-- ==============================================================================
-- 4. CREATE FUNCTIONS & TRIGGERS
-- ==============================================================================

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

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, organization_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'organization_name', null)
  )
  on conflict (id) do update
  set full_name = excluded.full_name;

  insert into public.user_roles (user_id, role, organization_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    coalesce(new.raw_user_meta_data->>'organization_name', null)
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.reserve_stock(p_variant_id uuid, p_quantity int)
returns boolean as $$
declare
  v_available int;
begin
  select (quantity - reserved_quantity) into v_available
  from public.inventory
  where variant_id = p_variant_id
  for update;

  if v_available >= p_quantity then
    update public.inventory
    set reserved_quantity = reserved_quantity + p_quantity,
        updated_at = now()
    where variant_id = p_variant_id;
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer;

create or replace function public.deduct_stock(p_variant_id uuid, p_quantity int)
returns void as $$
begin
  update public.inventory
  set quantity = quantity - p_quantity,
      reserved_quantity = greatest(0, reserved_quantity - p_quantity),
      updated_at = now()
  where variant_id = p_variant_id;
end;
$$ language plpgsql security definer;

create or replace function public.release_stock(p_variant_id uuid, p_quantity int)
returns void as $$
begin
  update public.inventory
  set reserved_quantity = greatest(0, reserved_quantity - p_quantity),
      updated_at = now()
  where variant_id = p_variant_id;
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

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

-- Public read policies
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

-- Reviews
drop policy if exists "Approved reviews are public" on public.reviews;
create policy "Approved reviews are public" on public.reviews for select using (is_approved = true);

drop policy if exists "Users manage own reviews" on public.reviews;
create policy "Users manage own reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Admin Master Access
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

-- ==============================================================================
-- 6. SEED CATALOG DATA (Valid RFC 4122 Hexadecimal UUIDs)
-- ==============================================================================

insert into public.categories (id, name, slug, description, image_url, sort_order) values
('c0000000-0000-0000-0000-000000000001', 'Cup Noodles', 'cup-noodles', 'Gourmet artisan instant cup noodles with aromatic Indian broths', '/logo/cup2eat-logo.png', 1),
('c0000000-0000-0000-0000-000000000002', 'Cup Soups', 'cup-soups', 'Wholesome comforting herbal and vegetable soups in insulated cups', '/logo/cup2eat-logo.png', 2),
('c0000000-0000-0000-0000-000000000003', 'Cup Desserts', 'cup-desserts', 'Decadent warm lava cakes, puddings and molten brownies in ready-to-microwave cups', '/logo/cup2eat-logo.png', 3),
('c0000000-0000-0000-0000-000000000004', 'Beverages', 'beverages', 'Artisan spiced chais, hot chocolates, and matcha latte cups', '/logo/cup2eat-logo.png', 4)
on conflict (id) do update 
set name = excluded.name, 
    slug = excluded.slug, 
    description = excluded.description;

insert into public.products (id, name, slug, category_id, base_price, sale_price, is_featured, is_published, rating, reviews_count) values
('b0000000-0000-0000-0000-000000000001', 'Masala Magic Cup Noodles', 'masala-magic-cup-noodles', 'c0000000-0000-0000-0000-000000000001', 149.00, 119.00, true, true, 4.8, 48),
('b0000000-0000-0000-0000-000000000002', 'Creamy Tomato Basil Soup Cup', 'creamy-tomato-basil-soup-cup', 'c0000000-0000-0000-0000-000000000002', 129.00, 99.00, false, true, 4.6, 22),
('b0000000-0000-0000-0000-000000000003', 'Belgian Chocolate Lava Cup Cake', 'belgian-chocolate-lava-cup-cake', 'c0000000-0000-0000-0000-000000000003', 199.00, 169.00, true, true, 4.9, 64),
('b0000000-0000-0000-0000-000000000004', 'Green Matcha Tea Latte Cup', 'green-matcha-tea-latte-cup', 'c0000000-0000-0000-0000-000000000004', 129.00, 99.00, false, true, 4.7, 18),
('b0000000-0000-0000-0000-000000000005', 'Spicy Schezwan Hakka Cup', 'spicy-schezwan-hakka-cup', 'c0000000-0000-0000-0000-000000000001', 159.00, 129.00, true, true, 4.7, 31)
on conflict (id) do update 
set name = excluded.name, 
    slug = excluded.slug, 
    base_price = excluded.base_price, 
    sale_price = excluded.sale_price;

insert into public.product_variants (id, product_id, name, sku, flavour, size, price_adjustment) values
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Extra Spicy Masala', 'C2E-MSL-SPY', 'Extra Spicy', 'Regular 90g', 0.00),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Mild Herb Masala', 'C2E-MSL-MLD', 'Mild Herb', 'Regular 90g', 0.00),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Dark Chocolate Ganache', 'C2E-LAV-DRK', 'Dark Cocoa', 'Single 110g', 20.00)
on conflict (id) do update 
set name = excluded.name, 
    sku = excluded.sku;

insert into public.inventory (variant_id, quantity, reserved_quantity, low_stock_threshold) values
('d0000000-0000-0000-0000-000000000001', 60, 2, 10),
('d0000000-0000-0000-0000-000000000002', 45, 0, 10),
('d0000000-0000-0000-0000-000000000003', 25, 4, 10)
on conflict (variant_id) do update 
set quantity = excluded.quantity;

insert into public.coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) values
('WELCOME10', '10% Welcome Discount for New Foodies', 'percentage', 10.00, 199.00, 1000, true),
('CUPFEST50', 'Flat ₹50 OFF on Orders above ₹399', 'fixed', 50.00, 399.00, 500, true)
on conflict (code) do nothing;

-- ==============================================================================
-- 7. USER PROVISIONING FUNCTION & SEED ACCOUNTS (Bulletproof GoTrue Auth)
-- ==============================================================================

create or replace function public.create_seed_user(
  user_email text,
  user_password text,
  user_name text,
  user_role text,
  user_org text default null
) returns uuid as $$
declare
  new_user_id uuid := gen_random_uuid();
  encrypted_pw text;
begin
  -- 1. Clean up old/broken records for this email
  delete from auth.identities where identity_data->>'email' = user_email;
  delete from auth.identities where user_id in (select id from auth.users where email = user_email);
  delete from public.user_roles where user_id in (select id from auth.users where email = user_email);
  delete from public.profiles where email = user_email;
  delete from auth.users where email = user_email;

  encrypted_pw := crypt(user_password, gen_salt('bf'));

  -- 2. Insert into auth.users
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_confirm_status,
    is_sso_user,
    is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', user_name, 'role', user_role, 'organization_name', user_org),
    false,
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    0,
    false,
    false
  );

  -- 3. Insert into auth.identities (GoTrue compatible across versions)
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'auth' and table_name = 'identities' and column_name = 'provider_id'
  ) then
    execute format(
      'insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) values (%L, %L, %L, %L, %L, now(), now(), now())',
      new_user_id, new_user_id, jsonb_build_object('sub', new_user_id::text, 'email', user_email, 'email_verified', true, 'phone_verified', false), 'email', new_user_id::text
    );
  else
    execute format(
      'insert into auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values (%L, %L, %L, %L, now(), now(), now())',
      new_user_id::text, new_user_id, jsonb_build_object('sub', new_user_id::text, 'email', user_email, 'email_verified', true, 'phone_verified', false), 'email'
    );
  end if;

  -- 4. Insert profile
  insert into public.profiles (id, full_name, email, organization_name)
  values (new_user_id, user_name, user_email, user_org)
  on conflict (id) do update
  set full_name = excluded.full_name,
      organization_name = excluded.organization_name;

  -- 5. Insert role
  insert into public.user_roles (user_id, role, organization_name)
  values (new_user_id, user_role, user_org)
  on conflict (user_id) do update
  set role = excluded.role,
      organization_name = excluded.organization_name;

  return new_user_id;
end;
$$ language plpgsql security definer;

-- 1. Super Admin (Founder)
select public.create_seed_user(
  'ahmadkhan32@cup2eat.com',
  'Admin@Cup2Eat2026',
  'Ahmad Khan (Founder)',
  'super_admin',
  'CUP2EAT Corporate HQ'
);

-- 2. Org Admins
select public.create_seed_user(
  'mumbai.ops@cup2eat.com',
  'OrgAdmin@Cup2Eat2026',
  'Mumbai Regional Operations',
  'org_admin',
  'Maharashtra Operations Hub'
);

select public.create_seed_user(
  'delhi.admin@cup2eat.com',
  'OrgAdmin@Cup2Eat2026',
  'Delhi NCR Logistics Lead',
  'org_admin',
  'Northern Regional Hub'
);

-- 3. Operations Admin
select public.create_seed_user(
  'sunil.inventory@cup2eat.com',
  'OpsAdmin@Cup2Eat2026',
  'Sunil Mehta (Inventory Mgr)',
  'admin',
  'Maharashtra Operations Hub'
);

-- 4. Test Customer
select public.create_seed_user(
  'customer@cup2eat.com',
  'Customer@Cup2Eat2026',
  'Priya Sharma (Sample Customer)',
  'customer',
  null
);
