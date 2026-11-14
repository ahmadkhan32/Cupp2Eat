# CUP2EAT 🍵

> **Eat Your Drink!** — Premium artisan food and beverage e-commerce platform

![CUP2EAT](./frontend/public/logo/cup2eat-logo.jpg)

## 🌟 Overview

CUP2EAT is a full-stack e-commerce platform for India's finest cup-based snacks and beverages. Built with **Next.js 14** (App Router) on the frontend and **Node.js + Express.js** on the backend, backed by **Supabase PostgreSQL**.

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Emerald Green | `#064B3B` | Primary brand color, CTAs |
| Metallic Gold | `#D4AF37` | Accents, highlights |
| Warm Cream | `#FFF9ED` | Background |
| Dark Charcoal | `#202923` | Text |

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router, JavaScript & JSX)
- **React 18**
- **Tailwind CSS** — utility-first styling
- **Redux Toolkit** — state management
- **React Hook Form** + **Zod** — form validation
- **Supabase JS** — auth & sessions
- **Lucide React** — icons
- **React Hot Toast** — notifications
- **Recharts** — analytics charts

### Backend
- **Node.js** + **Express.js**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Razorpay** — payment gateway
- **PDFKit** — invoice generation
- **Nodemailer** — email notifications
- **Helmet** + **express-rate-limit** — security

## 📁 Project Structure

```
cup2eat/
├── frontend/              # Next.js 14 App
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── (store)/   # Public store pages
│   │   │   ├── (auth)/    # Auth pages
│   │   │   ├── account/   # Customer account
│   │   │   └── admin/     # Admin panel
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Redux slices
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities & API client
│   │   ├── schemas/       # Zod validation schemas
│   │   └── store/         # Redux store
│   └── public/            # Static assets
├── backend/               # Express.js API
│   └── src/
│       ├── modules/       # Feature modules
│       │   ├── auth/
│       │   ├── products/
│       │   ├── orders/
│       │   ├── payments/
│       │   ├── invoices/
│       │   ├── admin/
│       │   ├── users/
│       │   ├── reviews/
│       │   ├── coupons/
│       │   ├── cart/
│       │   └── categories/
│       ├── middleware/    # Auth, error handling
│       ├── config/        # Environment & Supabase
│       └── routes/        # Route aggregator
├── supabase/
│   ├── migrations/        # Database schema
│   └── seed.sql           # Sample data
└── docs/                  # Documentation
```

## 👥 Role Hierarchy

| Role | Permissions |
|------|------------|
| `super_admin` | Full access; creates org_admin accounts |
| `org_admin` | Manage organization; create admin accounts |
| `admin` | Manage products, orders, inventory |
| `customer` | Shop, track orders, write reviews |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Razorpay account (for payments)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmadkhan32/Cupp2Eat.git
   cd cup2eat
   ```

2. **Install dependencies**
   ```bash
   npm install --workspaces
   ```

3. **Configure environment variables**
   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

4. **Run database migrations** in Supabase SQL editor (files in `supabase/migrations/`)

5. **Start development servers**
   ```bash
   # Frontend (port 3000)
   npm run dev:frontend

   # Backend (port 4000)
   npm run dev:backend
   ```

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [SRS](./docs/SRS.md)

## 📄 License

MIT © CUP2EAT
