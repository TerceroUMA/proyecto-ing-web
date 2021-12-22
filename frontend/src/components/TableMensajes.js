import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';

export const TableMensajes = () => {

  const { uuid } = useSelector( state => state.auth );
  const [conversaciones, setConversaciones] = useState([]);

  useEffect( () => {

    if ( uuid ) {

      fetchUrlencoded( `conversaciones?idUsuario=${uuid}` )
        .then( ( response ) => response.json() )
        .then( ( data ) => setConversaciones( data.conversaciones ) )
        .catch( ( error ) => console.log( error ) );

    }

  }, [uuid]);

  return (
    <table className="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Emisor</th>
          <th scope="col">Fecha</th>
          <th scope="col">Mensaje</th>
          <th scope="col">Visto</th>
          <th scope="col"></th>
        </tr>
      </thead>

      <tbody>

        {
          conversaciones.map( ( conversacion, index ) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{conversacion.emisor}</td>
              <td>{conversacion.fecha}</td>
              <td><button className="btn btn-primary">Ver mensaje</button></td>
              <td>{
                conversacion.visto
                  ? <button className="btn btn-success">Visto</button>
                  : <button className="btn btn-danger">Sin ver</button>
              }</td>
              <td> <button className="btn btn-success">Responder</button></td>
            </tr>
          ) )
        }

      </tbody>
    </table>
  );

};
