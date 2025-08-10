import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../Api';
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn
} from "react-icons/fa";
import { Link } from 'react-router-dom';

// convierte acentos y espacios en url válida
const slugify = texto =>
  texto.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-');

const Header = () => {
  const [secciones, setSecciones] = useState([]);
  const [headerData, setHeaderData] = useState(null);

useEffect(() => {
  api.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/secciones/con-contenido`)
    .then(response => {
      console.log('Datos de secciones:', response.data);
      setSecciones(Array.isArray(response.data) ? response.data : []);
    })
    .catch(error => {
      console.error('Error al cargar secciones:', error);
    });

  api.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/header`)
    .then(res => setHeaderData(res.data))
    .catch(err => console.error('Error al cargar header dinámico:', err));
}, []);

  return (
<Navbar expand="lg" className="header-navbar py-3" variant="dark" style={{ backgroundColor: '#041b2d' }}>
  <Container className="px-5 d-flex justify-content-between">

    {/* LOGO */}
    <div className="d-flex align-items-center">
      <Link to="/">
        {headerData?.Logo && (
          <img
            src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${headerData.Logo}`}
            alt="EP de México"
            className="logo-header"
          />
        )}
      </Link>
    </div>

    {/* Botón hamburguesa */}
    <Navbar.Toggle aria-controls="main-navbar" />

    <Navbar.Collapse id="main-navbar">
      {/* MENÚ DINÁMICO */}
      <Nav className="mx-auto">
        {secciones.map(seccion => (
          <NavDropdown
            key={seccion.id_secciones}
            title={seccion.Nombre}
            id={`seccion-${seccion.id_secciones}`}
            className="hover-dropdown"
          >
            {seccion.contenido.map(item => (
              <NavDropdown.Item
                as={Link}
                key={item.id_contenido}
                to={`/${slugify(seccion.Nombre)}/${slugify(item.Titulo)}`}
              >
                {item.Titulo}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        ))}
      </Nav>

      {/* REDES SOCIALES */}
      <div className="d-flex align-items-center gap-3 redes-header">
        {headerData?.linkFB && (
          <a href={headerData.linkFB} target="_blank" rel="noopener noreferrer"><FaFacebookF color="white" /></a>
        )}
        {headerData?.linkIG && (
          <a href={headerData.linkIG} target="_blank" rel="noopener noreferrer"><FaInstagram color="white" /></a>
        )}
        {headerData?.linkTT && (
          <a href={headerData.linkTT} target="_blank" rel="noopener noreferrer"><FaTiktok color="white" /></a>
        )}
        {headerData?.linkLN && (
          <a href={headerData.linkLN} target="_blank" rel="noopener noreferrer"><FaLinkedinIn color="white" /></a>
        )}
      </div>
    </Navbar.Collapse>

  </Container>
</Navbar>

  );
};

export default Header;
