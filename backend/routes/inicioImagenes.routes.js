const express = require('express');
const router = express.Router();
const controller = require('../controllers/inicioImagenes.controller');
const upload = require('../public/uploads/multer');

router.get('/', controller.getImagenes);
router.post('/', upload.single('Imagen'), controller.createImagen);
router.delete('/:id', controller.deleteImagen);

module.exports = router;
