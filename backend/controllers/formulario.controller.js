const db = require("../db");
const axios = require("axios");
const nodemailer = require("nodemailer");

exports.getContenidos = (req, res) => {
  // DISTINCT para no repetir y ORDER BY para UX
  const query = `SELECT DISTINCT Clasificacion FROM eventosaside ORDER BY Clasificacion`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener contenidos" });
    res.json(results);
  });
};

exports.getProgramasByContenido = (req, res) => {
  const { Clasificacion } = req.params; // <- ya coincide con la ruta
  // Usa el nombre correcto de la tabla y ordena por Descripcion
  const query = `SELECT id_evento, Descripcion FROM eventosaside WHERE Clasificacion = ? ORDER BY Descripcion`;
  db.query(query, [Clasificacion], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener programas" });
    res.json(results);
  });
};

exports.enviarFormulario = (req, res) => {
  const {
    nombre,
    correo,
    celular,
    Clasificacion,
    id_evento,
    campus,
    ciudad,
    mensaje,
    "g-recaptcha-response": captcha,
  } = req.body;

  const secretKey = "6LccnqorAAAAAAF4rRo-A-IcsojKJZFRI3DRjBAm";

  if (!captcha) {
    return res.status(400).json({ message: "Captcha no verificado" });
  }

  // 1) Validamos reCAPTCHA con Google
  axios
    .post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: { secret: secretKey, response: captcha },
    })
    .then(async (response) => {
      if (!response.data.success) {
        return res.status(400).json({ message: "Captcha inválido" });
      }

      // 2) Consulta la base de datos para obtener la descripción del evento
      const query = `SELECT Descripcion FROM eventosaside WHERE id_evento = ?`;
      db.query(query, [id_evento], async (err, results) => {
        if (err || results.length === 0) {
          console.error("Error al obtener la descripción del evento:", err || "Evento no encontrado");
          return res.status(500).json({ message: "Error al procesar el formulario" });
        }

        const descripcionEvento = results[0].Descripcion;

        // 3) Configuramos el transporte SMTP CORRECTO para Gmail
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "epgdladmministrador@gmail.com",
            pass: "jysanmboqqleoptz",
          },
        });

        // 3.b) (Opcional) Verificamos la conexión
        try {
          await transporter.verify();
          console.log("SMTP listo para enviar mensajes");
        } catch (verifyErr) {
          console.error("Error al verificar el transporte SMTP:", verifyErr);
          return res
            .status(500)
            .json({ message: "Error al conectar con Gmail SMTP" });
        }

        // 4) Definimos el contenido del correo, usando la descripción
        const mailOptions = {
          from: `"Formulario Web" <epgdladmministrador@gmail.com>`,
          to: "epgdladmministrador@gmail.com",
          subject: "Nuevo mensaje del formulario de EP CAMPUS GUADALAJARA",
          html: `
            <h3>Nuevo mensaje desde el formulario de contacto:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${correo}</p>
            <p><strong>Celular:</strong> ${celular}</p>
            <p><strong>Categoría:</strong> ${Clasificacion}</p>
            <p><strong>Diplomado/Maestría:</strong> ${descripcionEvento}</p>
            <p><strong>Campus:</strong> ${campus}</p>
            <p><strong>Estado:</strong> ${ciudad}</p>
            <p><strong>Mensaje:</strong><br>${mensaje}</p>
          `,
        };

        // 5) Enviamos el correo
        try {
          await transporter.sendMail(mailOptions);
          return res
            .status(200)
            .json({ message: "Formulario enviado correctamente" });
        } catch (sendErr) {
          console.error("Error al enviar el correo:", sendErr);
          return res.status(500).json({ message: "Error al enviar el correo" });
        }
      });
    })
    .catch((error) => {
      console.error("Error al verificar captcha:", error);
      return res.status(500).json({ message: "Error al verificar captcha" });
    });
};