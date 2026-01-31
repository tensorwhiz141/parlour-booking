import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register', [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('phone')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Please provide a valid 10-digit Indian phone number'),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, password, role } = req.body;

        try {
            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            const user = await User.create({
                name,
                email,
                phone,
                password,
                role: role || 'user',
            });

            if (user) {
                res.status(201).json({
                    success: true,
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                    },
                    message: 'User registered successfully',
                });
            } else {
                res.status(400).json({ success: false, message: 'Invalid user data' });
            }
        } catch (error) {
            console.error('Registration error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Server error during registration',
                error: error.message,
            });
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & return token
 * @access  Public
 */
router.post(
    '/login', [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (user && (await user.comparePassword(password))) {
                res.json({
                    success: true,
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                    },
                    token: generateToken(user._id),
                    message: 'Login successful',
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Login error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Server error during login',
                error: error.message,
            });
        }
    }
);

export default router;
