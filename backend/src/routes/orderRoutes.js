const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId')
      .populate('medicines.medicineId');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET orders by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.customerId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid customer ID format: ${req.params.customerId}`
      });
    }

    const orders = await Order.find({ customerId: req.params.customerId });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE order
router.post('/', async (req, res) => {
  try {
    const { customerId, medicines, totalPrice } = req.body;
    
    // Validate customer ID
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid customer ID format: ${customerId}`
      });
    }

    // Validate stock
    for (let item of medicines) {
      // Validate medicine ID
      if (!mongoose.Types.ObjectId.isValid(item.medicineId)) {
        return res.status(400).json({
          success: false,
          error: `Invalid medicine ID format: ${item.medicineId}`
        });
      }

      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: `Medicine not found: ${item.medicineId}`
        });
      }

      if (medicine.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `${medicine.name} stock insufficient. Available: ${medicine.currentStock}`
        });
      }
    }

    // Create order
    const orderId = 'ORD' + Date.now();
    const order = new Order({
      orderId,
      customerId,
      medicines,
      totalPrice,
      status: 'confirmed',
      prescriptionVerified: true
    });
    await order.save();

    // Decrement stock
    for (let item of medicines) {
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { currentStock: -item.quantity }
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      orderId: orderId,
      data: order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// UPDATE order status
router.patch('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      req.body,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order not found: ${req.params.orderId}`
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;