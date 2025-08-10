const express = require('express');
const router = express.Router();
const headerController = require('../controllers/header.controller');
const multer = require('../public/uploads/multer');

router.get('/', headerController.obtenerHeader);
router.put('/:id', multer.single('Logo'), headerController.actualizarHeader);

module.exports = router;