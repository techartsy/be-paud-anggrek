const express = require('express');
const { registerStudent, login, getStudents, getStudentById, removeStudent } = require('../controllers/UserController/userController');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);

router.use(authentication);
router.get('/', getStudents);
router.get('/:id', getStudentById);

router.use(adminAuthorization);
router.delete('/delete/:id', removeStudent);

module.exports = router;
