const router = require('express').Router();
const ctrl = require('./products.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

// Public Storefront Endpoints
router.get('/', ctrl.getAll);
router.get('/featured', ctrl.getFeatured);
router.get('/:slug', ctrl.getBySlug);

// Protected Admin Endpoints
router.post('/', authenticate, authorize('super_admin', 'org_admin', 'admin'), ctrl.create);
router.put('/:id', authenticate, authorize('super_admin', 'org_admin', 'admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), ctrl.delete);

module.exports = router;
