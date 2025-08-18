import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../componentes/Header";
import Banner from "../componentes/Banner";
import EventoSide from "../componentes/EventoSide";
import Footer from "../componentes/Footer";

const PaginaDetallePrograma = () => {
  // Obtiene el 'slug' de la URL
  const { slug } = useParams();

  // Estados para manejar los datos y errores
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [bloqueActivo, setBloqueActivo] = useState(null);

  // Efecto que se ejecuta cada vez que el 'slug' cambia
  useEffect(() => {
    const fetchData = async () => {
      // Reinicia los estados de error y detalle en cada nuevo 'slug'
      setError(null);
      setDetalle(null);
      setBloques([]);

      try {
        // Petición para obtener los detalles del programa
        const detalleRes = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/slug/${slug}`);
        setDetalle(detalleRes.data);

        // Petición para obtener los bloques del programa
        const bloquesRes = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/bloques/slug/${slug}`);
        const data = Array.isArray(bloquesRes.data) ? bloquesRes.data : [];
        setBloques(data);

        // Si hay bloques, establece el primero como activo
        if (data.length > 0) {
          setBloqueActivo(data[0].id_bloque);
        }
      } catch (err) {
        // Captura cualquier error de las peticiones
        console.error("[PaginaDetallePrograma] Error al obtener datos:", err);

        // Maneja el error 404 de forma específica
        if (err.response && err.response.status === 404) {
          setError("Detalle del programa no encontrado.");
        } else {
          setError("Ocurrió un error al cargar los datos.");
        }
      }
    };

    fetchData();
  }, [slug]);

  // Renderiza el mensaje de error si existe
  if (error) {
    return (
      <div>
        <Header />
        <h2 className="text-danger text-center mt-4">{error}</h2>
      </div>
    );
  }

  // Muestra el mensaje de carga mientras se obtienen los datos
  if (!detalle) {
    return (
      <div>
        <Header />
        <p className="text-center mt-4">Cargando…</p>
      </div>
    );
  }

  // Renderiza el contenido completo si no hay errores y los datos se han cargado
  return (
    <div className="container-fluid">
      <Header />

      <div className="slider-banner">
        <Banner slug={slug} />
      </div>

      <div className="container my-4">
        <div className="row">
          <aside className="col-md-4 col-lg-3 mb-3">
            <EventoSide />
          </aside>
          <section className="col-md-9">
            {detalle.Banner && (
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_URL}${detalle.Banner}`}
                alt={detalle.Nombre}
                className="img-fluid mb-4"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: detalle.Texto || "" }} />

            {/* Bloques académicos */}
            {bloques.length > 0 && (
              <div className="mt-5">
                <h4 className="text-success">PROGRAMA ACADÉMICO</h4>
                <ul className="nav nav-tabs mb-3">
                  {bloques.map((bloque) => (
                    <li className="nav-item" key={bloque.id_bloque}>
                      <button
                        className={`nav-link ${
                          bloqueActivo === bloque.id_bloque ? "active" : ""
                        }`}
                        onClick={() => setBloqueActivo(bloque.id_bloque)}
                      >
                        {bloque.bloque_nombre}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border rounded p-3 bg-white">
                  {bloques.map((bloque) =>
                    bloque.id_bloque === bloqueActivo ? (
                      <div key={bloque.id_bloque}>
                        <div
                          dangerouslySetInnerHTML={{ __html: bloque.contenido }}
                        ></div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default PaginaDetallePrograma;