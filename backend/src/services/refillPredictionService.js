const RefillAlert = require('../models/RefillAlert');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Customer = require('../models/Customer');

async function predictRefillsForAllCustomers() {
  console.log('🔄 Starting refill prediction...');
  
  try {
    const customers = await Customer.find();
    let alertsCreated = 0;

    for (const customer of customers) {
      // Get all medicines this customer has ordered
      const customerOrders = await Order.find({ customerId: customer._id });
      
      if (!customerOrders.length) continue;

      // For each medicine, check if refill needed
      const medicineIds = new Set();
      customerOrders.forEach(order => {
        order.medicines.forEach(med => medicineIds.add(med.medicineId.toString()));
      });

      for (const medicineId of medicineIds) {
        // Get last order date for this medicine
        const lastOrder = await Order.findOne({
          customerId: customer._id,
          'medicines.medicineId': medicineId
        }).sort({ orderDate: -1 });

        if (!lastOrder) continue;

        const medicine = await Medicine.findById(medicineId);
        const lastOrderDate = new Date(lastOrder.orderDate);
        const frequency = 30; // Default 30 days (can be customized)
        const nextRefillDate = new Date(lastOrderDate.getTime() + frequency * 24 * 60 * 60 * 1000);

        // If refill date is within 3 days from now
        const daysUntilRefill = Math.ceil((nextRefillDate - new Date()) / (24 * 60 * 60 * 1000));

        if (daysUntilRefill <= 3 && daysUntilRefill > 0) {
          // Check if alert already exists
          const existingAlert = await RefillAlert.findOne({
            customerId: customer._id,
            medicineId: medicineId,
            status: { $ne: 'ordered' }
          });

          if (!existingAlert) {
            // Create new alert
            const alert = await RefillAlert.create({
              customerId: customer._id,
              medicineId: medicineId,
              lastOrderDate: lastOrderDate,
              predictedRefillDate: nextRefillDate,
              frequency: frequency,
              status: 'pending',
              alertSentDate: null
            });

            alertsCreated++;
            console.log(`✅ Alert created for ${customer.firstName} - ${medicine.name}`);
          }
        }
      }
    }

    console.log(`✅ Refill prediction complete! ${alertsCreated} new alerts created.`);
    return { success: true, alertsCreated };

  } catch (error) {
    console.error('❌ Refill prediction error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { predictRefillsForAllCustomers };