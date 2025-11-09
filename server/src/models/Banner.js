const mongoose = require('mongoose');

const bannerImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, required: true }
});

const bannerSectionSchema = [bannerImageSchema];

const bannerSchema = new mongoose.Schema({
  homepageBanner: bannerSectionSchema,
  aboutUs: bannerSectionSchema,
  commercialBanner: bannerSectionSchema,
  plotBanner: bannerSectionSchema,
  residentialBanner: bannerSectionSchema,
  contactBanners: bannerSectionSchema,
  careerBanner: bannerSectionSchema,
  ourTeamBanner: bannerSectionSchema,
  termsConditionsBanner: bannerSectionSchema,
  privacyPolicyBanner: bannerSectionSchema,
  sidebar: {
    commercial: [bannerImageSchema],
    residential: [bannerImageSchema],
    plots: [bannerImageSchema]
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
