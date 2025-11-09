const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mongodb+srv://jayrajsinhjadavharichtech_db_user:9MvwZLBGlNnYkoft@cluster1.i32wuv3.mongodb.net/shilpadmin';
    
    await mongoose.connect(dbUrl);
    
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