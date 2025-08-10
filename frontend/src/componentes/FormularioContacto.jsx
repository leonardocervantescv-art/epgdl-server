import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const FormularioContacto = () => {
  const [contenidos, setContenidos] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [captchaValue, setCaptchaValue] = useState(null);
  
  // Nuevo estado para el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');

  const recaptchaRef = useRef(null);

  const initialFormState = {
    nombre: '',
    correo: '',
    celular: '',
    id_contenido: '',
    id_programa: '',
    campus: '',
    ciudad: '',
    mensaje: ''
  };
  const [form, setForm] = useState(initialFormState);

  const siteKey = "6Lf7nJsrAAAAAEdsKxOBQO3pymnSYqON0Mp28O21";

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/formulario/contenidos`)
      .then(res => setContenidos(res.data))
      .catch(err => console.error('Error al cargar contenidos:', err));
  }, []);

  useEffect(() => {
    if (form.id_contenido) {
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/formulario/programas/${form.id_contenido}`)
        .then(res => setProgramas(res.data))
        .catch(err => console.error('Error al cargar programas:', err));
    } else {
      setProgramas([]);
    }
  }, [form.id_contenido]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = value => {
    setCaptchaValue(value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!captchaValue) {
      console.error('Por favor confirma que no eres un robot');
      return;
    }

    const data = { ...form, 'g-recaptcha-response': captchaValue };

    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/formulario/enviar`, data);
      
      // Mostrar el mensaje de éxito
      setSuccessMessage('¡Muchas gracias! Un asesor se comunicará contigo muy pronto.');
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      // Limpiamos los campos del formulario
      setForm(initialFormState);
      
      // Reseteamos el reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

    } catch (err) {
      console.error(err);
      setSuccessMessage('Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };

  return (
    <section className="form-container mt-4" id="contacto">
      <div className="text-center text-primary fw-bold fs-3 mb-4">SOLICITA INFORMES</div>
      <div className="row align-items-center">
        <div className="col-md-7">
          <form onSubmit={handleSubmit}>
            {/* Mensaje de éxito/error */}
            {successMessage && (
              <div 
                className={`alert ${successMessage.startsWith('¡') ? 'alert-success' : 'alert-danger'}`} 
                role="alert"
              >
                {successMessage}
              </div>
            )}
            
            <div className="mb-3">
              <label className="form-label">NOMBRE</label>
              <input 
                type="text" 
                className="form-control" 
                name="nombre" 
                required 
                maxLength="50"
                pattern="^[A-Za-z\s]{1,30}$" 
                title="Solo letras, máx 30 caracteres"
                placeholder="Ingresa tu Nombre" 
                onChange={handleChange} 
                value={form.nombre}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">E-MAIL</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="correo" 
                  required 
                  maxLength="30" 
                  onChange={handleChange} 
                  value={form.correo}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CELULAR</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  name="celular" 
                  required 
                  maxLength="10"
                  pattern="^\d{10}$" 
                  title="Debe tener 10 dígitos" 
                  onChange={handleChange} 
                  value={form.celular}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">PROGRAMA DE INTERÉS</label>
              <select 
                className="form-select" 
                name="id_contenido" 
                required 
                onChange={handleChange}
                value={form.id_contenido}
              >
                <option value="">Seleccione un programa</option>
                {contenidos.map(c => (
                  <option key={c.id_contenido} value={c.id_contenido}>{c.Titulo}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">DIPLOMADO / MAESTRÍA</label>
              <select 
                className="form-select" 
                name="id_programa" 
                required 
                onChange={handleChange}
                value={form.id_programa}
              >
                <option value="">Seleccione una opción</option>
                {programas.map(p => (
                  <option key={p.id_programas} value={p.id_programas}>{p.Nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">CAMPUS</label>
              <select 
                className="form-select" 
                name="campus" 
                required 
                onChange={handleChange}
                value={form.campus}
              >
                <option value="">Seleccione un campus</option>
                <option value="Continua">Campus virtual</option>
                <option value="Guadalajara">Guadalajara</option>
                <option value="Mérida">Mérida</option>
                <option value="Monterrey">Monterrey</option>
                <option value="Puebla Continua">Puebla Continua</option>
                <option value="Puebla Posgrados">Puebla Posgrados</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">ESTADO</label>
              <select 
                className="form-select" 
                name="ciudad" 
                required 
                onChange={handleChange}
                value={form.ciudad}
              >
                <option value="">Seleccione un estado</option>
                {[
                  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
                  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León',
                  'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
                  'Veracruz', 'Yucatán', 'Zacatecas', 'Otro'
                ].map((estado, idx) => (
                  <option key={idx} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">MENSAJE</label>
              <textarea 
                className="form-control" 
                name="mensaje" 
                rows="4" 
                maxLength="100" 
                required 
                onChange={handleChange}
                value={form.mensaje}
              ></textarea>
            </div>

            {/* CAPTCHA */}
            <div className="mb-3 d-flex justify-content-center">
              <ReCAPTCHA 
                ref={recaptchaRef}
                sitekey={siteKey} 
                onChange={handleCaptchaChange} 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ENVIAR CORREO
            </button>
          </form>
        </div>
        <div className="col-md-5 text-center">
          <img src="/img/F1.png" alt="Persona" className="form-image" />
        </div>
      </div>
    </section>
  );
};

export default FormularioContacto;