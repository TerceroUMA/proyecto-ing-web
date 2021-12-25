import React from 'react';
import { useHistory } from 'react-router';
import { TableMensajes } from '../components/TableMensajes';
import { useSelector } from 'react-redux';


export default function BandejaSalida() {

  const { uuid } = useSelector( state => state.auth );
  const history = useHistory();

  const handleMisMensaje = ( ) => {

    history.push( `/bandejaEntrada/${uuid}` );

  };

  const handleCrearMensaje = ( ) => {

    history.push({
      pathname: '../mensajes/nuevo',
      search: `?idUsuario=${uuid}`
    });

  };

  return (
    <div className="bandeja-entrada-container">
      <h1>Bandeja de salida</h1>
      <button onClick={handleMisMensaje} className="btn btn-success"> Ir a mi bandeja de entrada</button>
      <button onClick={handleCrearMensaje} className="btn btn-warning"> Crear un Mensaje </button>
      <TableMensajes url={`conversaciones/redactados?idUsuario=${uuid}`} tipo="salida"/>
    </div>
  );

}
