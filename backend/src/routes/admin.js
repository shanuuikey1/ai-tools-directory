const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes here are admin-only and require the x-admin-key header
router.use(authenticateAdmin);

// Dashboard Analytics
router.get('/stats', adminController.getPlatformStats);

// Customers Management
router.get('/customers', adminController.getAllCustomers);
router.patch('/customers/:id/toggle', adminController.toggleCustomerStatus);

// Bookings Management
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);
router.patch('/bookings/:id/reassign', adminController.reassignBookingProvider);

// Service Providers Management
router.get('/providers', adminController.getAllProviders);
router.patch('/providers/:id/verify', adminController.updateProviderStatus);

// Service Catalog Management
router.get('/services', adminController.getAllServices);
router.patch('/services/:id/toggle', adminController.toggleServiceStatus);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

module.exports = router;
