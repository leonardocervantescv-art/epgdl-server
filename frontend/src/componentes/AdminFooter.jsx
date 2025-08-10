//ADMINISTRADOR DEL FOOTER
//SE RELACIONA EN AdminInicioPanel


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFooter = () => {
  const [footer, setFooter] = useState(null);
  const [form, setForm] = useState({
    Logo: null,
    Mapa: null,
    telImagen: null,
    Telefono: '',
    Direccion: '',
    Campus: '',
    Copyright: '',
  });

  const fetchFooter = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/footer`);
      const data = res.data;

      if (data && data.id_footer) {
        setFooter(data);
        setForm({
          Logo: null,
          Mapa: null,
          telImagen: null,
          Telefono: data.Telefono || '',
          Direccion: data.Direccion || '',
          Campus: data.Campus || '',
          Copyright: data.Copyright || '',
        });
      }
    } catch (error) {
      console.error('Error al obtener footer:', error);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (form.Logo) formData.append('Logo', form.Logo);
      if (form.Mapa) formData.append('Mapa', form.Mapa);
      if (form.telImagen) formData.append('telImagen', form.telImagen);
      formData.append('Telefono', form.Telefono);
      formData.append('Direccion', form.Direccion);
      formData.append('Campus', form.Campus);
      formData.append('Copyright', form.Copyright);

      if (footer?.id_footer) {
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/footer/${footer.id_footer}`, formData);
        alert('Footer actualizado correctamente');
        fetchFooter(); // Recargar datos actualizados
      } else {
        alert('No hay footer para actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar footer:', error);
    }
  };

  return (
    <>
    <div className="container mt-4">
      <h2>Administrador del Footer</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Logo (imagen)</label>
          <input className="form-control" type="file" name="Logo" onChange={handleFileChange} />
          {footer?.Logo && (
            <img src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${footer.Logo}`} alt="Logo actual" width="150" className="mt-2" />
          )}
        </div>

        <div className="mb-3">
          <label>Mapa (imagen)</label>
          <input className="form-control" type="file" name="Mapa" onChange={handleFileChange} />
          {footer?.Mapa && (
            <img src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${footer.Mapa}`} alt="Mapa actual" width="150" className="mt-2" />
          )}
        </div>

        <div className="mb-3">
        <label>Teléfono (imagen)</label>
        <input className="form-control" type="file" name="telImagen" onChange={handleFileChange} />
        {footer?.telImagen && (
          <img src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${footer.telImagen}`} alt="Teléfono actual" width="150" className="mt-2" />
        )}
        </div>


        <div className="mb-3">
          <label>Teléfono</label>
          <textarea
            className="form-control"
            name="Telefono"
            value={form.Telefono}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <textarea
            className="form-control"
            name="Direccion"
            value={form.Direccion}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label>Campus</label>
          <input
            className="form-control"
            type="text"
            name="Campus"
            value={form.Campus}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label>Copyright</label>
          <textarea
            className="form-control"
            name="Copyright"
            value={form.Copyright}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Actualizar Footer
        </button>
      </form>
    </div>
    </>
  );
};

export default AdminFooter;
