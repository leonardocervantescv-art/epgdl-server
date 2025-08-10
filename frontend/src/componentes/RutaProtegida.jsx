// components/RutaProtegida.jsx
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const RutaProtegida = ({ children }) => {
  const [autenticado, setAutenticado] = useState(null); // null = cargando

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAutenticado(false);
      return;
    }

    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/panel`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => setAutenticado(true))
    .catch(() => {
      localStorage.removeItem('token');
      setAutenticado(false);
    });
  }, []);

  if (autenticado === null) {
    return <p>Cargando...</p>; // o spinner
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;
