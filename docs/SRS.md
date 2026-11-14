# CUP2EAT – Software Requirements Specification (SRS) v1.0

**Brand:** CUP2EAT – Eat Your Drink!  
**Market & Currency:** India (INR ₹)  
**Payment Gateway:** Razorpay  
**Tech Stack:** Next.js 14 (App Router) + React + Tailwind CSS + Node.js/Express.js + Supabase (PostgreSQL, Auth, Storage)  

## 1. Brand Identity
- **Emerald Green:** `#064B3B` (Primary brand color)
- **Metallic Gold:** `#D4AF37` (Accent & borders)
- **Warm Cream:** `#FFF9ED` (Backgrounds)
- **Dark Charcoal:** `#202923` (Typography & footers)

## 2. Multi-Role RBAC Model
1. **Super Admin**: Highest level administrator. Full CRUD access, financial reports, settings, and ability to create Organization Admins with specific login/password credentials.
2. **Organization Admin**: Regional/branch operations administrator. Can create Operations Admins and manage local inventory, orders, and reviews.
3. **Operations Admin**: Daily order processing, courier tracking assignment, product stock management.
4. **Customer**: Storefront shopper authenticated via email/password or Google OAuth (Gmail).

## 3. Core Modules
- **Storefront**: Hero section, bestsellers, flavour selection, dynamic category browsing, responsive layout.
- **Cart & Checkout**: Real-time quantity management, coupon discounts, Indian PIN code verification, Razorpay integration.
- **Admin Suite**: Dashboard analytics, product CRUD, inventory health, courier tracking updates, PDF tax invoice generation.
- **Security**: PostgreSQL Row Level Security (RLS), HMAC SHA256 payment signature verification, sanitized inputs.

## 4. Default Seed Logins & Credentials

| Role | Name / Hub | Email | Default Password | Portal URL |
|---|---|---|---|---|
| **Super Admin** | Ahmad Khan (Founder) | `ahmadkhan32@cup2eat.com` | `Admin@Cup2Eat2026` | `/admin/login` |
| **Organization Admin** | Mumbai Regional Hub | `mumbai.ops@cup2eat.com` | `OrgAdmin@Cup2Eat2026` | `/admin/login` |
| **Organization Admin** | Delhi Regional Hub | `delhi.admin@cup2eat.com` | `OrgAdmin@Cup2Eat2026` | `/admin/login` |
| **Operations Admin** | Sunil Mehta (Inventory) | `sunil.inventory@cup2eat.com` | `OpsAdmin@Cup2Eat2026` | `/admin/login` |
| **Customer** | Priya Sharma (Test User) | `customer@cup2eat.com` | `Customer@Cup2Eat2026` | `/login` |

*To seed these users into Supabase, execute `supabase/seed_users.sql` in the Supabase SQL Editor.*
