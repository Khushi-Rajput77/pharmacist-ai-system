const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  medicines: [{
    medicineId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    dosage: String,
    frequency: String
  }],
  totalPrice: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: Date,
  prescriptionVerified: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);