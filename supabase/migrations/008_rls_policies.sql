-- 8. Complete Row Level Security (RLS) Policies
-- Enable RLS across all customer-bearing and secure tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.shipments enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;

-- Public read catalog
create policy "Public can read active categories" on public.categories for select using (is_active = true);
create policy "Public can read published products" on public.products for select using (is_published = true);
create policy "Public can read product images" on public.product_images for select using (true);
create policy "Public can read product variants" on public.product_variants for select using (is_active = true);

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Addresses policies
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- Cart policies
create policy "Users manage own carts" on public.carts for all using (auth.uid() = user_id);
create policy "Users manage own cart items" on public.cart_items for all using (
  cart_id in (select id from public.carts where user_id = auth.uid())
);

-- Orders policies
create policy "Customers can view own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Customers can view own order items" on public.order_items for select using (
  order_id in (select id from public.orders where customer_id = auth.uid())
);

-- Notifications
create policy "Users view own notifications" on public.notifications for all using (auth.uid() = user_id);

-- Reviews
create policy "Approved reviews are public" on public.reviews for select using (is_approved = true);
create policy "Users manage own reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Admin Master Bypass Policy (Admins can view and edit across tables)
create policy "Admins full access to products" on public.products for all using (public.is_admin(auth.uid()));
create policy "Admins full access to categories" on public.categories for all using (public.is_admin(auth.uid()));
create policy "Admins full access to orders" on public.orders for all using (public.is_admin(auth.uid()));
create policy "Admins full access to inventory" on public.inventory for all using (public.is_admin(auth.uid()));
create policy "Admins full access to payments" on public.payments for all using (public.is_admin(auth.uid()));
create policy "Admins full access to shipments" on public.shipments for all using (public.is_admin(auth.uid()));
create policy "Super admins manage roles" on public.user_roles for all using (public.is_super_admin(auth.uid()));
