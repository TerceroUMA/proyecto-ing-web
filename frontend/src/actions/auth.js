import Swal from 'sweetalert2';
import { fetchFormData, fetchUrlencoded } from '../helpers/fetch';
import { types } from '../types/types';

export const login = ( user ) => ({
  type: types.login,
  payload: user
});

export const registrarse = ( nombre, correo, password, confirmarPassword, apellidos, telefono, edad, localidad, file, sendToHome ) => {

  return async ( dispatch ) => {

    try {

      const formData = new FormData();
      formData.append( 'nombre', nombre );
      formData.append( 'correo', correo );
      formData.append( 'password', password );
      formData.append( 'confirmarPassword', confirmarPassword );
      formData.append( 'apellidos', apellidos );
      formData.append( 'telefono', telefono );
      formData.append( 'edad', edad );
      formData.append( 'localidad', localidad );
      formData.append( 'imagen', file );

      const respuesta = await fetchFormData( 'users/registrarse', formData, 'POST' );
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

        localStorage.setItem( 'usuario', JSON.stringify( data.usuario ) );

        dispatch( login( data.usuario ) );

      } else {

        if ( data.msg ) {

          Swal.fire( 'Error', data.msg, 'error' );

        } else {

          Swal.fire( 'Error', data.errorsArray[0], 'error' );

        }


      }

    } catch ( error ) {

      console.log( error );

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

      localStorage.setItem( 'usuario', JSON.stringify( data.usuario ) );

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

  localStorage.clear();

  return logout;

};
