const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genericName: String,
  dosage: String,
  unitType: String,
  currentStock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 50 },
  price: Number,
  prescriptionRequired: { type: Boolean, default: false },
  sideEffects: [String],
  interactions: [String],
  usages: [String],
  manufacturer: String,
  expiryDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);