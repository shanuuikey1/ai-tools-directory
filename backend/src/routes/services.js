const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateAdmin } = require('../middleware/auth');

// Public Routes
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getCategories);
router.get('/:serviceId', serviceController.getServiceById);

// Admin-only: requires the x-admin-key header (see ADMIN_API_KEY).
router.post('/', authenticateAdmin, serviceController.createService);

module.exports = router;
