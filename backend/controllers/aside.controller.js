const db = require("../db");

// Obtener todos los eventos (ordenados ascendente por Fecha)
exports.getAllEventos = (req, res) => {
  const sql = `SELECT id_evento, Fecha, Descripcion, Url, Duracion, Clasificacion
               FROM EventosAside
               ORDER BY Fecha`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener sólo los N primeros eventos (por query param ?limit=3)
exports.getLimitEventos = (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const sql = `SELECT id_evento, Fecha, Descripcion, Url, Duracion
               FROM EventosAside
               where Clasificacion = 'Posgrados' or Clasificacion = 'Diplomados'
               ORDER BY Fecha
               LIMIT ?`;
  db.query(sql, [limit], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// CREATE
exports.createEvento = (req, res) => {
  const { Fecha, Descripcion, Url, Duracion, Clasificacion } = req.body;
  const sql = `
    INSERT INTO EventosAside (Fecha, Descripcion, Url, Duracion, Clasificacion)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [Fecha, Descripcion, Url, Duracion, Clasificacion],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id_evento: result.insertId,
        Fecha,
        Descripcion,
        Url,
        Duracion,
        Clasificacion,
      });
    }
  );
};

// UPDATE
exports.updateEvento = (req, res) => {
  const { id } = req.params;
  const { Fecha, Descripcion, Url, Duracion, Clasificacion } = req.body;
  const sql = `
    UPDATE EventosAside
    SET Fecha=?, Descripcion=?, Url=?, Duracion=?, Clasificacion=?
    WHERE id_evento=?
  `;
  db.query(
    sql,
    [Fecha, Descripcion, Url, Duracion, Clasificacion, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id_evento: id,
        Fecha,
        Descripcion,
        Url,
        Duracion,
        Clasificacion,
      });
    }
  );
};

exports.deleteEvento = (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM EventosAside WHERE id_evento=?`, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
};

exports.getContenidoProgram = (req, res) => {
  const sql = `select c.Titulo, p.nombre
              from contenido c inner join Programas p on c.id_contenido = p.id_contenido
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
  db.query("SELECT * FROM Horarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.crearContacto = (req, res) => {
  const { Horario, Sabado, Informes, Diplomados } = req.body;
  db.query(
    "INSERT INTO Horarios (Horario, Sabado, Informes, Diplomados) VALUES (?, ?, ?, ?)",
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
