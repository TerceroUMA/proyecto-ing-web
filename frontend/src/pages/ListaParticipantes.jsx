import React, { useEffect, useState } from 'react';

import { fetchUrlencoded } from '../helpers/fetch';

import { useHistory } from 'react-router';

import '../styles/pages/usuarios.css';
import { Link } from 'react-router-dom';

import '../styles/pages/lista-participantes.css';


export default function ListaParticipantes() {

  const history = useHistory();
  const [hayDatos, setHayDatos] = useState( false );
  const [trayecto, setTrayecto] = useState({});
  const [noExiste, setNoExiste] = useState( false );
  const url = history.location.pathname;
  const idTrayecto = url.split( '/' )[2];
  const [pasajeros, setPasajeros] = useState([{}]);
  const [cambio, setCambio] = useState( false );

  useEffect( async () => {

    if ( idTrayecto ) {

      const respuesta = await fetchUrlencoded( `trayectos?uuid=${idTrayecto}` );
      const body = await respuesta.json();
      setHayDatos( true );


      if ( body.ok ) {

        const r = await fetchUrlencoded( `users?uuid=${body.trayecto.idConductor}` );
        const a = await r.json();

        const ax = body.trayecto;
        ax.conductorObject = a.usuario;
        setTrayecto( ax );

        const arr = [];
        for ( let p = 0; p < body.trayecto.pasajeros.length; p++ ) {

          const respuesta = await fetchUrlencoded( `users?uuid=${body.trayecto.pasajeros[p]}` );
          const aux = await respuesta.json();

          arr.push({
            id: body.trayecto.pasajeros[p],
            nombre: aux.usuario.nombre + ' ' + aux.usuario.apellidos,
            imagen: aux.usuario.imagen
          });

        };

        setPasajeros( arr );
        setCambio( true );


      } else {

        setNoExiste( true );

      }

    }


  }, [idTrayecto]);

  if ( !hayDatos || !cambio ) {

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
    <div className="lista-participantes-container">
      <h1 style={{ width: 100 + '%' }}> Lista de Participantes </h1>
      <br></br>
      <h3> Conductor: </h3>
      <div className="usuario-container">
        <div className="usuario-foto">
          <img src={trayecto.conductorObject.imagen}/>
        </div>

        <div className="usuario-info">
          <Link replace to={{ pathname: '/users', search: `?uuid=${trayecto.idConductor}&valoracion=1` }}> {trayecto.conductor} </Link>
        </div>

      </div>
      <br></br>

      <h3> Participantes: </h3>
      {
        pasajeros.map( k => (

          <div key={k.id} className="usuario-container">
            <div className="usuario-foto">
              <img src={k.imagen}/>
            </div>
            <div className="usuario-info">
              <Link replace to={{ pathname: '/users', search: `?uuid=${k.id}&valoracion=1` }}> {k.nombre} </Link>
              <br></br>
            </div>

          </div>


        ) )
      }
      <button className="btn btn-success" onClick={() => handleVolver( idTrayecto ) }> Volver </button>
    </div>
  );

}
