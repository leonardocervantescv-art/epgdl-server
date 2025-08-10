// COMPONENTES DE PROXIMOS INICIOS Y HORARIOS
// ESTE ES EL QUE SE OCUPA EN EL LAS PÁGINAS ES LO QUE SE VE EN EL NAVEGADOR 

import { useEffect, useState } from 'react';
import axios from 'axios';

const EventoSide = () => {
  const [eventos, setEventos] = useState([]);
  const [horario, setHorario] = useState(null);
  const [slugEventos, setSlugEventos] = useState('');
  const [seccionEventos, setSeccionEventos] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/eventos?limit=3`)
      .then(res => setEventos(res.data))
      .catch(console.error);

    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/contacto`)
      .then(res => {
        if (res.data.length) setHorario(res.data[0]);
      })
      .catch(console.error);

    // → Aquí pedimos slug + extra
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/extra/evento`)
      .then(res => {
        setSlugEventos(res.data.slug);
        setSeccionEventos(res.data.extra);
      })
      .catch(console.error);
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
        { }
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

