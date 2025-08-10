const db = require('../db');
const path = require('path');
const fs = require('fs');
const util = require('util');
const query = util.promisify(db.query).bind(db);


const uploadBannerBySlug = async (req, res) => {
  try {
    const { slug, texto } = req.body;
    const bannerFile = req.file;

    let bannerPath = null;
    if (bannerFile) {
      bannerPath = `/uploads/banners/${bannerFile.filename}`;
    }

    // Armar la consulta SQL dinámica
    const fields = [];
    const values = [];

    if (bannerPath) {
      fields.push('Banner = ?');
      values.push(bannerPath);
    }

    if (texto !== undefined) {
      fields.push('Texto = ?');
      values.push(texto);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay datos para actualizar.' });
    }

    values.push(slug);
    const sql = `UPDATE Contenido SET ${fields.join(', ')} WHERE slug = ?`;

    const result = await query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Página no encontrada (slug inválido).' });
    }

    res.json({ message: 'Página actualizada correctamente.', Banner: bannerPath });
  } catch (error) {
    console.error('[uploadBannerBySlug] ', error);
    res.status(500).json({ message: 'Error al actualizar el contenido.', error: error.message });
  }
};


const getBannerByContenido = async (req, res) => {
  try {
    const { id_contenido } = req.params;
    const rows = await query('SELECT Banner FROM Contenido WHERE id_contenido = ?', [id_contenido]);

    if (rows.length === 0) return res.status(404).json({ message: 'Contenido no encontrado.' });

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el banner.', error: error.message });
  }
};


const getBannerBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const rows = await query(
      'SELECT Banner FROM Contenido WHERE slug = ?',
      [slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Página no encontrada.' });
    }
    res.json({ Banner: rows[0].Banner }); // podría ser null si no hay banner
  } catch (error) {
    console.error('[getBannerBySlug] ', error);
    res.status(500).json({ message: 'Error obteniendo banner.', error: error.message });
  }
};



const deleteBannerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    // Obtener ruta actual
    const rows = await query('SELECT Banner FROM Contenido WHERE slug = ?', [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Página no encontrada.' });
    }
    const currentBanner = rows[0].Banner;
    if (currentBanner) {
      // Borrar archivo del sistema
      const filePath = path.join(__dirname, '..', 'public', currentBanner);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Actualizar BD a NULL
    await query('UPDATE Contenido SET Banner = NULL WHERE slug = ?', [slug]);
    res.json({ message: 'Banner eliminado correctamente.' });
  } catch (error) {
    console.error('[deleteBannerBySlug] ', error);
    res.status(500).json({ message: 'Error al eliminar el banner.', error: error.message });
  }
};



module.exports = {
  getBannerByContenido,
  getBannerBySlug,
  uploadBannerBySlug,
  deleteBannerBySlug,
};
