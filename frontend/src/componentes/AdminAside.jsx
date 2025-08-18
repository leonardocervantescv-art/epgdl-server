//ADMINISTRADOR COMPLETO DE EVENTOS Y HORARIOS

// src/components/AdminAside.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import EventoForm from "./EventoForm";
import ContactoForm from "./ContactoForm";
import Header from "./Header";

const AdminAside = () => {
  const [eventos, setEventos] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [editingEvento, setEditingEvento] = useState(null);
  const [editingContacto, setEditingContacto] = useState(null);

  // ... código anterior

  const fetchData = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/all`)
      .then((res) => setEventos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEventos([]));
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/contacto`)
      .then((res) => {
        // Aseguramos que la respuesta sea un array antes de establecer el estado
        setContactos(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setContactos([])); // También agregamos un catch para manejar el error
  };
  // ... código posterior

  useEffect(fetchData, []);

  const eliminar = (tipo, id) => {
    const url =
      tipo === "evento"
        ? `${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/${id}`
        : `${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/contacto/${id}`;
    if (!window.confirm("¿Seguro?")) return;
    axios.delete(url).then(fetchData);
  };

  // Clasificaciones base + dinámicas
  const clasificacionesBase = ["POSGRADOS", "DIPLOMADOS"];
  const clasificacionesDinamicas = eventos
    .map((e) => e.Clasificacion)
    .filter(Boolean);
  const clasificaciones = Array.from(
    new Set([...clasificacionesBase, ...clasificacionesDinamicas])
  );

  const eventosPorClasif = eventos.reduce((acc, ev) => {
    const key = ev.Clasificacion || "Sin clasificación";
    acc[key] = acc[key] || [];
    acc[key].push(ev);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h3>Administración del Aside</h3>
        <section className="mb-5">
          <h4>
            <strong>Eventos</strong>
          </h4>
          <EventoForm
            evento={editingEvento}
            clasificaciones={clasificaciones}
            onSuccess={() => {
              setEditingEvento(null);
              fetchData();
            }}
          />

          {Object.entries(eventosPorClasif).map(([clasif, evs]) => (
            <div key={clasif} className="mb-4">
              <h5 className="text-uppercase">{clasif}</h5>
              <ul className="list-group">
                {evs.map((e) => (
                  <li
                    key={e.id_evento}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <a href={e.Url} target="_blank" rel="noreferrer">
                        <strong>{e.Descripcion}</strong>
                      </a>
                      <br />
                      {new Date(e.Fecha).toLocaleDateString()} — {e.Duracion}
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => setEditingEvento(e)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminar("evento", e.id_evento)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <hr />

        <section>
          <h4>
            <strong>Contactos y Horarios</strong>
          </h4>
          <ContactoForm
            contacto={editingContacto}
            onSuccess={() => {
              setEditingContacto(null);
              fetchData();
            }}
          />
          <ul className="list-group mt-3">
            {contactos.map((c) => (
              <li
                key={c.id_horarios}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  Lunes a Viernes: {c.Horario} <br />
                  Sábado: {c.Sabado} <br />
                  Informes: {c.Informes} <br />
                  Diplomados: {c.Diplomados}
                </span>
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => setEditingContacto(c)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminar("contacto", c.id_horarios)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default AdminAside;
