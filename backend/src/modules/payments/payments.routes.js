const router = require('express').Router();
const ctrl = require('./payments.controller');
const authenticate = require('../../middleware/authenticate');
const express = require('express');

router.post('/create', authenticate, ctrl.createOrder);
router.post('/verify', authenticate, ctrl.verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

module.exports = router;
