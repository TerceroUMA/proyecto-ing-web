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
  const [refresh, setRefresh] = useState( false );
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

  useEffect( async () => {

    if ( refresh ) {

      const respuesta = await fetchUrlencoded( `trayectos/${uuid}` );
      const body = await respuesta.json();
      setTrayectos( body.trayectos );

      return () => setRefresh( false );

    }

  }, [refresh]);

  const sendToTrayectosCreados = () => {

    history.push( '/trayectosCreados' );

  };

  const handleBorrarTrayecto = ( uuidTrayecto ) => {

    dispatch( borrarTrayecto( uuidTrayecto, sendToTrayectosCreados ) );
    setRefresh( true );

  };

  const handleEditarTrayecto = ( uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles, imagen ) => {

    const data = { uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles, imagen };
    history.push( '/editarTrayecto', data );

  };

  const handleCrear = () => {

    history.push( '/crearTrayecto' );

  };

  if ( !hayDatos ) {

    return (
      <div className="trayectos-container" >
        <h1> Cargando... </h1>
      </div> );

  }

  if ( trayectos.length === 0 ) {

    return (
      <div className="trayectos-container" style={{ flexDirection: 'column' }} >
        <h1 style={{ marginTop: 10 + 'px' }}> No has creado ningún viaje </h1> <br/>
        <button type="button" className="btn btn-primary" style={{ marginTop: 5 + 'px', width: 25 + '%' }} onClick={handleCrear}> Crear Trayecto </button>
      </div> );

  }

  return (
    <div className="trayectos-container" style={{ flexDirection: 'column' }}>
      <button type="button" className="btn btn-primary" style={{ marginTop: 15 + 'px', width: 25 + '%' }} onClick={handleCrear}> Crear Trayecto </button>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: 15 + 'px' }}>
        {trayectos.map( ({ uuid: uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles, imagen }) => (
          <div
            key={uuidTrayecto} className="trayectos">
            <div className="trayecto">
              <img src={imagen} />
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
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 + '%', marginBottom: 10 + 'px' }}>

                <button className="btn btn-danger" onClick={() => handleBorrarTrayecto( uuidTrayecto )} style={{ width: 40 + '%', marginRight: 5 + 'px' }}>Borrar</button>
                <button className="btn btn-warning" onClick={() => handleEditarTrayecto( uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles, imagen )} style={{ width: 40 + '%', marginLeft: 5 + 'px' }}>Editar</button>
              </div>

            </div>
          </div>
        ) ) }
      </div>
    </div>
  );

}

