import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import sgMail from '@sendgrid/mail';

// Generate JWT with role information
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid API key configured');
} else {
  console.error('❌ SENDGRID_API_KEY not found in environment variables');
  console.error('❌ Please add SENDGRID_API_KEY to your .env file');
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // SECURITY: Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }

    // SECURITY: Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // SECURITY: NEVER accept role from frontend
    // All registered users are ALWAYS 'user' role
    const user = await User.create({
      name,
      email,
      password,
      role: 'user', // Hardcoded - cannot be changed by frontend
    });

    if (user) {
      // SECURITY: Return user info WITHOUT password
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // SECURITY: Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Check for user email - explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    // SECURITY: Verify user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      // SECURITY: Check if user account is active
      if (!user.isActive) {
        return res.status(403).json({ 
          message: 'Your account has been deactivated. Please contact support.' 
        });
      }

      // SECURITY: Return user info WITHOUT password
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      // SECURITY: Generic error message to prevent email enumeration
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // SECURITY: Password already excluded by schema select: false
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        country: user.country || 'Rwanda',
        district: user.district || '',
        sector: user.sector || '',
        cell: user.cell || '',
        village: user.village || '',
        picture: user.picture || '',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Address and contact fields
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.whatsapp = req.body.whatsapp !== undefined ? req.body.whatsapp : user.whatsapp;
      user.country = req.body.country || user.country;
      user.district = req.body.district !== undefined ? req.body.district : user.district;
      user.sector = req.body.sector !== undefined ? req.body.sector : user.sector;
      user.cell = req.body.cell !== undefined ? req.body.cell : user.cell;
      user.village = req.body.village !== undefined ? req.body.village : user.village;
      user.picture = req.body.picture !== undefined ? req.body.picture : user.picture;

      // SECURITY: Only update password if provided
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({ 
            message: 'Password must be at least 6 characters long' 
          });
        }
        user.password = req.body.password; // Will be hashed by pre-save middleware
      }

      // SECURITY: NEVER allow role update through profile update
      // Role can only be changed by admin through admin panel

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone || '',
        whatsapp: updatedUser.whatsapp || '',
        country: updatedUser.country || 'Rwanda',
        district: updatedUser.district || '',
        sector: updatedUser.sector || '',
        cell: updatedUser.cell || '',
        village: updatedUser.village || '',
        picture: updatedUser.picture || '',
        token: generateToken(updatedUser._id, updatedUser.role),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth Login/Register
// @route   POST /api/users/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // SECURITY: Validate token presence
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // SECURITY: Validate required fields from Google
    if (!email || !googleId) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    // Check if user exists by email
    let user = await User.findOne({ email });

    if (user) {
      // SECURITY: If user exists, check if they're using Google auth
      if (user.authProvider === 'google' || !user.authProvider) {
        // Update googleId if not set
        if (!user.googleId) {
          user.googleId = googleId;
          user.authProvider = 'google';
        }
        
        // Update profile picture if available
        if (picture && !user.picture) {
          user.picture = picture;
        }

        await user.save();
      } else {
        // User exists with local auth, link Google account
        user.googleId = googleId;
        user.authProvider = 'local'; // Keep local as primary auth
        await user.save();
      }
    } else {
      // SECURITY: Create new user with Google auth
      // CRITICAL: Always set role to 'user' - NEVER allow admin creation via Google
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        authProvider: 'google',
        role: 'user', // Hardcoded - cannot be changed by Google auth
        password: Math.random().toString(36).slice(-8), // Random password for Google users
        picture,
      });
    }

    // SECURITY: Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Your account has been deactivated. Please contact support.' 
      });
    }

    // Generate JWT
    const token_jwt = generateToken(user._id, user.role);

    // SECURITY: Return user info WITHOUT password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      googleId: user.googleId,
      authProvider: user.authProvider,
      token: token_jwt,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    if (error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Send reset email
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // SECURITY: Validate email
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // SECURITY: Always return success message to prevent email enumeration
    // Even if user doesn't exist, we return the same message
    if (!user) {
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token before storing
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token and expiration (15 minutes)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your AliRwanda Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #f97316;
          }
          .button {
            display: inline-block;
            background-color: #f97316;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: #ea580c;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">AliRwanda</div>
          </div>
          <h2>Reset Your Password</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password for your AliRwanda account. Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #f97316;">${resetUrl}</p>
          <div class="warning">
            <strong>Important:</strong> This link will expire in 15 minutes for your security.
          </div>
          <p>If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <div class="footer">
            <p>This is an automated email from AliRwanda. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} AliRwanda. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using SendGrid
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is not configured in environment variables');
      return res.status(500).json({ 
        message: 'Email service not configured. Please contact support.' 
      });
    }

    try {
      await sgMail.send({
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'alirwandaofficial@gmail.com',
        subject: 'Reset Your AliRwanda Password',
        html: emailHtml,
      });
      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ SendGrid Error:', emailError.message);
      if (emailError.response) {
        console.error('❌ SendGrid Response:', emailError.response.body);
      }
      return res.status(500).json({ 
        message: 'Failed to send reset email. Please try again later.' 
      });
    }

    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

// @desc    Reset Password
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // SECURITY: Validate token
    if (!token) {
      return res.status(400).json({ message: 'Invalid or missing reset token' });
    }

    // SECURITY: Validate password
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide both password and confirm password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the received token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    // Update password
    user.password = password;

    // Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({ 
      message: 'Password reset successfully. You can now log in with your new password.' 
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  googleAuth,
  forgotPassword,
  resetPassword,
};
