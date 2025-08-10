// ADMINISTRADOR DEL INDEX
//AQUI SE INTEGRAN TODOS LOS ADMINISTRADORES
//AdminInicio.jsx
//AdminInicioBanner.jsx
//AdminImagenes.jsx
//AdminFooter.jsx 


import React, { useState } from 'react';
import AdminInicioTextoVideo from './AdminInicio';
import AdminInicioImagenes from './AdminInicioImagenes';
import AdminInicioBanners from './AdminInicioBanners';
import AdminFooter from './AdminFooter';
import Header from './Header';

const AdminInicioPanel = () => {
  const [seccionActiva, setSeccionActiva] = useState('textoVideo');

  return (
    <>
    <Header />
      <div className="container mt-4">
        <h3>Administración Página Inicio</h3>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${seccionActiva === 'textoVideo' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('textoVideo')}
            >
              Texto y Video
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${seccionActiva === 'imagenes' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('imagenes')}
            >
              Imágenes
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${seccionActiva === 'banners' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('banners')}
            >
              Banners
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${seccionActiva === 'footer' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('footer')}
            >
              Footer
            </button>
          </li>
        </ul>

        <div>
          {seccionActiva === 'textoVideo' && <AdminInicioTextoVideo />}
          {seccionActiva === 'imagenes' && <AdminInicioImagenes />}
          {seccionActiva === 'banners' && <AdminInicioBanners />}
          {seccionActiva === 'footer' && <AdminFooter />}
        </div>
      </div>
    </>

  );
};

export default AdminInicioPanel;
