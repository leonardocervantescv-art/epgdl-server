const express = require('express');
const router = express.Router();
const seccionesController = require('../controllers/secciones.controller');

// Obtener todas las secciones
router.get('/', seccionesController.obtenerSecciones);  //ESTA SI

// Obtener secciones con contenido
router.get('/con-contenido', seccionesController.obtenerSeccionesConContenido); //ESTA TAMBIEN

// Obtener una sección por ID
router.get('/:id', seccionesController.obtenerSeccionPorId); // ESTA TAMBIEN

// Crear una nueva sección
router.post('/', seccionesController.crearSeccion);

// Actualizar sección por ID
router.put('/:id', seccionesController.actualizarSeccion);

// Eliminar sección por ID
router.delete('/:id', seccionesController.eliminarSeccion);


module.exports = router;
