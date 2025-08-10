const db = require('../db');
const axios = require('axios');
const nodemailer = require('nodemailer');

exports.getContenidos = (req, res) => {
  const query = `SELECT Titulo FROM Contenido WHERE id_secciones = 2`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener contenidos' });
    res.json(results);
  });
};

exports.getProgramasByContenido = (req, res) => {
  const { id_contenido } = req.params;
  const query = `SELECT Nombre FROM Programas p inner join Contenido c on p.id_contenido = c.id_contenido WHERE c.Titulo = ?`;
  db.query(query, [id_contenido], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener programas' });
    res.json(results);
  });
};



exports.enviarFormulario = (req, res) => {
  const {
    nombre,
    correo,
    celular,
    id_contenido,
    id_programa,
    campus,
    ciudad,
    mensaje,
    'g-recaptcha-response': captcha
  } = req.body;

  const secretKey = '6Lf7nJsrAAAAACrTH-m-wzaxks0Sqz-JhTDEJs1U'; 

  if (!captcha) {
    return res.status(400).json({ message: 'Captcha no verificado' });
  }

  // 1) Validamos reCAPTCHA con Google
  axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
    params: { secret: secretKey, response: captcha }
  })
  .then(async response => {
    if (!response.data.success) {
      return res.status(400).json({ message: 'Captcha inválido' });
    }

    // 2) Configuramos el transporte SMTP CORRECTO para Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',     // ← Opción más sencilla
      auth: {
        user: 'leonardocervantescv@gmail.com',
        pass: 'hndxhfbvxedhltwu'  // ← Tu App Password (16 caracteres sin espacios)
      }
    });

    // 2.b) (Opcional) Verificamos la conexión
    try {
      await transporter.verify();
      console.log('SMTP listo para enviar mensajes');
    } catch (verifyErr) {
      console.error('Error al verificar el transporte SMTP:', verifyErr);
      return res.status(500).json({ message: 'Error al conectar con Gmail SMTP' });
    }

    // 3) Definimos el contenido del correo
    const mailOptions = {
      from: `"Formulario Web" <leonardocervantescv@gmail.com>`,
      to: 'leonardocervantescv@gmail.com',
      subject: 'Nuevo mensaje del formulario de contacto',
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto:</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Celular:</strong> ${celular}</p>
        <p><strong>Programa:</strong> ${id_contenido}</p>
        <p><strong>Diplomado/Maestría:</strong> ${id_programa}</p>
        <p><strong>Campus:</strong> ${campus}</p>
        <p><strong>Estado:</strong> ${ciudad}</p>
        <p><strong>Mensaje:</strong><br>${mensaje}</p>
      `
    };

    // 4) Enviamos el correo
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Formulario enviado correctamente' });
    } catch (sendErr) {
      console.error('Error al enviar el correo:', sendErr);
      return res.status(500).json({ message: 'Error al enviar el correo' });
    }

  })
  .catch(error => {
    console.error('Error al verificar captcha:', error);
    return res.status(500).json({ message: 'Error al verificar captcha' });
  });
};