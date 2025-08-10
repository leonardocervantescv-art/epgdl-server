import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import axios from "axios";
import Footer from "../componentes/Footer";

const Banner = ({ slug }) => (
  <div className="bg-blue-500 text-white p-8 text-center">  
  </div>
);



const PaginaProgramas = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [contenido, setContenido] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContenidoYProgramas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Obtener el contenido actual
        const resContenido = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/slug/${slug}`
        );
        setContenido(resContenido.data);

        // Obtener programas relacionados con el contenido
        const resProgramas = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/${resContenido.data.id_contenido}`
        );

        // AQUI ESTÁ EL CAMBIO CLAVE: se verifica si la respuesta es un array.
        // Si no lo es, se establece como un array vacío para evitar el error.
        const programasData = Array.isArray(resProgramas.data) ? resProgramas.data : [];
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

  const handleClick = (programaSlug) => {
    navigate(`/programas/${programaSlug}`);
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Header />
        <p>Cargando programas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Header />
        <h2 className="text-danger">{error}</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="pagina-programas container-fluid px-3">
        <Banner slug={slug} />
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
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default PaginaProgramas;