/*
import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Service from '../models/Service.js';

const router = express.Router();

// Get all bookings (admin only)
// GET /api/bookings
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .sort({ date: -1 })
      .populate('userId', 'name email')
      .populate('serviceId', 'name price duration')
      .populate('stylistId', 'name');
    
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get current user's bookings
// GET /api/bookings/user
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('serviceId', 'name price duration')
      .populate('stylistId', 'name');
    
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get user bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new booking
// POST /api/bookings
router.post(
  '/',
  protect,
  [
    body('serviceId').optional(),
    body('serviceName').notEmpty().withMessage('Service name is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { 
        serviceId, 
        serviceName,
        stylistId,
        stylistName,
        date, 
        time, 
        price, 
        specialRequests 
      } = req.body;
      
      // Get user details
      const user = await User.findById(req.user._id);
      
      // Create booking
      const booking = await Booking.create({
        userId: req.user._id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        serviceId,
        serviceName,
        stylistId,
        stylistName,
        date,
        time,
        price,
        specialRequests,
        status: 'pending',
      });
      
      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully',
      });
    } catch (error) {
      console.error('Create booking error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);


// Get available time slots for a specific date
// GET /api/bookings/available-slots
router.get('/available-slots', async (req, res) => {
  try {
    const { date, serviceId } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    
    // Get service duration if serviceId is provided
    let serviceDuration = 60; // Default duration in minutes
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) {
        serviceDuration = service.duration;
      }
    }
    
    // Find all bookings for the specified date
    const bookings = await Booking.find({
      date: new Date(date),
      status: { $ne: 'cancelled' },
    });
    
    // Get booked time slots
    const bookedSlots = bookings.map(booking => booking.time);
    
    // Generate all possible time slots (10:00 AM to 7:00 PM)
    const allSlots = [];
    for (let hour = 10; hour <= 19; hour++) {
      allSlots.push(`${hour}:00`);
      if (hour < 19) allSlots.push(`${hour}:30`);
    }
    
    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    console.error('Get available slots error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});



// Get booking by ID
// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('serviceId', 'name price duration')
      .populate('stylistId', 'name');
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this booking' });
    }
    
    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update booking status (admin only)
// PATCH /api/bookings/:id/status
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Update booking status
    booking.status = req.body.status;
    
    const updatedBooking = await booking.save();
    
    res.json({
      success: true,
      data: updatedBooking,
      message: `Booking status updated to ${req.body.status}`,
    });
  } catch (error) {
    console.error('Update booking status error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Cancel booking (user)
// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to cancel this booking
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    
    const updatedBooking = await booking.save();
    
    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete booking (admin only)
// DELETE /api/bookings/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    await booking.deleteOne();
    
    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Delete booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});



export default router;
*/

import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/authMiddleware.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Stylist from '../models/Stylist.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all bookings (admin only)
// GET /api/bookings
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .sort({ date: -1 })
      .populate('userId', 'name email')
      .populate('serviceId', 'name price duration')
      .populate('stylistId', 'name');
    
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get current user's bookings
// GET /api/bookings/user
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('serviceId', 'name price duration')
      .populate('stylistId', 'name');
    
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get user bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new booking
// POST /api/bookings
router.post(
  '/',
  protect,
  [
    body('serviceId').optional(),
    body('serviceName').notEmpty().withMessage('Service name is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stylistId')
      .optional()
      .custom((value) => {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
          throw new Error('Invalid stylist ID');
        }
        return true;
      }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { 
        serviceId, 
        serviceName,
        stylistId,
        stylistName,
        date, 
        time, 
        price, 
        specialRequests 
      } = req.body;
      
      // Validate stylistId if provided
      if (stylistId) {
        const stylist = await Stylist.findById(stylistId);
        if (!stylist) {
          return res.status(400).json({ success: false, message: 'Stylist not found' });
        }
      }
      
      // Check if time slot is already booked for the same stylist and date
      if (stylistId) {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        const existingBooking = await Booking.findOne({
          stylistId,
          date: { $gte: startOfDay, $lte: endOfDay },
          time,
          status: { $ne: 'cancelled' },
        });
        
        if (existingBooking) {
          return res.status(400).json({
            success: false,
            message: 'This time slot is already booked for the selected stylist',
          });
        }
      }
      
      // Get user details
      const user = await User.findById(req.user._id);
      
      // Create booking
      const booking = await Booking.create({
        userId: req.user._id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        serviceId,
        serviceName,
        stylistId,
        stylistName,
        date: new Date(date),
        time,
        price,
        specialRequests,
        status: 'pending',
      });
      
      console.log('Created booking:', booking);
      
      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully',
      });
    } catch (error) {
      console.error('Create booking error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// Get available time slots for a specific date
// GET /api/bookings/available-slots
router.get('/available-slots', async (req, res) => {
  try {
    const { date, serviceId, stylistId } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    
    // Get service duration if serviceId is provided
    let serviceDuration = 60; // Default duration in minutes
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) {
        serviceDuration = service.duration;
      }
    }
    
    // Find bookings for the specified date and stylist (if provided)
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    const query = {
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    };
    
    if (stylistId) {
      query.stylistId = stylistId;
    }
    
    console.log('Querying bookings with:', query);
    const bookings = await Booking.find(query);
    
    // Get booked time slots
    const bookedSlots = bookings.map(booking => booking.time);
    console.log('Booked slots for query:', bookedSlots);
    
    // Generate all possible time slots (10:00 AM to 7:00 PM)
    const allSlots = [];
    for (let hour = 10; hour <= 19; hour++) {
      allSlots.push(`${hour}:00`);
      if (hour < 19) allSlots.push(`${hour}:30`);
    }
    
    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    console.error('Get available slots error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get booking by ID
// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('serviceId', 'name price duration')
      .populate('stylistId', 'name');
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this booking' });
    }
    
    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update booking status (admin only)
// PATCH /api/bookings/:id/status
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Update booking status
    booking.status = req.body.status;
    
    const updatedBooking = await booking.save();
    
    res.json({
      success: true,
      data: updatedBooking,
      message: `Booking status updated to ${req.body.status}`,
    });
  } catch (error) {
    console.error('Update booking status error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Cancel booking (user)
// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is authorized to cancel this booking
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    
    const updatedBooking = await booking.save();
    
    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete booking (admin only)
// DELETE /api/bookings/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    await booking.deleteOne();
    
    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Delete booking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;