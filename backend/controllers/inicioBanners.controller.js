const db = require('../db');
const fs = require('fs');
const path = require('path');

exports.getBanners = (req, res) => {
  db.query('SELECT * FROM iniciobanners', (error, results) => {
    if (error) return res.status(500).json({ message: 'Error al obtener banners', error });
    res.json(results);
  });
};

exports.createBanner = (req, res) => {
  const { Enlace, Alt, Posicion, id_inicio } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No se subió ningún banner' });

  const Banner = `/uploads/${file.filename}`;
  db.query(
    'INSERT INTO iniciobanners (Banner, Enlace, Alt, Posicion, id_inicio) VALUES (?, ?, ?, ?, ?)',
    [Banner, Enlace, Alt, Posicion, id_inicio],
    (error) => {
      if (error) return res.status(500).json({ message: 'Error al crear banner', error });
      res.json({ message: 'Banner creado correctamente' });
    }
  );
};

exports.deleteBanner = (req, res) => {
  const { id } = req.params;

  db.query('SELECT Banner FROM iniciobanners WHERE id_banner = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al buscar banner', err });
    if (results.length === 0) return res.status(404).json({ message: 'Banner no encontrado' });

    const bannerPath = path.join(__dirname, '..', 'public', results[0].Banner);
    if (fs.existsSync(bannerPath)) fs.unlinkSync(bannerPath);

    db.query('DELETE FROM iniciobanners WHERE id_banner = ?', [id], (error) => {
      if (error) return res.status(500).json({ message: 'Error al eliminar banner', error });
      res.json({ message: 'Banner eliminado correctamente' });
    });
  });
};
