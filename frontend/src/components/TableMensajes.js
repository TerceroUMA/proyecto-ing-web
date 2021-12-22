import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUrlencoded } from '../helpers/fetch';
import moment from 'moment';

import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useForm } from '../hooks/useForm';


export const TableMensajes = ({ url, tipo }) => {

  const { uuid } = useSelector( state => state.auth );
  const [conversaciones, setConversaciones] = useState([]);
  const [cargado, setCargado] = useState( false );
  const history = useHistory();
  const [filtrarVisto, setFiltrarVisto] = useState( false );
  const [formValues, onChangeValues] = useForm({
    correo: '',
    fecha: ''
  });

  const { correo, fecha } = formValues;

  useEffect( () => {

    if ( uuid ) {

      fetchUrlencoded( `${url}&fecha=${fecha}&visto=${!filtrarVisto && ''}&correo=${correo}` )
        .then( ( response ) => response.json() )
        .then( ( data ) => {

          setConversaciones( data.conversaciones );
          setCargado( true );

        })
        .catch( ( error ) => console.log( error ) );

    }

  }, [uuid, fecha, filtrarVisto, correo]);

  const handleVisto = ( idConve ) => {

    fetchUrlencoded( `conversaciones?uuid=${idConve}`, {}, 'PUT' )
      .then( ( response ) => response.json() )
      .then( ( data ) => {

        console.log( data );

      });

  };

  const handleChangeVisto = () => {

    setFiltrarVisto( v => !v );

  };

  const handleVerMensaje = ( idConve ) => {

    if ( tipo === 'entrada' ) {

      handleVisto( idConve );

    }

    history.push( `/mensajes/${idConve}` );

  };

  const myHTML = () => {

    if ( cargado ) {

      return (
        <>
          <form>
            <label htmlFor="fecha">Fecha mayor a:</label>
            <input
              type="date"
              className="form-control"
              style={{ marginBottom: '10px' }}
              name="fecha"
              value={fecha}
              onChange={onChangeValues}
            />
            <label htmlFor="visto">No visto:</label>
            <input
              type="checkbox"
              className="form-check-input"
              style={{ marginBottom: '10px', marginLeft: '10px' }}
              name="visto"
              onChange={handleChangeVisto}
            />
            <br/>
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              className="form-control"
              style={{ marginBottom: '10px' }}
              name="correo"
              value={correo}
              onChange={onChangeValues}
            />
          </form>

          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{tipo === 'entrada' ? 'Emisor' : 'Receptor' }</th>
                <th scope="col">Fecha</th>
                <th scope="col">Mensaje</th>
                <th scope="col">Visto</th>
              </tr>
            </thead>

            <tbody>

              {
                conversaciones.map( ( conversacion, index ) => (

                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{tipo === 'entrada' ? conversacion.emisor : conversacion.receptor }</td>
                    <td>{moment( conversacion.fecha ).fromNow()}</td>
                    <td><button className="btn btn-primary" onClick={( ) => handleVerMensaje( conversacion.uuid )}>Ver mensaje</button></td>
                    <td>{
                      conversacion.visto
                        ? <p className="text-success"><b>Visto</b></p>
                        : <p className="text-danger"><b>Sin ver</b></p>
                    }</td>
                  </tr>
                ) )
              }

            </tbody>
          </table>
        </> );

    } else {

      return <p style={{ fontSize: '40px', fontFamily: 'bold' }}>Cargando...</p>;

    }

  };

  return (
    <>
      {
        myHTML()
      }
    </>
  );

};

TableMensajes.propTypes = {
  url: PropTypes.string.isRequired,
  tipo: PropTypes.string.isRequired
};
