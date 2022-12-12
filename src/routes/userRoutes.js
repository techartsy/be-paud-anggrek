const express = require('express');
const {
  registerStudent,
  login,
  getStudents,
  getProfile,
  getStudentById,
  removeStudent,
  uploadDocs,
  profileFulfillment } = require('../controllers/UserController/userController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);

router.use(authentication);
router.get('/', getStudents);
router.post('/upload-docs', uploadFile('image', 'docs'), uploadDocs);
router.post('/profile-fulfillment', uploadFile('foto_murid'), profileFulfillment);
router.get('/get-profile', getProfile);
router.get('/:id', getStudentById);

router.use(adminAuthorization);
router.delete('/delete/:id', removeStudent);

module.exports = router;
