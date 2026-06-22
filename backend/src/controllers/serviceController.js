const Service = require('../models/Service');

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const { category } = req.query;

    let where = { is_active: true };
    if (category) {
      where.category = category;
    }

    const services = await Service.findAll({
      where,
      order: [['name', 'ASC']],
    });

    res.json({
      message: 'Services retrieved successfully',
      services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service retrieved successfully',
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Service (Admin Only)
exports.createService = async (req, res) => {
  try {
    const { name, category, description, basePrice, imageUrl } = req.body;

    if (!name || !category || !basePrice) {
      return res.status(400).json({ message: 'Name, category, and base price are required' });
    }

    const service = await Service.create({
      name,
      category,
      description: description || '',
      base_price: basePrice,
      image_url: imageUrl || null,
    });

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Service Categories
exports.getCategories = async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: [
        [require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category'],
      ],
      where: { is_active: true },
      raw: true,
    });

    const categories = services.map(s => s.category);

    res.json({
      message: 'Categories retrieved successfully',
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
