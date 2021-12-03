import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';

export default function UsuarioID() {

  const { uuid } = useSelector( state => state.auth );
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

  return (
    <div>

      <div className="trayecto-container">

        <div className="trayecto-info-datos">

          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellidos:</strong> {usuario.apellidos} </p>
          <p><strong>Edad:</strong> {usuario.edad}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Teléfono</strong> {usuario.telefono}</p>
          <p><strong>Localidad:</strong> {usuario.localidad} </p>
        </div>
      </div>
    </div>
  );

}
