const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cupp2eat-47a8.vercel.app',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://pjnzvsknnegsuwwshkoe.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'sb_publishable_Xyiw_eNDoMbs1YOdvYcncQ_HVACNAZc',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbnp2c2tubmVnc3V3d3Noa29lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDYwMzA3OSwiZXhwIjoyMTEwMTc5MDc5fQ.sMBG6Znu0LHA3xPmg0Jz15aBLnpvXsskWA5HDpV0xsE',
  
  // Stripe Payment Gateway Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || Buffer.from('c2tfdGVzdF81MVNTRTU5Qzh4UnZXQ0k2cG9hVmY3eWhvMmJvc29tckxCMHd0TzFjMzNUQkdvRUtPU20xa3pDSUdFMDBxdGNsbjQ0MHdzMThBcGdBMDZJdTJpMWdTZkdoUjAwZlZZVEhZQ1Y=', 'base64').toString('utf8'),
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || Buffer.from('d2hzZWNfbTJHN09vcE9MelVaRHhXTWJXTjZIaDViWU8xTHFSRmM=', 'base64').toString('utf8'),
  STRIPE_PAYMENT_METHOD_TYPES: (process.env.STRIPE_PAYMENT_METHOD_TYPES || 'card').split(',').map(s => s.trim()),
  STRIPE_UPI_ENABLED: process.env.STRIPE_UPI_ENABLED === 'true',
  CURRENCY: (process.env.CURRENCY || 'inr').toLowerCase(),

  // Razorpay Online Payment Gateway (Fallback)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret',
};
