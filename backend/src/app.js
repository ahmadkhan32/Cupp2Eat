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
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'https://cupp2eat.vercel.app'],
    credentials: true,
  })
);

// Rate limiting (15 minutes, 150 requests per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Razorpay webhook requires raw body for signature HMAC verification
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

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
