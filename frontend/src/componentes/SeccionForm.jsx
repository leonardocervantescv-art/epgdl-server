//Componente del Panel
//este componente y ContenidoForm se coumunica con AdminPanel
//COMPONENTE UNICAMENTE DE LAS SECCIONES, EL COMPONENTE DE LOS SUBMENÚS ES EL DE ContenidoForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';




const SeccionForm = ({ seccion, modoEditar, onSuccess }) => {
  const [Nombre, setNombre] = useState('');

  useEffect(() => {
    if (modoEditar && seccion) {
      setNombre(seccion.Nombre);
    } else {
      setNombre('');
    }
  }, [modoEditar, seccion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = { Nombre };

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/api/secciones`;
    const peticion = modoEditar
      ? axios.put(`${url}/${seccion.id_secciones}`, datos)
      : axios.post(url, datos);

    peticion
      .then(() => onSuccess())
      .catch(err => console.error(err));
      alert('Sección Creada Correctamente');
      setNombre('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <h4>{modoEditar ? 'Editar Sección' : 'Agregar Sección'}</h4>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Nombre"
          className="form-control"
          value={Nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">
        {modoEditar ? 'Actualizar' : 'Agregar'}
      </button>
    </form>
  );
};

export default SeccionForm;
