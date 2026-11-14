const router = require('express').Router();
const ctrl = require('./reviews.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

router.get('/product/:productId', ctrl.getProductReviews);
router.post('/', authenticate, ctrl.createReview);
router.patch('/:id/approve', authenticate, authorize('super_admin', 'org_admin', 'admin'), ctrl.approveReview);
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin', 'admin'), ctrl.deleteReview);

module.exports = router;
