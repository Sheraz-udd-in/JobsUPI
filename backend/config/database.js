const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log('📊 MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsupi',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      }
    );

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Running in demo mode with mock data');
    console.warn('💡 To enable real database:');
    console.warn('   1. Ensure MongoDB is running or Atlas IP is whitelisted');
    console.warn('   2. Check MONGODB_URI in .env file');
    console.warn('   3. Verify database user credentials\n');
    // Don't throw - let app continue with demo mode
    return null;
  }
};

// Try to connect on startup
connectDB();

// Retry connection periodically
setInterval(() => {
  if (!isConnected) {
    connectDB();
  }
}, 30000); // Retry every 30 seconds

module.exports = connectDB;
