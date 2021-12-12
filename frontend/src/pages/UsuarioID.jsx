import React, { useEffect, useState } from 'react';
import { useQuery } from '../hooks/useQuery';
import { fetchUrlencoded } from '../helpers/fetch';
import '../styles/home.css';

export default function UsuarioID() {

  const query = useQuery();
  const uuid = query.get( 'uuid' );
  const [hayDatos, setHayDatos] = useState( false );
  const [usuario, setUsuario] = useState({});

  useEffect( async () => {

    if ( uuid ) {

      const respuesta = await fetchUrlencoded( `users?uuid=${uuid}` );
      const body = await respuesta.json();
      setHayDatos( true );

      if ( body.ok ) {

        setUsuario( body.usuario );

      }

    }

  }, [uuid]);

  if ( !hayDatos ) {

    return (
      <div className="trayecto-container" >
        <h1> Cargando... </h1>
      </div> );

  }


  if ( !usuario ) {

    return (
      <div className="trayecto-container" >
        <h1> No existe este Usuario </h1>
      </div>
    );

  }

  const handleVolver = ( ) => {

    history.back();

  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50 + 'px' }}>
      <div className="card" style={{ width: 18 + 'rem' }}>
        <img src="http://assets.stickpng.com/images/585e4beacb11b227491c3399.png" className="card-img-top" alt="..."/>
        <div className="card-body">
          <h5 className="card-title"> <strong> Usuario: </strong> {usuario.nombre} {usuario.apellidos} </h5>
          <p className="card-text"><strong>Edad:</strong> {usuario.edad}</p>
          <p className="card-text"><strong>Correo:</strong> {usuario.correo}</p>
          <p className="card-text"><strong>Teléfono</strong> {usuario.telefono}</p>
          <p className="card-text"><strong>Localidad:</strong> {usuario.localidad} </p>
          <button className="btn btn-success" onClick={() => handleVolver( ) }> Volver </button>
        </div>
      </div>


    </div>
  );

}
