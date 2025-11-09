const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    // Prefer an explicit DATABASE_URL environment variable. Use a local
    // fallback for developer convenience but do NOT hard-code production
    // credentials in source.
    const dbUrl = process.env.DATABASE_URL 

    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('✅ Connected to MongoDB successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase
};