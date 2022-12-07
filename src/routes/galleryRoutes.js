const express = require('express');
const { addGallery, getAllGallery, getGalleryById, removeGallery } = require('../controllers/GalleryController/galleryController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getAllGallery);
router.get('/:id', getGalleryById);

router.use(authentication);
router.use(adminAuthorization);
router.post('/create', uploadFile('image'), addGallery);
router.delete('/delete/:id', removeGallery);

module.exports = router;
