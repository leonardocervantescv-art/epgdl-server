//ADMINISTRADOR DE btnbajos y campus
//SE RELACIONA EN AdminInicioPanel

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminInicioBanners = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    Posicion: "",
    Alt: "",
    Enlace: "",
    Banner: null,
  });

  const cargarBanners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-banners`); // Nos aseguramos de que `res.data` sea un array
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar banners:", error);
      setBanners([]); // En caso de error, también establecemos un array vacío
    }
  };

  useEffect(() => {
    cargarBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Banner") {
      setFormData({ ...formData, Banner: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = new FormData();
    datos.append("Posicion", formData.Posicion);
    datos.append("Alt", formData.Alt);
    datos.append("Enlace", formData.Enlace);
    datos.append("Banner", formData.Banner);
    datos.append("id_inicio", 1);

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-banners`, datos);
      setFormData({ Posicion: "", Alt: "", Enlace: "", Banner: null });
      cargarBanners();
    } catch (error) {
      console.error("Error al subir banner:", error);
    }
  };

  const eliminarBanner = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este banner?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-banners/${id}`); // La URL estaba mal, la corregimos
        cargarBanners();
      } catch (error) {
        console.error("Error al eliminar banner:", error);
      }
    }
  };

  return (
    <div className="mt-4">
      <h4>Agregar Banner (Banners Circulares)</h4>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-2">
          <select
            name="Posicion"
            className="form-select"
            value={formData.Posicion}
            onChange={handleChange}
            required
          >
            <option value="">Posición</option>
            <option value="btnbajos">btnbajos</option>
            <option value="campus">campus</option>
            <option value="proximos">proximos</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="Alt"
            className="form-control"
            placeholder="Texto alternativo"
            value={formData.Alt}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="Enlace"
            className="form-control"
            placeholder="Enlace (opcional)"
            value={formData.Enlace}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="file"
            name="Banner"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn btn-success w-100">
            Guardar Banner
          </button>
        </div>
      </form>

      <hr />

      <h5>Banners actuales</h5>
      <div className="row">
        {banners.map((b) => (
          <div key={b.id_banner} className="col-md-4 mb-3">
            <div className="card">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_URL}${b.Banner}`}
                alt={b.Alt}
              />

              <div className="card-body">
                <p>
                  <strong>Posición:</strong> {b.Posicion}
                </p>
                <p>
                  <strong>Alt:</strong> {b.Alt}
                </p>
                <p>
                  <strong>Enlace:</strong> {b.Enlace}
                </p>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => eliminarBanner(b.id_banner)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInicioBanners;
