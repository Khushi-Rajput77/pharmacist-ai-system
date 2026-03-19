// ✅ MOST IMPORTANT: Load .env FIRST, before anything else
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// ✅ Verify that .env is loaded properly
console.log('🔍 Environment Check:');
console.log('   CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? '✅ Found' : '❌ NOT FOUND');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ NOT FOUND');
console.log('   LANGFUSE_PUBLIC_KEY:', process.env.LANGFUSE_PUBLIC_KEY ? '✅ Found' : '⚠️ Optional');
console.log('   LANGFUSE_SECRET_KEY:', process.env.LANGFUSE_SECRET_KEY ? '✅ Found' : '⚠️ Optional');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log('📁 API Health Check: http://localhost:5000/api/health\n');
  });
}).catch(err => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});