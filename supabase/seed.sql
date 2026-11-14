-- ==============================================================================
-- CUP2EAT SEED DATA (Valid RFC 4122 Hexadecimal UUIDs & Self-Healing Tables)
-- ==============================================================================

-- 0. Ensure prerequisite tables exist
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

-- 1. Insert Initial Categories (c0000000-...)
insert into public.categories (id, name, slug, description, image_url, sort_order) values
('c0000000-0000-0000-0000-000000000001', 'Cup Noodles', 'cup-noodles', 'Gourmet artisan instant cup noodles with aromatic Indian broths', '/logo/cup2eat-logo.png', 1),
('c0000000-0000-0000-0000-000000000002', 'Cup Soups', 'cup-soups', 'Wholesome comforting herbal and vegetable soups in insulated cups', '/logo/cup2eat-logo.png', 2),
('c0000000-0000-0000-0000-000000000003', 'Cup Desserts', 'cup-desserts', 'Decadent warm lava cakes, puddings and molten brownies in ready-to-microwave cups', '/logo/cup2eat-logo.png', 3),
('c0000000-0000-0000-0000-000000000004', 'Beverages', 'beverages', 'Artisan spiced chais, hot chocolates, and matcha latte cups', '/logo/cup2eat-logo.png', 4)
on conflict (id) do update 
set name = excluded.name, 
    slug = excluded.slug, 
    description = excluded.description;

-- 2. Insert Products (b0000000-...) - Valid Hex UUIDs
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

-- 3. Product Variants (d0000000-...) - Valid Hex UUIDs
insert into public.product_variants (id, product_id, name, sku, flavour, size, price_adjustment) values
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Extra Spicy Masala', 'C2E-MSL-SPY', 'Extra Spicy', 'Regular 90g', 0.00),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Mild Herb Masala', 'C2E-MSL-MLD', 'Mild Herb', 'Regular 90g', 0.00),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Dark Chocolate Ganache', 'C2E-LAV-DRK', 'Dark Cocoa', 'Single 110g', 20.00)
on conflict (id) do update 
set name = excluded.name, 
    sku = excluded.sku;

-- 4. Inventory for Variants
insert into public.inventory (variant_id, quantity, reserved_quantity, low_stock_threshold) values
('d0000000-0000-0000-0000-000000000001', 60, 2, 10),
('d0000000-0000-0000-0000-000000000002', 45, 0, 10),
('d0000000-0000-0000-0000-000000000003', 25, 4, 10)
on conflict (variant_id) do update 
set quantity = excluded.quantity;

-- 5. Sample Coupons
insert into public.coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) values
('WELCOME10', '10% Welcome Discount for New Foodies', 'percentage', 10.00, 199.00, 1000, true),
('CUPFEST50', 'Flat ₹50 OFF on Orders above ₹399', 'fixed', 50.00, 399.00, 500, true)
on conflict (code) do nothing;
