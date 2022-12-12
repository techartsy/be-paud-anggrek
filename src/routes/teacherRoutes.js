const express = require('express');
const { registerTeacher, login, getTeacherById, getTeachers, uploadCertificate, removeTeacher, getTeacherProfile } = require('../controllers/TeacherController/teacherController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.post('/register', uploadFile('image'), registerTeacher);
router.post('/login', login);
router.get('/', getTeachers);

router.use(authentication);
router.get('/get-profile', getTeacherProfile);
router.get('/:id', getTeacherById);
router.post('/upload-certificate/:id', uploadFile('file'), uploadCertificate)

router.use(adminAuthorization);
router.delete('/delete/:id', removeTeacher);

module.exports = router;
