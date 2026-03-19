const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  medicineId: mongoose.Schema.Types.ObjectId,
  doctorName: String,
  prescriptionDate: Date,
  expiryDate: Date,
  quantity: Number,
  dosageInstructions: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);