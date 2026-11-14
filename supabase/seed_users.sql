-- ==============================================================================
-- CUP2EAT SEED USERS & CREDENTIALS SCRIPT (Bulletproof GoTrue Auth)
-- Run this in Supabase Dashboard > SQL Editor
-- It cleans up any corrupted records and provisions all default users
-- with auth.identities so logins work with 100% reliability.
-- ==============================================================================

create extension if not exists "pgcrypto";

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

  -- 2. Insert into auth.users
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
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    0,
    false,
    false
  );

  -- 3. Insert into auth.identities (GoTrue compatible across versions)
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

-- ==============================================================================
-- 1. SUPER ADMIN (Founder / Owner Account)
-- Email: ahmadkhan32@cup2eat.com
-- Password: Admin@Cup2Eat2026
-- ==============================================================================
select public.create_seed_user(
  'ahmadkhan32@cup2eat.com',
  'Admin@Cup2Eat2026',
  'Ahmad Khan (Founder)',
  'super_admin',
  'CUP2EAT Corporate HQ'
);

-- ==============================================================================
-- 2. ORGANIZATION ADMIN (Regional Operations Hub)
-- Email: mumbai.ops@cup2eat.com
-- Password: OrgAdmin@Cup2Eat2026
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
-- 3. OPERATIONS ADMIN (Catalog & Stock Lead)
-- Email: sunil.inventory@cup2eat.com
-- Password: OpsAdmin@Cup2Eat2026
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
-- Email: customer@cup2eat.com
-- Password: Customer@Cup2Eat2026
-- ==============================================================================
select public.create_seed_user(
  'customer@cup2eat.com',
  'Customer@Cup2Eat2026',
  'Priya Sharma (Sample Customer)',
  'customer',
  null
);
