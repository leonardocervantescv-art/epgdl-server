const db = require('../db');
const fs = require('fs');
const path = require('path');

exports.getImagenes = (req, res) => {
  db.query('SELECT * FROM InicioImagenes', (error, results) => {
    if (error) return res.status(500).json({ message: 'Error al obtener imágenes', error });
    res.json(results);
  });
};

exports.createImagen = (req, res) => {
  const { Alt, Posicion, Enlace, id_inicio } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No se subió ninguna imagen' });

  const Imagen = `/uploads/${file.filename}`;
  db.query(
    'INSERT INTO InicioImagenes (Imagen, Posicion, Alt, Enlace, id_inicio) VALUES (?, ?, ?, ?, ?)',
    [Imagen, Posicion, Alt, Enlace, id_inicio],
    (error) => {
      if (error) return res.status(500).json({ message: 'Error al crear imagen', error });
      res.json({ message: 'Imagen creada correctamente' });
    }
  );
};

exports.deleteImagen = (req, res) => {
  const { id } = req.params;

  db.query('SELECT Imagen FROM InicioImagenes WHERE id_imagen = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al buscar imagen', err });
    if (results.length === 0) return res.status(404).json({ message: 'Imagen no encontrada' });

    const imagePath = path.join(__dirname, '..', 'public', results[0].Imagen);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    db.query('DELETE FROM InicioImagenes WHERE id_imagen = ?', [id], (error) => {
      if (error) return res.status(500).json({ message: 'Error al eliminar imagen', error });
      res.json({ message: 'Imagen eliminada correctamente' });
    });
  });
};
