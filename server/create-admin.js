const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const uri = process.env.DATABASE_URL;
console.log('Connecting to:', uri);

const clientOptions = { 
  serverApi: { 
    version: '1', 
    strict: true, 
    deprecationErrors: true 
  } 
};

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Admin Schema (simplified for this script)
const adminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  role: { type: String, default: 'super-admin' },
  permissions: [String],
  isActive: { type: Boolean, default: true }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'shilpgroup47@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email: shilpgroup47@gmail.com');
      console.log('Password: ShilpGroup@RealState11290');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('ShilpGroup@RealState11290', 12);

    // Create admin
    const admin = new Admin({
      username: 'shilpgroup47',
      email: 'shilpgroup47@gmail.com',
      password: hashedPassword,
      fullName: 'Shilp Group Admin',
      role: 'super-admin',
      permissions: [
        'users.read', 'users.write', 'users.delete',
        'analytics.read', 'settings.read', 'settings.write',
        'projects.read', 'projects.write', 'projects.delete',
        'blogs.read', 'blogs.write', 'blogs.delete',
        'banners.read', 'banners.write', 'banners.delete'
      ],
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('Email: shilpgroup47@gmail.com');
    console.log('Password: ShilpGroup@RealState11290');
    console.log('Role: super-admin');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

async function main() {
  try {
    await connectToDatabase();
    await createAdmin();
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main();