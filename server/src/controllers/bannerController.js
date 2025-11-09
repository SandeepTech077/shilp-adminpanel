const bannerService = require('../services/bannerService');

exports.getBanners = async (req, res) => {
  try {
    const banners = await bannerService.getBanners();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addOrUpdateBanner = async (req, res) => {
  const { type } = req.params;
  const files = req.files || (req.file ? [req.file] : []);
  try {
    const banners = await bannerService.addOrUpdateBanner(type, files, req.body);
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBannerImage = async (req, res) => {
  const { type, key, index } = req.params;
  try {
    const banners = await bannerService.deleteBannerImage(type, key, index);
    if (!banners) return res.status(404).json({ error: 'Not found' });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
