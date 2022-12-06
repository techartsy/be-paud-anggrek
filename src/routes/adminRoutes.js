const express = require('express');
const { createAdmin, login } = require('../controllers/AdminController/adminController');
const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', login);

module.exports = router;
