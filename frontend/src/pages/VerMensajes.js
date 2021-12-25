import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSinToken, fetchUrlencoded } from '../helpers/fetch';
import { useHistory } from 'react-router';
import moment from 'moment';

import '../styles/pages/mensajeria.css';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export default function VerMensajes() {

  const [mensaje, setMensaje] = useState({});
  const history = useHistory();
  const { correo } = useSelector( state => state.auth );

  const { idConversacion } = useParams();
  useEffect( () => {

    fetchSinToken( `conversaciones?uuid=${idConversacion}` )
      .then( res => res.json() )
      .then( data => {

        setMensaje( data.conversacion );

      });

  }, []);

  const handleVolver = () => {

    history.goBack();

  };

  const handleResponder = ( ) => {

    history.push({
      pathname: '../mensajes/nuevo',
      search: `?receptor=${mensaje.emisor}&emisor=${correo}&asunto=${mensaje.asunto}`
    });

  };

  const handleDelete = ( idConve ) => {

    fetchUrlencoded( `conversaciones?uuid=${idConve}`, {}, 'DELETE' )
      .then( ( response ) => response.json() )
      .then( ( data ) => {

        if ( data.ok ) {

          Swal.fire({
            title: 'Correo eliminado',
            text: 'El correo se ha eliminado satisfactoriamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            willClose: () => {

              history.goBack();

            }
          });

        } else {

          Swal.fire( 'Error', data.msg, 'error' );

        }

      });


  };

  return (
    <div className="ver-mensaje-container">
      <h1>Ver Mensajes</h1>
      <div className="div-buttons">
        {
          mensaje.emisor !== correo
            ? ( <button
              onClick={() => handleResponder( idConversacion )}
              className="btn btn-primary btn-mr-50"
            >Responder</button> )
            : ( <button
              onClick={() => handleResponder( idConversacion )}
              className="btn btn-primary btn-mr-50"
              disabled
            > Responder
            </button> )
        }

        <button onClick={() => handleVolver( )} className="btn btn-success btn-mr-50">Volver</button>
        <button onClick={() => handleDelete( idConversacion )} className="btn btn-danger">Eliminar</button>
      </div>
      <div style={{ marginTop: '50px' }} className="mensaje-card">
        <p><b>Fecha: </b> {moment( mensaje.fecha ).format( 'LLL' )}</p>
        <p><b>De: </b>{mensaje.emisor}</p>
        <p><b>Para: </b>{mensaje.receptor}</p>
        <p><b>Asunto: </b>{mensaje.asunto}</p>
        <p><b>Mensaje: </b> </p>
        <cite>{mensaje.texto}</cite>
      </div>
    </div>
  );

}
