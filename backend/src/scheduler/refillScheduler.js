const cron = require('node-cron');
const { predictRefillsForAllCustomers } = require('../services/refillPredictionService');

// Run refill prediction every 6 hours
// Format: (minute) (hour) (day) (month) (day of week)
// 0 */6 * * * = at minute 0, every 6 hours, every day

const refillScheduler = cron.schedule('0 */6 * * *', async () => {
  console.log('\n⏰ Running scheduled refill prediction...');
  await predictRefillsForAllCustomers();
});

// Also run manually on server start
async function initializeScheduler() {
  console.log('🚀 Initializing refill scheduler...');
  await predictRefillsForAllCustomers();
}

module.exports = { refillScheduler, initializeScheduler };