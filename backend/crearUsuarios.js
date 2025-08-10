// crearUsuario.js
const bcrypt = require('bcryptjs');
const db = require('./db'); // Asegúrate de que este archivo exista y exporte la conexión

async function crearUsuario(nombre, usuario, contrasena, rol = 'editor') {
  try {
    const hash = await bcrypt.hash(contrasena, 10);

    const sql = 'INSERT INTO Usuarios (Nombre, Usuario, Contrasena, Rol) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, usuario, hash, rol], (err, result) => {
      if (err) {
        console.error('Error al insertar usuario:', err.message);
      } else {
        console.log(`✅ Usuario creado: ${usuario} con rol ${rol}`);
      }
      process.exit(); // Finaliza el script
    });
  } catch (error) {
    console.error('Error encriptando la contraseña:', error.message);
    process.exit();
  }
}

// Ejemplo de uso: node crearUsuario.js "Nombre" "usuario@correo.com" "123456" "admin"
const [ , , nombre, usuario, contrasena, rol ] = process.argv;
if (!nombre || !usuario || !contrasena) {
  console.log('Uso: node crearUsuario.js "Nombre" "usuario" "contraseña" "rol"');
  process.exit();
}

crearUsuario(nombre, usuario, contrasena, rol);
