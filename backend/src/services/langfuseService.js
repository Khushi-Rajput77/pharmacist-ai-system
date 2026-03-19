const { Langfuse } = require('@langfuse/node');

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: 'https://cloud.langfuse.com'
});

async function traceOrderCreation(customerId, medicines, result) {
  const trace = langfuse.trace({
    name: 'Order Creation Flow',
    userId: customerId,
    metadata: {
      medicineCount: medicines.length,
      timestamp: new Date().toISOString()
    }
  });

  // Log stock validation
  const stockSpan = trace.span({
    name: 'Stock Validation',
    input: { medicines }
  });
  stockSpan.end({ output: { validated: true } });

  // Log prescription check
  const prescriptionSpan = trace.span({
    name: 'Prescription Check',
    input: { customerId }
  });
  prescriptionSpan.end({ output: { valid: true } });

  // Log order creation
  const orderSpan = trace.span({
    name: 'Order Database Save',
    input: { totalPrice: result.totalPrice }
  });
  orderSpan.end({ output: { orderId: result.orderId } });

  trace.end();
  return true;
}

async function traceChatProcessing(message, customerId, result) {
  const trace = langfuse.trace({
    name: 'Chat Message Processing',
    userId: customerId
  });

  // Claude extraction
  const nlpSpan = trace.span({
    name: 'Claude NLP Extraction',
    input: { message }
  });
  nlpSpan.end({ output: { extracted: result.extracted } });

  // Validation
  const validationSpan = trace.span({
    name: 'Order Validation',
    input: { medicine: result.medicine }
  });
  validationSpan.end({ output: { approved: result.approved } });

  trace.end();
  return true;
}

module.exports = { traceOrderCreation, traceChatProcessing, langfuse };