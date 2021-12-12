import React, { useEffect, useState } from 'react';
import { fetchUrlencoded } from '../helpers/fetch';
import '../styles/home.css';
import TrayectosFilter from './TrayectosFilter';

import moment from 'moment';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const Home = () => {

  const [trayectos, setTrayectos] = useState([]);
  const { uuid } = useSelector( state => state.auth );
  const history = useHistory();
  console.log( uuid );
  const getDatos = ({ origen, destino, precio, plazasDisponibles, fechaDeSalida }) => {

    fetchUrlencoded( `trayectos?origen=${origen}&destino=${destino}&precio=${precio}&plazasDisponibles=${plazasDisponibles}&fechaDeSalida=${fechaDeSalida}&idUsuario=${uuid || ''}` )

      .then( response => response.json() )
      .then( data => {

        setTrayectos( data.trayectos );

      });

  };

  useEffect( () => {

    fetchUrlencoded( `trayectos?origen=&destino=&precio=&plazasDisponibles=&fechaDeSalida=&idUsuario=${uuid || ''}` )
      .then( response => response.json() )
      .then( data => {

        setTrayectos( data.trayectos );

      });

  }, []);

  const handleVerTrayecto = ( idTrayecto ) => {

    history.push( `/trayectos/${idTrayecto}` );

  };

  return (
    <div className="home-container">
      <h1>Trayectos</h1>

      <TrayectosFilter handleRequest={ getDatos }/>
      <div className="trayectos-container">

        {
          trayectos.map( ({ uuid: uuidTrayecto, origen, destino, tipoDeVehiculo, conductor, duracion, precio, fechaDeSalida, horaDeSalida, periodicidad, plazasDisponibles }) => (
            <div className="trayecto" key={uuidTrayecto}>
              <img src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages1.autocasion.com%2Funsafe%2F900x600%2Factualidad%2Fwp-content%2Fuploads%2F2013%2F12%2F_main_image_146785_52b30d8a6f62f.jpg&f=1&nofb=1'} />
              <div className="trayecto-info">
                <h2>{origen} - {destino}</h2>

                <div className="trayecto-info-datos">
                  <p><strong>Usuario:</strong> {conductor}</p>
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
          ) )
        }
      </div>
    </div>
  );

};
