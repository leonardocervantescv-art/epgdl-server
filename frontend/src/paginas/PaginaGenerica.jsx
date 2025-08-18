// frontend/src/pages/PaginaGenerica.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../componentes/Header";
import Banner from "../componentes/Banner";
import EventoSide from "../componentes/EventoSide";
import Footer from "../componentes/Footer";
import EventosTable from "./EventosTable";

const PaginaGenerica = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [contenido, setContenido] = useState(null);
  const [error, setError] = useState(null);
  const [slugEventos, setSlugEventos] = useState("");
  const [seccionEventos, setSeccionEventos] = useState("");

  // 🔹 Hook 1: obtener el contenido según el slug
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

  // 🔹 Hook 2: necesario para el botón flotante de eventos
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/extra/evento`)
      .then((res) => {
        setSlugEventos(res.data.slug);
        setSeccionEventos(res.data.extra);
      })
      .catch(console.error);
  }, []);

  const handleIrAEventos = () => {
    if (seccionEventos && slugEventos) {
      navigate(`/${seccionEventos}/${slugEventos}`);
    }
  };

  return (
    <>
      <Header />

      {/* 🔹 Manejo de error */}
      {error && (
        <div className="container my-4">
          <h2 style={{ color: "red" }}>{error}</h2>
        </div>
      )}

      {/* 🔹 Cargando */}
      {!error && !contenido && (
        <div className="container my-4">
          <p>Cargando…</p>
        </div>
      )}

      {/* 🔹 Contenido principal */}
      {contenido && (
        <>
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
        </>
      )}

      <Footer />

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
    </>
  );
};

export default PaginaGenerica;
