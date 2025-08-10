/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContenidoForm from './ContenidoForm';

const ListaSubmenus = ({ id_secciones }) => {
  const [contenidos, setContenidos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [contenidoActual, setContenidoActual] = useState(null);

  const cargarContenidos = () => {
    axios.get(`http://localhost:3001/api/contenido/seccion/${id_secciones}`)
      .then(res => setContenidos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (id_secciones) cargarContenidos();
  }, [id_secciones]);

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este submenú?')) {
      axios.delete(`http://localhost:3001/api/contenido/${id}`)
        .then(() => cargarContenidos());
    }
  };

  const iniciarEdicion = (contenido) => {
    setModoEdicion(true);
    setContenidoActual(contenido);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setContenidoActual(null);
  };

  return (
    <div>
      <ContenidoForm
        id_secciones={id_secciones}
        onSuccess={cargarContenidos}
        contenidoActual={contenidoActual}
        modoEdicion={modoEdicion}
        cancelarEdicion={cancelarEdicion}
      />

      <ul className="list-group mt-3">
        {contenidos.map(c => (
          <li key={c.id_contenido} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{c.Titulo}</strong><br />
            </div>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => iniciarEdicion(c)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(c.id_contenido)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaSubmenus;
 */