const mongoose = require('mongoose');

const bannerSectionSchema = new mongoose.Schema({
  banner: { 
    type: String, 
    default: '' 
  },
  mobilebanner: { 
    type: String, 
    default: '' 
  },
  alt: { 
    type: String, 
    default: '' 
  },
  bannerMetadata: {
    uploadedAt: { type: Date, default: null },
    filename: { type: String, default: '' },
    originalName: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  mobilebannerMetadata: {
    uploadedAt: { type: Date, default: null },
    filename: { type: String, default: '' },
    originalName: { type: String, default: '' },
    size: { type: Number, default: 0 }
  }
}, { _id: false }); // Disable _id for subdocuments

const bannerSchema = new mongoose.Schema({
  // Main banner sections with default values
  homepageBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  aboutUs: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  commercialBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  plotBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  residentialBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  contactBanners: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  careerBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  ourTeamBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  termsConditionsBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  privacyPolicyBanner: { 
    type: bannerSectionSchema, 
    default: () => ({}) 
  },
  
  documentId: { 
    type: String, 
    default: 'main-banners', 
    unique: true 
  }
}, { 
  timestamps: true,
  versionKey: '__v',
  // This ensures all schema fields are included even if empty
  minimize: false
});

// Pre-save hook to ensure all sections exist
bannerSchema.pre('save', function(next) {
  const requiredSections = [
    'homepageBanner', 'aboutUs', 'commercialBanner', 'plotBanner',
    'residentialBanner', 'contactBanners', 'careerBanner', 'ourTeamBanner',
    'termsConditionsBanner', 'privacyPolicyBanner'
  ];
  
  requiredSections.forEach(section => {
    if (!this[section]) {
      this[section] = {};
    }
  });
  
  next();
});

bannerSchema.index({ documentId: 1 });

module.exports = mongoose.model('Banner', bannerSchema);