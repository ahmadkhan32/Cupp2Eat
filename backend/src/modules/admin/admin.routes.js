const router = require('express').Router();
const ctrl = require('./admin.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

const opsAuth = [authenticate, authorize('super_admin', 'org_admin', 'admin')];
const orgAuth = [authenticate, authorize('super_admin', 'org_admin')];
const superAuth = [authenticate, authorize('super_admin')];

router.get('/dashboard', ...opsAuth, ctrl.getDashboard);
router.get('/inventory', ...opsAuth, ctrl.getInventory);
router.get('/customers', ...opsAuth, ctrl.getCustomers);
router.patch('/orders/:id/status', ...opsAuth, ctrl.updateOrderStatus);
router.post('/orders/:id/shipment', ...opsAuth, ctrl.addShipment);

// Role & Enterprise Administration
router.get('/users', ...orgAuth, ctrl.getAdminUsers);
router.post('/users', ...orgAuth, ctrl.createAdminUser);
router.get('/reports/sales', ...orgAuth, ctrl.getSalesReport);

module.exports = router;
