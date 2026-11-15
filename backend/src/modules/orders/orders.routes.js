const router = require('express').Router();
const ctrl = require('./orders.controller');
const authenticate = require('../../middleware/authenticate');
const { optionalAuthenticate } = require('../../middleware/authenticate');

router.post('/', optionalAuthenticate, ctrl.placeOrder);
router.get('/my-orders', authenticate, ctrl.getMyOrders);
router.get('/track/:number', ctrl.trackOrder);
router.get('/:id', authenticate, ctrl.getById);

module.exports = router;
