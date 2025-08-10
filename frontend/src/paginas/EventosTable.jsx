import React, { useEffect, useState } from 'react'
import axios from 'axios'

const EventosTable = () => {
  const [eventos, setEventos] = useState([])
  const [clasificaciones, setClasificaciones] = useState([])
  const [clasificacionActiva, setClasificacionActiva] = useState('')

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos/all`)
      .then(res => {
        setEventos(res.data)

        // Agrupar clasificaciones únicas
        const grupos = Array.from(new Set(res.data.map(e => e.Clasificacion || 'Sin clasificación')))
        setClasificaciones(grupos)
        if (grupos.length > 0) setClasificacionActiva(grupos[0])
      })
      .catch(err => console.error(err))
  }, [])

  const eventosFiltrados = eventos.filter(e => (e.Clasificacion || 'Sin clasificación') === clasificacionActiva)

  return (
    <div className="mx-auto">

      <div className="mx-auto">
        <aside className="col-md-3 mb-3">
        </aside>

        <section className="content col-md-9  ">
          <h1 className="mb-3">Oferta Académica</h1>

          {clasificaciones.length > 0 && (
            <>
              <ul className="nav nav-tabs mb-3">
                {clasificaciones.map((clasif, index) => (
                  <li className="nav-item" key={index}>
                    <button
                      className={`nav-link ${clasificacionActiva === clasif ? 'active' : ''}`}
                      onClick={() => setClasificacionActiva(clasif)}
                    >
                      {clasif}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border rounded p-3 bg-white">
                <div className="custom-table">
                  <div className="table-header">
                    EVENTOS / PROGRAMAS DISPONIBLES
                  </div>
                  <div className="table-row">
                    <div className="table-cell program-cell">
                      <strong>Programa</strong>
                    </div>
                    <div className="table-cell highlight">
                      <strong>Inicio</strong>
                    </div>
                    <div className="table-cell duration">
                      <strong>Duración</strong>
                    </div>
                  </div>

                  {eventosFiltrados.length === 0 && (
                    <div className="p-3 text-muted">No hay eventos en esta clasificación.</div>
                  )}

                  {eventosFiltrados.map(evt => (
                    <div className="table-row" key={evt.id_evento}>
                      <div className="table-cell program-cell">
                        <a href={evt.Url} target="_blank" rel="noreferrer">{evt.Descripcion}</a>
                      </div>
                      <div className="table-cell highlight">
                        {new Date(evt.Fecha).toLocaleDateString('es-MX', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </div>
                      <div className="table-cell duration">
                        {evt.Duracion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

    </div>
  )
}

export default EventosTable

