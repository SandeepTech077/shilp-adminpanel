const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

const getBanners = async () => {
  return await Banner.findOne();
};

const addOrUpdateBanner = async (type, files, body) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  let banners = await Banner.findOne();
  if (!banners) banners = new Banner({});
  if (['sidebar'].includes(type)) {
    const key = body.key;
    if (!banners.sidebar[key]) banners.sidebar[key] = [];
    files.forEach(file => {
      // store full path under uploads in the URL so nested folders are preserved
      const filePath = file && file.path ? file.path.replace(/\\/g, '/') : '';
      const imageUrl = filePath ? `${baseUrl}/${filePath}` : '';
      banners.sidebar[key].push({ image: imageUrl, alt: body.alt });
    });
  } else {
    if (!banners[type]) banners[type] = [];
    files.forEach(file => {
      const filePath = file && file.path ? file.path.replace(/\\/g, '/') : '';
      const imageUrl = filePath ? `${baseUrl}/${filePath}` : '';
      banners[type].push({ image: imageUrl, alt: body.alt });
    });
  }
  await banners.save();
  return banners;
};

const deleteBannerImage = async (type, key, index) => {
  let banners = await Banner.findOne();
  if (!banners) return null;
  let imagePath;
  if (type === 'sidebar') {
    // key = category, index = index
    if (banners.sidebar[key] && banners.sidebar[key][index]) {
      imagePath = banners.sidebar[key][index].image;
      banners.sidebar[key].splice(index, 1);
    }
  } else {
    // For non-sidebar, support arrays of images. key may be undefined and index may be in key position.
    let idx = undefined;
    if (typeof index !== 'undefined') {
      idx = Number(index);
    } else if (typeof key !== 'undefined' && !isNaN(Number(key))) {
      idx = Number(key);
    }
    if (Array.isArray(banners[type]) && typeof idx === 'number') {
      if (banners[type][idx]) {
        imagePath = banners[type][idx].image;
        banners[type].splice(idx, 1);
      }
    }
  }
  if (imagePath) {
    // imagePath expected to be full URL like http://host/uploads/..., find the /uploads/ segment
    try {
      let rel = imagePath;
      const uploadsIdx = imagePath.indexOf('/uploads/');
      if (uploadsIdx !== -1) {
        rel = imagePath.substring(uploadsIdx + 1); // remove leading slash
      }
      // join with server root upload dir (uploads/...)
      const filePath = path.join(process.cwd(), rel.replace(/\//g, path.sep));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Error deleting file from disk', err);
    }
  }
  await banners.save();
  return banners;
};

module.exports = {
  getBanners,
  addOrUpdateBanner,
  deleteBannerImage,
};