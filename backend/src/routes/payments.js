const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateCustomer } = require('../middleware/auth');

// Payment Routes
router.post('/create-order', authenticateCustomer, paymentController.createOrder);
router.post('/verify', authenticateCustomer, paymentController.verifyPayment);
router.get('/history', authenticateCustomer, paymentController.getPaymentHistory);

module.exports = router;
