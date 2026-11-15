-- ==============================================================================
-- CUP2EAT SUPABASE AUTH REPAIR & SEED SCRIPT
-- Resolves:
--   1. "Database error querying schema" (500) by setting non-null Go strings
--   2. "users_phone_key" unique constraint violation by keeping phone NULL
--   3. "confirmed_at is a generated column" by only setting email_confirmed_at
--   4. "customer_id does not exist" by checking column existence safely
-- ==============================================================================

create extension if not exists "pgcrypto";

-- Step 1: Safely nullify foreign keys in existing orders/invoices/rfqs if tables exist
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'customer_id') then
    update public.orders set customer_id = null where customer_id in (
      select id from auth.users where email in (
        'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
        'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
        'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
      )
    );
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invoices' and column_name = 'customer_id') then
    update public.invoices set customer_id = null where customer_id in (
      select id from auth.users where email in (
        'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
        'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
        'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
      )
    );
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'rfqs' and column_name = 'customer_id') then
    update public.rfqs set customer_id = null where customer_id in (
      select id from auth.users where email in (
        'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
        'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
        'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
      )
    );
  end if;
end $$;

-- Step 2: Clean up broken accounts and any previous test probe accounts
delete from auth.identities where identity_data->>'email' in (
  'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
  'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
  'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
);

delete from auth.identities where user_id in (
  select id from auth.users where email in (
    'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
    'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
    'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
  )
);

delete from public.user_roles where user_id in (
  select id from auth.users where email in (
    'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
    'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
    'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
  )
);

delete from public.profiles where email in (
  'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
  'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
  'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
);

delete from auth.users where email in (
  'ahmadkhan32@cup2eat.com', 'mumbai.ops@cup2eat.com', 'delhi.admin@cup2eat.com',
  'sunil.inventory@cup2eat.com', 'customer@cup2eat.com', 'admin_test_official@cup2eat.com',
  'test_probe_user_1@cup2eat.com', 'brand_new_user_111@cup2eat.com'
);

-- Step 3: Sanitize all remaining records in auth.users
update auth.users
set 
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  phone = null;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change_token') then
    update auth.users set email_change_token = coalesce(email_change_token, '');
  end if;
end $$;

-- Step 7: Fix user_roles RLS policies so users can read their own role without 406 error
alter table if exists public.user_roles enable row level security;
drop policy if exists "Super admins manage roles" on public.user_roles;
create policy "Super admins manage roles" on public.user_roles for all using (public.is_super_admin(auth.uid()));
drop policy if exists "Users can view own role" on public.user_roles;
create policy "Users can view own role" on public.user_roles for select using (auth.uid() = user_id);
drop policy if exists "Admins view all roles" on public.user_roles;
create policy "Admins view all roles" on public.user_roles for select using (public.is_admin(auth.uid()));

-- Step 4: Recreate provisioning function with 100% compliant GoTrue fields
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
  -- 1. Remove previous traces
  delete from auth.identities where identity_data->>'email' = user_email;
  delete from auth.identities where user_id in (select id from auth.users where email = user_email);
  delete from public.user_roles where user_id in (select id from auth.users where email = user_email);
  delete from public.profiles where email = user_email;
  delete from auth.users where email = user_email;

  encrypted_pw := crypt(user_password, gen_salt('bf', 10));

  -- 2. Insert into auth.users (all Go string token fields initialized to empty string '')
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change, email_change_token_current,
    reauthentication_token, phone_change, phone_change_token,
    phone,
    email_change_confirm_status, is_sso_user, is_anonymous
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
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', user_email,
      'email_verified', true,
      'phone_verified', false,
      'full_name', user_name,
      'role', user_role,
      'organization_name', user_org
    ),
    false,
    now(),
    now(),
    '', -- confirmation_token
    '', -- recovery_token
    '', -- email_change_token_new
    '', -- email_change
    '', -- email_change_token_current
    '', -- reauthentication_token
    '', -- phone_change
    '', -- phone_change_token
    null, -- phone (MUST be null)
    0,    -- email_change_confirm_status
    false,-- is_sso_user
    false -- is_anonymous
  );

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change_token') then
    execute format('update auth.users set email_change_token = '''' where id = %L', new_user_id);
  end if;

  -- 3. Insert into auth.identities
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'auth' and table_name = 'identities' and column_name = 'provider_id'
  ) then
    execute format(
      'insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) values (%L, %L, %L, %L, %L, now(), now(), now())',
      new_user_id::text, new_user_id, jsonb_build_object('sub', new_user_id::text, 'email', user_email, 'email_verified', true, 'phone_verified', false, 'full_name', user_name, 'role', user_role), 'email', new_user_id::text
    );
  else
    execute format(
      'insert into auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values (%L, %L, %L, %L, now(), now(), now())',
      new_user_id::text, new_user_id, jsonb_build_object('sub', new_user_id::text, 'email', user_email, 'email_verified', true, 'phone_verified', false, 'full_name', user_name, 'role', user_role), 'email'
    );
  end if;

  -- 4. Insert profile
  insert into public.profiles (id, full_name, email, organization_name)
  values (new_user_id, user_name, user_email, user_org)
  on conflict (id) do update
  set full_name = excluded.full_name, organization_name = excluded.organization_name;

  -- 5. Insert role
  insert into public.user_roles (user_id, role, organization_name)
  values (new_user_id, user_role, user_org)
  on conflict (user_id) do update
  set role = excluded.role, organization_name = excluded.organization_name;

  return new_user_id;
end;
$$ language plpgsql security definer;

-- Step 5: Provision all seed accounts
select public.create_seed_user('ahmadkhan32@cup2eat.com', 'Admin@Cup2Eat2026', 'Ahmad Khan (Founder)', 'super_admin', 'CUP2EAT Corporate HQ');
select public.create_seed_user('mumbai.ops@cup2eat.com', 'OrgAdmin@Cup2Eat2026', 'Mumbai Regional Operations', 'org_admin', 'Maharashtra Operations Hub');
select public.create_seed_user('delhi.admin@cup2eat.com', 'OrgAdmin@Cup2Eat2026', 'Delhi NCR Logistics Lead', 'org_admin', 'Northern Regional Hub');
select public.create_seed_user('sunil.inventory@cup2eat.com', 'OpsAdmin@Cup2Eat2026', 'Sunil Mehta (Inventory Mgr)', 'admin', 'Maharashtra Operations Hub');
select public.create_seed_user('customer@cup2eat.com', 'Customer@Cup2Eat2026', 'Priya Sharma (Sample Customer)', 'customer', null);

-- Step 6: Final Sanity Check
update auth.users
set 
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  phone = null;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change_token') then
    update auth.users set email_change_token = coalesce(email_change_token, '');
  end if;
end $$;

-- Step 7: Fix user_roles RLS policies so users can read their own role without 406 error
alter table if exists public.user_roles enable row level security;
drop policy if exists "Super admins manage roles" on public.user_roles;
create policy "Super admins manage roles" on public.user_roles for all using (public.is_super_admin(auth.uid()));
drop policy if exists "Users can view own role" on public.user_roles;
create policy "Users can view own role" on public.user_roles for select using (auth.uid() = user_id);
drop policy if exists "Admins view all roles" on public.user_roles;
create policy "Admins view all roles" on public.user_roles for select using (public.is_admin(auth.uid()));
