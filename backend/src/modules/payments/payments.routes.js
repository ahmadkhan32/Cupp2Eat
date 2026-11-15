const router = require('express').Router();
const ctrl = require('./payments.controller');
const authenticate = require('../../middleware/authenticate');
const { optionalAuthenticate } = require('../../middleware/authenticate');
const express = require('express');

// Stripe Specific Endpoints
router.post('/stripe/create-session', optionalAuthenticate, ctrl.createStripeSession);
router.post('/stripe/create-intent', optionalAuthenticate, ctrl.createStripeIntent);
router.post('/stripe/verify', optionalAuthenticate, ctrl.verifyStripePayment);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), ctrl.stripeWebhook);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), ctrl.stripeWebhook);

// Unified & Fallback Endpoints
router.post('/create-order', optionalAuthenticate, ctrl.createPayment);
router.post('/create', optionalAuthenticate, ctrl.createOrder);
router.post('/verify', optionalAuthenticate, ctrl.verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

module.exports = router;
