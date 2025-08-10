const express = require('express');
const router = express.Router();
const asideController = require('../controllers/aside.controller');
const upload = require('../public/uploads/multer');

// EVENTOS
router.get('/eventos/all', asideController.getAllEventos);
router.get('/eventos/', asideController.getLimitEventos);
router.get('/eventos/programa', asideController.getContenidoProgram);
router.post('/eventos', asideController.createEvento)
router.put('/eventos/:id', asideController.updateEvento);
router.delete('/eventos/:id', asideController.deleteEvento);

// CONTACTO
router.get('/contacto', asideController.obtenerContacto);   
router.post('/contacto', asideController.crearContacto);
router.put('/contacto/:id', asideController.actualizarContacto);
router.delete('/contacto/:id', asideController.eliminarContacto);

module.exports = router;

