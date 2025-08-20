const db = require('../db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

// Obtener bloques por slug de programa
exports.obtenerBloquesPorSlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [programa] = await query('SELECT id_programas FROM programas WHERE slug = ?', [slug]);
    if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });

    const bloques = await query('SELECT * FROM bloquesacademicos WHERE id_programas = ?', [programa.id_programas]);
    res.json(bloques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener bloques' });
  }
};

// Crear bloque
exports.crearBloque = async (req, res) => {
  const { slug, bloque_nombre, contenido } = req.body;

  try {
    // 🔍 Buscar el programa por slug
    const rowsPrograma = await query('SELECT id_programas FROM programas WHERE slug = ?', [slug]);
    if (rowsPrograma.length === 0) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }

    const id_programas = rowsPrograma[0].id_programas;

    // ✅ Insertar el bloque con el id_programas
    await query(
      'INSERT INTO bloquesacademicos (id_programas, bloque_nombre, contenido) VALUES (?, ?, ?)',
      [id_programas, bloque_nombre, contenido]
    );

    res.status(201).json({ message: 'Bloque académico creado correctamente' });
  } catch (error) {
    console.error("❌ Error al crear bloque:", error);
    res.status(500).json({ message: 'Error interno al crear el bloque' });
  }
};


// Editar bloque
exports.editarBloque = async (req, res) => {
  const { id } = req.params;
  const { bloque_nombre, contenido } = req.body;
  try {
    await query(
      'UPDATE bloquesacademicos SET bloque_nombre = ?, contenido = ? WHERE id_bloque = ?',
      [bloque_nombre, contenido, id]
    );
    res.json({ message: 'Bloque actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al editar bloque' });
  }
};

// Eliminar bloque
exports.eliminarBloque = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM bloquesacademicos WHERE id_bloque = ?', [id]);
    res.json({ message: 'Bloque eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar bloque' });
  }
};
