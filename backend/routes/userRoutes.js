import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update user profile
// PUT /api/users/profile
router.put(
  '/profile',
  protect,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      
      if (user) {
        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        
        // Update password if provided
        if (req.body.password) {
          user.password = req.body.password;
        }
        
        const updatedUser = await user.save();
        
        res.json({
          success: true,
          data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
          },
          message: 'Profile updated successfully',
        });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Update profile error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// Admin: Get all users
// GET /api/users
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin: Get user by ID
// GET /api/users/:id
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user by ID error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin: Update user
// PUT /api/users/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.role = req.body.role || user.role;
      
      const updatedUser = await user.save();
      
      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
        message: 'User updated successfully',
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Update user error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin: Delete user
// DELETE /api/users/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await user.deleteOne();
      res.json({
        success: true,
        message: 'User removed',
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;