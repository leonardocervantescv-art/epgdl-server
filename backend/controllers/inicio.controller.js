const db = require('../db');
const fs = require('fs');
const path = require('path');

exports.getInicio = (req, res) => {
  db.query('SELECT * FROM Inicio', (error, results) => {
    if (error) {
      console.error('Error al obtener datos de Inicio:', error);
      return res.status(500).json({ message: 'Error al obtener los datos de Inicio', error });
    }
    res.json(results);
  });
};

exports.updateInicio = (req, res) => {
  const { id } = req.params;
  const { Texto } = req.body;
  let videoURL = null;

  if (req.file) {
    videoURL = `/uploads/${req.file.filename}`;
  }

  db.query('SELECT * FROM Inicio WHERE id_inicio = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al buscar registro', err });
    if (results.length === 0) return res.status(404).json({ message: 'Registro no encontrado' });

    const oldVideo = results[0].Video;
    if (videoURL && oldVideo) {
      const oldVideoPath = path.join(__dirname, '..', 'public', oldVideo);
      if (fs.existsSync(oldVideoPath)) fs.unlinkSync(oldVideoPath);
    }

    const finalVideo = videoURL || oldVideo;

    db.query(
      'UPDATE Inicio SET Texto = ?, Video = ? WHERE id_inicio = ?',
      [Texto, finalVideo, id],
      (error) => {
        if (error) return res.status(500).json({ message: 'Error al actualizar', error });
        res.json({ message: 'Inicio actualizado correctamente' });
      }
    );
  });
};

//PARA GUARDAR POR PRIMERA VEZ
exports.videoInicio = (req, res) => {
  const { Texto } = req.body;
  let videoPath = null;

  if (req.file) {
    videoPath = `/uploads/${req.file.filename}`;
  }

  const sql = 'INSERT INTO Inicio (Texto, Video) VALUES (?, ?)';
  db.query(sql, [Texto, videoPath], (err, results) => {
    if (err) {
      console.error('No se pudo guardar el video o el texto', err);
      return res.status(500).json({ message: 'No se pudo guardar el video o el texto' });
    }
    res.json({ message: 'Inicio guardado correctamente', results });
  });
};
