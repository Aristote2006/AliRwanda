import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Protect routes - verify JWT token
// @usage   Add as middleware to routes that require authentication
const protect = async (req, res, next) => {
  let token;

  // SECURITY: Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ 
          message: 'Not authorized, no token provided' 
        });
      }

      // SECURITY: Verify token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // SECURITY: Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          message: 'User not found, authorization failed' 
        });
      }

      // SECURITY: Check if user account is active
      if (!req.user.isActive) {
        return res.status(403).json({ 
          message: 'Your account has been deactivated' 
        });
      }

      // Proceed to next middleware/route handler
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      
      // Handle specific JWT errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired, please login again' 
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token, please login again' 
        });
      }

      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    // No token provided
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// @desc    Admin middleware - restrict access to admins only
// @usage   Use AFTER protect middleware: protect, admin
const admin = (req, res, next) => {
  // SECURITY: Verify user exists and has admin role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

export { protect, admin };
