-- ==============================================================================
-- 9. Transactional Stock Reservation and Release Functions (Idempotent)
-- ==============================================================================

-- Drop existing functions first to prevent "cannot change return type" errors
drop function if exists public.reserve_stock(uuid, int);
drop function if exists public.reserve_stock(uuid, integer);
drop function if exists public.deduct_stock(uuid, int);
drop function if exists public.deduct_stock(uuid, integer);
drop function if exists public.release_stock(uuid, int);
drop function if exists public.release_stock(uuid, integer);

-- Ensure inventory tables exist
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

-- Reserve stock during order placement (returns boolean for confirmation)
create or replace function public.reserve_stock(p_variant_id uuid, p_quantity int)
returns boolean language plpgsql security definer as $$
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
$$;

-- Deduct stock permanently upon verified payment
create or replace function public.deduct_stock(p_variant_id uuid, p_quantity int)
returns void language plpgsql security definer as $$
begin
  update public.inventory
  set quantity = quantity - p_quantity,
      reserved_quantity = greatest(0, reserved_quantity - p_quantity),
      updated_at = now()
  where variant_id = p_variant_id;
end;
$$;

-- Release stock upon order cancellation
create or replace function public.release_stock(p_variant_id uuid, p_quantity int)
returns void language plpgsql security definer as $$
begin
  update public.inventory
  set reserved_quantity = greatest(0, reserved_quantity - p_quantity),
      updated_at = now()
  where variant_id = p_variant_id;
end;
$$;
