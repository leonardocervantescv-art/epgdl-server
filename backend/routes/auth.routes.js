const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/register', authController.registrar);
router.get('/usuarios', authController.getUsuarios);
router.delete('/usuarios/:id', authController.deleteUsuario);
router.put('/usuarios/:id', authController.updateUsuario);




module.exports = router;
