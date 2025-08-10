const db = require('../db');
const fs = require('fs');
const path = require('path');

// Obtener footer
exports.getFooter = (req, res) => {
  db.query('SELECT * FROM Footer LIMIT 1', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el footer' });
    res.json(result[0] || {});
  });
};

// Crear footer
exports.createFooter = (req, res) => {
  const { Campus, Telefono, Direccion, Copyright } = req.body;
  const Logo = req.files['Logo'] ? req.files['Logo'][0].filename : null;
  const Mapa = req.files['Mapa'] ? req.files['Mapa'][0].filename : null;
  const telImagen = req.files['telImagen'] ? req.files['telImagen'][0].filename : null;

  const sql = `
    INSERT INTO Footer (Logo, Mapa, telImagen, Telefono, Direccion, Campus, Copyright)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [Logo, Mapa, telImagen, Telefono, Direccion, Campus, Copyright];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear el footer' });
    res.json({ message: 'Footer creado correctamente' });
  });
};

// Actualizar footer
exports.updateFooter = (req, res) => {
  const { id } = req.params;
  const { Campus, Telefono, Direccion, Copyright } = req.body;

  const sqlSelect = 'SELECT * FROM Footer WHERE id_footer = ?';
  db.query(sqlSelect, [id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'Footer no encontrado' });

    const oldFooter = result[0];
    const Logo = req.files['Logo'] ? req.files['Logo'][0].filename : oldFooter.Logo;
    const Mapa = req.files['Mapa'] ? req.files['Mapa'][0].filename : oldFooter.Mapa;
    const telImagen = req.files['telImagen'] ? req.files['telImagen'][0].filename : oldFooter.telImagen;

// Eliminar imágenes anteriores solo si se subieron nuevas
if (req.files['Logo']) {
  const rutaAntigua = path.join(__dirname, '../public/uploads', oldFooter.Logo);
  if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
}

if (req.files['Mapa']) {
  const rutaAntigua = path.join(__dirname, '../public/uploads', oldFooter.Mapa);
  if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
}

if (req.files['telImagen']) {
  const rutaAntigua = path.join(__dirname, '../public/uploads', oldFooter.telImagen);
  if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
}




    const sqlUpdate = `
      UPDATE Footer SET Logo = ?, Mapa = ?, telImagen = ?, Telefono = ?, Direccion = ?, Campus = ?, Copyright = ?
      WHERE id_footer = ?
    `;
    const values = [Logo, Mapa, telImagen, Telefono, Direccion, Campus, Copyright, id];

    db.query(sqlUpdate, values, (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar footer' });
      res.json({ message: 'Footer actualizado correctamente' });
    });
  });
};

// Eliminar footer
exports.deleteFooter = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM Footer WHERE id_footer = ?', [id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'Footer no encontrado' });

    const footer = result[0];
    if (footer.Logo) fs.unlinkSync(path.join(__dirname, '../public/uploads/', footer.Logo));
    if (footer.Mapa) fs.unlinkSync(path.join(__dirname, '../public/uploads/', footer.Mapa));
    if (footer.telImagen) fs.unlinkSync(path.join(__dirname, '../public/uploads/', footer.telImagen));

    db.query('DELETE FROM Footer WHERE id_footer = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Error al eliminar footer' });
      res.json({ message: 'Footer eliminado correctamente' });
    });
  });
};