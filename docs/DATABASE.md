# CUP2EAT – PostgreSQL Database Architecture

Comprehensive relational data model built on Supabase PostgreSQL.

## Entity Relationship Overview

### 1. `profiles`
- `id` (UUID, PK) -> references `auth.users(id)`
- `full_name` (TEXT)
- `email` (TEXT, UNIQUE)
- `phone` (TEXT)
- `organization_name` (TEXT)
- `created_at` (TIMESTAMPTZ)

### 2. `user_roles`
- `id` (UUID, PK)
- `user_id` (UUID, FK) -> `auth.users(id)`
- `role` (ENUM: `super_admin`, `org_admin`, `admin`, `customer`)
- `organization_name` (TEXT)
- `created_by` (UUID, FK) -> `auth.users(id)`

### 3. `categories`
- `id` (UUID, PK)
- `name` (TEXT)
- `slug` (TEXT, UNIQUE)
- `description` (TEXT)
- `image_url` (TEXT)

### 4. `products`
- `id` (UUID, PK)
- `name` (TEXT)
- `slug` (TEXT, UNIQUE)
- `category_id` (UUID, FK) -> `categories(id)`
- `base_price` (NUMERIC(12,2))
- `sale_price` (NUMERIC(12,2))
- `rating` (NUMERIC(3,2))

### 5. `product_variants`
- `id` (UUID, PK)
- `product_id` (UUID, FK) -> `products(id)`
- `name` (TEXT)
- `sku` (TEXT, UNIQUE)
- `flavour` (TEXT)
- `size` (TEXT)
- `price_adjustment` (NUMERIC(12,2))

### 6. `inventory`
- `id` (UUID, PK)
- `variant_id` (UUID, FK, UNIQUE) -> `product_variants(id)`
- `quantity` (INT)
- `reserved_quantity` (INT)
- `low_stock_threshold` (INT)

### 7. `orders` & `order_items`
- `orders.id` (UUID, PK)
- `order_number` (TEXT, UNIQUE)
- `customer_id` (UUID, FK) -> `auth.users(id)`
- `subtotal`, `shipping_fee`, `discount`, `total` (NUMERIC)
- `payment_status` (`pending`, `paid`, `failed`)
- `order_status` (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`)
- `shipping_address` (JSONB)
