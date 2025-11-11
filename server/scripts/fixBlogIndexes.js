require('dotenv').config();
const mongoose = require('mongoose');

const fixBlogIndexes = async () => {
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

    // Drop the problematic slug index if it exists
    try {
      await blogsCollection.dropIndex('slug_1');
      console.log('\n✅ Dropped old slug_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️  slug_1 index does not exist (already removed)');
      } else {
        console.log('\n⚠️  Error dropping slug_1 index:', error.message);
      }
    }

    // Verify indexes after cleanup
    const updatedIndexes = await blogsCollection.indexes();
    console.log('\n📋 Updated indexes on blogs collection:');
    updatedIndexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Blog indexes fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing blog indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the script
fixBlogIndexes();
