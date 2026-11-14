# CUP2EAT – REST API Documentation

Base URL: `https://api.cup2eat.com/api/v1` or `http://localhost:4000/api/v1`

## Authentication (`/auth`)
- `POST /auth/register`: Create customer account
- `POST /auth/login`: Authenticate customer/admin
- `POST /auth/logout`: Revoke session
- `GET /auth/me`: Current session & RBAC role
- `POST /auth/sync-google`: Google OAuth user profile provisioning

## Products (`/products`)
- `GET /products`: List products with pagination, search, & category filter
- `GET /products/featured`: Top bestseller artisan cups
- `GET /products/:slug`: Product details, variants, & customer reviews
- `POST /products`: Create product (Admin)
- `PUT /products/:id`: Update product (Admin)
- `DELETE /products/:id`: Delete product (Admin)

## Orders (`/orders`)
- `POST /orders`: Place order (Stock reservation & invoice generation)
- `GET /orders/my-orders`: Customer's historical orders
- `GET /orders/:id`: Full order breakdown
- `GET /orders/track/:number`: Public order tracking

## Razorpay Payments (`/payments`)
- `POST /payments/create`: Create Razorpay order ID in INR (paise)
- `POST /payments/verify`: HMAC SHA256 payment signature verification
- `POST /payments/webhook`: Webhook handler for asynchronous capture

## Admin Management (`/admin`)
- `GET /admin/dashboard`: Metrics, sales, orders, low-stock notifications
- `GET /admin/users`: List administrative accounts
- `POST /admin/users`: Super Admin / Org Admin creates admin with email & password
- `PATCH /admin/orders/:id/status`: Update fulfillment status
- `POST /admin/orders/:id/shipment`: Assign courier & tracking number
