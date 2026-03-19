const mongoose = require('mongoose');

const refillAlertSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  medicineId: mongoose.Schema.Types.ObjectId,
  lastOrderDate: Date,
  predictedRefillDate: Date,
  frequency: Number,
  status: { type: String, enum: ['pending', 'sent', 'acknowledged', 'ordered'], default: 'pending' },
  alertSentDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RefillAlert', refillAlertSchema);