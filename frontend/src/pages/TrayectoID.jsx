import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';

export default function TrayectoID() {

  const { uuid } = useSelector( state => state.auth );
  const history = useHistory();
  const [hayDatos, setHayDatos] = useState( false );
  const [trayecto, setTrayecto] = useState({});
  const [noExiste, setNoExiste] = useState( false );
  const url = history.location.pathname;
  const idTrayecto = url.split( '/' )[2];
  const [pasajeros, setPasajeros] = useState([]); ;

  useEffect( async () => {

    if ( idTrayecto ) {

      const respuesta = await fetchUrlencoded( `trayectos?uuid=${idTrayecto}` );
      const body = await respuesta.json();
      setHayDatos( true );


      if ( body.ok ) {

        setTrayecto( body.trayecto );
        setPasajeros( body.trayecto.pasajeros );

      } else {

        setNoExiste( true );

      }

    }


  }, [idTrayecto]);

  if ( !hayDatos ) {

    return (
      <div className="trayectos-container" >
        <h1> Cargando... </h1>
      </div> );

  }

  const handleInscribrise = async() => {

    const respuesta = await fetchUrlencoded( 'trayectos/inscribir', { uuid: idTrayecto, idUsuario: uuid }, 'POST' );
    const body = await respuesta.json();

    if ( !body.ok ) {

      Swal.fire( 'Error', body.msg, 'error' );

    }

    history.push( '/trayectosInscritos' );

  };

  const handleDesinscribrise = async() => {

    const respuesta = await fetchUrlencoded( 'trayectos/desinscribir', { uuid: idTrayecto, idUsuario: uuid }, 'POST' );
    const body = await respuesta.json();

    if ( !body.ok ) {

      Swal.fire( 'Error', body.msg, 'error' );

    }

    history.push( '/' );

  };

  const handleListarUsuariosTrayectos = ( idTrayecto ) => {

    history.push( `/trayectos/${idTrayecto}/participantes` );

  };

  if ( noExiste ) {

    return (
      <div className="trayectos-container" >
        <h1> No existe este trayecto </h1>
      </div>
    );

  }

  return (
    <div>

      <div className="trayectos-container">
        <div className="trayecto">
          <img src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages1.autocasion.com%2Funsafe%2F900x600%2Factualidad%2Fwp-content%2Fuploads%2F2013%2F12%2F_main_image_146785_52b30d8a6f62f.jpg&f=1&nofb=1'} />
          <div className="trayecto-info">
            <h2>{trayecto.origen} - {trayecto.destino}</h2>

            <div className="trayecto-info-datos">

              <p><strong>Precio:</strong> {trayecto.precio}€</p>
              <p><strong>Duración:</strong> {trayecto.duracion} minutos</p>
              <p><strong>Plazas disponibles:</strong> {trayecto.plazasDisponibles}</p>
              <p><strong>Fecha de salida:</strong> {moment( trayecto.fechaDeSalida ).format( 'DD/MM/YYYY' )}</p>
              <p><strong>Hora de salida:</strong> {trayecto.horaDeSalida}</p>
              <p><strong>Tipo de vehículo:</strong> {trayecto.tipoDeVehiculo}</p>
              <p><strong>Periodicidad:</strong> {trayecto.periodicidad} días</p>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                {
                  pasajeros.filter( p => p === uuid ).length === 0
                    ? (
                      trayecto.plazasDisponibles !== '0'
                        ? (
                          <button
                            className="btn btn-success"
                            onClick={handleInscribrise}
                          >
                      Inscribirse
                          </button>
                        )
                        : (
                          <button
                            className="btn btn-success"
                            disabled
                          >
                      No hay plazas Disponibles
                          </button>
                        )

                    )
                    : (
                      <button
                        className="btn btn-danger"
                        onClick={handleDesinscribrise}
                      >
                    Desinscribirse
                      </button>
                    )
                }

                <button className="btn btn-warning" onClick={() => handleListarUsuariosTrayectos( idTrayecto ) } > Pasajeros </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
