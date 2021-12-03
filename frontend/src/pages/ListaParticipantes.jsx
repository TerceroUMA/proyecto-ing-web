import React, { useEffect, useState } from 'react';

import { fetchUrlencoded } from '../helpers/fetch';

import { useHistory } from 'react-router';


export default function ListaParticipantes() {

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

        const arr = [];
        for ( let p = 0; p < body.trayecto.pasajeros.length; p++ ) {

          const respuesta = await fetchUrlencoded( `users?uuid=${body.trayecto.pasajeros[p]}` );
          const aux = await respuesta.json();

          arr.push( aux.usuario.nombre + ' ' + aux.usuario.apellidos );

        };

        setPasajeros( arr );


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

  if ( noExiste ) {

    return (
      <div className="trayectos-container" >
        <h1> No existe este trayecto </h1>
      </div>
    );

  }

  const handleVolver = ( idTrayecto ) => {

    history.push( `/trayectos/${idTrayecto}` );

  };


  return (
    <div>
      <div className="trayecto-info-datos">
        <h2> Conductor: </h2>
        <p>{trayecto.conductor} </p>
        <h2>Pasajeros: </h2>
        {
          pasajeros.map( paja => (

            <p key={paja}> {paja} </p>

          ) )
        }
        <button className="btn btn-success" onClick={() => handleVolver( idTrayecto ) }> Volver </button>
      </div>

    </div>
  );

}
