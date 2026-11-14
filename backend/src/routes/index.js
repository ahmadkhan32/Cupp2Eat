const router = require('express').Router();

const authRoutes = require('../modules/auth/auth.routes');
const productRoutes = require('../modules/products/products.routes');
const categoryRoutes = require('../modules/categories/categories.routes');
const cartRoutes = require('../modules/cart/cart.routes');
const orderRoutes = require('../modules/orders/orders.routes');
const paymentRoutes = require('../modules/payments/payments.routes');
const invoiceRoutes = require('../modules/invoices/invoices.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const userRoutes = require('../modules/users/users.routes');
const reviewRoutes = require('../modules/reviews/reviews.routes');
const couponRoutes = require('../modules/coupons/coupons.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);

module.exports = router;
