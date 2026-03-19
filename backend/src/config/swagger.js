const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agentic AI Pharmacy System API',
      version: '1.0.0',
      description: 'Complete pharmacy ordering system with AI and proactive refills'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    components: {
      schemas: {
        Medicine: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            dosage: { type: 'string' },
            currentStock: { type: 'number' },
            price: { type: 'number' },
            prescriptionRequired: { type: 'boolean' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            orderId: { type: 'string' },
            customerId: { type: 'string' },
            totalPrice: { type: 'number' },
            status: { type: 'string' },
            orderDate: { type: 'string', format: 'date-time' }
          }
        },
        RefillAlert: {
          type: 'object',
          properties: {
            customerId: { type: 'string' },
            medicineId: { type: 'string' },
            predictedRefillDate: { type: 'string', format: 'date' },
            status: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;