const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const Customer = require('../models/Customer');
const Prescription = require('../models/Prescription');
const mongoose = require('mongoose');

// ✅ SIMPLE TEXT PARSING - NO API NEEDED!
// Extract medicine details using simple regex and text matching

function extractMedicineDetails(message) {
  // Convert to lowercase for matching
  const msg = message.toLowerCase();
  
  // Pattern: medicine name + dosage + quantity
  // Examples:
  // "I need aspirin 500mg, 10 tablets"
  // "I want metformin 500mg"
  // "Give me aspirin"
  
  let extraction = {
    medicineName: null,
    dosage: null,
    quantity: null,
    frequency: null
  };

  // Common medicine names (you can add more)
  const medicines = ['aspirin', 'metformin', 'lisinopril', 'amlodipine', 'ibuprofen', 'paracetamol', 'amoxicillin'];
  
  // Find medicine name
  for (let med of medicines) {
    if (msg.includes(med)) {
      extraction.medicineName = med;
      break;
    }
  }

  // Extract dosage (pattern: number + mg)
  const dosageMatch = message.match(/(\d+)\s*mg/i);
  if (dosageMatch) {
    extraction.dosage = dosageMatch[1] + 'mg';
  }

  // Extract quantity (pattern: number + tablets/capsules/etc)
  const quantityMatch = message.match(/(\d+)\s*(tablets?|capsules?|strips?|bottles?)/i);
  if (quantityMatch) {
    extraction.quantity = parseInt(quantityMatch[1]);
  }

  // Default quantity if not specified
  if (!extraction.quantity && extraction.medicineName) {
    extraction.quantity = 1;
  }

  // Extract frequency
  if (msg.includes('daily') || msg.includes('once a day')) {
    extraction.frequency = 'daily';
  } else if (msg.includes('twice') || msg.includes('two times')) {
    extraction.frequency = 'twice daily';
  }

  return extraction;
}

// Extract medicine details using simple text parsing
router.post('/process', async (req, res) => {
  try {
    const { message, customerId } = req.body;

    // Validate customer ID
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid customer ID format: ${customerId}`
      });
    }
    
    console.log('📝 Processing chat message:', message);
    console.log('👤 Customer ID:', customerId);

    // Step 1: Extract medicine details using simple text parsing
    const extraction = extractMedicineDetails(message);
    
    console.log('✅ Extraction successful:', extraction);

    // Step 2: If no medicine found, ask for clarification
    if (!extraction.medicineName) {
      return res.json({
        success: false,
        response: "I couldn't identify the medicine. Can you be more specific? (e.g., 'I need aspirin 500mg, 10 tablets')",
        extracted: null
      });
    }

    // Step 3: Search for medicine in database
    const medicine = await Medicine.findOne({
      name: new RegExp(extraction.medicineName, 'i')
    });

    if (!medicine) {
      return res.json({
        success: false,
        response: `We don't have ${extraction.medicineName} in stock. Try searching for another medicine.`,
        extracted: extraction
      });
    }

    // Step 4: Check stock
    const quantity = extraction.quantity || 1;
    if (medicine.currentStock < quantity) {
      return res.json({
        success: false,
        response: `${medicine.name} is running low. Only ${medicine.currentStock} available.`,
        extracted: extraction,
        available: medicine.currentStock
      });
    }

    // Step 5: Check prescription requirement
    if (medicine.prescriptionRequired) {
      const prescription = await Prescription.findOne({
        customerId,
        medicineId: medicine._id,
        expiryDate: { $gt: new Date() }
      });
      if (!prescription) {
        return res.json({
          success: false,
          response: `This medicine requires a valid prescription. Please upload your prescription.`,
          extracted: extraction
        });
      }
    }

    // Step 6: Everything good, suggest order
    const totalPrice = medicine.price * quantity;
    res.json({
      success: true,
      response: `✅ Found ${medicine.name} (${medicine.dosage})! In stock: ${medicine.currentStock}. Order ${quantity} units? Price: ₹${totalPrice}`,
      extracted: extraction,
      medicine: {
        _id: medicine._id,
        name: medicine.name,
        dosage: medicine.dosage,
        price: medicine.price,
        stock: medicine.currentStock
      },
      totalPrice: totalPrice
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;