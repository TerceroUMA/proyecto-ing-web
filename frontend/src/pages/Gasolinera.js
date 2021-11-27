import React, { useEffect, useState } from 'react';
import GasolinaFilter from '../components/GasolinaFilter';
import { fetchUrlencoded } from '../helpers/fetch';
import '../styles/pages/gasolineras.css';

export const Gasolinera = () => {

  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState( 0 );

  const paginaSiguiente = () => {

    setPagina( p => p + 1 );

  };

  const paginaAnterior = () => {

    setPagina( p => p - 1 );

  };

  const getData = ( provincia, municipio, precio ) => {

    setLista([]);

    fetchUrlencoded( `datos/gasolineras?pagina=${pagina}&provincia=${provincia || ''}&municipio=${municipio || ''}&precio=${precio || ''}` )
      .then( response => response.json() )
      .then( data => {

        setLista( data.gasolineras );

      });

  };

  useEffect( () => {

    setLista([]);
    getData();

  }, [pagina]);

  if ( lista.length === 0 ) {

    return (
      <div className="gasolineras-container" style={{ justifyContent: 'center' }}>
        <div>
          <h1>Gasolineras</h1>
        </div>

        <h1>Página: {pagina + 1}</h1>

        <GasolinaFilter previous={paginaAnterior} next={paginaSiguiente} refrescarDatos={getData} />
        <h1 style={{ marginTop: '2%' }}>Cargando...</h1>
      </div>
    );

  }


  return (
    <div className="gasolineras-container">
      <div>
        <h1>Gasolineras</h1>
      </div>

      <h1>Página: {pagina + 1}</h1>

      <GasolinaFilter previous={paginaAnterior} next={paginaSiguiente} refrescarDatos={getData} />

      <table className="table" style={{ margin: '0px 5px' }}>
        <thead>
          <tr>
            <th scope="col">Municipio</th>
            <th scope="col">Calle</th>
            <th scope="col">Gasoleo A</th>
          </tr>
        </thead>

        {
          lista.map( ( item, index ) => {

            return (
              <tbody key={index}>
                <tr>
                  <td>{item.Municipio}</td>
                  <td>{item.Dirección}</td>
                  <td>{item['Precio Gasoleo A'] === -1 ? 'No disponible' : item['Precio Gasoleo A']}</td>
                </tr>
              </tbody>
            );

          })
        }
      </table>
    </div>
  );

};

export default Gasolinera;
