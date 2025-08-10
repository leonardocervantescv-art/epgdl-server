//ADMINISTRADOR SOLO DE LOS HORARIOS
// SE UNE JUNTO CON EventoForm EN ADMINASIDE

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ContactoForm = ({ contacto, onSuccess }) => {
  const [Horario, setHorario] = useState('')
  const [Sabado, setSabado] = useState('')
  const [Informes, setInformes] = useState('')
  const [Diplomados, setDiplomados] = useState('')

  useEffect(() => {
    if (contacto) {
      setHorario(contacto.Horario)
      setSabado(contacto.Sabado)
      setInformes(contacto.Informes)
      setDiplomados(contacto.Diplomados)
    } else {
      setHorario('')
      setSabado('')
      setInformes('')
      setDiplomados('')
    }
  }, [contacto])

  const submit = async e => {
    e.preventDefault()
    try {
      if (contacto) {
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/contacto/${contacto.id_horarios}`, { Horario, Sabado, Informes, Diplomados })
      } else {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/aside/contacto`, { Horario, Sabado, Informes, Diplomados })
      }
      onSuccess()
    } catch (err) {
      console.error(err)
    }
    {alert('Horario Guardado Correctamente')}
  }

  return (
    <form onSubmit={submit} className="mb-3 p-3 border rounded">
      <h5>{contacto ? 'Editar Contacto' : 'Nuevo Contacto'}</h5>
      <input type="text" className="form-control mb-2" placeholder="Horario"
        value={Horario} onChange={e => setHorario(e.target.value)} />
      <input type="text" className="form-control mb-2" placeholder="Sábado"
        value={Sabado} onChange={e => setSabado(e.target.value)} />
      <input type="text" className="form-control mb-2" placeholder="Informes"
        value={Informes} onChange={e => setInformes(e.target.value)} />
      <input type="text" className="form-control mb-2" placeholder="Diplomados"
        value={Diplomados} onChange={e => setDiplomados(e.target.value)} />
      <button className="btn btn-primary">
        {contacto ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  )
}

export default ContactoForm
