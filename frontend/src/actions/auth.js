import Swal from 'sweetalert2';
import { fetchSinToken } from '../helpers/fetch';
import { types } from '../types/types';

const login = ( user ) => ({
  type: types.login,
  payload: user
});

export const registrarse = ( nombre, correo, password, confirmarPassword, apellidos, telefono, edad, localidad, sendToHome ) => {

  return async ( dispatch ) => {

    try {

      const respuesta = await fetchSinToken( 'users', { nombre, apellidos, correo, password, confirmarPassword, edad, telefono, localidad }, 'POST' );
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

export const iniciarSesion = ( correo, password, sendToHome ) => {

  return async ( dispatch ) => {

    const respuesta = await fetchSinToken( 'users/login', { correo, password }, 'POST' );
    const data = await respuesta.json();

    if ( data.ok ) {

      console.log( data );

      /* data.user.uuid = data.user.correo;
      dispatch( login( data.user ) );

      Swal.fire({
        title: 'Bienvenido',
        text: data.msg,
        icon: 'success',
        willClose: () => {

          sendToHome();

        }
      }); */

    } else {

      if ( data.msg ) {

        Swal.fire( 'Error', data.msg, 'error' );

      } else {

        Swal.fire( 'Error', data.errorsArray[0], 'error' );

      }

    }

  };

};
