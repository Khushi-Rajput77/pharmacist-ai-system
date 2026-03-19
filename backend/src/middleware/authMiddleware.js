/**
 * Authentication & Authorization Middleware
 * Industry-standard RBAC (Role-Based Access Control)
 * 
 * Features:
 * - JWT token validation
 * - Role-based access control
 * - Audit logging
 */

const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT Token
 * Used to authenticate requests from frontend
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate JWT Token
 * Called during login to create session token
 */
const generateToken = (customerId, role) => {
  return jwt.sign(
    { customerId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Authentication Middleware
 * Extracts and validates token from request headers
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify user still exists and is active
    const user = await Customer.findById(decoded.customerId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user data to request for use in route handlers
    req.user = {
      customerId: decoded.customerId,
      role: decoded.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Authorization Middleware (Role Checker)
 * Ensures user has required role to access endpoint
 * 
 * Usage: authorize(['admin', 'pharmacist'])
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires ${allowedRoles.join(' or ')} role`
      });
    }

    next();
  };
};

/**
 * Log Login Activity
 * Records user login attempts for audit trail
 */
const logLoginActivity = async (customerId, ipAddress, userAgent) => {
  try {
    await Customer.findByIdAndUpdate(
      customerId,
      {
        lastLogin: new Date(),
        $push: {
          loginHistory: {
            timestamp: new Date(),
            ipAddress: ipAddress,
            userAgent: userAgent
          }
        }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error logging login activity:', error);
  }
};

/**
 * Extract Client IP
 * Helper function to get client IP from request
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection.remoteAddress || 
         'unknown';
};

module.exports = {
  authenticate,
  authorize,
  generateToken,
  verifyToken,
  logLoginActivity,
  getClientIp
};
