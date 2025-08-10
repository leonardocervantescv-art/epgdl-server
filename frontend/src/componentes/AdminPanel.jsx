//Componente principal del panel de administración

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SeccionForm from "./SeccionForm";
import ContenidoForm from "./ContenidoForm";
import Header from "./Header";
import AdminHeader from "./AdminHeader";
import { FaAlignCenter } from "react-icons/fa";

const AdminPanel = () => {
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [mostrarFormularioContenido, setMostrarFormularioContenido] =
    useState(null);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(null);
  const [modoEditarContenido, setModoEditarContenido] = useState(false);
  const navigate = useNavigate();

  const obtenerSecciones = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/secciones/con-contenido`)
      .then((res) => {
        // Aseguramos que res.data sea un array, de lo contrario, usamos un array vacío.
        setSecciones(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setSecciones([]); // En caso de error, también establecemos un array vacío.
      });
  };

  useEffect(() => {
    obtenerSecciones();
  }, []);

  const eliminarSeccion = (id) => {
    if (window.confirm("¿Eliminar esta sección?")) {
      axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/secciones/${id}`).then(() => obtenerSecciones());
    }
  };

  const handlePaginas = () => {
    navigate("/admin/contenido");
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Panel de Administración</h2>

        <SeccionForm
          seccion={seccionSeleccionada}
          modoEditar={modoEditar}
          onSuccess={() => {
            setSeccionSeleccionada(null);
            setModoEditar(false);
            obtenerSecciones();
          }}
        />

        <hr />
        <h2>Secciones</h2>
        <ul className="list-group">
          <div className="container d-flex">
            <button className="btn btn-success ms-auto" onClick={handlePaginas}>
              Editar Contenido de las Páginas
            </button>
          </div>
          <br />
          {secciones.map((seccion) => (
            <li key={seccion.id_secciones} className="list-group-item">
              <strong>{seccion.Nombre}</strong>
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => {
                    setSeccionSeleccionada(seccion);
                    setModoEditar(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => eliminarSeccion(seccion.id_secciones)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    setMostrarFormularioContenido(seccion.id_secciones)
                  }
                >
                  Agregar Submenú
                </button>
              </div>

              {mostrarFormularioContenido === seccion.id_secciones && (
                <ContenidoForm
                  id_secciones={seccion.id_secciones}
                  contenido={contenidoSeleccionado}
                  modoEditar={modoEditarContenido}
                  onSuccess={() => {
                    setMostrarFormularioContenido(null);
                    setContenidoSeleccionado(null);
                    setModoEditarContenido(false);
                    obtenerSecciones();
                  }}
                />
              )}

              <ul className="mt-2">
                {seccion.contenido.map((item) => (
                  <li key={item.id_contenido}>
                    {item.Titulo}
                    <div className="mt-1">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          setContenidoSeleccionado(item);
                          setModoEditarContenido(true);
                          setMostrarFormularioContenido(seccion.id_secciones);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          if (window.confirm("¿Eliminar este submenú?")) {
                            axios
                              .delete(`/api/contenido/${item.id_contenido}`)
                              .then(() => obtenerSecciones());
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <AdminHeader />
      </div>
    </>
  );
};

export default AdminPanel;
