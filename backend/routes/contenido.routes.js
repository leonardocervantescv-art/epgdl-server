const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenido.controller');

router.get('/slug/:slug', contenidoController.obtenerContenidoPorSlug);

router.get('/', contenidoController.obtenerTodosLosContenidos);
router.get('/filter', contenidoController.getContenidosFiltrados); // 
router.get('/fill', contenidoController.getProgramasFiltrados); // PARA EL ADMINISTRADOR DE LOS PROGRAMAS
router.get('/extra/:valor', contenidoController.getContenidoByExtra); // PARA EL BOTÓN DE EVENTOS Y HORARIOS
router.put("/:id/mover", contenidoController.moverContenido); //PARA MOVER SUBMENÚS DE SECCION    
router.put("/:id/toggle", contenidoController.toggleContenido); // PARA ACTIVAR O DESACTIVAR SUBMENÚS
router.put("/:id/toggle-seccion", contenidoController.toggleSeccion);
    




// Crear nuevo contenido
router.post('/', contenidoController.crearContenido);

// Editar contenido existente
router.put('/:id', contenidoController.updateContenido);
//router.put('/:id', contenidoController.editarContenido);

// Eliminar contenido
router.delete('/:id', contenidoController.eliminarContenido);





module.exports = router;