const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const UPLOADS_DIR = path.join(__dirname, 'Uploads');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Validate environment variables
if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env');
  process.exit(1);
}
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}
if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Error: EMAIL_USER or EMAIL_PASS not defined in .env');
  process.exit(1);
}
console.log('Environment variables:', {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  MONGODB_URI: process.env.MONGODB_URI,
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use('/Uploads', express.static(UPLOADS_DIR));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalName}`);
  },
});
const upload = multer({ storage });

// Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const midiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const MIDI = mongoose.model('MIDI', midiSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Register Endpoint
app.post(
  '/api/register',
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg),
      });
    }

    const { name, email, password } = req.body;
    console.log('Register attempt:', { name, email });

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Duplicate email:', email);
        return res.status(400).json({
          success: false,
          message: 'Email is already registered',
        });
      }

      const emailDomain = email.split('@')[1];
      const blockedDomains = ['tempmail.com', 'mailinator.com'];
      if (blockedDomains.includes(emailDomain)) {
        console.log('Blocked domain:', emailDomain);
        return res.status(400).json({
          success: false,
          message: 'Disposable email addresses are not allowed',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('Hashed password:', hashedPassword);
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date(),
      });

      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id },
        JWT_SECRET,
        { expiresIn: '24h' },
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Login Endpoint
app.post(
  '/api/login',
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        console.log('User not found:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('User found:', { email: user.email, name: user.name });
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        console.log('Password mismatch for:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Forgot Password Endpoint
app.post(
  '/api/forgot-password',
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;
    console.log('Forgot password attempt:', { email });

    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({ message: 'Email not found' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = await bcrypt.hash(resetToken, 12);
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <p>You requested a password reset for your account.</p>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent to:', email);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Reset Password Endpoint
app.post(
  '/api/reset-password',
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({
        email: email.toLowerCase().trim(),
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
      if (!isTokenValid) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Get User Data Endpoint
app.get('/api/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Username Endpoint
app.put(
  '/api/user/username',
  authenticate,
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        { name: name.trim() },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Username updated successfully', name: user.name });
    } catch (error) {
      console.error('Update username error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update Email Endpoint
app.put(
  '/api/user/email',
  authenticate,
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.userId) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { email: email.toLowerCase().trim() },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Email updated successfully', email: user.email });
    } catch (error) {
      console.error('Update email error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update Password Endpoint
app.put(
  '/api/user/password',
  authenticate,
  [
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.findByIdAndUpdate(
        req.userId,
        { password: hashedPassword },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete Account Endpoint
app.delete('/api/user', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await MIDI.deleteMany({ userId: req.userId });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Contact Endpoint
app.post(
  '/api/contact',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, message } = req.body;

    try {
      console.log('Contact submission:', { name, email, message });
      res.status(200).json({ message: 'Message received successfully' });
    } catch (error) {
      console.error('Contact error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Generate Music Endpoint
app.post(
  '/api/generate-music',
  authenticate,
  [body('prompt').notEmpty().withMessage('Prompt is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { prompt } = req.body;
    const userId = req.userId;

    try {
      const response = await axios.post(
        'http://localhost:5001/api/generate',
        { prompt },
        { responseType: 'json' }
      );

      // Extract and decode base64 MIDI data
      const midiBase64 = response.data.midi.data;
      const midiBuffer = Buffer.from(midiBase64, 'base64');

      const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
      const fileName = `${userId}-${Date.now()}-${sanitizedPrompt}.mid`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      // Save the decoded MIDI file
      fs.writeFileSync(filePath, midiBuffer);
      console.log('MIDI file saved:', filePath);

      const midi = new MIDI({
        userId,
        prompt,
        filePath: `/Uploads/${fileName}`,
      });

      await midi.save();

      res.status(200).json({ message: 'Music generated successfully', fileUrl: `/Uploads/${fileName}` });
    } catch (error) {
      console.error('Music generation error:', error?.response?.data || error);
      res.status(500).json({ message: 'Failed to generate music' });
    }
  }
);

// Fetch User's Generated MIDIs
app.get('/api/my-music', authenticate, async (req, res) => {
  try {
    const midis = await MIDI.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(midis);
  } catch (error) {
    console.error('Fetching music error:', error);
    res.status(500).json({ message: 'Failed to fetch music' });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});