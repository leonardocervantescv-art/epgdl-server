//MENU DE LOS ADMINISTRADORES

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';


const AdminMenu = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const panels = [
    { name: 'Secciones', path: '/admin/secciones', icon: 'fa-sitemap' },
    { name: 'Banners y Contenido', path: '/admin/contenido', icon: 'fa-image' },
    { name: 'Programas', path: '/admin/programas', icon: 'fa-book' },
    { name: 'Eventos y Fechas', path: '/admin/aside', icon: 'fa-calendar-alt' },
    { name: 'Contenido de Programas', path: '/admin/detalles-programas', icon: 'fa-file-alt' },
    { name: 'Pagina de Inicio', path: '/admin/inicio-admin', icon: 'fa-file-alt' },
  ];


  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };



  return (
    <>
      <Header />
      <div className="admin-menu container py-5">
        <div className="container d-flex">
          <NavLink to="#" onClick={cerrarSesion} className="btn btn-danger ms-auto">
            <i className="fas fa-right-from-bracket me-2"></i>
            Salir
          </NavLink>
        </div>
        <h2 className="mb-4 text-center fw-bold mdb">Panel de Administración</h2>
        <div className="row g-4">
          {panels.map(panel => (
            <div key={panel.path} className="col-md-6 col-lg-4">
              <NavLink
                to={panel.path}
                className="admin-card card text-center text-decoration-none h-100 shadow-sm"
              >
                <div className="card-body">
                  <i className={`fas ${panel.icon} fa-2x mb-3 text-primary`}></i>
                  <h5 className="card-title">{panel.name}</h5>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
        <br />
        <hr />
        {usuario?.rol === 'admin' && (
          <div className="admin-card card text-center text-decoration-none h-100 shadow-sm">
            <NavLink to="/admin/registrar" className="card h-100 text-decoration-none text-dark shadow-sm">
              <div className="card-body d-flex align-items-center justify-content-center">
                <h5 className="card-title mb-0 fw-bold mdb">
                <i class="fa-solid fa-list me-2"></i>
                  Registrar Usuario</h5>
              </div>
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminMenu;
