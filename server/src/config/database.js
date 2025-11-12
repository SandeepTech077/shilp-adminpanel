const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {

    // credentials in source.
    const dbUrl = process.env.DATABASE_URL 

    await mongoose.connect(dbUrl);

  // Connected to MongoDB

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      // MongoDB disconnected
    });

    mongoose.connection.on('reconnected', () => {
      // MongoDB reconnected
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
  // Disconnected from MongoDB
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase
};