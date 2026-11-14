const router = require('express').Router();
const ctrl = require('./coupons.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

router.post('/validate', ctrl.validateCoupon);
router.get('/', authenticate, authorize('super_admin', 'org_admin'), ctrl.getAll);
router.post('/', authenticate, authorize('super_admin', 'org_admin'), ctrl.create);
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), ctrl.delete);

module.exports = router;
