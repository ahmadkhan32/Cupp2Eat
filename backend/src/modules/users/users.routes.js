const router = require('express').Router();
const ctrl = require('./users.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.get('/addresses', ctrl.getAddresses);
router.post('/addresses', ctrl.addAddress);
router.delete('/addresses/:id', ctrl.deleteAddress);

module.exports = router;
