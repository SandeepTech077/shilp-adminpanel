const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabaseIndexes = async () => {
  try {
  // Connect to database
  await mongoose.connect(process.env.DATABASE_URL);
  console.info('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projects');
    
    // Get all indexes
    const indexes = await collection.indexes();
    
  console.info('📋 Current indexes on projects collection:');
  console.info('==========================================');
    
    indexes.forEach((index, i) => {
      console.info(`${i + 1}. Index Name: ${index.name}`);
      console.info(`   Key: ${JSON.stringify(index.key)}`);
      if (index.unique) console.info(`   Unique: ${index.unique}`);
      if (index.sparse) console.info(`   Sparse: ${index.sparse}`);
      console.info('');
    });
    
    // Check for problematic indexes
    const problematicIndexes = indexes.filter(index => 
      index.name.includes('projectDetail') || 
      (index.name.includes('slug') && index.name !== 'slug_1')
    );
    
    if (problematicIndexes.length > 0) {
      console.info('⚠️  Problematic indexes found:');
      problematicIndexes.forEach(index => {
        console.info(`- ${index.name}: ${JSON.stringify(index.key)}`);
      });
      
      console.info('\n🔧 To drop problematic indexes, run:');
      problematicIndexes.forEach(index => {
        console.info(`db.projects.dropIndex("${index.name}")`);
      });
    } else {
      console.info('✅ No problematic indexes found');
    }
    
  } catch (error) {
    console.error('❌ Error checking indexes:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

checkDatabaseIndexes();