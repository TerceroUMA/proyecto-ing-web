import Swal from 'sweetalert2';
import { fetchSinToken } from '../helpers/fetch';
import { types } from '../types/types';

const login = ( user ) => ({
  type: types.login,
  payload: user
});

export const registrarse = ( nombre, email, password, confPassword, sendToHome ) => {

  return async ( dispatch ) => {

    try {

      const respuesta = await fetchSinToken( 'auth/new', { nombre, email, password, confPassword }, 'POST' );
      const data = await respuesta.json();

      if ( data.ok ) {

        Swal.fire({
          title: 'Registro',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          willClose: () => {

            sendToHome();

          }
        });

        data.user.uuid = data.user.nombre;
        delete data.user.nombre;
        dispatch( login( data.user ) );

      } else {

        if ( data.msg ) {

          Swal.fire( 'Error', data.msg, 'error' );

        } else {

          Swal.fire( 'Error', data.errorsArray[0], 'error' );

        }


      }

    } catch ( error ) {

      Swal.fire( 'Error', 'Ha ocurrido algún error con el servidor', 'error' );

    }

  };

};

export const iniciarSesion = ( nombre, password, sendToHome ) => {

  return async ( dispatch ) => {

    const respuesta = await fetchSinToken( 'auth', { nombre, password }, 'POST' );
    const data = await respuesta.json();

    if ( data.ok ) {

      data.user.uuid = data.user.nombre;
      delete data.user.nombre;
      dispatch( login( data.user ) );

      Swal.fire({
        title: 'Bienvenido',
        text: data.msg,
        icon: 'success',
        willClose: () => {

          sendToHome();

        }
      });

    } else {

      if ( data.msg ) {

        Swal.fire( 'Error', data.msg, 'error' );

      } else {

        Swal.fire( 'Error', data.errorsArray[0], 'error' );

      }

    }

  };

};
