const mongoose = require('mongoose');const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');const bcrypt = require('bcryptjs');

require('dotenv').config();require('dotenv').config();



// Import Admin model// Connect to MongoDB

const Admin = require('./src/models/Admin');const uri = process.env.DATABASE_URL;

console.log('Connecting to:', uri);

// Connect to MongoDB

mongoose.connect(process.env.DATABASE_URL, {const clientOptions = { 

  dbName: process.env.DATABASE_NAME  serverApi: { 

})    version: '1', 

.then(() => {    strict: true, 

  console.log('✅ MongoDB connected successfully');    deprecationErrors: true 

  createAdmin();  } 

})};

.catch((error) => {

  console.error('❌ MongoDB connection error:', error);async function connectToDatabase() {

  process.exit(1);  try {

});    await mongoose.connect(uri, clientOptions);

    await mongoose.connection.db.admin().command({ ping: 1 });

async function createAdmin() {    console.log("✅ Successfully connected to MongoDB!");

  try {  } catch (error) {

    // Get admin credentials from environment variables    console.error('❌ Failed to connect to MongoDB:', error);

    const adminEmail = process.env.ADMIN_EMAIL || 'shilpgroup47@gmail.com';    throw error;

    const adminPassword = process.env.ADMIN_PASSWORD || 'ShilpGroup@RealState11290';  }

    const adminUsername = process.env.ADMIN_USERNAME || 'shilpgroup47';}

    const adminFullName = process.env.ADMIN_FULLNAME || 'Shilp Group Admin';

// Admin Schema (simplified for this script)

    // Check if admin already existsconst adminSchema = new mongoose.Schema({

    const existingAdmin = await Admin.findOne({ email: adminEmail });  username: String,

    if (existingAdmin) {  email: String,

      console.log('Admin already exists!');  password: String,

      console.log(`Email: ${adminEmail}`);  fullName: String,

      console.log(`Password: ${adminPassword}`);  role: { type: String, default: 'super-admin' },

      process.exit(0);  permissions: [String],

    }  isActive: { type: Boolean, default: true }

});

    // Hash password

    const hashedPassword = await bcrypt.hash(adminPassword, 12);const Admin = mongoose.model('Admin', adminSchema);



    // Create adminasync function createAdmin() {

    const admin = new Admin({  try {

      username: adminUsername,    // Get admin credentials from environment variables

      email: adminEmail,    const adminEmail = process.env.ADMIN_EMAIL || 'shilpgroup47@gmail.com';

      password: hashedPassword,    const adminPassword = process.env.ADMIN_PASSWORD || 'ShilpGroup@RealState11290';

      fullName: adminFullName,    const adminUsername = process.env.ADMIN_USERNAME || 'shilpgroup47';

      role: 'super-admin',    const adminFullName = process.env.ADMIN_FULLNAME || 'Shilp Group Admin';

      permissions: [

        'users.read', 'users.write', 'users.delete',    // Check if admin already exists

        'analytics.read', 'settings.read', 'settings.write',    const existingAdmin = await Admin.findOne({ email: adminEmail });

        'projects.read', 'projects.write', 'projects.delete',    if (existingAdmin) {

        'blogs.read', 'blogs.write', 'blogs.delete',      console.log('Admin already exists!');

        'banners.read', 'banners.write', 'banners.delete'      console.log(`Email: ${adminEmail}`);

      ],      console.log(`Password: ${adminPassword}`);

      isActive: true      process.exit(0);

    });    }



    await admin.save();    // Hash password

    console.log('✅ Admin created successfully!');    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    console.log(`Email: ${adminEmail}`);

    console.log(`Password: ${adminPassword}`);    // Create admin

    console.log('Role: super-admin');    const admin = new Admin({

          username: adminUsername,

    process.exit(0);      email: adminEmail,

  } catch (error) {      password: hashedPassword,

    console.error('❌ Error creating admin:', error);      fullName: adminFullName,

    process.exit(1);      role: 'super-admin',

  }      permissions: [

}        'users.read', 'users.write', 'users.delete',
        'analytics.read', 'settings.read', 'settings.write',
        'projects.read', 'projects.write', 'projects.delete',
        'blogs.read', 'blogs.write', 'blogs.delete',
        'banners.read', 'banners.write', 'banners.delete'
      ],
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
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