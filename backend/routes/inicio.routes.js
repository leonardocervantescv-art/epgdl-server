const express = require('express');
const router = express.Router();
const controller = require('../controllers/inicio.controller');
const upload = require('../public/uploads/multer');

// Obtener datos
router.get('/', controller.getInicio);

// Insertar por primera vez (POST)
router.post('/', upload.single('Video'), controller.videoInicio);

// Actualizar existente (PUT)
router.put('/:id', upload.single('Video'), controller.updateInicio);

module.exports = router;
