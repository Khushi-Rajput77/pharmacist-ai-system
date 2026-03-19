require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

console.log('🔍 Environment Check:');
console.log('   CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? '✅ Found' : '❌ NOT FOUND');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ NOT FOUND');

connectDB()
  .then(() => {
    app.initSchedulers(); // ✅ schedulers start AFTER DB ready
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 API Health Check: http://localhost:${PORT}/api/health\n`);
    });
  })
  .catch(err => {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  });