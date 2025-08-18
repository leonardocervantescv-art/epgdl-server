const db = require("../db");

// Obtener todos los eventos (ordenados ascendente por Fecha)
exports.getAllEventos = (req, res) => {
  const sql = `SELECT id_evento, Fecha, Descripcion, Url, Duracion, Clasificacion, otro
               FROM eventosaside
               ORDER BY Fecha`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener sólo los N primeros eventos (por query param ?limit=3)
// Ahora filtra los eventos con Clasificacion 'Posgrados' o 'Diplomados'
// y donde el campo 'otro' sea NULL o 0.
exports.getLimitEventos = (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const sql = `
    SELECT id_evento, Fecha, Descripcion, Url, Duracion, Clasificacion
    FROM eventosaside
    WHERE (Clasificacion = 'Posgrados' OR Clasificacion = 'Diplomados')
      AND (otro IS NULL OR otro = 0)
    ORDER BY Fecha
    LIMIT ?;
  `;
  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("Error al obtener eventos limitados:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// CREATE
exports.createEvento = (req, res) => {
  const { Fecha, Descripcion, Url, Duracion, Clasificacion, otro } = req.body;
  const sql = `
    INSERT INTO eventosaside (Fecha, Descripcion, Url, Duracion, Clasificacion, otro)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [Fecha, Descripcion, Url, Duracion, Clasificacion, otro],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id_evento: result.insertId,
        Fecha,
        Descripcion,
        Url,
        Duracion,
        Clasificacion,
        otro,
      });
    }
  );
};

// UPDATE
exports.updateEvento = (req, res) => {
  const { id } = req.params;
  const { Fecha, Descripcion, Url, Duracion, Clasificacion, otro } = req.body;
  const sql = `
    UPDATE eventosaside
    SET Fecha=?, Descripcion=?, Url=?, Duracion=?, Clasificacion=?, otro=?
    WHERE id_evento=?
  `;
  db.query(
    sql,
    [Fecha, Descripcion, Url, Duracion, Clasificacion, otro, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id_evento: id,
        Fecha,
        Descripcion,
        Url,
        Duracion,
        Clasificacion,
        otro,
      });
    }
  );
};

exports.deleteEvento = (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM eventosaside WHERE id_evento=?`, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
};


exports.getContenidoProgram = (req, res) => {
  const sql = `select c.Titulo, p.nombre
               from contenido c inner join programas p on c.id_contenido = p.id_contenido
               where c.id_secciones = 2;`;
               
  db.query(sql, (err, results) => {
    if (err) {
      console.error("No se pudieron obtener los programas", err);
      return res
        .status(500)
        .json({ message: "No se pudieron obtener los programas" });
    }
    res.json(results);
  });
};




// CONTACTO
exports.obtenerContacto = (req, res) => {
  db.query("SELECT * FROM horarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.crearContacto = (req, res) => {
  const { Horario, Sabado, Informes, Diplomados } = req.body;
  db.query(
    "INSERT INTO horarios (Horario, Sabado, Informes, Diplomados) VALUES (?, ?, ?, ?)",
    [Horario, Sabado, Informes, Diplomados],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Contacto creado", id: result.insertId });
    }
  );
};

exports.actualizarContacto = (req, res) => {
  const { id } = req.params;
  const { Horario, Sabado, Informes, Diplomados } = req.body;
  db.query(
    "UPDATE Horarios SET Horario=?, Sabado=?, Informes=?, Diplomados=? WHERE id_horarios=?",
    [Horario, Sabado, Informes, Diplomados, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Contacto actualizado" });
    }
  );
};

exports.eliminarContacto = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Horarios WHERE id_horarios=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Contacto eliminado" });
  });
};
