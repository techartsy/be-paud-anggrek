const express = require('express');
const { addArticle, getAllCertificate, getCertificateById, removeCertificate } = require('../controllers/CertificateController/certificateController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getAllCertificate);
router.get('/:id', getCertificateById);
// router.get('/:id', getArticleById);

// router.use(authentication);
// router.use(adminAuthorization);
// router.post('/create', uploadFile('image'), addArticle);
router.delete('/delete/:id', removeCertificate);

module.exports = router;
