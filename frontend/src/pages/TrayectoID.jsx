import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { IconLocation } from '../components/IconLoacation';
import Routing from './Rotuing';

export default function TrayectoID() {

  const { uuid } = useSelector( state => state.auth );
  const history = useHistory();
  const [hayDatos, setHayDatos] = useState( false );
  const [trayecto, setTrayecto] = useState({});
  const [noExiste, setNoExiste] = useState( false );
  const url = history.location.pathname;
  const idTrayecto = url.split( '/' )[2];
  const [pasajeros, setPasajeros] = useState([]); ;
  const [latitudOrigen, setLatitudOrigen] = useState( 0 );
  const [longitudOrigen, setLongitudOrigen] = useState( 0 );
  const [latitudDestino, setLatitudDestino] = useState( 0 );
  const [longitudDestino, setLongitudDestino] = useState( 0 );

  useEffect( async () => {

    if ( idTrayecto ) {

      const respuesta = await fetchUrlencoded( `trayectos?uuid=${idTrayecto}` );
      const body = await respuesta.json();
      setHayDatos( true );


      if ( body.ok ) {

        setTrayecto( body.trayecto );
        setPasajeros( body.trayecto.pasajeros );

        console.log( body.trayecto );

        console.log( `Origen: ${body.trayecto.origen}` );
        console.log( `Destino: ${body.trayecto.destino}` );

        fetch( `https://maps.googleapis.com/maps/api/geocode/json?address=${body.trayecto.origen}&key=${process.env.REACT_APP_API_KEY_GOOGLE}` )
          .then( res => res.json() )
          .then( data => {

            console.log( 'origen: ', data );
            const { lat, lng } = data.results[0].geometry.location;
            setLatitudOrigen( lat );
            setLongitudOrigen( lng );

          });

        fetch( `https://maps.googleapis.com/maps/api/geocode/json?address=${body.trayecto.destino}&key=${process.env.REACT_APP_API_KEY_GOOGLE}` )
          .then( res => res.json() )
          .then( data => {

            console.log( 'destino: ', data );
            const { lat, lng } = data.results[0].geometry.location;
            setLatitudDestino( lat );
            setLongitudDestino( lng );

          });

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

    history.push( '/trayectosInscritos' );

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
          <img src={trayecto.imagen} />
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

      {
        longitudOrigen !== 0 && longitudDestino !== 0

          ? <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 50 + 'px', marginTop: 50 + 'px' }}>

            <MapContainer
              center={{ lat: latitudOrigen, lng: longitudOrigen }}
              zoom={7}>ç

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />

              <Routing
                L1={latitudOrigen}
                L2={longitudOrigen}
                L3={latitudDestino}
                L4={longitudDestino}
              />

            </MapContainer>
          </div>
          : <></>
      }


    </div>
  );

}
