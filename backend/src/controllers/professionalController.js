const ProfessionalApplication = require('../models/ProfessionalApplication');

exports.submitApplication = async (req, res) => {
  try {
    const { name, email, phone, service, experience, price } = req.body;

    if (!name || !email || !phone || !service || !experience || !price) {
      return res.status(400).json({ message: 'All fields are required' });
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
