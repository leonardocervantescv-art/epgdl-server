// ADMINISTRADOR SOLO DE LOS EVENTOS Y DIPLOMADOS PROXIMOS
// SE UNE JUNTO CON ContactoForm EN ADMINASIDE

import React, { useState, useEffect } from "react";
import axios from "axios";

const EventoForm = ({ evento, onSuccess, clasificaciones = [] }) => {
  const [form, setForm] = useState({
    Descripcion: "",
    Fecha: "",
    Duracion: "",
    Url: "",
    Clasificacion: "",
  });
  const [nuevaClasificacion, setNuevaClasificacion] = useState("");
  const [usandoNuevaClasificacion, setUsandoNuevaClasificacion] =
    useState(false);
  const [programasAgrupados, setProgramasAgrupados] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/programa`)
      .then((res) => {
        // Aseguramos que res.data es un array antes de usar .reduce
        if (Array.isArray(res.data)) {
          const agrupado = res.data.reduce((acc, item) => {
            if (!acc[item.Titulo]) acc[item.Titulo] = [];
            acc[item.Titulo].push(item.nombre);
            return acc;
          }, {});
          setProgramasAgrupados(agrupado);
        } else {
          setProgramasAgrupados({}); // En caso de error, inicializamos como un objeto vacío
        }
      })
      .catch((err) => {
        console.error("Error al cargar programas", err);
        setProgramasAgrupados({}); // En caso de error, también inicializamos como objeto vacío
      });
  }, []);

  useEffect(() => {
    if (evento) {
      setForm(evento);
      setUsandoNuevaClasificacion(false);
      setNuevaClasificacion("");
    }
  }, [evento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClasificacionChange = (e) => {
    const value = e.target.value;
    if (value === "__nueva__") {
      setUsandoNuevaClasificacion(true);
      setForm((prev) => ({ ...prev, Clasificacion: "" }));
    } else {
      setUsandoNuevaClasificacion(false);
      setNuevaClasificacion("");
      setForm((prev) => ({ ...prev, Clasificacion: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      Clasificacion: usandoNuevaClasificacion
        ? nuevaClasificacion
        : form.Clasificacion,
    };

    const method = evento ? "put" : "post";
    const url = evento
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/${evento.id_evento}`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos`;

    axios[method](url, data)
      .then(() => {
        onSuccess();
        setForm({
          Descripcion: "",
          Fecha: "",
          Duracion: "",
          Url: "",
          Clasificacion: "",
        });
        setUsandoNuevaClasificacion(false);
        setNuevaClasificacion("");
        alert("Evento guardado correctamente");
      })
      .catch((err) => {
        console.error("Error al guardar el evento", err);
        alert("Hubo un error al guardar el evento.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="form-label">Descripción (Programa)</label>
        <select
          name="Descripcion"
          value={form.Descripcion}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">-- Selecciona un programa --</option>
          {Object.entries(programasAgrupados).map(([titulo, programas]) => (
            <optgroup key={titulo} label={titulo.toUpperCase()}>
              {programas.map((nombrePrograma, index) => (
                <option key={`${titulo}-${index}`} value={nombrePrograma}>
                  {nombrePrograma}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <input
          type="date"
          name="Fecha"
          value={form.Fecha}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          name="Duracion"
          value={form.Duracion}
          onChange={handleChange}
          placeholder="Duración"
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <input
          type="url"
          name="Url"
          value={form.Url}
          onChange={handleChange}
          placeholder="URL del evento"
          className="form-control"
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Clasificación</label>
        <select
          className="form-select"
          value={usandoNuevaClasificacion ? "__nueva__" : form.Clasificacion}
          onChange={handleClasificacionChange}
        >
          <option value="">Selecciona una clasificación</option>
          {clasificaciones.map((clasif) => (
            <option key={clasif} value={clasif}>
              {clasif}
            </option>
          ))}
          <option value="__nueva__">+ Agregar nueva clasificación</option>
        </select>
      </div>

      {usandoNuevaClasificacion && (
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe nueva clasificación"
            value={nuevaClasificacion}
            onChange={(e) => setNuevaClasificacion(e.target.value)}
            required
          />
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        {evento ? "Actualizar evento" : "Agregar evento"}
      </button>
    </form>
  );
};

export default EventoForm;
