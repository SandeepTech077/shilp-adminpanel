const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('../src/models/Admin');

const createFirstAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('❌ Admin already exists in database');
      process.exit(1);
    }

    // Create first admin
    const adminData = {
      username: 'admin',
      email: 'admin@shilpadmin.com',
      password: 'Admin123!@#',  // Strong default password
      fullName: 'System Administrator',
      role: 'super-admin',
      permissions: [
        'users.read', 'users.write', 'users.delete',
        'analytics.read', 'settings.read', 'settings.write',
        'system.manage',
        'projects.create', 'projects.read', 'projects.update', 'projects.delete',
        'banners.create', 'banners.read', 'banners.update', 'banners.delete'
      ]
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ First admin created successfully!');
    console.log('📋 Admin Details:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Role: ${adminData.role}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

createFirstAdmin();