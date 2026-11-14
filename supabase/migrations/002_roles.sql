-- 2. Multi-Role RBAC System
-- Roles: super_admin, org_admin, admin, customer
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin', 'org_admin', 'admin', 'customer')),
  organization_name text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

create index user_roles_user_idx on public.user_roles(user_id);
create index user_roles_role_idx on public.user_roles(role);

-- Helper security functions for checking roles in RLS
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.user_roles
    where user_id = $1 and role in ('super_admin', 'org_admin', 'admin')
  );
$$ language sql security definer;

create or replace function public.is_super_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.user_roles
    where user_id = $1 and role = 'super_admin'
  );
$$ language sql security definer;
