const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const medicineRoutes = require('./routes/medicineRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const refillRoutes = require('./routes/refillRoutes');
const { initializeScheduler, startRefillScheduler } = require('./scheduler/refillScheduler');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: '🚀 AI Pharmacy System Backend API', status: '✅ Running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running', timestamp: new Date() });
});

app.use('/api/medicines', medicineRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/refills', refillRoutes);

// ✅ Export a function to start schedulers AFTER DB is ready
app.initSchedulers = () => {
  try {
    initializeScheduler();
    if (process.env.CLAUDE_API_KEY) {
      startRefillScheduler();
      console.log('✅ Refill scheduler started');
    } else {
      console.log('⚠️ Claude API key not found - chat service disabled');
    }
  } catch (error) {
    console.error('⚠️ Error starting scheduler:', error.message);
  }
};

module.exports = app;