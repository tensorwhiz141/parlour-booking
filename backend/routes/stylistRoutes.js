import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import Stylist from '../models/Stylist.js';

const router = express.Router();

// Get all stylists
// GET /api/stylists
router.get('/', async (req, res) => {
  try {
    const stylists = await Stylist.find({ isActive: true }).sort({ name: 1 });
    
    res.json({
      success: true,
      data: stylists,
    });
  } catch (error) {
    console.error('Get stylists error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get stylist by ID
// GET /api/stylists/:id
router.get('/:id', async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    
    if (!stylist) {
      return res.status(404).json({ success: false, message: 'Stylist not found' });
    }
    
    res.json({
      success: true,
      data: stylist,
    });
  } catch (error) {
    console.error('Get stylist error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new stylist (admin only)
// POST /api/stylists
router.post(
  '/',
  protect,
  admin,
  [
    body('name').notEmpty().withMessage('Stylist name is required'),
    body('experience').isNumeric().withMessage('Experience must be a number'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, specialization, experience, rating, image, availability } = req.body;
      
      const stylist = await Stylist.create({
        name,
        specialization: specialization || [],
        experience,
        rating: rating || 5,
        image: image || '',
        availability: availability || [],
      });
      
      res.status(201).json({
        success: true,
        data: stylist,
        message: 'Stylist created successfully',
      });
    } catch (error) {
      console.error('Create stylist error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// Update a stylist (admin only)
// PUT /api/stylists/:id
router.put(
  '/:id',
  protect,
  admin,
  async (req, res) => {
    try {
      const stylist = await Stylist.findById(req.params.id);
      
      if (!stylist) {
        return res.status(404).json({ success: false, message: 'Stylist not found' });
      }
      
      // Update stylist fields
      stylist.name = req.body.name || stylist.name;
      stylist.specialization = req.body.specialization !== undefined ? req.body.specialization : stylist.specialization;
      stylist.experience = req.body.experience !== undefined ? req.body.experience : stylist.experience;
      stylist.rating = req.body.rating !== undefined ? req.body.rating : stylist.rating;
      stylist.image = req.body.image !== undefined ? req.body.image : stylist.image;
      stylist.availability = req.body.availability !== undefined ? req.body.availability : stylist.availability;
      stylist.isActive = req.body.isActive !== undefined ? req.body.isActive : stylist.isActive;
      
      const updatedStylist = await stylist.save();
      
      res.json({
        success: true,
        data: updatedStylist,
        message: 'Stylist updated successfully',
      });
    } catch (error) {
      console.error('Update stylist error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// Delete a stylist (admin only)
// DELETE /api/stylists/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    
    if (!stylist) {
      return res.status(404).json({ success: false, message: 'Stylist not found' });
    }
    
    await stylist.deleteOne();
    
    res.json({
      success: true,
      message: 'Stylist deleted successfully',
    });
  } catch (error) {
    console.error('Delete stylist error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get stylists by specialization
// GET /api/stylists/specialization/:specialization
router.get('/specialization/:specialization', async (req, res) => {
  try {
    const stylists = await Stylist.find({ 
      specialization: req.params.specialization,
      isActive: true 
    }).sort({ name: 1 });
    
    res.json({
      success: true,
      data: stylists,
    });
  } catch (error) {
    console.error('Get stylists by specialization error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;