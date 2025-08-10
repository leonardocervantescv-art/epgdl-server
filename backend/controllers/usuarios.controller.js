/* const db = require('../db');

exports.obtenerUsuarios = (req, res) => {
  db.query('SELECT * FROM Usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.obtenerUsuarioPorId = (req, res) => {
  db.query('SELECT * FROM Usuarios WHERE id_usuarios = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

exports.crearUsuario = (req, res) => {
  const { Nombre, Correo, Contrasena, Rol } = req.body;
  const sql = 'INSERT INTO Usuarios (Nombre, Correo, Contrasena, Rol) VALUES (?, ?, ?, ?)';
  db.query(sql, [Nombre, Correo, Contrasena, Rol || 'admin'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Usuario creado', id: result.insertId });
  });
};

exports.actualizarUsuario = (req, res) => {
  const { Nombre, Correo, Contrasena, Rol } = req.body;
  const sql = 'UPDATE Usuarios SET Nombre=?, Correo=?, Contrasena=?, Rol=? WHERE id_usuarios=?';
  db.query(sql, [Nombre, Correo, Contrasena, Rol, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario actualizado' });
  });
};

exports.eliminarUsuario = (req, res) => {
  db.query('DELETE FROM Usuarios WHERE id_usuarios=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
}; */
