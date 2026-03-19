const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { authenticate, authorize, generateToken, logLoginActivity, getClientIp } = require('../middleware/authMiddleware');

/**
 * LOGIN Endpoint
 * Authenticates user and returns JWT token + user role
 * POST /api/customers/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find customer by email
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!customer.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive'
      });
    }

    // Generate JWT token
    const token = generateToken(customer._id, customer.role);

    // Log login activity for audit trail
    logLoginActivity(customer._id, getClientIp(req), req.headers['user-agent']);

    // Return success with user data and token
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      customerId: customer._id,
      data: {
        _id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        role: customer.role,
        phoneNumber: customer.phoneNumber,
        address: customer.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().select('-password');
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single customer
router.get('/:id', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid customer ID format: ${req.params.id}`
      });
    }

    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        error: 'Customer not found' 
      });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE customer (register)
router.post('/register', async (req, res) => {
  try {
    // Validate required fields
    const { firstName, lastName, email, phoneNumber, address, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check duplicate email
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: `Customer with email ${email} already exists!`
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role (default to 'patient')
    const validRoles = ['patient', 'admin', 'pharmacist'];
    const userRole = validRoles.includes(role) ? role : 'patient';

    // Create new customer
    const customer = new Customer({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email.toLowerCase(),
      phoneNumber: phoneNumber || '',
      address: address || '',
      password: hashedPassword,
      role: userRole,
      isActive: true
    });

    await customer.save();

    // Generate token for immediate login after registration
    const token = generateToken(customer._id, customer.role);

    res.status(201).json({ 
      success: true, 
      message: 'Customer registered successfully', 
      token: token,
      customerId: customer._id,
      data: {
        _id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        role: customer.role
      }
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
});

// UPDATE customer
router.patch('/:id', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid customer ID format: ${req.params.id}`
      });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid customer ID format: ${req.params.id}`
      });
    }

    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;