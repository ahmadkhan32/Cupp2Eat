const router = require('express').Router();
const ctrl = require('./invoices.controller');
const authenticate = require('../../middleware/authenticate');

router.get('/:orderId', authenticate, ctrl.getInvoice);
router.get('/:orderId/download', authenticate, ctrl.downloadPdf);

module.exports = router;
