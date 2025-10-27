import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import Service from '../models/Service.js';

const router = express.Router();

// Get all services
// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get service by ID
// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new service (admin only)
// POST /api/services
router.post(
  '/',
  protect,
  admin,
  [
    body('name').notEmpty().withMessage('Service name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, description, price, duration, image, category } = req.body;
      
      const service = await Service.create({
        name,
        description,
        price,
        duration,
        image: image || '',
        category: category || '',
      });
      
      res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully',
      });
    } catch (error) {
      console.error('Create service error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// Update a service (admin only)
// PUT /api/services/:id
router.put(
  '/:id',
  protect,
  admin,
  async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      
      // Update service fields
      service.name = req.body.name || service.name;
      service.description = req.body.description || service.description;
      service.price = req.body.price || service.price;
      service.duration = req.body.duration || service.duration;
      service.image = req.body.image !== undefined ? req.body.image : service.image;
      service.category = req.body.category !== undefined ? req.body.category : service.category;
      service.isActive = req.body.isActive !== undefined ? req.body.isActive : service.isActive;
      
      const updatedService = await service.save();
      
      res.json({
        success: true,
        data: updatedService,
        message: 'Service updated successfully',
      });
    } catch (error) {
      console.error('Update service error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// Delete a service (admin only)
// DELETE /api/services/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    await service.deleteOne();
    
    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get services by category
// GET /api/services/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ name: 1 });
    
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services by category error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;