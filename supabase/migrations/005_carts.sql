-- 5. Carts & Cart Items
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index carts_user_idx on public.carts(user_id);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity int not null default 1,
  price_snapshot numeric(12,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index cart_items_cart_idx on public.cart_items(cart_id);
