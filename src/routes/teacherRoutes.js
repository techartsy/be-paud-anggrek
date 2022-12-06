const express = require('express');
const { registerTeacher, login, getTeacherById, getTeachers, uploadCertificate } = require('../controllers/TeacherController/teacherController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.post('/register', uploadFile('image'), registerTeacher);
router.post('/login', login);

router.use(authentication);
router.get('/:id', getTeacherById);
router.post('/upload-certificate/:id', uploadFile('file'), uploadCertificate)

router.use(adminAuthorization);
router.get('/', getTeachers);

module.exports = router;
