const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes')
const userRoutes = require('./userRoutes')
const teacherRoutes = require('./teacherRoutes')
const galleryRoutes = require('./galleryRoutes')

router.get('/', (req, res) => {
  res.send('Routes Connected');
})

router.use('/admin', adminRoutes);
router.use('/student', userRoutes);
router.use('/teacher', teacherRoutes);
router.use('/gallery', galleryRoutes);


module.exports = router;
