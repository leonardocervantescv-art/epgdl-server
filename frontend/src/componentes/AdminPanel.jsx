// frontend/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SeccionForm from "./SeccionForm";
import ContenidoForm from "./ContenidoForm";
import Header from "./Header";
import AdminHeader from "./AdminHeader";

const AdminPanel = () => {
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [mostrarFormularioContenido, setMostrarFormularioContenido] = useState(null);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(null);
  const [modoEditarContenido, setModoEditarContenido] = useState(false);
  const navigate = useNavigate();

  // 🔹 Cargar secciones con contenido
  const obtenerSecciones = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/secciones/con-contenido`)
      .then((res) => {
        setSecciones(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setSecciones([]);
      });
  };

  useEffect(() => {
    obtenerSecciones();
  }, []);

  // 🔹 Eliminar sección
  const eliminarSeccion = (id) => {
    if (window.confirm("¿Eliminar esta sección?")) {
      axios
        .delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/secciones/${id}`)
        .then(() => obtenerSecciones());
    }
  };

  // 🔹 Habilitar/Deshabilitar sección
  const handleToggleSeccion = async (id_secciones, activo) => {
    try {
      const nuevoValor = Number(activo) === 1 ? 0 : 1;
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/${id_secciones}/toggle-seccion`,
        { Activo: nuevoValor }
      );
      obtenerSecciones();
    } catch (error) {
      console.error("Error al actualizar estado de la sección", error);
    }
  };

  // 🔹 Mover submenú a otra sección
  const handleMover = async (id_contenido, nuevaSeccion) => {
    try {
      const seccionId = parseInt(nuevaSeccion, 10);
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/${id_contenido}/mover`,
        { id_secciones: seccionId }
      );
      obtenerSecciones();
    } catch (error) {
      console.error("Error al mover submenú", error);
    }
  };

  // 🔹 Habilitar/Deshabilitar submenú
  const handleToggle = async (id_contenido, activo) => {
    try {
      const nuevoValor = Number(activo) === 1 ? 0 : 1;
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/${id_contenido}/toggle`,
        { Activo: nuevoValor }
      );
      obtenerSecciones();
    } catch (error) {
      console.error("Error al actualizar estado del submenú", error);
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

        {/* Formulario para agregar/editar secciones */}
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
        <div className="container d-flex mb-3">
          <button className="btn btn-success ms-auto" onClick={handlePaginas}>
            Editar Contenido de las Páginas
          </button>
        </div>

        <ul className="list-group">
          {secciones.map((seccion) => {
            const seccionActiva = Number(seccion.Activo) === 1;

            return (
              <li key={seccion.id_secciones} className="list-group-item">
                <strong>{seccion.Nombre}</strong>{" "}
                {!seccionActiva && (
                  <span className="badge bg-secondary">Deshabilitada</span>
                )}

                <div className="mt-2">
                  {/* Editar */}
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

                  {/* Eliminar */}
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => eliminarSeccion(seccion.id_secciones)}
                  >
                    Eliminar
                  </button>

                  {/* Agregar submenú */}
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => setMostrarFormularioContenido(seccion.id_secciones)}
                  >
                    Agregar Submenú
                  </button>

                  {/* Habilitar/Deshabilitar sección */}
                  <button
                    className={`btn btn-sm ${
                      seccionActiva ? "btn-outline-danger" : "btn-outline-success"
                    }`}
                    onClick={() => handleToggleSeccion(seccion.id_secciones, Number(seccion.Activo))}
                  >
                    {seccionActiva ? "Deshabilitar" : "Habilitar"}
                  </button>
                </div>

                {/* Formulario de contenido */}
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

                {/* Submenús */}
                <ul className="mt-2">
                  {seccion.contenido.map((item) => {
                    const activo = Number(item.Activo) === 1;

                    return (
                      <li key={item.id_contenido}>
                        {item.Titulo}{" "}
                        {!activo && (
                          <span className="badge bg-secondary">Deshabilitado</span>
                        )}
                        <div className="mt-1 d-flex align-items-center gap-2">
                          {/* Editar */}
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              setContenidoSeleccionado(item);
                              setModoEditarContenido(true);
                              setMostrarFormularioContenido(seccion.id_secciones);
                            }}
                          >
                            Editar
                          </button>

                          {/* Eliminar */}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              if (window.confirm("¿Eliminar este submenú?")) {
                                axios
                                  .delete(
                                    `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/${item.id_contenido}`
                                  )
                                  .then(() => obtenerSecciones());
                              }
                            }}
                          >
                            Eliminar
                          </button>

                          {/* Mover */}
                          <select
                            className="form-select form-select-sm w-auto"
                            defaultValue=""
                            onChange={(e) => {
                              const nuevaSeccion = Number(e.target.value);
                              if (nuevaSeccion) {
                                handleMover(item.id_contenido, nuevaSeccion);
                              }
                              e.target.value = "";
                            }}
                          >
                            <option value="" disabled>
                              Cambiar sección...
                            </option>
                            {secciones.map((s) => (
                              <option key={s.id_secciones} value={s.id_secciones}>
                                {s.Nombre}
                              </option>
                            ))}
                          </select>

                          {/* Habilitar/Deshabilitar submenú */}
                          <button
                            className={`btn btn-sm ${
                              activo ? "btn-outline-danger" : "btn-outline-success"
                            }`}
                            onClick={() => handleToggle(item.id_contenido, Number(item.Activo))}
                          >
                            {activo ? "Deshabilitar" : "Habilitar"}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        <AdminHeader />
      </div>
    </>
  );
};

export default AdminPanel;
