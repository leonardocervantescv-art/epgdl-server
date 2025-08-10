import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";

const RegistrarUsuario = () => {
  const [form, setForm] = useState({
    Nombre: "",
    Usuario: "",
    Contrasena: "",
    Rol: "editor",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/usuarios`); // Verificamos si la respuesta es un array, de lo contrario usamos uno vacío
      setUsuarios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Error al cargar usuarios");
      setUsuarios([]); // En caso de error, también establecemos un array vacío
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      if (editando) {
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/usuarios/${editando}`, form);
        setMensaje("Usuario actualizado correctamente");
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/register`, form);
        setMensaje("Usuario registrado correctamente");
      }
      setForm({ Nombre: "", Usuario: "", Contrasena: "", Rol: "editor" });
      setEditando(null);
      obtenerUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar usuario");
    }
  };

  const handleEditar = (usuario) => {
    setForm({
      Nombre: usuario.Nombre,
      Usuario: usuario.Usuario,
      Contrasena: "", // se deja vacío para que escriba una nueva
      Rol: usuario.Rol,
    });
    setEditando(usuario.id_usuarios);
    setMensaje("");
    setError("");
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/usuarios/${id}`);
        obtenerUsuarios();
      } catch (err) {
        setError("Error al eliminar usuario");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h3 className="mb-4">
          {editando ? "Editar usuario" : "Registrar nuevo usuario"}
        </h3>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label>Nombre</label>
            <input
              type="text"
              className="form-control"
              name="Nombre"
              value={form.Nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Usuario</label>
            <input
              type="text"
              className="form-control"
              name="Usuario"
              value={form.Usuario}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="Contrasena"
              value={form.Contrasena}
              onChange={handleChange}
              required={!editando}
            />
          </div>
          <div className="mb-3">
            <label>Rol</label>
            <select
              className="form-select"
              name="Rol"
              value={form.Rol}
              onChange={handleChange}
            >
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            {editando ? "Actualizar" : "Registrar"}
          </button>
        </form>

        <hr />

        <h4 className="mt-4">Usuarios registrados</h4>
        <table className="table table-bordered table-hover mt-3">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuarios}>
                <td>{u.Nombre}</td>
                <td>{u.Usuario}</td>
                <td>{u.Rol}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditar(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(u.id_usuarios)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RegistrarUsuario;
