const express = require('express');
const { addGallery, getAllGallery, getGalleryById } = require('../controllers/GalleryController/galleryController');
const { uploadFile } = require('../middlewares/uploadFile');
const router = express.Router();

router.get('/', getAllGallery);
router.get('/:id', getGalleryById);
router.post('/create', uploadFile('image'), addGallery);

module.exports = router;
