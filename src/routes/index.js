const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const teacherRoutes = require('./teacherRoutes');
const galleryRoutes = require('./galleryRoutes');
const articleRoutes = require('./articleRoutes');
const testimonyRoutes = require('./testimonyRoutes');
const certificateRoutes = require('./certificateRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/admin', adminRoutes);
router.use('/student', userRoutes);
router.use('/teacher', teacherRoutes);
router.use('/gallery', galleryRoutes);
router.use('/article', articleRoutes);
router.use('/testimony', testimonyRoutes);
router.use('/certificate', certificateRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
