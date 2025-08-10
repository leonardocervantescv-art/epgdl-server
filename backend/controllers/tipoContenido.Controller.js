/* const db = require('../db');

exports.obtenerTipos = (req, res) => {
  db.query('SELECT * FROM tipo_Contenido', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.crearTipo = (req, res) => {
  const { Nombre } = req.body;
  db.query('INSERT INTO tipo_Contenido (Nombre) VALUES (?)', [Nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Tipo de contenido creado', id: result.insertId });
  });
};

exports.eliminarTipo = (req, res) => {
  db.query('DELETE FROM tipo_Contenido WHERE id_tipo=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tipo de contenido eliminado' });
  });
};
 */