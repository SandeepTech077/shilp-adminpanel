const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../src/models/Project');

const cleanupNullSlugs = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Find projects with null or empty slugs
    const nullSlugProjects = await Project.find({ 
      $or: [
        { slug: null }, 
        { slug: '' }, 
        { slug: { $exists: false } }
      ] 
    });
    
    console.log(`📋 Found ${nullSlugProjects.length} projects with null/empty slugs`);
    
    if (nullSlugProjects.length > 0) {
      console.log('\nProjects to be deleted:');
      nullSlugProjects.forEach((project, index) => {
        console.log(`${index + 1}. ID: ${project._id}, Title: "${project.projectTitle}"`);
      });
      
      // Ask for confirmation (in a real scenario)
      console.log('\n🚨 This will PERMANENTLY DELETE these projects!');
      console.log('⚠️  Make sure you have a backup before proceeding.');
      
      // Delete projects with null/empty slugs
      const result = await Project.deleteMany({ 
        $or: [
          { slug: null }, 
          { slug: '' }, 
          { slug: { $exists: false } }
        ] 
      });
      
      console.log(`✅ Deleted ${result.deletedCount} projects with null/empty slugs`);
    } else {
      console.log('✅ No projects with null/empty slugs found - nothing to clean up');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

cleanupNullSlugs();