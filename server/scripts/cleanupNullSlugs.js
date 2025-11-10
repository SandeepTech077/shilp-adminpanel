const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../src/models/Project');

const cleanupNullSlugs = async () => {
  try {
  // Connect to database
  await mongoose.connect(process.env.DATABASE_URL);
  console.info('✅ Connected to MongoDB');

    // Find projects with null or empty slugs
    const nullSlugProjects = await Project.find({ 
      $or: [
        { slug: null }, 
        { slug: '' }, 
        { slug: { $exists: false } }
      ] 
    });
    
  console.info(`📋 Found ${nullSlugProjects.length} projects with null/empty slugs`);
    
    if (nullSlugProjects.length > 0) {
      console.info('\nProjects to be deleted:');
      nullSlugProjects.forEach((project, index) => {
        console.info(`${index + 1}. ID: ${project._id}, Title: "${project.projectTitle}"`);
      });
      
      // Ask for confirmation (in a real scenario)
      console.info('\n🚨 This will PERMANENTLY DELETE these projects!');
      console.info('⚠️  Make sure you have a backup before proceeding.');
      
      // Delete projects with null/empty slugs
      const result = await Project.deleteMany({ 
        $or: [
          { slug: null }, 
          { slug: '' }, 
          { slug: { $exists: false } }
        ] 
      });
      
  console.info(`✅ Deleted ${result.deletedCount} projects with null/empty slugs`);
    } else {
  console.info('✅ No projects with null/empty slugs found - nothing to clean up');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

cleanupNullSlugs();