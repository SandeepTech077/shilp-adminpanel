const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shilp-adminpanel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
    const existingAdmin = await Admin.findOne({ email: 'admin@shilp.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email: admin@shilp.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@shilp.com',
      password: hashedPassword,
      fullName: 'Super Admin',
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
    console.log('Email: admin@shilp.com');
    console.log('Password: admin123');
    console.log('Role: super-admin');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();