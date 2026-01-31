import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPEmail, generateOTP } from '../utils/emailService.js';

const router = express.Router();

/**
 * REGISTER
 */
router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').matches(/^[6-9]\d{9}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  }
);

/**
 * STEP 1 – REQUEST OTP
 */
router.post(
  '/request-otp',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, expiresAt });

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: 'OTP sent to email',
      expiresAt,
    });
  }
);

/**
 * STEP 2 – VERIFY OTP
 */
router.post(
  '/verify-otp',
  [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.isExpired()) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    await OTP.deleteMany({ email });

    const user = await User.findOne({ email });

    res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  }
);

export default router;
