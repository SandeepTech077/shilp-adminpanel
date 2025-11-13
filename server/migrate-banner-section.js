const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shilp-adminpanel')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    addBannerSectionToExistingProjects();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

async function addBannerSectionToExistingProjects() {
  try {
    console.log('🔧 Adding bannerSection field to existing projects...');
    
    // Update all projects that don't have bannerSection field
    const result = await mongoose.connection.db.collection('projects').updateMany(
      { bannerSection: { $exists: false } }, // Find documents without bannerSection
      { 
        $set: { 
          bannerSection: {
            desktopBannerImage: '',
            mobileBannerImage: '',
            alt: ''
          }
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} projects with bannerSection field`);
    
    // Show updated projects
    const updatedProjects = await mongoose.connection.db.collection('projects')
      .find({}, { projectTitle: 1, bannerSection: 1 })
      .toArray();
    
    console.log('📋 Projects after migration:');
    updatedProjects.forEach(project => {
      console.log(`  - ${project.projectTitle}: bannerSection added ✓`);
    });
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}