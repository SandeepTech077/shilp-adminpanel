const mongoose = require('mongoose');
require('dotenv').config();

const dropProblematicIndexes = async () => {
  try {
  // Connect to database
  await mongoose.connect(process.env.DATABASE_URL);
  console.info('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projects');
    
    // List of problematic indexes to drop
    const indexesToDrop = [
      'projectDetail.title_text_projectDetail.shortAddress_text',
      'projectDetail.slug_1',
      'projectDetail.projectState_1', 
      'projectDetail.cardDetail.projectType_1',
      'projectDetail.projectType_1',
      'projectDetail.projectTitle_1',
      'slug_1_isActive_1' // This creates duplicate with main slug_1
    ];
    
    console.info('🚨 WARNING: This will drop the following indexes:');
    indexesToDrop.forEach(indexName => {
      console.info(`- ${indexName}`);
    });
    
    console.info('\n⚠️  Are you sure you want to proceed? This action cannot be undone.');
    console.info('💡 Make sure to backup your database before proceeding.\n');
    
    // Drop each problematic index
    let droppedCount = 0;
    for (const indexName of indexesToDrop) {
      try {
  await collection.dropIndex(indexName);
  console.info(`✅ Dropped index: ${indexName}`);
        droppedCount++;
      } catch (error) {
        if (error.message.includes('index not found')) {
          console.info(`ℹ️  Index not found (already dropped): ${indexName}`);
        } else {
          console.error(`❌ Failed to drop index ${indexName}:`, error.message);
        }
      }
    }
    
  console.info(`\n🎉 Successfully dropped ${droppedCount} problematic indexes`);
  console.info('✅ The duplicate key error should now be resolved!');
    
    // Show remaining indexes
    const remainingIndexes = await collection.indexes();
    console.info('\n📋 Remaining indexes:');
    remainingIndexes.forEach(index => {
      console.info(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('❌ Error dropping indexes:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

dropProblematicIndexes();