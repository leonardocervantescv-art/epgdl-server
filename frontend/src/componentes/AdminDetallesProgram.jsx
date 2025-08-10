import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import EditorTiptap from "./EditorTipTap";

const AdminDetallesProgramas = () => {
  const [programas, setProgramas] = useState([]);
  const [slugSeleccionado, setSlugSeleccionado] = useState("");
  const [bannerActual, setBannerActual] = useState(null);
  const [bannerArchivo, setBannerArchivo] = useState(null);
  const [textoPrograma, setTextoPrograma] = useState("");
  const [editor, setEditor] = useState(null);
  const [editorBloques, setEditorBloques] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [bloqueForm, setBloqueForm] = useState({
    bloque_nombre: "",
    contenido: "",
  });
  const [editandoBloqueId, setEditandoBloqueId] = useState(null);

  // Obtener todos los programas
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/all`)
      .then((res) => {
        setProgramas(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setProgramas([]);
      });
  }, []);

  // Cambiar contenido y banner según el slug seleccionado
  useEffect(() => {
    if (!slugSeleccionado) {
      setBannerActual(null);
      setTextoPrograma("");
      setBloques([]);
      if (editor?.commands?.setContent) editor.commands.setContent("");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/slug/${slugSeleccionado}`)
      .then((res) => {
        setBannerActual(res.data.Banner || null);
        setTextoPrograma(res.data.Texto || "");
        if (editor?.commands?.setContent)
          editor.commands.setContent(res.data.Texto || "");
      })
      .catch(() => {
        setBannerActual(null);
        setTextoPrograma("");
        if (editor?.commands?.setContent) editor.commands.setContent("");
      });

    // Obtener bloques
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/bloques/slug/${slugSeleccionado}`)
      .then((res) => setBloques(res.data))
      .catch((err) => console.error("Error al obtener bloques:", err));
  }, [slugSeleccionado, editor]);

  const handleGuardarTexto = async () => {
    const contenidoHTML = editor?.getHTML?.() || "";
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/upload`, {
        slug: slugSeleccionado,
        texto: contenidoHTML,
      });
      // Reemplazamos alert()
      console.log("Texto guardado correctamente");
    } catch (err) {
      console.error(err);
      console.log("Error al guardar el texto");
    }
  };

  const handleSubirBanner = async () => {
    const formData = new FormData();
    formData.append("slug", slugSeleccionado);
    formData.append("banner", bannerArchivo);

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/programas/slug/${slugSeleccionado}`);
      setBannerActual(res.data.Banner || null);
      setBannerArchivo(null);
      // Reemplazamos alert()
      console.log("Banner actualizado");
    } catch (err) {
      console.error(err);
      console.log("Error al subir banner");
    }
  };

  const handleGuardarBloque = async () => {
    const programa = programas.find((p) => p.slug === slugSeleccionado);
    if (!programa) return;

    const contenidoHTML = editorBloques?.getHTML?.() || "";
    try {
      if (editandoBloqueId) {
        // SOLUCIÓN: Agrega la URL base aquí
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/bloques/${editandoBloqueId}`, {
          ...bloqueForm,
          contenido: contenidoHTML,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/bloques`, {
          ...bloqueForm,
          contenido: contenidoHTML,
          slug: slugSeleccionado,
        });
      }
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/bloques/slug/${slugSeleccionado}`);
      setBloques(res.data);
      setBloqueForm({ bloque_nombre: "", contenido: "" });
      setEditandoBloqueId(null);
      if (editorBloques?.commands?.setContent)
        editorBloques.commands.setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditarBloque = (bloque) => {
    setBloqueForm({
      bloque_nombre: bloque.bloque_nombre,
      contenido: bloque.contenido,
    });
    setEditandoBloqueId(bloque.id_bloque);
    if (editorBloques?.commands?.setContent)
      editorBloques.commands.setContent(bloque.contenido || "");
  };

  const handleEliminarBloque = async (id) => {
    // Reemplazamos confirm()
    console.log("Confirmación: ¿Seguro de eliminar este bloque?");
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/bloques/${id}`);
      setBloques(bloques.filter((b) => b.id_bloque !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Editor de Detalles de Programas</h2>

        <div className="mb-3">
          <label>Selecciona Programa (slug)</label>
          <select
            className="form-select"
            value={slugSeleccionado}
            onChange={(e) => setSlugSeleccionado(e.target.value)}
          >
            <option value="">-- Elige un programa --</option>
            {Object.entries(
              programas.reduce((acc, programa) => {
                const titulo = programa.Titulo;
                if (!acc[titulo]) acc[titulo] = [];
                acc[titulo].push(programa);
                return acc;
              }, {})
            ).map(([titulo, programasPorTitulo]) => (
              <optgroup key={titulo} label={titulo}>
                {programasPorTitulo.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.Nombre} ({p.slug})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Banner actual */}
        <div className="mb-3">
          <label>Banner actual:</label>
          <br />
          {bannerActual ? (
            <img
              src={`${import.meta.env.VITE_REACT_APP_API_URL}${bannerActual}`}
              alt="Banner"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <p>No hay banner</p>
          )}
        </div>

        <input
          type="file"
          className="form-control"
          onChange={(e) => setBannerArchivo(e.target.files[0])}
        />
        <button className="btn btn-success mt-2" onClick={handleSubirBanner}>
          Subir Banner
        </button>

        {/* Editor */}
        <div className="mt-4">
          <label>Texto del programa:</label>
          <div className="editor-wrapper border p-2">
            <EditorTiptap
              key={slugSeleccionado}
              initialContent={textoPrograma}
              onEditorReady={setEditor}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={handleGuardarTexto}>
            Guardar Texto
          </button>
        </div>

        {/* Bloques académicos */}
        <div className="mt-5">
          <h4>Programa Académico</h4>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Nombre del bloque (Ej. 1er Bloque)"
            value={bloqueForm.bloque_nombre}
            onChange={(e) =>
              setBloqueForm({ ...bloqueForm, bloque_nombre: e.target.value })
            }
          />
          <div className="editor-wrapper border p-2">
            {" "}
            <EditorTiptap
              key={editandoBloqueId || "nuevo-bloque"}
              initialContent={bloqueForm.contenido}
              onEditorReady={setEditorBloques}
            />
          </div>
          <button
            className="btn btn-primary mb-3 mt-2"
            onClick={handleGuardarBloque}
          >
            {editandoBloqueId ? "Actualizar Bloque" : "Agregar Bloque"}
          </button>

          {bloques.map((b) => (
            <div key={b.id_bloque} className="border p-2 mb-2">
              <strong>{b.bloque_nombre}</strong>
              <p dangerouslySetInnerHTML={{ __html: b.contenido }}></p>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEditarBloque(b)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleEliminarBloque(b.id_bloque)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDetallesProgramas;