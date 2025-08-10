// componentes/AdminProgramas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const AdminProgramas = () => {
  const [contenidos, setContenidos] = useState([]);
  const [slugSeleccionado, setSlugSeleccionado] = useState("");
  const [programas, setProgramas] = useState([]);
  const [id_contenido, setIdContenido] = useState("");
  const [formulario, setFormulario] = useState({ Nombre: "", Descripcion: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programaEditarId, setProgramaEditarId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/fill`)
      .then((res) => {
        setContenidos(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error al cargar contenidos:", err);
        setContenidos([]);
      });
  }, []);

  useEffect(() => {
    if (id_contenido) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${id_contenido}`)
        .then((res) => setProgramas(res.data))
        .catch((err) => console.error("Error al cargar programas:", err));
    }
  }, [id_contenido]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const generarSlug = (nombre) => {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleGuardar = async () => {
    if (!formulario.Nombre || !formulario.Descripcion || !id_contenido) {
      // Reemplazamos alert() con una función más amigable
      console.log("Faltan campos por llenar");
      return;
    }

    try {
      if (modoEdicion) {
        const slug = generarSlug(formulario.Nombre);
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${programaEditarId}`, {
          ...formulario,
          slug,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas`, {
          ...formulario,
          id_contenido,
        });
      }
      setFormulario({ Nombre: "", Descripcion: "" });
      setModoEdicion(false);
      setProgramaEditarId(null);
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${id_contenido}`);
      setProgramas(res.data);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const handleEditar = (programa) => {
    setFormulario({
      Nombre: programa.Nombre,
      Descripcion: programa.Descripcion,
    });
    setModoEdicion(true);
    setProgramaEditarId(programa.id_programas);
  };

  const handleEliminar = async (id) => {
    // Reemplazamos confirm() con una función más amigable
    console.log("¿Seguro que deseas eliminar este programa? Si es así, procede a la eliminación.");
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${id}`);
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${id_contenido}`);
      setProgramas(res.data);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleProgramas = () => {
    navigate("/admin/detalles-programas");
  };

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2 className="text-center mb-4">
          Panel de Administración de Programas
        </h2>

        {/* Selector de submenú */}
        <div className="mb-3">
          <label className="form-label">Selecciona un submenú</label>
          <select
            className="form-select"
            value={id_contenido}
            onChange={(e) => setIdContenido(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {contenidos.map((contenido) => (
              <option
                key={contenido.id_contenido}
                value={contenido.id_contenido}
              >
                {contenido.Titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Formulario */}
        <div className="card p-3 mb-4">
          <h5>{modoEdicion ? "Editar programa" : "Agregar nuevo programa"}</h5>
          <input
            type="text"
            name="Nombre"
            className="form-control my-2"
            placeholder="Nombre del programa"
            value={formulario.Nombre}
            onChange={handleChange}
          />
          <textarea
            name="Descripcion"
            className="form-control my-2"
            placeholder="Descripción del programa"
            value={formulario.Descripcion}
            onChange={handleChange}
          />
          <button onClick={handleGuardar} className="row btn btn-primary">
            {modoEdicion ? "Actualizar" : "Guardar"}
          </button>
          <br />
          <div className="container d-flex">
            <button
              className="btn btn-warning ms-auto"
              onClick={handleProgramas}
            >
              <p>EDITAR CONTENIDO DE LOS PROGRAMAS</p>
            </button>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-4 justify-content-center">
          {programas.map((programa) => (
            <div className="col" key={programa.id_programas}>
              <div className="card-item">
                <div className="card-content card-front">
                  <h3>{programa.Nombre}</h3>
                </div>
                <div className="card-content card-back">
                  <p>{programa.Descripcion}</p>
                  <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(programa)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(programa.id_programas)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminProgramas;