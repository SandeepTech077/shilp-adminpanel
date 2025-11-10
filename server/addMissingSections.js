// Simple script to add missing banner sections
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shilp-adminpanel')
  .then(() => {
    console.info('✅ Connected to MongoDB');
    addMissingSections();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Add missing sections function
async function addMissingSections() {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('banners');
    
    // Find the main banner document
    const bannerDoc = await collection.findOne({ documentId: 'main-banners' });
    
    if (!bannerDoc) {
      console.info('❌ No banner document found');
      process.exit(1);
    }
    
    console.info('📋 Found banner document:', bannerDoc._id);
    
    // Define all required sections
    const requiredSections = [
      'homepageBanner', 'aboutUs', 'commercialBanner', 'plotBanner',
      'residentialBanner', 'contactBanners', 'careerBanner', 'ourTeamBanner',
      'termsConditionsBanner', 'privacyPolicyBanner'
    ];
    
    // Check current sections
    const currentSections = requiredSections.filter(section => bannerDoc[section]);
    const missingSections = requiredSections.filter(section => !bannerDoc[section]);
    
  console.info('📋 Current sections:', currentSections.length, currentSections);
  console.info('📋 Missing sections:', missingSections.length, missingSections);
    
    if (missingSections.length === 0) {
      console.info('✅ All sections already exist!');
      process.exit(0);
    }
    
    // Create update object with missing sections
    const updateObj = {};
    missingSections.forEach(section => {
      updateObj[section] = {
        banner: '',
        mobilebanner: '',
        alt: '',
        bannerMetadata: {
          uploadedAt: null,
          filename: '',
          originalName: '',
          size: 0
        },
        mobilebannerMetadata: {
          uploadedAt: null,
          filename: '',
          originalName: '',
          size: 0
        }
      };
    });
    
  console.info('➕ Adding missing sections:', Object.keys(updateObj));
    
    // Update the document
    const result = await collection.updateOne(
      { documentId: 'main-banners' },
      { 
        $set: updateObj,
        $currentDate: { updatedAt: true }
      }
    );
    
  console.info('📋 Update result:', result);
    
    // Verify the result
    const updatedDoc = await collection.findOne({ documentId: 'main-banners' });
    const finalSections = requiredSections.filter(section => updatedDoc[section]);
    
  console.info('✅ Update completed!');
  console.info('📋 Final sections count:', finalSections.length, '/', requiredSections.length);
  console.info('📋 Final sections list:', finalSections);
    
  mongoose.connection.close();
  console.info('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}