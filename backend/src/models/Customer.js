const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  address: String,
  
  // 🔐 Role-Based Access Control (RBAC)
  role: { 
    type: String, 
    enum: ['patient', 'admin', 'pharmacist'], 
    default: 'patient',
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  activeMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  prescriptions: [{
    medicineId: mongoose.Schema.Types.ObjectId,
    prescriptionDate: Date,
    expiryDate: Date,
    doctorName: String
  }],
  orderHistory: [String],
  preferences: {
    preferredDeliveryTime: String,
    notificationChannel: [String]
  },
  
  // Audit fields for industry standards
  lastLogin: Date,
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ SIMPLE FIX - Password hashing without .pre()
customerSchema.methods.hashPassword = async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
};

// Call this method before saving in your route
// या फिर यह करो:

// ❌ .pre() hook को remove करो
// और सीधे route में hash करो

module.exports = mongoose.model('Customer', customerSchema);