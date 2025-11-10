const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('../src/models/Admin');

const checkAdminStatus = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL);
  // Connected to MongoDB

    // Check existing admins
    const admins = await Admin.find({}, 'username email role permissions isActive');
    
    if (admins.length === 0) {
      // No admins found
      return;
    }

    admins.forEach((admin, index) => {
      // Admin details available; suppressed verbose output
      const hasValidRole = admin.role === 'admin' || admin.role === 'super-admin';
      const hasProjectPermissions = admin.permissions.includes('projects.create');

      if (!hasValidRole || !hasProjectPermissions) {
        // Important issues found; print minimal info
        console.error('Admin permission/role issue for:', admin.username);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking admin status:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

checkAdminStatus();