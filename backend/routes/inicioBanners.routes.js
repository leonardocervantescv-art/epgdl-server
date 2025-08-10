const express = require('express');
const router = express.Router();
const controller = require('../controllers/inicioBanners.controller');
const upload = require('../public/uploads/multer');

router.get('/', controller.getBanners);
router.post('/', upload.single('Banner'), controller.createBanner);
router.delete('/:id', controller.deleteBanner);

module.exports = router;
