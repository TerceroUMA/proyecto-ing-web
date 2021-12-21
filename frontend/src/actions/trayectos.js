import { fetchFormData, fetchUrlencoded } from '../helpers/fetch';
import Swal from 'sweetalert2';

export const crearTrayecto = ( origen, destino, tipoDeVehiculo, conductor, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad, imagen, sendToTrayectosCreados ) => {

  return async ( ) => {

    try {

      const formData = new FormData();
      formData.append( 'origen', origen );
      formData.append( 'destino', destino );
      formData.append( 'tipoDeVehiculo', tipoDeVehiculo );
      formData.append( 'conductor', conductor );
      formData.append( 'duracion', duracion );
      formData.append( 'precio', precio );
      formData.append( 'plazasDisponibles', plazasDisponibles );
      formData.append( 'fechaDeSalida', fechaDeSalida );
      formData.append( 'horaDeSalida', horaDeSalida );
      formData.append( 'periodicidad', periodicidad );
      formData.append( 'imagen', imagen );

      const respuesta = await fetchFormData( 'trayectos', formData, 'POST' );
      const data = await respuesta.json();

      if ( data.ok ) {

        Swal.fire({
          title: 'Trayecto Creado',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          willClose: () => {

            sendToTrayectosCreados();

          }
        });

      } else {

        if ( data.msg ) {

          Swal.fire( 'Error', data.msg, 'error' );

        } else {

          Swal.fire( 'Error', data.errorsArray[0], 'error' );

        }

      }

    } catch {

      Swal.fire( 'Error', 'Ha ocurrido algún error con el servidor', 'error' );

    }

  };

};

export const borrarTrayecto = ( uuidTrayecto, sendToTrayectosCreados ) => {

  return async ( ) => {

    const respuesta = await fetchUrlencoded( 'trayectos', { uuid: uuidTrayecto }, 'DELETE' );
    const data = await respuesta.json();

    if ( data.ok ) {

      Swal.fire({
        title: 'Trayecto Borrado',
        text: data.msg,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        willClose: () => {

          sendToTrayectosCreados();

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

export const actualizarTrayecto = ( uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad, sendToTrayectosCreados ) => {

  return async ( ) => {


    const respuesta = await fetchUrlencoded( 'trayectos', { uuid: uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, plazasDisponibles, fechaDeSalida, horaDeSalida, periodicidad }, 'PUT' );
    const data = await respuesta.json();

    if ( data.ok ) {

      Swal.fire({
        title: 'Trayecto Actualizado',
        text: data.msg,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        willClose: () => {

          sendToTrayectosCreados();

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
