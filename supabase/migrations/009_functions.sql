-- 9. Transactional Stock Reservation and Release Functions

-- Reserve stock during order placement
create or replace function public.reserve_stock(p_variant_id uuid, p_quantity int)
returns void language plpgsql security definer as $$
begin
  update public.inventory
  set reserved_quantity = reserved_quantity + p_quantity,
      updated_at = now()
  where variant_id = p_variant_id;

  insert into public.inventory_movements (variant_id, movement_type, quantity, reference_type)
  values (p_variant_id, 'reservation', p_quantity, 'order');
end;
$$;

-- Deduct stock permanently upon verified payment
create or replace function public.deduct_stock(p_variant_id uuid, p_quantity int)
returns void language plpgsql security definer as $$
begin
  update public.inventory
  set quantity = quantity - p_quantity,
      reserved_quantity = reserved_quantity - p_quantity,
      updated_at = now()
  where variant_id = p_variant_id;

  insert into public.inventory_movements (variant_id, movement_type, quantity, reference_type)
  values (p_variant_id, 'sale', p_quantity, 'order');
end;
$$;

-- Release stock upon cancellation
create or replace function public.release_stock(p_variant_id uuid, p_quantity int)
returns void language plpgsql security definer as $$
begin
  update public.inventory
  set reserved_quantity = greatest(0, reserved_quantity - p_quantity),
      updated_at = now()
  where variant_id = p_variant_id;

  insert into public.inventory_movements (variant_id, movement_type, quantity, reference_type)
  values (p_variant_id, 'release', p_quantity, 'order_cancelled');
end;
$$;
