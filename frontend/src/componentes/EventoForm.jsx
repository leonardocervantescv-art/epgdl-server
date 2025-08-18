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
  const [usandoNuevaClasificacion, setUsandoNuevaClasificacion] = useState(false);
  const [usandoOtroPrograma, setUsandoOtroPrograma] = useState(false);
  const [programasAgrupados, setProgramasAgrupados] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/programa`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const agrupado = res.data.reduce((acc, item) => {
            if (!acc[item.Titulo]) acc[item.Titulo] = [];
            acc[item.Titulo].push(item.nombre);
            return acc;
          }, {});
          setProgramasAgrupados(agrupado);
        } else {
          setProgramasAgrupados({});
        }
      })
      .catch((err) => {
        console.error("Error al cargar programas", err);
        setProgramasAgrupados({});
      });
  }, []);

  useEffect(() => {
    if (evento) {
      const fechaFormateada = evento.Fecha
        ? new Date(evento.Fecha).toISOString().split("T")[0]
        : "";

      const programasExistentes = Object.values(programasAgrupados).flat();
      const existeDescripcion = programasExistentes.includes(evento.Descripcion);

      setUsandoOtroPrograma(!existeDescripcion);
      setForm({
        ...evento,
        Fecha: fechaFormateada,
      });
      setNuevaClasificacion("");
      setUsandoNuevaClasificacion(false);
    }
  }, [evento, programasAgrupados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    if (value === "__otro__") {
      setUsandoOtroPrograma(true);
      setForm((prev) => ({ ...prev, Descripcion: "" }));
    } else {
      setUsandoOtroPrograma(false);
      setForm((prev) => ({ ...prev, Descripcion: value }));
    }
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

    // Construimos el objeto de datos que se enviará,
    // incluyendo el campo 'otro' de forma explícita
    const dataToSend = {
      ...form,
      otro: usandoOtroPrograma ? 1 : null,
      Clasificacion: usandoNuevaClasificacion
        ? nuevaClasificacion
        : form.Clasificacion,
    };

    const method = evento ? "put" : "post";
    const url = evento
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/${evento.id_evento}`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos`;

    axios[method](url, dataToSend) // Usamos el nuevo objeto dataToSend
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
        setUsandoOtroPrograma(false);
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
          value={usandoOtroPrograma ? "__otro__" : form.Descripcion}
          onChange={handleDescripcionChange}
          className="form-select"
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
          <option value="__otro__">+ Agregar otro programa</option>
        </select>
      </div>

      {usandoOtroPrograma && (
        <div className="mb-2">
          <input
            type="text"
            name="Descripcion"
            value={form.Descripcion}
            onChange={handleChange}
            placeholder="Agrega otro programa"
            className="form-control"
            required
          />
        </div>
      )}

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
