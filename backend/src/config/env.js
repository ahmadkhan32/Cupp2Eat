const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'placeholder_anon_key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_role_key',
  
  // Stripe Payment Gateway Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_PAYMENT_METHOD_TYPES: (process.env.STRIPE_PAYMENT_METHOD_TYPES || 'card').split(',').map(s => s.trim()),
  STRIPE_UPI_ENABLED: process.env.STRIPE_UPI_ENABLED === 'true',
  CURRENCY: (process.env.CURRENCY || 'inr').toLowerCase(),

  // Razorpay Online Payment Gateway (Fallback)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret',
};
