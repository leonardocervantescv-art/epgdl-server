const express = require('express');
const router = express.Router();
const bloquesController = require('../controllers/bloques.controller');

router.get('/slug/:slug', bloquesController.obtenerBloquesPorSlug);
router.post('/', bloquesController.crearBloque);
router.put('/:id', bloquesController.editarBloque);
router.delete('/:id', bloquesController.eliminarBloque);

module.exports = router;
