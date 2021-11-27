import Swal from 'sweetalert2';
import { fetchUrlencoded } from '../helpers/fetch';
import { types } from '../types/types';

const login = ( user ) => ({
  type: types.login,
  payload: user
});

export const registrarse = ( nombre, correo, password, confirmarPassword, apellidos, telefono, edad, localidad, sendToHome ) => {

  return async ( dispatch ) => {

    try {

      const respuesta = await fetchUrlencoded( 'users', { nombre, apellidos, correo, password, confirmarPassword, edad, telefono, localidad }, 'POST' );
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

        dispatch( login( data.usuario ) );

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

    const respuesta = await fetchUrlencoded( 'users/login', { correo, password }, 'POST' );
    const data = await respuesta.json();

    if ( data.ok ) {

      dispatch( login( data.usuario ) );

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

const logout = {
  type: types.logout
};

export const cerrarSesion = () => {

  localStorage.removeItem( 'usuario' );

  return logout;

};
