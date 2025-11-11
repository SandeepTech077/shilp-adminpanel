require('dotenv').config();
const mongoose = require('mongoose');

const cleanupBlogIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const blogsCollection = db.collection('blogs');

    // Get all indexes
    const indexes = await blogsCollection.indexes();
    console.log('\n📋 Current indexes on blogs collection:');
    indexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Drop unnecessary indexes (keep only needed ones)
    const indexesToDrop = ['status_1_publishedAt_-1', 'category_1'];
    
    for (const indexName of indexesToDrop) {
      try {
        await blogsCollection.dropIndex(indexName);
        console.log(`\n✅ Dropped ${indexName} index`);
      } catch (error) {
        if (error.code === 27) {
          console.log(`\n⚠️  ${indexName} index does not exist`);
        } else {
          console.log(`\n⚠️  Error dropping ${indexName} index:`, error.message);
        }
      }
    }

    // Verify indexes after cleanup
    const updatedIndexes = await blogsCollection.indexes();
    console.log('\n📋 Final indexes on blogs collection:');
    updatedIndexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Blog indexes cleaned successfully!');
    console.log('\nℹ️  Remaining indexes are:');
    console.log('  - _id_: Default MongoDB index');
    console.log('  - url_1: Unique index for URL slugs (required)');
    console.log('  - status_1: Index for status filtering (required)');
    console.log('  - createdAt_-1: Index for sorting by date (required)');
  } catch (error) {
    console.error('❌ Error cleaning blog indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the script
cleanupBlogIndexes();
