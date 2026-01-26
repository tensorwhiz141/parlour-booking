
    import express from 'express';
    import { body, validationResult } from 'express-validator';
    import User from '../models/User.js';
    import OTP from '../models/OTP.js';
    import generateToken from '../utils/generateToken.js';
    import { sendOTPEmail, generateOTP } from '../utils/emailService.js';

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
     * @route   POST /api/auth/request-otp
     * @desc    Request OTP for login - Step 1 of authentication
     * @access  Public
     */
    router.post(
        '/request-otp', [
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
                // Find user by email
                const user = await User.findOne({ email });

                // Check if user exists and password matches
                if (!user || !(await user.comparePassword(password))) {
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Invalid email or password' 
                    });
                }

                // Generate OTP
                const otp = generateOTP();
                
                // Calculate expiration time (3 minutes from now)
                const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

                // Delete any existing OTP for this email
                await OTP.deleteMany({ email });

                // Save new OTP
                const otpRecord = new OTP({
                    email,
                    otp,
                    expiresAt
                });

                await otpRecord.save();

                // Send OTP via email
                const emailResult = await sendOTPEmail(email, otp);
                
                if (!emailResult.success) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to send OTP email'
                    });
                }

                res.json({
                    success: true,
                    data: {
                        email: email,
                        expiresAt: expiresAt.toISOString()
                    },
                    message: 'OTP sent to your email address'
                });

            } catch (error) {
                console.error('OTP request error:', error.message);
                res.status(500).json({
                    success: false,
                    message: 'Server error during OTP request',
                    error: error.message,
                });
            }
        }
    );

    /**
     * @route   POST /api/auth/verify-otp
     * @desc    Verify OTP and complete login - Step 2 of authentication
     * @access  Public
     */
    router.post(
        '/verify-otp', [
            body('email').isEmail().withMessage('Please provide a valid email'),
            body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
        ],
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, otp } = req.body;

            try {
                // Find OTP record
                const otpRecord = await OTP.findOne({ email });

                if (!otpRecord) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'No OTP found for this email. Please request a new OTP.' 
                    });
                }

                // Check if OTP is expired
                if (otpRecord.isExpired()) {
                    await OTP.deleteMany({ email });
                    return res.status(400).json({ 
                        success: false, 
                        message: 'OTP has expired. Please request a new OTP.' 
                    });
                }

                // Check if max attempts reached
                if (otpRecord.isMaxAttemptsReached()) {
                    await OTP.deleteMany({ email });
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Maximum OTP attempts reached. Please request a new OTP.' 
                    });
                }

                // Increment attempts
                await otpRecord.incrementAttempts();

                // Verify OTP
                if (otpRecord.otp !== otp) {
                    const remainingAttempts = otpRecord.maxAttempts - otpRecord.attempts;
                    return res.status(400).json({ 
                        success: false, 
                        message: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
                    });
                }

                // OTP is valid - delete OTP record
                await OTP.deleteMany({ email });

                // Find user and generate token
                const user = await User.findOne({ email });
                
                if (!user) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'User not found' 
                    });
                }

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

            } catch (error) {
                console.error('OTP verification error:', error.message);
                res.status(500).json({
                    success: false,
                    message: 'Server error during OTP verification',
                    error: error.message,
                });
            }
        }
    );

    /**
     * @route   POST /api/auth/resend-otp
     * @desc    Resend OTP if previous one expired
     * @access  Public
     */
    router.post(
        '/resend-otp', [
            body('email').isEmail().withMessage('Please provide a valid email'),
        ],
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email } = req.body;

            try {
                // Find existing OTP
                const existingOTP = await OTP.findOne({ email });

                if (!existingOTP) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'No active OTP session found. Please login again.' 
                    });
                }

                // Generate new OTP
                const newOTP = generateOTP();
                const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

                // Update existing record
                existingOTP.otp = newOTP;
                existingOTP.expiresAt = expiresAt;
                existingOTP.attempts = 0; // Reset attempts
                await existingOTP.save();

                // Send new OTP via email
                const emailResult = await sendOTPEmail(email, newOTP);
                
                if (!emailResult.success) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to resend OTP email'
                    });
                }

                res.json({
                    success: true,
                    data: {
                        expiresAt: expiresAt.toISOString()
                    },
                    message: 'New OTP sent to your email address'
                });

            } catch (error) {
                console.error('OTP resend error:', error.message);
                res.status(500).json({
                    success: false,
                    message: 'Server error during OTP resend',
                    error: error.message,
                });
            }
        }
    );

    export default router;