// EventoSide.jsx - Se simplifica, ya que el backend hace todo el trabajo.

import { useEffect, useState } from 'react';
import axios from 'axios';  

const EventoSide = () => {
  const [eventos, setEventos] = useState([]);
  const [horario, setHorario] = useState(null);
  const [slugEventos, setSlugEventos] = useState('');
  const [seccionEventos, setSeccionEventos] = useState('');

  useEffect(() => {
    // Solo hacemos las peticiones necesarias. La lógica de filtrado está en el backend.
    Promise.all([
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos?limit=3`),
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/contacto`),
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/extra/evento`)
    ])
    .then(([eventosRes, contactoRes, extraRes]) => {
      setEventos(eventosRes.data);
      if (contactoRes.data.length) setHorario(contactoRes.data[0]);
      setSlugEventos(extraRes.data.slug);
      setSeccionEventos(extraRes.data.extra);
    })
    .catch(error => {
      console.error("Error al cargar los datos del aside", error);
      setEventos([]);
      setHorario(null);
      setSlugEventos('');
      setSeccionEventos('');
    });
  }, []);

  return (
    <div>
      <section className="upcoming">
        <h3>PROXIMOS INICIOS</h3>
        {Array.isArray(eventos) && eventos.map(evt => (
          <div key={evt.id_evento}>
            <p>{new Date(evt.Fecha).getDate()}</p>
            <p>
              {new Date(evt.Fecha)
                .toLocaleString('es-MX', { month: 'long' })}
              <br />
              <a href={evt.Url} >{evt.Descripcion}</a>
            </p>
          </div>
        ))}
        {seccionEventos && slugEventos && (
          <a
            href={`/${seccionEventos}/${slugEventos}`}
            className="vertodos"
          >
            Ver todos
          </a>
        )}
        <section className="hours">
          <h3>HORARIO DE ATENCIÓN</h3>
          {horario ? (
            <>
              <p>
                <span>🕘</span> Lunes a Viernes: {horario.Horario}
              </p>
              <p>
                <span>S</span> Sábado: {horario.Sabado}
              </p>
              <p>
                <span>📞</span> Informes: {horario.Informes}
              </p>
              <p>
                <span>🎓</span> Diplomados: {horario.Diplomados}
              </p>
            </>
          ) : (
            <p>Cargando horario...</p>
          )}
        </section>
      </section >
    </div>
  )
}

export default EventoSide;
