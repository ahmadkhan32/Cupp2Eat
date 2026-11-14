-- 7. Razorpay Payments, Tax Invoices, Courier Shipments, Coupons, Reviews, Notifications & Audits
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(12,2) not null,
  currency text default 'INR',
  status text default 'created' check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')),
  method text,
  error_code text,
  error_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index payments_order_idx on public.payments(order_id);
create index payments_razorpay_idx on public.payments(razorpay_order_id);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  invoice_number text unique not null,
  pdf_url text,
  gst_number text default '07AAAAA0000A1Z5',
  tax_breakdown jsonb,
  created_at timestamptz default now()
);

create index invoices_order_idx on public.invoices(order_id);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  courier_name text,
  tracking_number text,
  tracking_url text,
  estimated_delivery date,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null,
  min_order_amount numeric(12,2) default 0,
  max_uses int,
  current_uses int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id),
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  is_verified boolean default false,
  is_approved boolean default true,
  created_at timestamptz default now(),
  unique(product_id, user_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text check (type in ('order', 'payment', 'shipping', 'promotion', 'system')),
  is_read boolean default false,
  reference_id uuid,
  created_at timestamptz default now()
);

create index notifications_user_idx on public.notifications(user_id);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  performed_by uuid references auth.users(id),
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);
