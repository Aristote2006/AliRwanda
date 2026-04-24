import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT with role information
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

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
        token: generateToken(updatedUser._id, updatedUser.role),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
