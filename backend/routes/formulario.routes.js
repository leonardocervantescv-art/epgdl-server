const express = require('express');
const router = express.Router();
const formularioController = require('../controllers/formulario.controller');

router.get('/contenidos', formularioController.getContenidos);
router.get('/programas/:id_contenido', formularioController.getProgramasByContenido);
router.post('/enviar', formularioController.enviarFormulario);

module.exports = router;
