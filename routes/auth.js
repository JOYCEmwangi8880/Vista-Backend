const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);
const User = require('../models/User');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Save files to public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  },
});
const upload = multer({ storage });

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: Signup
router.post('/register', upload.single('profileImage'), async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage: req.file.path,
      otp,
      otpExpires,
    });
    await user.save();

    // Send OTP via email
    const request = mailjet.post('send').request({
      FromEmail: 'your_email@example.com',
      FromName: 'Terravista',
      Subject: 'Your OTP Code',
      'Text-part': `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      Recipients: [{ Email: email }],
    });
    await request;

    res.status(200).json({ message: 'Signup successful. Check your email for the OTP.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
