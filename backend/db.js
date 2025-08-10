// Primero, carga las variables de entorno si no estás en producción
// En producción, el servidor de hosting ya las proveerá
require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect(error => {
    if(error) {
        console.error('Error de conexión a la BD :(', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL :)');
});

module.exports = connection;