const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Routes Connected');
})

module.exports = router;
