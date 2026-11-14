-- ==============================================================================
-- CUP2EAT SEED USERS & CREDENTIALS SCRIPT (100% Non-Null GoTrue String Fields)
-- Run this in Supabase Dashboard > SQL Editor
-- Resolves "Database error querying schema" and sets up all accounts.
-- ==============================================================================

create extension if not exists "pgcrypto";

-- Step 1: Clean up any foreign key references & broken seed accounts
delete from auth.identities where identity_data->>'email' in (
  'ahmadkhan32@cup2eat.com',
  'mumbai.ops@cup2eat.com',
  'delhi.admin@cup2eat.com',
  'sunil.inventory@cup2eat.com',
  'customer@cup2eat.com'
);

delete from auth.identities where user_id in (
  select id from auth.users where email in (
    'ahmadkhan32@cup2eat.com',
    'mumbai.ops@cup2eat.com',
    'delhi.admin@cup2eat.com',
    'sunil.inventory@cup2eat.com',
    'customer@cup2eat.com'
  )
);

delete from public.user_roles where user_id in (
  select id from auth.users where email in (
    'ahmadkhan32@cup2eat.com',
    'mumbai.ops@cup2eat.com',
    'delhi.admin@cup2eat.com',
    'sunil.inventory@cup2eat.com',
    'customer@cup2eat.com'
  )
);

delete from public.profiles where email in (
  'ahmadkhan32@cup2eat.com',
  'mumbai.ops@cup2eat.com',
  'delhi.admin@cup2eat.com',
  'sunil.inventory@cup2eat.com',
  'customer@cup2eat.com'
);

-- Safely clear optional references in other tables if they exist
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'carts') then
    delete from public.carts where user_id in (select id from auth.users where email in ('ahmadkhan32@cup2eat.com','mumbai.ops@cup2eat.com','delhi.admin@cup2eat.com','sunil.inventory@cup2eat.com','customer@cup2eat.com'));
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'inventory_audit_log') then
    update public.inventory_audit_log set created_by = null where created_by in (select id from auth.users where email in ('ahmadkhan32@cup2eat.com','mumbai.ops@cup2eat.com','delhi.admin@cup2eat.com','sunil.inventory@cup2eat.com','customer@cup2eat.com'));
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'invoices') then
    update public.invoices set customer_id = null where customer_id in (select id from auth.users where email in ('ahmadkhan32@cup2eat.com','mumbai.ops@cup2eat.com','delhi.admin@cup2eat.com','sunil.inventory@cup2eat.com','customer@cup2eat.com'));
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'notifications') then
    delete from public.notifications where user_id in (select id from auth.users where email in ('ahmadkhan32@cup2eat.com','mumbai.ops@cup2eat.com','delhi.admin@cup2eat.com','sunil.inventory@cup2eat.com','customer@cup2eat.com'));
  end if;
end $$;

delete from auth.users where email in (
  'ahmadkhan32@cup2eat.com',
  'mumbai.ops@cup2eat.com',
  'delhi.admin@cup2eat.com',
  'sunil.inventory@cup2eat.com',
  'customer@cup2eat.com'
);

-- Step 2: Clean up any NULL string values in remaining auth.users
update auth.users
set 
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  phone = null,
  phone_change = null,
  phone_change_token = null;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change_token') then
    update auth.users set email_change_token = coalesce(email_change_token, '');
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'confirmed_at') then
    update auth.users set confirmed_at = coalesce(confirmed_at, email_confirmed_at, now());
  end if;
end $$;

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

  -- 2. Insert into auth.users with empty strings for all Go string fields
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
    email_change_token_new,
    email_change,
    email_change_token_current,
    reauthentication_token,
    phone,
    phone_change,
    phone_change_token,
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
    '',
    '',
    '',
    '',
    '',
    '',
    null,
    null,
    null,
    0,
    false,
    false
  );

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'confirmed_at') then
    execute format('update auth.users set confirmed_at = now() where id = %L', new_user_id);
  end if;
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

-- Super Admin
select public.create_seed_user(
  'ahmadkhan32@cup2eat.com',
  'Admin@Cup2Eat2026',
  'Ahmad Khan (Founder)',
  'super_admin',
  'CUP2EAT Corporate HQ'
);

-- Org Admins
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

-- Operations Admin
select public.create_seed_user(
  'sunil.inventory@cup2eat.com',
  'OpsAdmin@Cup2Eat2026',
  'Sunil Mehta (Inventory Mgr)',
  'admin',
  'Maharashtra Operations Hub'
);

-- Test Customer
select public.create_seed_user(
  'customer@cup2eat.com',
  'Customer@Cup2Eat2026',
  'Priya Sharma (Sample Customer)',
  'customer',
  null
);
