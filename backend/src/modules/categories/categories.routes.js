const router = require('express').Router();
const ctrl = require('./categories.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

router.get('/', ctrl.getAll);
router.get('/:slug', ctrl.getBySlug);

router.post('/', authenticate, authorize('super_admin', 'org_admin', 'admin'), ctrl.create);
router.put('/:id', authenticate, authorize('super_admin', 'org_admin', 'admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), ctrl.delete);

module.exports = router;
