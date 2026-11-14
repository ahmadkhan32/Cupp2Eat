const router = require('express').Router();
const ctrl = require('./orders.controller');
const authenticate = require('../../middleware/authenticate');

router.post('/', authenticate, ctrl.placeOrder);
router.get('/my-orders', authenticate, ctrl.getMyOrders);
router.get('/track/:number', ctrl.trackOrder);
router.get('/:id', authenticate, ctrl.getById);

module.exports = router;
