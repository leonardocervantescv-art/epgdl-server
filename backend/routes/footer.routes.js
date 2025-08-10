
const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footer.controller');
const upload = require('../public/uploads/multer');

// Cargar múltiples imágenes (Logo y Mapa)
const multiUpload = upload.fields([
  { name: 'Logo', maxCount: 1 },
  { name: 'Mapa', maxCount: 1 },
  { name: 'telImagen', maxCount: 1 },
]);

router.get('/', footerController.getFooter);
router.post('/', multiUpload, footerController.createFooter);
router.put('/:id', multiUpload, footerController.updateFooter);
router.delete('/:id', footerController.deleteFooter);

module.exports = router;
