const express = require('express');
const { registerStudent, login, getStudents, getStudentById } = require('../controllers/UserController/userController');
const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/register', registerStudent);
router.post('/login', login);

module.exports = router;
