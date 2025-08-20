// PARA ENCRIPTAR LAS CONTRASEÑAS 

const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'epdeMexico';

exports.login = (req, res) => {
  const { Usuario, Contrasena } = req.body;

  if (!Usuario || !Contrasena) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const query = 'SELECT * FROM usuarios WHERE Usuario = ?';
  db.query(query, [Usuario], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error del servidor.' });
    if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado.' });

    const usuarios = results[0];

    const match = await bcrypt.compare(Contrasena, usuarios.Contrasena);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta.' });

    // Crear token JWT
    const token = jwt.sign(
      { id: usuarios.id_usuarios, rol: usuarios.Rol, nombre: usuarios.Nombre },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuarios: {
        id: usuarios.id_usuarios,
        nombre: usuarios.Nombre,
        rol: usuarios.Rol,
        Usuario: usuarios.Usuario,
      }
    });
  });
};


exports.registrar = async (req, res) => {
  const { Nombre, Usuario, Contrasena, Rol } = req.body;

  if (!Nombre || !Usuario || !Contrasena || !Rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const hash = await bcrypt.hash(Contrasena, 10);
    const sql = 'INSERT INTO usuarios (Nombre, Usuario, Contrasena, Rol) VALUES (?, ?, ?, ?)';

    db.query(sql, [Nombre, Usuario, hash, Rol], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'El usuario ya existe.' });
        }
        return res.status(500).json({ message: 'Error del servidor.' });
      }
      res.status(201).json({ message: 'Usuario registrado correctamente.' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario.' });
  }
};

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
  const query = 'SELECT id_usuarios, Nombre, Usuario, Rol FROM usuarios';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios' });
    res.json(results);
  });
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id_usuarios = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar usuario' });
    res.json({ message: 'Usuario eliminado correctamente' });
  });
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Usuario, Contrasena, Rol } = req.body;

  if (!Nombre || !Usuario || !Rol) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    let query = '';
    let params = [];

    if (Contrasena) {
      const hashed = await bcrypt.hash(Contrasena, 10);
      query = 'UPDATE usuarios SET Nombre = ?, Usuario = ?, Contrasena = ?, Rol = ? WHERE id_usuarios = ?';
      params = [Nombre, Usuario, hashed, Rol, id];
    } else {
      query = 'UPDATE usuarios SET Nombre = ?, Usuario = ?, Rol = ? WHERE id_usuarios = ?';
      params = [Nombre, Usuario, Rol, id];
    }

    db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar usuario' });
      res.json({ message: 'Usuario actualizado correctamente' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al encriptar contraseña' });
  }
};