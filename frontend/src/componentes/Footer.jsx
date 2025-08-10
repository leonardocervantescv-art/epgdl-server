import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Footer = () => {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/footer`)
      .then((res) => {
        console.log('Respuesta del backend:', res.data);
        if (res.data) {
          setFooter(res.data);
        }
      })
      .catch((err) => {
        console.error('Error al obtener el footer:', err);
      });
  }, []);

  console.log("Datos del footer en JSX:", footer);
  if (!footer) return null;

  return (
    <>
      <footer className="pie-pagina">
        <div className="grupo1">
          <div className="box">
            <figure>
              <a href="#">
                {footer.Logo && (
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${footer.Logo}`}
                    alt="Logo EP MTY"
                    style={{ with: '200px', height: 'auto' }}
                  />
                )}
              </a>
            </figure>
          </div>

          <div className="box">
            {footer.Mapa && (
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${footer.Mapa}`}
                alt="Mapa"
                width={20}
                style={{ marginBottom: '10px' }}
              />
            )}
            <h2>{footer.Campus}</h2>
            <p>
              {footer.Direccion?.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}<br />
                </React.Fragment>
              ))}
            </p>

            {footer.telImagen && (
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${footer.telImagen}`}
                alt="Teléfono"
                width={20}
                style={{ marginTop: '10px' }}
              />
            )}
            <p>
              {footer.Telefono?.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}<br />
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        <div className="grupo2">
          <small>
            &copy; {new Date().getFullYear()} <b>EP de México</b> - {footer.Copyright}
          </small>
        </div>
      </footer>
    </>
  );
};

export default Footer;