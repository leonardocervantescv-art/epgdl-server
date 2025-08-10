// backend/controllers/contenido.controller.js

const db = require('../db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

exports.crearContenido = (req, res) => {
  const { Titulo, id_secciones, slug } = req.body;

  if (!Titulo || !id_secciones) {
    return res.status(400).json({ error: 'Titulo e id_secciones son obligatorios.' });
  }

  const sql = `INSERT INTO Contenido (Titulo, id_secciones, slug) VALUES (?, ?, ?)`;
  db.query(sql, [Titulo, id_secciones, slug], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Contenido creado', id: result.insertId });
  });
};


exports.editarContenido = (req, res) => {
  const { id } = req.params;
  const { Titulo } = req.body;

  if (!Titulo) {
    return res.status(400).json({ error: 'El Titulo es obligatorio.' });
  }

  const sql = `UPDATE Contenido SET Titulo = ? WHERE id_contenido = ?`;
  db.query(sql, [Titulo, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Contenido actualizado' });
  });
};

exports.eliminarContenido = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Contenido WHERE id_contenido = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Contenido eliminado' });
  });
};


 exports.obtenerContenidoPorSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const rows = await query(
      'SELECT * FROM Contenido WHERE slug = ?',
      [slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Página no encontrada.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('[obtenerContenidoPorSlug] ', error);
    res.status(500).json({ message: 'Error al obtener el contenido.', error: error.message });
  }
};



exports.obtenerTodosLosContenidos = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Contenido');
    res.json(rows);
  } catch (error) {
    console.error('[obtenerTodosLosContenidos] ', error);
    res.status(500).json({ message: 'Error al obtener contenidos.', error: error.message });
  }
};

// contenido.controller.js
function generarSlug(texto) {
  return texto
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

exports.updateContenido = async (req, res) => {
  const { id } = req.params;
  const { Titulo, id_secciones } = req.body;

  if (!Titulo || !id_secciones) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  const nuevoSlug = generarSlug(Titulo);

  try {
    await query(
      'UPDATE Contenido SET Titulo = ?, slug = ?, id_secciones = ? WHERE id_contenido = ?',
      [Titulo, nuevoSlug, id_secciones, id]
    );
    res.json({ message: 'Contenido actualizado correctamente.' });
  } catch (err) {
    console.error('Error al actualizar contenido:', err);
    res.status(500).json({ error: 'Error al actualizar el contenido.' });
  }
};


//Contenidos Filtrados para Administrador de Banners Y Contenido
exports.getContenidosFiltrados = (req, res) => {
  const sql = `select * from Contenido where id_secciones != 2`;
  db.query(sql, (err, rows) => {
    if(err) {
      console.error('No se obtuvieron contenidos filtrados: ', err)
      return res.status(500).json({ message: 'No se obtuvieron programas filtrados'})
    }
    res.json(rows)
  });
};

//Contenido Filtrado para Administrador de Programas
exports.getProgramasFiltrados = (req, res) => {
  const sql = 'select * from Contenido where id_secciones = 2';
  db.query(sql, (err, rows) => {
    if(err) {
      console.error('No se obtieron programas filtrados', err)
      return res.status(500).json({ message: 'No se obtuvieron programas filtrados'})
    }
    res.json(rows)
  });
};

//PARA EL BOTON DE EVENTOS Y HORARIOS
// controllers/contenido.controller.js
// controllers/contenido.controller.js
exports.getContenidoByExtra = (req, res) => {
  const { valor } = req.params;
  const sql = `
    SELECT slug, extra
    FROM Contenido
    WHERE extra = ?
    LIMIT 1
  `;
  db.query(sql, [valor], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]); // { slug: 'enterate-o-eventos', extra: 'evento' }
  });
};


