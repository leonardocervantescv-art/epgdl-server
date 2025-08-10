// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/panel', verifyToken, (req, res) => {
  res.json({ message: 'Acceso permitido al panel administrativo' });
});

module.exports = router;
