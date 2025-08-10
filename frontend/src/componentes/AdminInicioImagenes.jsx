//ADMINISTRADOR DE IMAGENES
//SE RELACIONA EN AdminInicioPanel

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminInicioImagenes = () => {
  const [imagenes, setImagenes] = useState([]);
  const [imagenFile, setImagenFile] = useState(null);
  const [posicion, setPosicion] = useState("");
  const [enlace, setEnlace] = useState("");
  const [alt, setAlt] = useState("");

  const cargarImagenes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-imagenes`
      );
      setImagenes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener imágenes:", error);
      setImagenes([]);
    }
  };

  useEffect(() => {
    cargarImagenes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Imagen", imagenFile);
    formData.append("Posicion", posicion);
    formData.append("Enlace", enlace);
    formData.append("Alt", alt);
    formData.append("id_inicio", 1);

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-imagenes`,
        formData
      );
      // Reemplazamos alert() con una función más amigable
      console.log("Imagen subida correctamente");
      setImagenFile(null);
      setPosicion("");
      setEnlace("");
      setAlt("");
      cargarImagenes();
    } catch (error) {
      console.error("Error al subir imagen:", error);
      console.error("Error al subir la imagen");
    }
  };

  const eliminarImagen = async (id) => {
    // Reemplazamos window.confirm con una confirmación en el console log
    console.log("¿Estás seguro de eliminar esta imagen? Si es así, procede a la eliminación.");

    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-imagenes/${id}`
      );
      console.log("Imagen eliminada");
      cargarImagenes();
    } catch (error) {
      console.error("Error al eliminar:", error);
      console.error("Error al eliminar imagen");
    }
  };

  return (
    <div className="mt-4">
      <h4>Agregar nueva imagen</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Imagen (.jpg, .png, etc)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImagenFile(e.target.files[0])}
            required
          />
        </div>

        <div className="col-md-2">
          <select
            name="Posicion"
            className="form-select"
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
            required
          >
            <option value="">Posicion</option>
            <option value="diplomado">diplomado</option>
            <option value="banner">banner</option>
            <option value="inicio">inicio</option>
            <option value="footer">footer</option>
          </select>
        </div>
        <br />
        <div className="mb-3">
          <label className="form-label">Enlace</label>
          <input
            type="text"
            className="form-control"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Texto alternativo (alt)</label>
          <input
            type="text"
            className="form-control"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Subir imagen
        </button>
      </form>
      <hr />
      <h4>Imágenes actuales</h4>
      <div className="row">
        {imagenes.map((img) => {
          // *** IMPORTANTE: Línea de depuración para ver la URL ***
          const imageUrl = `${import.meta.env.VITE_REACT_APP_API_URL}${img.Imagen}`;

          return (
            <div key={img.id_imagen} className="col-md-4 mb-3 text-center">
              <img
                src={imageUrl}
                alt={img.Alt}
                className="img-fluid mb-2"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />
              <p>
                <strong>Posición:</strong> {img.Posicion}
              </p>
              <p>
                <strong>Alt:</strong> {img.Alt}
              </p>
              <button
                className="btn btn-danger"
                onClick={() => eliminarImagen(img.id_imagen)}
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminInicioImagenes;