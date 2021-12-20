import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import moment from 'moment';
import { useHistory } from 'react-router';

export default function TrayectosCreados() {

  const history = useHistory();
  const { uuid } = useSelector( state => state.auth );
  const [hayDatos, setHayDatos] = useState( false );
  const [trayectos, setTrayectos] = useState([]);
  const [cambio, setCambio] = useState( false );


  useEffect( async () => {

    if ( uuid ) {

      const respuesta = await fetchUrlencoded( `trayectos/inscribir/${uuid}` );
      const body = await respuesta.json();
      setHayDatos( true );

      if ( body.ok ) {

        setTrayectos( body.trayectos );
        const trConductor = [];

        for ( let p = 0; p < body.trayectos.length; p++ ) {

          trConductor[p] = body.trayectos[p];
          const respuesta = await fetchUrlencoded( `users?uuid=${body.trayectos[p].conductor}` );
          const aux = await respuesta.json();

          trConductor[p].conductor = aux.usuario.nombre + ' ' + aux.usuario.apellidos;

        };

        setTrayectos( trConductor );
        setCambio( true );

      }


    }


  }, [uuid]);

  if ( !hayDatos || !cambio ) {

    return (
      <div className="trayectos-container" >
        <h1> Cargando... </h1>
      </div> );

  }

  if ( trayectos.length === 0 ) {

    return (
      <div className="trayectos-container" >
        <h1> No estás inscrito en ningún viaje </h1>
      </div> );

  }

  const handleVerTrayecto = ( idTrayecto ) => {

    history.push( `/trayectos/${idTrayecto}` );

  };

  return (
    <div className="trayectos-container">
      {trayectos.map( ({ uuid: uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles }) => (
        <div
          key={uuidTrayecto}>
          <div className="trayecto">
            <img src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages1.autocasion.com%2Funsafe%2F900x600%2Factualidad%2Fwp-content%2Fuploads%2F2013%2F12%2F_main_image_146785_52b30d8a6f62f.jpg&f=1&nofb=1'} />
            <div className="trayecto-info">
              <h2>{origen} - {destino}</h2>

              <div className="trayecto-info-datos">
                <p><strong>Conductor:</strong> {conductor} </p>
                <p><strong>Precio:</strong> {precio}€</p>
                <p><strong>Duración:</strong> {duracion} minutos</p>
                <p><strong>Plazas disponibles:</strong> {plazasDisponibles}</p>
                <p><strong>Fecha de salida:</strong> {moment( fechaDeSalida ).format( 'DD/MM/YYYY' )}</p>
                <p><strong>Hora de salida:</strong> {horaDeSalida}</p>
                <p><strong>Tipo de vehículo:</strong> {tipoDeVehiculo}</p>
                <p><strong>Periodicidad:</strong> {periodicidad} días</p>

                <button className="btn btn-success" onClick={() => handleVerTrayecto( uuidTrayecto ) }> Acceder </button>

              </div>
            </div>
          </div>
        </div>
      ) ) }
    </div>
  );

};

