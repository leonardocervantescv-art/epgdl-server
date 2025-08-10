// backend/routes/banner.routes.js

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const bannerController = require('../controllers/banner.controller');

// Configuración de Multer para que guarde en "public/uploads/banners"
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/banners'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Subir o actualizar un banner (por slug en lugar de por id_contenido)
router.post('/upload', upload.single('banner'), bannerController.uploadBannerBySlug);

// Obtener banner por ID de contenido
router.get('/:id_contenido', bannerController.getBannerByContenido);

// Obtener banner por slug
router.get('/slug/:slug', bannerController.getBannerBySlug);


router.delete('/slug/:slug', bannerController.deleteBannerBySlug);

module.exports = router;


