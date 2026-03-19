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
const { initializeScheduler } = require('./scheduler/refillScheduler');


// Langfuse - conditional
const { startRefillScheduler } = require('./scheduler/refillScheduler');

const app = express();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware
app.use(cors());
app.use(express.json());

// Initialize scheduler
initializeScheduler();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 AI Pharmacy System Backend API',
    status: '✅ Server is running',
    endpoints: {
      health: '/api/health',
      docs: '/api-docs',
      medicines: '/api/medicines',
      customers: '/api/customers',
      orders: '/api/orders',
      chat: '/api/chat',
      refills: '/api/refills'
    }
  });
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running', timestamp: new Date() });
});

// API Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/refills', refillRoutes);

// Initialize Refill Scheduler
try {
  if (process.env.CLAUDE_API_KEY && process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY) {
    startRefillScheduler();
    console.log('✅ Observability enabled with refill scheduler');
  } else if (process.env.CLAUDE_API_KEY) {
    startRefillScheduler();
    console.log('⚠️ Refill scheduler running without Langfuse observability');
  } else {
    console.log('⚠️ Claude API key not found - chat service disabled');
  }
} catch (error) {
  console.error('⚠️ Error starting scheduler:', error.message);
  console.log('Continuing without scheduler...');
}

module.exports = app;

// 6969c545e550d8731b9c6f84