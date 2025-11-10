const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('../src/models/Admin');

const checkAdminStatus = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Check existing admins
    const admins = await Admin.find({}, 'username email role permissions isActive');
    
    if (admins.length === 0) {
      console.log('❌ No admins found in database');
      console.log('💡 Run: npm run create-admin');
      return;
    }

    console.log('📋 Existing Admins:');
    console.log('==================');
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Admin Details:`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Permissions: ${admin.permissions.join(', ')}`);
      
      // Check if role matches what the middleware expects
      const hasValidRole = admin.role === 'admin' || admin.role === 'super-admin';
      const hasProjectPermissions = admin.permissions.includes('projects.create');
      
      console.log(`   ✅ Valid Role: ${hasValidRole}`);
      console.log(`   ✅ Has Project Permissions: ${hasProjectPermissions}`);
      
      if (!hasValidRole) {
        console.log(`   ⚠️  Role issue: Expected 'admin' or 'super-admin', got '${admin.role}'`);
      }
      
      if (!hasProjectPermissions) {
        console.log(`   ⚠️  Missing 'projects.create' permission`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking admin status:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

checkAdminStatus();