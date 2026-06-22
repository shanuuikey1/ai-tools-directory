const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateCustomer, authenticateProvider } = require('../middleware/auth');

// Customer Routes
router.post('/', authenticateCustomer, bookingController.createBooking);
router.get('/my-bookings', authenticateCustomer, bookingController.getCustomerBookings);
router.post('/:bookingId/rate', authenticateCustomer, bookingController.rateBooking);

// Provider Routes
router.get('/provider/bookings', authenticateProvider, bookingController.getProviderBookings);
router.put('/:bookingId/accept', authenticateProvider, bookingController.acceptBooking);
router.put('/:bookingId/reject', authenticateProvider, bookingController.rejectBooking);
router.put('/:bookingId/complete', authenticateProvider, bookingController.completeBooking);
router.post('/:bookingId/rate', authenticateProvider, bookingController.rateBooking);

module.exports = router;
