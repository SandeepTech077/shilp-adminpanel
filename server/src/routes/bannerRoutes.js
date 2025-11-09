const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// configure multer storage to place files under uploads/banner/<type> or uploads/banner/sidebar/<key>
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			const type = req.params.type || (req.body && req.body.type) || 'others';
			let dest = uploadDir;
			// place banner related uploads under uploads/banner/<type>
			if (type === 'sidebar') {
				const key = req.body.key || (req.query && req.query.key) || 'general';
				dest = path.join(uploadDir, 'banner', 'sidebar', String(key));
			} else {
				dest = path.join(uploadDir, 'banner', String(type));
			}
			// ensure directory exists
			fs.mkdirSync(dest, { recursive: true });
			cb(null, dest);
		} catch (err) {
			cb(err);
		}
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname) || '';
		const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
		cb(null, name);
	},
});

const upload = multer({ storage });

// Get all banners
router.get('/', bannerController.getBanners);

// Add/update banner image
router.post('/:type', (req, res, next) => {
	if (['homepageBanner','aboutUs','commercialBanner','plotBanner','residentialBanner','contactBanners','careerBanner','ourTeamBanner','termsConditionsBanner','privacyPolicyBanner'].includes(req.params.type)) {
		upload.array('image')(req, res, next);
	} else {
		upload.single('image')(req, res, next);
	}
}, bannerController.addOrUpdateBanner);

// Delete banner image (key optional for non-sidebar sections)
router.delete('/:type/:key?/:index?', bannerController.deleteBannerImage);

module.exports = router;
