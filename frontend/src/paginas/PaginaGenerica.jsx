// frontend/src/pages/PaginaGenerica.jsx

// frontend/src/pages/PaginaGenerica.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../componentes/Header";
import Banner from "../componentes/Banner";
import EventoSide from "../componentes/EventoSide";
import Footer from "../componentes/Footer";
import EventosTable from "./EventosTable";

const PaginaGenerica = () => {
  const { slug } = useParams();
  const [contenido, setContenido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/slug/${slug}`
        );
        setContenido(res.data);
      } catch (err) {
        console.error("[PaginaGenerica] Error al obtener contenido:", err);
        setError("Página no encontrada.");
      }
    };
    fetchContenido();
  }, [slug]);

  if (error) {
    return (
      <div>
        <Header />
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );
  }

  if (!contenido) {
    return (
      <div>
        <Header />
        <p>Cargando…</p>
      </div>
    );
  }




  return (
    <>
      <Header />

      <div className="container slider-banner my-3">
        <Banner slug={contenido.slug} />
      </div>

      <div className="container my-4">
        <div className="row">
          <aside className="col-md-4 col-lg-3 mb-3">
            <EventoSide />
          </aside>
          <section className="col-md-8 col-lg-9">
            <div dangerouslySetInnerHTML={{ __html: contenido.Texto || "" }} />
            {contenido.extra === "evento" && <EventosTable />}
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaginaGenerica;

//REVISAR ENDPOINTS
