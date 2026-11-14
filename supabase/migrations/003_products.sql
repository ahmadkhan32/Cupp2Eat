-- 3. Categories & Products Hierarchy
create table public.categories (
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

create index categories_slug_idx on public.categories(slug);

create table public.products (
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

create index products_slug_idx on public.products(slug);
create index products_category_idx on public.products(category_id);
create index products_featured_idx on public.products(is_featured);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index product_images_product_idx on public.product_images(product_id);

create table public.product_variants (
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

create index product_variants_product_idx on public.product_variants(product_id);
