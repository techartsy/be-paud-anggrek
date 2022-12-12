const express = require('express');
const { getAllCertificate, getCertificateById, removeCertificate } = require('../controllers/CertificateController/certificateController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getAllCertificate);
router.get('/:id', getCertificateById);

router.use(authentication);
router.use(adminAuthorization);
router.delete('/delete/:id', removeCertificate);

module.exports = router;
