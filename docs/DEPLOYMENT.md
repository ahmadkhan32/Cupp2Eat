# CUP2EAT – Production Deployment Guide

## 1. Vercel Deployment (Frontend)

1. Connect your GitHub repository: `https://github.com/ahmadkhan32/Cupp2Eat.git`
2. In Vercel Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
3. Configure Environment Variables in Vercel Dashboard:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
   NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 2. Supabase Setup (Database & Authentication)

1. Go to your Supabase Project dashboard.
2. In the **SQL Editor**, run the migration files in sequence:
   - `supabase/migrations/001_profiles.sql`
   - `supabase/migrations/002_roles.sql`
   - `supabase/migrations/003_products.sql`
   - `supabase/migrations/004_inventory.sql`
   - `supabase/migrations/005_carts.sql`
   - `supabase/migrations/006_orders.sql`
   - `supabase/migrations/007_payments.sql`
   - `supabase/migrations/008_rls_policies.sql`
   - `supabase/migrations/009_functions.sql`
   - `supabase/seed.sql`
3. In **Authentication > Providers > Google**:
   - Enable Google OAuth.
   - Enter your Google Cloud Client ID and Secret.
   - Add Authorized Redirect URI: `https://<project-id>.supabase.co/auth/v1/callback` and `https://your-domain.vercel.app/auth/callback`.

## 3. Node.js Backend Deployment (Render / Railway / VPS)

1. Deploy the `backend` folder.
2. Set environment variables:
   ```env
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=https://your-domain.vercel.app
   SUPABASE_URL=https://your-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   RAZORPAY_KEY_ID=your-live-key-id
   RAZORPAY_KEY_SECRET=your-live-key-secret
   RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
   ```
