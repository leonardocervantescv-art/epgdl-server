const db = require('../db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔧 Define correctamente la variable `storage`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/banners');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 🔧 Y ahora sí puedes usar `storage`
const upload = multer({ storage }).single('banner');

// ✔ Corrige esta función (no toco nada más)
exports.uploadPrograma = (req, res) => {
  upload(req, res, err => {
    if (err) return res.status(500).json({ message: 'Error al subir archivo' });

    const { slug, texto } = req.body;
    const bannerPath = req.file ? `/uploads/banners/${req.file.filename}` : null;

    let queryStr = `UPDATE Programas SET `;
    const values = [];

    if (texto) {
      queryStr += 'Texto = ?, ';
      values.push(texto);
    }

    if (bannerPath) {
      queryStr += 'Banner = ?, ';
      values.push(bannerPath);
    }

    // Quita la última coma si hay datos
    queryStr = queryStr.replace(/, $/, '');
    queryStr += ' WHERE slug = ?';
    values.push(slug);

    db.query(queryStr, values, (err) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar' });
      res.json({ message: 'Programa actualizado correctamente' });
    });
  });
};


// Obtener programas por id_contenido
exports.obtenerProgramasPorContenido = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await query('SELECT * FROM Programas WHERE id_contenido = ?', [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener programas:', error);
    res.status(500).json({ error: 'Error al obtener programas.' });
  }
};



exports.getProgramaBySlug = (req, res) => {
  const { slug } = req.params;
  const sql = 'SELECT * FROM Programas WHERE slug = ?';

  db.query(sql, [slug], (err, result) => {
    if (err) {
      console.error('[getProgramaBySlug] Error de SQL:', err);
      return res.status(500).json({ error: 'Error al obtener el programa por slug' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }

    res.json(result[0]);
  });
};





exports.crearPrograma = async (req, res) => {
  const { Nombre, Descripcion, id_contenido } = req.body;

  // Generar slug automáticamente desde el Nombre Y ES NECESARIO PONERLO PARA QUE FUNCIONE
  const slug = Nombre.toLowerCase()
    .normalize("NFD")                   // Quitar acentos
    .replace(/[\u0300-\u036f]/g, "")   // Eliminar marcas diacríticas
    .replace(/[^a-z0-9]+/g, "-")       // Reemplazar no alfanuméricos por guiones
    .replace(/^-+|-+$/g, "");          // Quitar guiones al inicio/final

  try {
    await query(
      'INSERT INTO Programas (Nombre, Descripcion, id_contenido, slug) VALUES (?, ?, ?, ?)',
      [Nombre, Descripcion, id_contenido, slug]
    );
    res.status(201).json({ message: 'Programa creado correctamente', slug });
  } catch (error) {
    console.error('Error al crear programa:', error);
    res.status(500).json({ error: 'Error al crear programa' });
  }
};


// Editar programa
exports.editarPrograma = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, slug } = req.body; 
  try {
    await query(
      'UPDATE Programas SET Nombre = ?, Descripcion = ?, slug = ? WHERE id_programas = ?',
      [Nombre, Descripcion, slug, id]
    );
    res.json({ message: 'Programa actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar programa:', error);
    res.status(500).json({ error: 'Error al editar programa' });
  }
};

// Eliminar programa
exports.eliminarPrograma = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM Programas WHERE id_programas = ?', [id]);
    res.json({ message: 'Programa eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar programa:', error);
    res.status(500).json({ error: 'Error al eliminar programa' });
  }
};




// Obtener todos los programas (usado en AdminDetallesProgramas)
exports.obtenerTodosLosProgramas = async (req, res) => {
  try {
    const rows = await query('select c.Titulo, p.Nombre, p.slug from Contenido c inner join Programas p on c.id_contenido=p.id_contenido');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener todos los programas:', error);
    res.status(500).json({ error: 'Error al obtener los programas.' });
  }
};

exports.getPorSeccion = (req, res) => {
  const sql = 'select  * from contenido where id_secciones = 2';
  db.query(sql, (err, result) => {
    if(err) {
      console.error('No se pudieron obtener los programas')
      return res.status(500).json({ message: 'No se obtuvieron los programas'})
    }
    res.json(result);
  });
};
