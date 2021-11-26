import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import '../styles/trayectos-filter.css';

export default function TrayectosFilter() {

  const [formValues, handleInputChange] = useForm({
    origen: '',
    destino: '',
    precio: '',
    plazasDisponibles: '',
    fechaDeSalida: ''
  });

  const { origen, destino, precio, plazasDisponibles, fechaDeSalida } = formValues;

  const [show, setShow] = useState( false );

  const handleShow = () => {

    setShow( s => !s );

  };

  return (
    <>
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

          <button className="btn btn-primary form-control"> Buscar </button>

        </form>
      </div>
    </>

  );

}
