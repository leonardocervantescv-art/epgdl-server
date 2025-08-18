// frontend/src/pages/PaginaProgramas.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import axios from "axios";
import Footer from "../componentes/Footer";

const Banner = ({ slug }) => (
  <div className="bg-blue-500 text-white p-8 text-center"></div>
);

const PaginaProgramas = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [contenido, setContenido] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slugEventos, setSlugEventos] = useState("");
  const [seccionEventos, setSeccionEventos] = useState("");

  // 🔹 Hook 1: obtener contenido + programas
  useEffect(() => {
    const fetchContenidoYProgramas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resContenido = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/slug/${slug}`
        );
        setContenido(resContenido.data);

        const resProgramas = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${resContenido.data.id_contenido}`
        );

        const programasData = Array.isArray(resProgramas.data)
          ? resProgramas.data
          : [];
        setProgramas(programasData);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError("Página no encontrada o error en la conexión.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContenidoYProgramas();
  }, [slug]);

  // 🔹 Hook 2: datos para botón de eventos
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/extra/evento`)
      .then((res) => {
        setSlugEventos(res.data.slug);
        setSeccionEventos(res.data.extra);
      })
      .catch(console.error);
  }, []);

  const handleClick = (programaSlug) => {
    navigate(`/programas/${programaSlug}`);
  };

  const handleIrAEventos = () => {
    if (seccionEventos && slugEventos) {
      navigate(`/${seccionEventos}/${slugEventos}`);
    }
  };

  return (
    <>
      <Header />

      <div className="pagina-programas container-fluid px-3">
        <Banner slug={slug} />

        {/* 🔹 Loading */}
        {isLoading && (
          <div className="text-center mt-5">
            <p>Cargando programas...</p>
          </div>
        )}

        {/* 🔹 Error */}
        {!isLoading && error && (
          <div className="text-center mt-5">
            <h2 className="text-danger">{error}</h2>
          </div>
        )}

        {/* 🔹 Contenido principal */}
        {!isLoading && !error && (
          <>
            <div className="text-center mb-4 card-title">
              <h1 className="mdb-program hover-underline">
                {slug.replace(/-/g, " ").toUpperCase()}
              </h1>
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-md-10">
                <div className="album py-5">
                  <div className="container">
                    {programas.length > 0 ? (
                      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-4 justify-content-center">
                        {programas.map((programa, index) => (
                          <div className="col" key={index}>
                            <div className="card-item">
                              <div className="card-content card-front">
                                <h3>{programa.Nombre}</h3>
                              </div>
                              <div className="card-content card-back">
                                <p>{programa.Descripcion}</p>
                                <button
                                  className="btn mt2"
                                  onClick={() => handleClick(programa.slug)}
                                >
                                  Ver más
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center mt-4">
                        <p>No se encontraron programas para este contenido.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <footer>
          <Footer />
        </footer>

        {/* 🔹 BOTONES FLOTANTES */}
        <div
          className="floating-btn whatsapp-btn"
          onClick={() =>
            window.open(
              "https://api.whatsapp.com/send?phone=8112142744&text=Hola, me gustaría recibir más información",
              "_blank"
            )
          }
        >
          <i className="fab fa-whatsapp"></i>
          <span>WhatsApp</span>
        </div>

        <div className="floating-btn eventos-btn" onClick={handleIrAEventos}>
          <i className="fas fa-calendar-alt"></i>
          <span>Eventos</span>
        </div>
      </div>
    </>
  );
};

export default PaginaProgramas;
