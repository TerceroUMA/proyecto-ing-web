import React from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import { useForm } from '../hooks/useForm';
import { useHistory } from 'react-router';

import Swal from 'sweetalert2';

import '../styles/pages/CrearMensaje.css';
import { useQuery } from '../hooks/useQuery';

export default function CrearMensaje() {

  const [formValues, handleInputChange] = useForm({
    asunto: '',
    texto: '',
    email: ''
  });

  const history = useHistory();
  const { asunto, texto, email } = formValues;
  const { uuid: usuarioConectado } = useSelector( state => state.auth );
  const query = useQuery();

  const receptor = query.get( 'receptor' );
  const nuevoAsunto = query.get( 'asunto' );

  const handleCrearMensaje = ( e ) => {

    e.preventDefault();

    const body = receptor
      ? { destinatario: receptor, asunto: `RE: ${nuevoAsunto}`, texto }
      : { destinatario: email, asunto, texto };

    fetchUrlencoded( `conversaciones?idUsuario=${usuarioConectado}`, body, 'POST' )
      .then( ( response ) => response.json() )
      .then( ( data ) => {

        if ( data.ok ) {

          Swal.fire({
            title: 'Correo enviado',
            text: `El correo se ha enviado a ${receptor || email}`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            willClose: () => {

              history.push( `/bandejaSalida/${usuarioConectado}` );

            }
          });

        } else {

          Swal.fire( 'Error', data.msg, 'error' );

        }

      });

  };

  return (
    <div className="crear-mensaje-container">
      <h1>Crear mensaje nuevo</h1>
      <form>
        <label htmlFor="email">Email del receptor. Mirar su correo en el perfil del usuario</label>
        <label htmlFor="texto" style={{ alignSelf: 'flex-start' }}>Destinatario:</label>
        {
          receptor
            ? (
              <>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder={receptor}
                  value={receptor}
                  disabled
                />
                <label htmlFor="texto" style={{ alignSelf: 'flex-start' }}>Asunto</label>
                <input
                  className="form-control"
                  type="text"
                  name="asunto"
                  placeholder={`Re: ${nuevoAsunto}`}
                  value={`Re: ${nuevoAsunto}`}
                  disabled
                />
              </>

            )
            : (
              <>
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
              </>
            )
        }
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
