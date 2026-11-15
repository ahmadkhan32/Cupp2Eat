const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { FRONTEND_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:4000',
  'https://backend-rpv5-git-main-ahmads-projects-3635a9cd.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'apikey',
      'x-client-info',
    ],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Rate limiting (15 minutes, 150 requests per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Payment webhooks require raw body for signature verification (Stripe & Razorpay)
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/v1/payments/stripe/webhook', express.raw({ type: 'application/json' }));
app.use('/api/v1/payments/stripe-webhook', express.raw({ type: 'application/json' }));

// Standard body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Version 1
app.use('/api/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'CUP2EAT E-Commerce API',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
