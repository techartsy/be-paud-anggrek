const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const teacherRoutes = require('./teacherRoutes');
const galleryRoutes = require('./galleryRoutes');
const articleRoutes = require('./articleRoutes');
const testimonyRoutes = require('./testimonyRoutes');
const certificateRoutes = require('./certificateRoutes');

router.get('/', (req, res) => {
  res.send('Routes Connected');
})

router.use('/admin', adminRoutes);
router.use('/student', userRoutes);
router.use('/teacher', teacherRoutes);
router.use('/gallery', galleryRoutes);
router.use('/article', articleRoutes);
router.use('/testimony', testimonyRoutes);
router.use('/certificate', certificateRoutes);


module.exports = router;
