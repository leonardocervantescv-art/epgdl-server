const express = require('express');
const router = express.Router();
const programasController = require('../controllers/programas.controller');


router.get('/slug/:slug', programasController.getProgramaBySlug);
router.post('/upload', programasController.uploadPrograma);
router.get('/all', programasController.obtenerTodosLosProgramas);
router.get('/:id', programasController.obtenerProgramasPorContenido);
router.post('/', programasController.crearPrograma);
router.put('/:id', programasController.editarPrograma);
router.delete('/:id', programasController.eliminarPrograma);

module.exports = router;