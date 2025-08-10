import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PaginaGenerica from '../paginas/PaginaGenerica';
import PaginaProgramas from '../paginas/PaginaProgramas';
import PaginaDetallePrograma from '../paginas/PaginaDetallePrograma';
import EventosTable from '../paginas/EventosTable'; // Este componente ya no será retornado directamente

const RuteadorDinamico = () => {
  const { seccion, slug } = useParams();
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    const detectarTipo = async () => {
      // 1. Intentamos verificar si es un detalle de programa
      try {
        await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/slug/${slug}`);
        setTipo('detalle');
        return;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log(`[RuteadorDinamico] El slug '${slug}' no es un programa. Procediendo...`);
        } else {
          console.error('[RuteadorDinamico] Error inesperado al verificar programa:', err);
          setTipo('error');
          return;
        }
      }

      // 2. Si no es un programa, verificamos si es contenido genérico
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/slug/${slug}`);
        const data = res.data;

        if (data.id_secciones === 2) {
          setTipo('programas');
          return;
        }

        // CORRECCIÓN: Eliminamos la lógica de enrutamiento directo a 'eventos'.
        // Ahora, una página de eventos es tratada como una página genérica,
        // y el componente PaginaGenerica se encargará de mostrar la tabla.
        setTipo('generico');
        return;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.error(`[RuteadorDinamico] Contenido con slug '${slug}' no encontrado.`);
          setTipo('error');
        } else {
          console.error('[RuteadorDinamico] Error al verificar contenido:', err);
          setTipo('error');
        }
      }
    };

    detectarTipo();
  }, [slug]);

  if (!tipo) {
    return <div className="text-center mt-5">Cargando contenido...</div>;
  }

  switch (tipo) {
    case 'detalle':
      return <PaginaDetallePrograma />;
    case 'programas':
      return <PaginaProgramas />;
    // CORRECCIÓN: El caso 'eventos' se ha eliminado del switch.
    // La página de eventos ahora se cargará como una página genérica.
    case 'generico':
      return <PaginaGenerica />;
    case 'error':
      return <h2 className="text-danger text-center mt-5">Error o contenido no encontrado.</h2>;
    default:
      return <h2 className="text-danger text-center mt-5">Contenido no encontrado.</h2>;
  }
};

export default RuteadorDinamico;