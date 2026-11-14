-- 4. Inventory & Stock Tracking
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity int not null default 0,
  reserved_quantity int not null default 0,
  low_stock_threshold int default 5,
  updated_at timestamptz default now(),
  unique(variant_id)
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  movement_type text not null check (movement_type in ('sale', 'restock', 'adjustment', 'return', 'reservation', 'release')),
  quantity int not null,
  reference_id uuid,
  reference_type text,
  notes text,
  performed_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create index inventory_variant_idx on public.inventory(variant_id);
create index inventory_movements_variant_idx on public.inventory_movements(variant_id);
