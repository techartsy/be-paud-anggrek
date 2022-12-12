const express = require('express');
const { createAssessment, getAllAssessment, getAssessmentById, removeAssessment } = require('../controllers/AssessmentController/assessmentController');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getAllAssessment);
router.get('/:id', getAssessmentById);

router.use(authentication);
router.post('/create/:id', createAssessment);

router.use(adminAuthorization);
router.delete('/delete/:id', removeAssessment);

module.exports = router;
