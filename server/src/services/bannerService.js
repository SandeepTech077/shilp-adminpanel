const bannerRepository = require('../repositories/bannerRepository');

const getBanners = async () => {
  return await bannerRepository.getBanners();
};

const addOrUpdateBanner = async (type, files, body) => {
  return await bannerRepository.addOrUpdateBanner(type, files, body);
};

const deleteBannerImage = async (type, key, index) => {
  return await bannerRepository.deleteBannerImage(type, key, index);
};

module.exports = {
  getBanners,
  addOrUpdateBanner,
  deleteBannerImage,
};
