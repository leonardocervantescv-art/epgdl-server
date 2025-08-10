// AdminInicioTextoVideo.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditorTipTap from './EditorTipTap';

const AdminInicioTextoVideo = () => {
  const [videoActual, setVideoActual] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [textoCargado, setTextoCargado] = useState(false);

  useEffect(() => {
    const fetchInicio = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio`);  
        const data = res.data[0];
        setVideoActual(data.Video);
        if (editorInstance && !textoCargado) {
          editorInstance.commands.setContent(data.Texto || '');
          setTextoCargado(true);
        }
      } catch (error) {
        console.error('Error al cargar contenido:', error);
      }
    };
    fetchInicio();
  }, [editorInstance, textoCargado]);

  const handleGuardarTexto = async () => {
    try {
      const formData = new FormData();
      formData.append('Texto', editorInstance.getHTML());
      formData.append('Video', videoActual); // mantener video actual

      await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio/1`, formData);
      alert('Texto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el texto:', error);
    }
  };

  const handleGuardarVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('Texto', editorInstance.getHTML()); // mantener texto actual
      if (videoFile) {
        formData.append('Video', videoFile);
      }

      await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio/1`, formData);
      alert('Video actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el video:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Texto Principal</h3>
      <EditorTipTap onEditorReady={setEditorInstance} />
      <button className="btn btn-primary mt-2" onClick={handleGuardarTexto}>
        Guardar Texto
      </button>

      <h3 className="mt-5">Video Principal</h3>
      {videoActual && (
        <video controls width="100%" className="mb-3">
          <source src={videoActual} type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
      )}
      <input
        type="file"
        className="form-control"
        accept="video/mp4"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />
      <button className="btn btn-success mt-2" onClick={handleGuardarVideo}>
        Guardar Video
      </button>
    </div>
  );
};

export default AdminInicioTextoVideo;
