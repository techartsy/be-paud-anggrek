const express = require('express');
const { createTestimony, getAllTestimony, getTestimonyById, removeTestimony } = require('../controllers/TestimonyController/testimonyController');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getAllTestimony);
router.get('/:id', getTestimonyById);

router.use(authentication);
router.post('/create', createTestimony);

router.use(adminAuthorization);
router.delete('/delete/:id', removeTestimony);

module.exports = router;
