import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUsuario }) => {
  const [usuario, setUsuarioInput] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/login`, {
        Usuario: usuario,
        Contrasena: contrasena,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuarios));
      setUsuario(res.data.usuarios);

      // CORRECCIÓN CLAVE:
      // Navegamos usando la ruta interna de la aplicación, no una URL completa.
      navigate('/login/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/assets/med.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
        }}
      >
        <h3 className="text-center mb-4">Panel Administrativo</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuarioInput(e.target.value)}
              placeholder="Escribe tu usuario"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Escribe tu contraseña"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>

        <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
          Acceso exclusivo para administradores
        </p>
      </div>
    </div>
  );
};

export default Login;