import React from 'react';
import { TableMensajes } from '../components/TableMensajes';
import { useHistory } from 'react-router';


import '../styles/pages/mensajeria.css';
import { useSelector } from 'react-redux';

export default function BandejaEntrada() {

  const history = useHistory();
  const { uuid } = useSelector( state => state.auth );

  const handleMisMensaje = () => {

    history.push( `/bandejaSalida/${uuid}` );

  };

  return (
    <div className="bandeja-entrada-container">
      <h1>Bandeja de entrada</h1>
      <button onClick={handleMisMensaje} className="btn btn-success"> Ir a mi bandeja de salida</button>
      <TableMensajes url={`conversaciones?idUsuario=${uuid}`} tipo="entrada" />
    </div>
  );

}
