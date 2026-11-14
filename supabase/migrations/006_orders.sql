-- 6. Customer Addresses, Orders & Order Items
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  house_no text not null,
  street text not null,
  city text not null,
  state text not null,
  pincode text not null,
  delivery_instructions text,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index addresses_user_idx on public.addresses(user_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid not null references auth.users(id),
  subtotal numeric(12,2) not null,
  shipping_fee numeric(12,2) default 0,
  discount numeric(12,2) default 0,
  tax_amount numeric(12,2) default 0,
  total numeric(12,2) not null,
  currency text not null default 'INR',
  payment_method text not null,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text default 'pending' check (order_status in ('pending', 'payment_pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned')),
  shipping_address jsonb not null,
  coupon_code text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index orders_customer_idx on public.orders(customer_id);
create index orders_status_idx on public.orders(order_status);
create index orders_number_idx on public.orders(order_number);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  variant_name text,
  quantity int not null,
  unit_price numeric(12,2) not null,
  total_price numeric(12,2) not null,
  created_at timestamptz default now()
);

create index order_items_order_idx on public.order_items(order_id);
