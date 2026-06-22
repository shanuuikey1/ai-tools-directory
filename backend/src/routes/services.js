const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateCustomer } = require('../middleware/auth');

// Public Routes
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getCategories);
router.get('/:serviceId', serviceController.getServiceById);

// Protected Routes (Admin/Provider)
router.post('/', serviceController.createService);

module.exports = router;
