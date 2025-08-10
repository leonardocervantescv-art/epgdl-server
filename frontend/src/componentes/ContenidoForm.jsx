//ESTE COMPONENTE SE RELACIONA CON SeccionForm en AdminPanel, es el administrador del header 
//COMPONENTE DE LOS SUBMENÚS

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContenidoForm = ({ id_secciones, contenido, modoEditar, onSuccess }) => {
  const [Titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (modoEditar && contenido) {
      setTitulo(contenido.Titulo);
      setSlug(contenido.slug);
    } else {
      setTitulo('');
      setSlug('');
    }
  }, [modoEditar, contenido]);

  useEffect(() => {
    // Auto-generar slug basado en el título
    const nuevoSlug = Titulo.toLowerCase().trim().replace(/\s+/g, '-');
    setSlug(nuevoSlug);
  }, [Titulo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      Titulo,
      slug,
      id_secciones
    };

    const url = modoEditar
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/${contenido.id_contenido}`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido`;

    const request = modoEditar
      ? axios.put(url, data)
      : axios.post(url, data);

    request
      .then(() => {
        setTitulo('');
        setSlug('');
        onSuccess();
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Título"
          value={Titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
      </div>
      {modoEditar && (
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Slug"
            value={slug}
            readOnly
          />
        </div>
      )}
      <button className="btn btn-success btn-sm" type="submit">
        {modoEditar ? 'Actualizar Submenú' : 'Agregar Submenú'}
      </button>
    </form>
  );
};

export default ContenidoForm;
