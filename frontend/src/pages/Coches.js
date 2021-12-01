import React, { useEffect, useState } from 'react';
import CochesFilter from '../components/CochesFilter';
import { fetchUrlencoded } from '../helpers/fetch';
import '../styles/pages/coches.css';

export const Coches = () => {

  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState( 0 );

  const paginaSiguiente = () => {

    setPagina( p => p + 1 );

  };

  const paginaAnterior = () => {

    setPagina( p => p - 1 );

  };

  const getData = ( anyo, marca, tipo ) => {

    setLista([]);

    fetchUrlencoded( `datos/coches?pagina=${pagina}&anyo=${anyo || ''}&marca=${marca || ''}&tipo=${tipo || ''}` )
      .then( response => response.json() )
      .then( data => {

        setLista( data.coches );

      });

  };

  useEffect( () => {

    setLista([]);
    getData();

  }, [pagina]);

  if ( lista.length === 0 ) {

    return (
      <div className="coches-container" style={{ justifyContent: 'center' }}>
        <div>
          <h1>Coches</h1>
        </div>

        <h1>Página: {pagina + 1}</h1>

        <CochesFilter previous={paginaAnterior} next={paginaSiguiente} refrescarDatos={getData} />
        <h1 style={{ marginTop: '2%' }}>Cargando...</h1>
      </div>
    );

  }


  return (
    <div className="coches-container">
      <div>
        <h1>Coches</h1>
      </div>

      <h1>Página: {pagina + 1}</h1>

      <CochesFilter previous={paginaAnterior} next={paginaSiguiente} refrescarDatos={getData} />

      <table className="table" style={{ margin: '0px 5px' }}>
        <thead>
          <tr>
            <th scope="col">Anyo</th>
            <th scope="col">Marca</th>
            <th scope="col">Tipo</th>
          </tr>
        </thead>

        {
          lista.map( ( item, index ) => {

            return (
              <tbody key={index}>
                <tr>
                  <td>{item.year}</td>
                  <td>{item.make}</td>
                  <td>{item.type}</td>
                </tr>
              </tbody>
            );

          })
        }
      </table>
    </div>
  );

};

export default Coches;
