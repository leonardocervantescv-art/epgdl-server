import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminHeader = () => {
  const [form, setForm] = useState({
    Logo: '',
    linkFB: '',
    linkIG: '',
    linkTT: '',
    linkLN: ''
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/header`)
      .then(res => setForm(res.data))
      .catch(err => console.error('Error al cargar header:', err));
  }, []);

  // Para guardar Imagen
  const handleFileChange = (e) => {
    setForm({ ...form, Logo: e.target.files[0] }); // guarda el File
  };


// Para guardar Logo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };



  const guardar = () => {
    const formData = new FormData();
    formData.append('linkFB', form.linkFB);
    formData.append('linkIG', form.linkIG);
    formData.append('linkTT', form.linkTT);
    formData.append('linkLN', form.linkLN);
    if (form.Logo instanceof File){
      formData.append('Logo', form.Logo);
    }

    axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/header/1`, formData)
      .then(() => alert('Header actualizado correctamente'))
      .catch(err => console.error('Error al actualizar header:', err));
  };


  return (
    <div className="mt-5">
      <h4>Logos y Redes Sociales</h4>
      <div className="form-group mb-2">
        <label>Logo (URL):</label>
        <input type="file" className="form-control" name="Logo" onChange={handleFileChange} />
        {/* PARA MOSTRAR VISTA PREVIA  */}
        {typeof form.Logo === 'string' && (
          <img
            src={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${form.Logo}`}
            alt="Logo actual"
            style={{ height: '40px', marginTop: '10px' }}
          />
        )}

      </div>
      <div className="form-group mb-2">
        <label>Facebook:</label>
        <input type="text" className="form-control" name="linkFB" value={form.linkFB} onChange={handleInputChange} />
      </div>
      <div className="form-group mb-2">
        <label>Instagram:</label>
        <input type="text" className="form-control" name="linkIG" value={form.linkIG} onChange={handleInputChange} />
      </div>
      <div className="form-group mb-2">
        <label>TikTok:</label>
        <input type="text" className="form-control" name="linkTT" value={form.linkTT} onChange={handleInputChange} />
      </div>
      <div className="form-group mb-2">
        <label>LinkedIn:</label>
        <input type="text" className="form-control" name="linkLN" value={form.linkLN} onChange={handleInputChange} />
      </div>
      <button className="btn btn-primary mt-3" onClick={guardar}>Guardar</button>
    </div>
  );
};

export default AdminHeader;
