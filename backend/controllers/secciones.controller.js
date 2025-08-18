//Backend del panel del header

const db = require('../db');

exports.obtenerSecciones = (req, res) => {
  db.query('SELECT * FROM Secciones', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.obtenerSeccionPorId = (req, res) => {
  db.query('SELECT * FROM Secciones WHERE id_secciones = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

exports.crearSeccion = (req, res) => {
  const { Nombre } = req.body;
  db.query('INSERT INTO Secciones (Nombre) VALUES (?)', [Nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Sección creada', id: result.insertId });
  });
};

exports.actualizarSeccion = (req, res) => {
  const { Nombre } = req.body;
  db.query('UPDATE Secciones SET Nombre=? WHERE id_secciones=?', [Nombre, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Sección actualizada' });
  });
};

exports.eliminarSeccion = (req, res) => {
  db.query('DELETE FROM Secciones WHERE id_secciones=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Sección eliminada' });
  });
};

// secciones.controller.js
exports.obtenerSeccionesConContenido = (req, res) => {
  const sql = `
    SELECT s.id_secciones, s.Nombre, s.Activo as seccion_activa,
           c.id_contenido, c.Titulo, c.Activo as contenido_activo
    FROM Secciones s
    LEFT JOIN Contenido c ON s.id_secciones = c.id_secciones
    ORDER BY s.id_secciones, c.id_contenido
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener secciones:", err);
      return res.status(500).json({ error: "Error al obtener secciones" });
    }

    const seccionesMap = {};

    results.forEach(row => {
      if (!seccionesMap[row.id_secciones]) {
        seccionesMap[row.id_secciones] = {
          id_secciones: row.id_secciones,
          Nombre: row.Nombre,
          Activo: row.seccion_activa,
          contenido: []
        };
      }

      if (row.id_contenido) {
        seccionesMap[row.id_secciones].contenido.push({
          id_contenido: row.id_contenido,
          Titulo: row.Titulo,
          Activo: row.contenido_activo
        });
      }
    });

    res.json(Object.values(seccionesMap));
  });
};




