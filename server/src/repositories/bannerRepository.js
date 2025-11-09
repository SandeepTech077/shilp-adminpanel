const Banner = require('../models/Banner');

const getBanners = async () => {
  let banners = await Banner.findOne({ documentId: 'main-banners' });
  
  const requiredSections = [
    'homepageBanner', 'aboutUs', 'commercialBanner', 'plotBanner',
    'residentialBanner', 'contactBanners', 'careerBanner', 'ourTeamBanner',
    'termsConditionsBanner', 'privacyPolicyBanner'
  ];
  
  const defaultSection = { 
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
  
  if (!banners) {
    console.log('📋 Creating new banners document with all sections');
    
    const allSections = {};
    requiredSections.forEach(section => {
      allSections[section] = defaultSection;
    });
    
    banners = new Banner({ 
      documentId: 'main-banners',
      ...allSections
    });
    
    await banners.save();
    console.log('✅ Created new banner document');
  } else {
    console.log('📋 Checking existing banners document');
    
    let needsUpdate = false;
    
    requiredSections.forEach(section => {
      if (!banners[section] || Object.keys(banners[section]).length === 0) {
        console.log(`➕ Adding missing section: ${section}`);
        banners[section] = defaultSection;
        // Mark the field as modified for Mongoose to save it
        banners.markModified(section);
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      await banners.save();
      console.log('✅ Updated banner document with missing sections');
    }
  }
  
  // Fetch fresh data after save to ensure consistency
  banners = await Banner.findOne({ documentId: 'main-banners' }).lean();
  
  console.log('📋 Final banner data:', {
    documentId: banners.documentId,
    sections: requiredSections.map(s => ({
      name: s,
      exists: !!banners[s],
      hasData: banners[s]?.banner || banners[s]?.mobilebanner ? true : false
    }))
  });
  
  return banners;
};

const updateBannerField = async (section, field, value) => {
  let banners = await Banner.findOne({ documentId: 'main-banners' });
  if (!banners) {
    banners = new Banner({ documentId: 'main-banners' });
  }
  
  if (!banners[section]) {
    banners[section] = {};
  }
  
  banners[section][field] = value;
  await banners.save();
  return banners;
};

// New method to update multiple fields at once
const updateBannerFields = async (section, fieldsData) => {
  let banners = await Banner.findOne({ documentId: 'main-banners' });
  if (!banners) {
    banners = new Banner({ documentId: 'main-banners' });
  }
  
  if (!banners[section]) {
    banners[section] = {};
  }
  
  // Update multiple fields
  Object.keys(fieldsData).forEach(field => {
    banners[section][field] = fieldsData[field];
  });
  
  await banners.save();
  return banners;
};

const deleteBannerField = async (section, field) => {
  let banners = await Banner.findOne({ documentId: 'main-banners' });
  if (!banners) return null;
  
  if (banners[section]) {
    banners[section][field] = '';
    // Also clear metadata when deleting image
    if (field === 'banner' || field === 'mobilebanner') {
      banners[section][`${field}Metadata`] = {
        uploadedAt: null,
        filename: '',
        originalName: '',
        size: 0
      };
    }
    await banners.save();
  }
  return banners;
};

module.exports = {
  getBanners,
  updateBannerField,
  updateBannerFields,
  deleteBannerField,
};
