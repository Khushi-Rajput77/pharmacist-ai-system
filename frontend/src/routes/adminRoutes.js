const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const RefillAlert = require('../models/RefillAlert');
const Order = require('../models/Order');

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const pendingRefills = await RefillAlert.countDocuments({ status: 'pending' });
    const lowStockMedicines = await Medicine.countDocuments({ 
      currentStock: { $lt: 100 } 
    });

    res.json({
      success: true,
      stats: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingRefills: pendingRefills,
        lowStockMedicines: lowStockMedicines
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET low stock medicines
router.get('/low-stock', async (req, res) => {
  try {
    const medicines = await Medicine.find({ currentStock: { $lt: 100 } });
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE medicine stock
router.patch('/medicines/:id/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $inc: { currentStock: quantity } },
      { new: true }
    );
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;