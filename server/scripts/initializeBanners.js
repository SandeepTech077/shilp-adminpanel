const mongoose = require('mongoose');
const Banner = require('../src/models/Banner');
require('dotenv').config();

const initializeBanners = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shilp-adminpanel');
    console.log('Connected to MongoDB');

    // Check if banner document already exists
    const existingBanner = await Banner.findOne();
    
    if (!existingBanner) {
      // Create initial banner document with empty structure and metadata
      const initialBanner = new Banner({
        documentId: 'main-banners',
        homepageBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        aboutUs: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        commercialBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        plotBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        residentialBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        contactBanners: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        careerBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        ourTeamBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        termsConditionsBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        },
        privacyPolicyBanner: {
          banner: '',
          mobilebanner: '',
          alt: '',
          bannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 },
          mobilebannerMetadata: { uploadedAt: null, filename: '', originalName: '', size: 0 }
        }
      });

      await initialBanner.save();
      console.log('Initial banner document created successfully');
    } else {
      console.log('Banner document already exists');
      
      // Update existing document to ensure all sections are present
      const updateFields = {};
      const sections = [
        'homepageBanner', 'aboutUs', 'commercialBanner', 'plotBanner', 
        'residentialBanner', 'contactBanners', 'careerBanner', 'ourTeamBanner',
        'termsConditionsBanner', 'privacyPolicyBanner'
      ];

      sections.forEach(section => {
        if (!existingBanner[section]) {
          updateFields[section] = {
            banner: '',
            mobilebanner: '',
            alt: ''
          };
        }
      });

      if (Object.keys(updateFields).length > 0) {
        await Banner.updateOne({}, { $set: updateFields });
        console.log('Missing sections added to existing banner document');
      }
    }

    console.log('Banner initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing banners:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeBanners();