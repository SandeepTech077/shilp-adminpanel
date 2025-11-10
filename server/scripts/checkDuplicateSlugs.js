const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../src/models/Project');

const checkDuplicateSlugs = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Find all projects
    const projects = await Project.find({}, 'projectTitle slug');
    
    console.log(`📋 Found ${projects.length} projects in database`);
    
    // Check for null or empty slugs
    const nullSlugs = projects.filter(p => !p.slug || p.slug.trim() === '');
    
    if (nullSlugs.length > 0) {
      console.log(`\n⚠️  Found ${nullSlugs.length} projects with null/empty slugs:`);
      nullSlugs.forEach((project, index) => {
        console.log(`${index + 1}. ID: ${project._id}, Title: "${project.projectTitle}", Slug: "${project.slug}"`);
      });
      
      console.log('\n🔧 These need to be fixed or deleted to resolve the duplicate key error.');
      console.log('Options:');
      console.log('1. Delete these projects: await Project.deleteMany({ $or: [{ slug: null }, { slug: "" }] })');
      console.log('2. Update with proper slugs based on project titles');
    } else {
      console.log('✅ No projects with null/empty slugs found');
    }
    
    // Check for duplicate slugs
    const slugCounts = {};
    projects.forEach(project => {
      const slug = project.slug || 'null';
      slugCounts[slug] = (slugCounts[slug] || 0) + 1;
    });
    
    const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log(`\n⚠️  Found ${duplicates.length} duplicate slugs:`);
      duplicates.forEach(([slug, count]) => {
        console.log(`- Slug "${slug}": ${count} projects`);
      });
    } else {
      console.log('✅ No duplicate slugs found (excluding null/empty)');
    }
    
  } catch (error) {
    console.error('❌ Error checking slugs:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

checkDuplicateSlugs();