-- ==============================================================================
-- CUP2EAT SEED USERS & CREDENTIALS SCRIPT
-- Execute this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- It safely creates or updates all user accounts with pre-confirmed emails.
-- ==============================================================================

-- Enable pgcrypto for BCrypt password hashing
create extension if not exists "pgcrypto";

-- Helper function to provision users with credentials and roles
create or replace function public.create_seed_user(
  user_email text,
  user_password text,
  user_name text,
  user_role text,
  user_org text default null
) returns uuid as $$
declare
  new_user_id uuid := gen_random_uuid();
  existing_user_id uuid;
  encrypted_pw text;
begin
  select id into existing_user_id from auth.users where email = user_email;

  encrypted_pw := crypt(user_password, gen_salt('bf'));

  if existing_user_id is not null then
    -- Update existing user credentials & confirmation
    update auth.users
    set encrypted_password = encrypted_pw,
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_user_meta_data = jsonb_build_object('full_name', user_name, 'role', user_role, 'organization_name', user_org)
    where id = existing_user_id;

    -- Upsert profile
    insert into public.profiles (id, full_name, email, organization_name)
    values (existing_user_id, user_name, user_email, user_org)
    on conflict (id) do update
    set full_name = excluded.full_name,
        organization_name = excluded.organization_name;

    -- Upsert role
    insert into public.user_roles (user_id, role, organization_name)
    values (existing_user_id, user_role, user_org)
    on conflict (user_id) do update
    set role = excluded.role,
        organization_name = excluded.organization_name;

    return existing_user_id;
  end if;

  -- Insert into auth.users (Supabase Auth System Table)
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', user_name, 'role', user_role, 'organization_name', user_org),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Insert profile
  insert into public.profiles (id, full_name, email, organization_name)
  values (new_user_id, user_name, user_email, user_org)
  on conflict (id) do update
  set full_name = excluded.full_name,
      organization_name = excluded.organization_name;

  -- Insert role
  insert into public.user_roles (user_id, role, organization_name)
  values (new_user_id, user_role, user_org)
  on conflict (user_id) do update
  set role = excluded.role,
      organization_name = excluded.organization_name;

  return new_user_id;
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- 1. SUPER ADMIN (Founder / Owner Account)
-- Full privileges: can access admin dashboard, manage users, create org admins
-- ==============================================================================
select public.create_seed_user(
  'ahmadkhan32@cup2eat.com',
  'Admin@Cup2Eat2026',
  'Ahmad Khan (Founder)',
  'super_admin',
  'CUP2EAT Corporate HQ'
);

-- ==============================================================================
-- 2. ORGANIZATION ADMIN (Regional Hub Operations)
-- Privileges: can manage branch catalog/orders and provision Operations Admins
-- ==============================================================================
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

-- ==============================================================================
-- 3. OPERATIONS ADMIN (Catalog, Inventory, Order Fulfillment)
-- Privileges: can update stock, manage orders, generate invoices, create coupons
-- ==============================================================================
select public.create_seed_user(
  'sunil.inventory@cup2eat.com',
  'OpsAdmin@Cup2Eat2026',
  'Sunil Mehta (Inventory Mgr)',
  'admin',
  'Maharashtra Operations Hub'
);

-- ==============================================================================
-- 4. TEST CUSTOMER ACCOUNT
-- Privileges: browse products, place orders, view order tracking, submit reviews
-- ==============================================================================
select public.create_seed_user(
  'customer@cup2eat.com',
  'Customer@Cup2Eat2026',
  'Priya Sharma (Sample Customer)',
  'customer',
  null
);
