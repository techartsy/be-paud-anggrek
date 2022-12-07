const express = require('express');
const { createAdmin, login, removeAdmin } = require('../controllers/AdminController/adminController');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');

const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', login);

router.use(authentication);
router.use(adminAuthorization);
router.delete('/delete/:id', removeAdmin);

module.exports = router;
