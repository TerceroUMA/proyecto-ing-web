import React from 'react';
import { TableMensajes } from '../components/TableMensajes';
import { useHistory } from 'react-router';


import '../styles/pages/mensajeria.css';

export default function Mensajeria() {

  const history = useHistory();

  /*
   TODO: POST - conversaciones?idUsuario=${usuarioConectado}, { receptor: correo, aparece en la fixa, asunto, texto }
  */

  const handleNuevoMensaje = () => {

    history.push( '/mensajeria/nuevo' );

  };

  return (
    <div className="bandeja-entrada-container">
      <h1>Mensajeria</h1>
      <button onClick={handleNuevoMensaje} className="btn btn-warning">Crear nuevo mensaje</button>
      <TableMensajes />
    </div>
  );

}
