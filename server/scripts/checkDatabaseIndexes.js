const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabaseIndexes = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projects');
    
    // Get all indexes
    const indexes = await collection.indexes();
    
    console.log('📋 Current indexes on projects collection:');
    console.log('==========================================');
    
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. Index Name: ${index.name}`);
      console.log(`   Key: ${JSON.stringify(index.key)}`);
      if (index.unique) console.log(`   Unique: ${index.unique}`);
      if (index.sparse) console.log(`   Sparse: ${index.sparse}`);
      console.log('');
    });
    
    // Check for problematic indexes
    const problematicIndexes = indexes.filter(index => 
      index.name.includes('projectDetail') || 
      (index.name.includes('slug') && index.name !== 'slug_1')
    );
    
    if (problematicIndexes.length > 0) {
      console.log('⚠️  Problematic indexes found:');
      problematicIndexes.forEach(index => {
        console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
      });
      
      console.log('\n🔧 To drop problematic indexes, run:');
      problematicIndexes.forEach(index => {
        console.log(`db.projects.dropIndex("${index.name}")`);
      });
    } else {
      console.log('✅ No problematic indexes found');
    }
    
  } catch (error) {
    console.error('❌ Error checking indexes:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

checkDatabaseIndexes();