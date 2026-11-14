const router = require('express').Router();
const ctrl = require('./cart.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', ctrl.getCart);
router.post('/items', ctrl.addItem);
router.put('/items/:id', ctrl.updateItem);
router.delete('/items/:id', ctrl.removeItem);

module.exports = router;
