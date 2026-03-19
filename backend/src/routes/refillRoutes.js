const express = require('express');
const router = express.Router();
const RefillAlert = require('../models/RefillAlert');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Customer = require('../models/Customer');

// GET all pending refill alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await RefillAlert.find({ status: { $ne: 'ordered' } })
      .populate('customerId')
      .populate('medicineId');
    
    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET refill alerts for specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const alerts = await RefillAlert.find({ customerId: req.params.customerId })
      .populate('medicineId');
    
    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark alert as sent
router.patch('/:alertId/sent', async (req, res) => {
  try {
    const alert = await RefillAlert.findByIdAndUpdate(
      req.params.alertId,
      { status: 'sent', alertSentDate: new Date() },
      { new: true }
    );
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark alert as ordered
router.patch('/:alertId/ordered', async (req, res) => {
  try {
    const alert = await RefillAlert.findByIdAndUpdate(
      req.params.alertId,
      { status: 'ordered' },
      { new: true }
    );
    res.json({ success: true, message: 'Alert marked as ordered', data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;