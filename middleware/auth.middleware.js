import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Authentication Middleware
export const authenticateUser = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token); // Log the token

    if (!token) {
      console.log('No token provided'); // Log missing token
      return res.status(401).json({ message: 'Authentication required' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token payload:', decoded); // Log decoded payload

    // 3. Find user in database
    // In auth.middleware.js
const user = await User.findById(decoded.id).select('-password'); // Use `decoded.id` instead of `decoded.userId`
     
    console.log('User found in DB:', user); // Log the user document

    if (!user) {
      console.log('User not found in DB for ID:', decoded.userId); // Log missing user
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    console.log('User attached to request:', req.userId); // Log success

    next(); // Proceed to next middleware
  } catch (error) {
    console.error('Authentication error:', error.message); // Log detailed error
    res.status(401).json({ message: 'Please authenticate', error: error.message });
  }
};

// Admin Check Middleware
export const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required',
      userRole: req.user?.role // Optional: Helps debug
    });
  }
  next();
};

// Verified User Check Middleware (optional)
export const checkVerified = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({ 
      message: 'Verified account required',
      verificationStatus: req.user?.verificationStatus 
    });
  }
  next();
};


export const protect = (req, res, next) => {
  console.log(req.body)
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Add user ID to request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};