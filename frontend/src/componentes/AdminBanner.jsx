//ADMINISTRADOR DE BANNERS Y CONTENIDO

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import EditorTiptap from "./EditorTipTap";

const AdminBanner = ({ onSuccess }) => {
  const [contenidos, setContenidos] = useState([]);
  const [slugSeleccionado, setSlugSeleccionado] = useState("");
  const [bannerArchivo, setBannerArchivo] = useState(null);
  const [bannerActual, setBannerActual] = useState(null);
  const [textoPagina, setTextoPagina] = useState("");
  const [editor, setEditor] = useState(null);

  // Obtener todas las páginas disponibles
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/filter`)
      .then((res) => {
        // Si la respuesta es un array, la usamos; de lo contrario, usamos un array vacío.
        setContenidos(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setContenidos([]); // En caso de error, también establecemos un array vacío.
      });
  }, []);

  // Cargar datos del contenido seleccionado
  useEffect(() => {
    if (!slugSeleccionado) {
      setBannerActual(null);
      if (editor?.commands?.setContent) editor.commands.setContent("");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/slug/${slugSeleccionado}`)
      .then((res) => {
        setBannerActual(res.data.Banner || null);
        setTextoPagina(res.data.Texto || "");
        if (editor?.commands?.setContent)
          editor.commands.setContent(res.data.Texto || "");
      })
      .catch((err) => {
        console.error("Error al obtener el contenido:", err);
        setBannerActual(null);
        setTextoPagina("");
        if (editor?.commands?.setContent) editor.commands.setContent("");
      });
  }, [slugSeleccionado, editor]);

  // Guardar solo el texto
  const handleGuardarTexto = async () => {
    if (!slugSeleccionado) {
      alert("Debes elegir una página.");
      return;
    }

    const contenidoHTML = editor?.getHTML?.() || "";

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/banner/upload`, {
        slug: slugSeleccionado,
        texto: contenidoHTML,
      });

      alert("Texto actualizado correctamente.");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el texto.");
    }
  };

  // Subir imagen del banner
  const handleSubirBanner = async () => {
    if (!slugSeleccionado) {
      alert("Debes elegir una página.");
      return;
    }

    if (!bannerArchivo) {
      alert("Debes seleccionar una imagen para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("slug", slugSeleccionado);
    formData.append("banner", bannerArchivo);

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/banner/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Banner subido correctamente.");
      if (onSuccess) onSuccess();

      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/slug/${slugSeleccionado}`);
      setBannerActual(res.data.Banner || null);
      setBannerArchivo(null);
    } catch (err) {
      console.error(err);
      alert("Error al subir el banner.");
    }
  };

  // Eliminar banner
  const handleEliminarBanner = async () => {
    if (!slugSeleccionado) return;

    const confirm = window.confirm("¿Estás seguro de eliminar este banner?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/banner/slug/${slugSeleccionado}`);
      alert("Banner eliminado correctamente.");
      setBannerActual(null);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el banner.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Administrador de Banners y Contenido</h2>

        {/* Selector de página */}
        <div className="mb-3">
          <label className="form-label">Selecciona Página (Slug)</label>
          <select
            className="form-select"
            value={slugSeleccionado}
            onChange={(e) => setSlugSeleccionado(e.target.value)}
            required
          >
            <option value="">-- Elige una página --</option>
            {contenidos.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.Titulo} ({c.slug})
              </option>
            ))}
          </select>
        </div>

        {/* Banner actual */}
        <div className="mb-3">
          <label className="form-label">Banner actual:</label>
          {bannerActual ? (
            <div>
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_URL}${bannerActual}`}
                alt="Banner actual"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginBottom: "10px",
                }}
              />
            </div>
          ) : (
            <p className="text-muted fst-italic">No hay banner actualmente</p>
          )}
        </div>

        {/* Subir nuevo banner */}
        <div className="mb-3">
          <label className="form-label">Selecciona Imagen (Banner)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setBannerArchivo(e.target.files[0])}
          />
          <div>
            <button
              type="button"
              className="btn btn-success mt-2"
              onClick={handleSubirBanner}
            >
              Subir Banner
            </button>
            <br />
            <br />
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={handleEliminarBanner}
            >
              Eliminar Banner
            </button>
          </div>
        </div>
        <hr />

        {/* Editor de texto */}
        <div className="mb-3">
          <label className="form-label">Contenido de la Página</label>
          <div
            className="editor-wrapper"
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              minHeight: "200px",
            }}
          >
            <EditorTiptap
              key={slugSeleccionado}
              initialContent={textoPagina}
              onEditorReady={setEditor}
            />
          </div>
        </div>

        {/* Botón para guardar texto */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGuardarTexto}
        >
          Guardar Texto
        </button>
      </div>
      <br />
    </>
  );
};

export default AdminBanner;
