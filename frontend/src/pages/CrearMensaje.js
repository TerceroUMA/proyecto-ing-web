import React from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import { useForm } from '../hooks/useForm';

import '../styles/pages/CrearMensaje.css';

export default function CrearMensaje() {

  const [formValues, handleInputChange] = useForm({
    asunto: '',
    texto: '',
    email: ''
  });

  const { asunto, texto, email } = formValues;

  const { uuid: usuarioConectado } = useSelector( state => state.auth );

  const handleCrearMensaje = ( e ) => {

    e.preventDefault();

    fetchUrlencoded( `conversaciones?idUsuario=${usuarioConectado}`, { receptor: email, asunto, texto }, 'POST' )
      .then( ( response ) => response.json() )
      .then( ( data ) => {

        console.log( data );

      });

  };

  return (
    <div className="crear-mensaje-container">
      <h1>Crear mensaje nuevo</h1>
      <form>
        <label htmlFor="email">Email del receptor. Mirar su correo en el perfil del usuario</label>
        <input
          className="form-control"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
        />
        <label htmlFor="texto" style={{ alignSelf: 'flex-start' }}>Asunto</label>
        <input
          className="form-control"
          type="text"
          name="asunto"
          placeholder="Asunto"
          value={asunto}
          onChange={handleInputChange}
        />
        <label htmlFor="texto" style={{ alignSelf: 'flex-start' }}>Mensaje</label>
        <textarea
          name="texto"
          placeholder="Escribe aquí tu mensaje"
          className="form-control"
          value={texto}
          onChange={handleInputChange}
        />
        <button
          className="btn btn-primary"
          onClick={handleCrearMensaje}
        >
          Enviar
        </button>
      </form>
    </div>
  );

}
