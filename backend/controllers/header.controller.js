const db = require('../db');

exports.obtenerHeader = (req, res) => {
  db.query('SELECT * FROM header WHERE id_header = 1', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el header' });
    res.json(result[0]);
  });
};

exports.actualizarHeader = (req, res) => {
  const { linkFB, linkIG, linkTT, linkLN } = req.body;
  const Logo = req.file ? req.file.filename : null;

  const sql = `
    UPDATE header SET
    ${Logo ? 'Logo = ?, ' : ''} linkFB = ?, linkIG = ?, linkTT = ?, linkLN = ?
    WHERE id_header = 1
  `;

  const params = Logo
    ? [Logo, linkFB, linkIG, linkTT, linkLN]
    : [linkFB, linkIG, linkTT, linkLN];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el header' });
    res.json({ message: 'Header actualizado correctamente' });
  });
};


exports.createHeader = (req, res) => {
  const { linkFB, linkIG, linkTT, linkLN } = req.body;
  const Logo = req.file ? req.file.filename : null;

  const sql = 'INSERT INTO header (Logo, linkFB, linkIG, linkTT, linkLN) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [Logo, linkFB, linkIG, linkTT, linkLN], (err, results) => {
    if (err) {
      console.error('No se pudo crear el header:', err);
      return res.status(500).json({ message: 'No se pudo crear el Header' });
    }

    res.status(200).json({ message: 'Header creado correctamente', id: results.insertId });
  });
};

