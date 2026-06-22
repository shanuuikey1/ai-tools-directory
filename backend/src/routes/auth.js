const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Customer Routes
router.post('/register-customer', authController.registerCustomer);
router.post('/login-customer', authController.loginCustomer);

// Provider Routes
router.post('/register-provider', authController.registerProvider);
router.post('/login-provider', authController.loginProvider);

module.exports = router;
