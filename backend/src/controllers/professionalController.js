const ProfessionalApplication = require('../models/ProfessionalApplication');

exports.submitApplication = async (req, res) => {
  try {
    const { name, email, phone, service, experience, price } = req.body;

    // Treat only missing/blank values as errors — a numeric 0 (e.g. a fresher
    // with 0 years experience) is a valid value, so don't use falsy checks.
    const fields = { name, email, phone, service, experience, price };
    const isMissing = (v) => v === undefined || v === null || v === '';
    if (Object.values(fields).some(isMissing)) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate experience and price are non-negative
    const experienceNum = parseInt(experience);
    const priceNum = parseFloat(price);
    if (isNaN(experienceNum) || experienceNum < 0) {
      return res.status(400).json({ message: 'Experience must be a non-negative number' });
    }
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone (basic: only digits and +, at least 10 chars)
    const phoneRegex = /^[\d+\s\-()]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone format' });
    }

    const application = await ProfessionalApplication.create({
      name,
      email,
      phone,
      service,
      experience,
      price,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Application submitted successfully. We will verify and contact you within 24-48 hours.',
      applicationId: application.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await ProfessionalApplication.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await ProfessionalApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await ProfessionalApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status || application.status;
    application.notes = notes || application.notes;
    await application.save();

    res.json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update application' });
  }
};
