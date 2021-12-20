import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchUrlencoded } from '../helpers/fetch';
import { borrarTrayecto } from '../actions/trayectos';
import moment from 'moment';

export default function TrayectosCreados() {

  const { uuid } = useSelector( state => state.auth );
  const [hayDatos, setHayDatos] = useState( false );
  const [trayectos, setTrayectos] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect( async () => {

    if ( uuid ) {

      const respuesta = await fetchUrlencoded( `trayectos/${uuid}` );
      const body = await respuesta.json();
      setHayDatos( true );
      setTrayectos( body.trayectos );


    }


  }, [uuid]);

  const SendToTrayectosCreados = () => {

    history.push( '/trayectosCreados' );

  };

  const handleBorrarTrayecto = ( uuidTrayecto ) => {

    dispatch( borrarTrayecto( uuidTrayecto, SendToTrayectosCreados ) );


    // dispatch( registrarse( nombre, correo, password, confirmarPassword, apellidos, telefono, edad, localidad, sendToHome ) );

  };

  if ( !hayDatos ) {

    return (
      <div className="trayectos-container" >
        <h1> Cargando... </h1>
      </div> );

  }

  if ( trayectos.length === 0 ) {

    return (
      <div className="trayectos-container" >
        <h1> No has creado ningún viaje </h1>
        <button className="btn btn-primary" > <a href="/crearTrayecto">Crear Trayecto</a> </button>
      </div> );

  }

  return (
    <div className="trayectos-container">
      <button className="btn btn-primary" > <a href="/crearTrayecto">Crear Trayecto</a> </button>
      {trayectos.map( ({ uuid: uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles }) => (
        <div
          key={uuidTrayecto} className="trayectos">
          <div className="trayecto">
            <img src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages1.autocasion.com%2Funsafe%2F900x600%2Factualidad%2Fwp-content%2Fuploads%2F2013%2F12%2F_main_image_146785_52b30d8a6f62f.jpg&f=1&nofb=1'} />
            <div className="trayecto-info">
              <h2>{origen} - {destino}</h2>

              <div className="trayecto-info-datos">

                <p><strong>Precio:</strong> {precio}€</p>
                <p><strong>Duración:</strong> {duracion} minutos</p>
                <p><strong>Plazas disponibles:</strong> {plazasDisponibles}</p>
                <p><strong>Fecha de salida:</strong> {moment( fechaDeSalida ).format( 'DD/MM/YYYY' )}</p>
                <p><strong>Hora de salida:</strong> {horaDeSalida}</p>
                <p><strong>Tipo de vehículo:</strong> {tipoDeVehiculo}</p>
                <p><strong>Periodicidad:</strong> {periodicidad} días</p>
              </div>
            </div>
            <button className="btn btn-danger" onClick={() => handleBorrarTrayecto( uuidTrayecto )}>Borrar</button>
          </div>
        </div>
      ) ) }
    </div>
  );

}

