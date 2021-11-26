import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from '../hooks/useForm';

export const Gasolinera = () => {

  const [lista, setLista] = useState([]);

  const getData = () => {

    fetch( 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/' )
      .then( response => response.json() )
      .then( data => {

        setLista( data.ListaEESSPrecio );

      });

  };

  useEffect( () => {

    if ( lista.length === 0 ) {

      getData();

    }

    return () => {

      console.log( 'cleanup' );

    };

  }, []);

  const [formValues, handleInputChange] = useForm({
    origen: '',
    destino: '',
    precio: '',
    plazasDisponibles: '',
    fechaDeSalida: '',
    horaDeSalida: ''
  });

  const { origen, destino, precio, plazasDisponibles, fechaDeSalida, horaDeSalida } = formValues;

  const [show, setShow] = useState( false );

  const handleShow = () => {

    setShow( s => !s );

  };

  if ( lista.length === 0 ) {

    return (

      <div className="container">

        <h1>Cargando...</h1>

      </div>

    );

  }


  return (
    <div>
      <div>
        <h1>Filtros</h1>
      </div>

      <button
        className="btn btn-primary btn-filter"
        onClick={ handleShow }
      >
                  Filtrar
      </button>

      <div className={'trayectos-filter ' + ( show ? '' : 'not-show' )}>
        <h1>Filtros de trayectos</h1>
        <form>
          <label htmlFor="origen">Origen:</label>
          <input
            className="form-control"
            type="text"
            name="origen"
            onChange={handleInputChange}
            value={origen}
          />

          <label htmlFor="destino">Destino:</label>
          <input
            className="form-control"
            type="text"
            name="destino"
            onChange={handleInputChange}
            value={destino}
          />

          <label htmlFor="precio">Precio igual o menor a:</label>
          <input
            className="form-control"
            type="number"
            name="precio"
            onChange={handleInputChange}
            value={precio}
          />

          <label htmlFor="plazasDisponibles">Plazas disponibles igual o mayor a:</label>
          <input
            className="form-control"
            type="number"
            name="plazasDisponibles"
            onChange={handleInputChange}
            value={plazasDisponibles}
          />

          <label htmlFor="fechaDeSalida">Fecha de salida igual o mayor a:</label>
          <input
            className="form-control"
            type="date"
            name="fechaDeSalida"
            onChange={handleInputChange}
            value={fechaDeSalida}
          />

          <label htmlFor="horaDeSalida">Hora de salida igual o mayor a:</label>
          <input
            className="form-control"
            type="text"
            name="horaDeSalida"
            onChange={handleInputChange}
            value={horaDeSalida}
            placeholder="hh:mm"
          />

          <button className="btn btn-primary form-control"> Buscar </button>

        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Municipio</th>
            <th scope="col">Calle</th>
            <th scope="col">Gasoleo A</th>
            <th scope="col">Gasoleo B</th>
          </tr>
        </thead>

        {
          lista.map( ( item, index ) => {

            return (
              <tbody key={index}>
                <tr>
                  <td>{item.Municipio}</td>
                  <td>{item.Dirección}</td>
                  <td>{item['Precio Gasoleo A']}</td>
                  <td>{item['Precio Gasoleo B']}</td>
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
