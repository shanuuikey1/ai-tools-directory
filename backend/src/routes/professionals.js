const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const { authenticateAdmin } = require('../middleware/auth');

// Public: Submit professional application
router.post('/apply', professionalController.submitApplication);

// Admin only: Get all applications
router.get('/applications', authenticateAdmin, professionalController.getApplications);

// Admin only: Get single application
router.get('/applications/:id', authenticateAdmin, professionalController.getApplicationById);

// Admin only: Update application status
router.patch('/applications/:id', authenticateAdmin, professionalController.updateApplicationStatus);

module.exports = router;
