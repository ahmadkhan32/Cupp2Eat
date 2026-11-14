-- ==============================================================================
-- CUP2EAT SEED DATA (Valid RFC 4122 Hexadecimal UUIDs)
-- ==============================================================================

-- 1. Insert Initial Categories (c0000000-...)
insert into public.categories (id, name, slug, description, image_url, sort_order) values
('c0000000-0000-0000-0000-000000000001', 'Cup Noodles', 'cup-noodles', 'Gourmet artisan instant cup noodles with aromatic Indian broths', '/logo/cup2eat-logo.png', 1),
('c0000000-0000-0000-0000-000000000002', 'Cup Soups', 'cup-soups', 'Wholesome comforting herbal and vegetable soups in insulated cups', '/logo/cup2eat-logo.png', 2),
('c0000000-0000-0000-0000-000000000003', 'Cup Desserts', 'cup-desserts', 'Decadent warm lava cakes, puddings and molten brownies in ready-to-microwave cups', '/logo/cup2eat-logo.png', 3),
('c0000000-0000-0000-0000-000000000004', 'Beverages', 'beverages', 'Artisan spiced chais, hot chocolates, and matcha latte cups', '/logo/cup2eat-logo.png', 4)
on conflict (id) do update 
set name = excluded.name, 
    slug = excluded.slug, 
    description = excluded.description;

-- 2. Insert Products (b0000000-...) - Valid Hex UUIDs
insert into public.products (id, name, slug, category_id, base_price, sale_price, is_featured, is_published, rating, reviews_count) values
('b0000000-0000-0000-0000-000000000001', 'Masala Magic Cup Noodles', 'masala-magic-cup-noodles', 'c0000000-0000-0000-0000-000000000001', 149.00, 119.00, true, true, 4.8, 48),
('b0000000-0000-0000-0000-000000000002', 'Creamy Tomato Basil Soup Cup', 'creamy-tomato-basil-soup-cup', 'c0000000-0000-0000-0000-000000000002', 129.00, 99.00, false, true, 4.6, 22),
('b0000000-0000-0000-0000-000000000003', 'Belgian Chocolate Lava Cup Cake', 'belgian-chocolate-lava-cup-cake', 'c0000000-0000-0000-0000-000000000003', 199.00, 169.00, true, true, 4.9, 64),
('b0000000-0000-0000-0000-000000000004', 'Green Matcha Tea Latte Cup', 'green-matcha-tea-latte-cup', 'c0000000-0000-0000-0000-000000000004', 129.00, 99.00, false, true, 4.7, 18),
('b0000000-0000-0000-0000-000000000005', 'Spicy Schezwan Hakka Cup', 'spicy-schezwan-hakka-cup', 'c0000000-0000-0000-0000-000000000001', 159.00, 129.00, true, true, 4.7, 31)
on conflict (id) do update 
set name = excluded.name, 
    slug = excluded.slug, 
    base_price = excluded.base_price, 
    sale_price = excluded.sale_price;

-- 3. Product Variants (d0000000-...) - Valid Hex UUIDs
insert into public.product_variants (id, product_id, name, sku, flavour, size, price_adjustment) values
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Extra Spicy Masala', 'C2E-MSL-SPY', 'Extra Spicy', 'Regular 90g', 0.00),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Mild Herb Masala', 'C2E-MSL-MLD', 'Mild Herb', 'Regular 90g', 0.00),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Dark Chocolate Ganache', 'C2E-LAV-DRK', 'Dark Cocoa', 'Single 110g', 20.00)
on conflict (id) do update 
set name = excluded.name, 
    sku = excluded.sku;

-- 4. Inventory for Variants
insert into public.inventory (variant_id, quantity, reserved_quantity, low_stock_threshold) values
('d0000000-0000-0000-0000-000000000001', 60, 2, 10),
('d0000000-0000-0000-0000-000000000002', 45, 0, 10),
('d0000000-0000-0000-0000-000000000003', 25, 4, 10)
on conflict (variant_id) do update 
set quantity = excluded.quantity;

-- 5. Sample Coupons
insert into public.coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) values
('WELCOME10', '10% Welcome Discount for New Foodies', 'percentage', 10.00, 199.00, 1000, true),
('CUPFEST50', 'Flat ₹50 OFF on Orders above ₹399', 'fixed', 50.00, 399.00, 500, true)
on conflict (code) do nothing;
