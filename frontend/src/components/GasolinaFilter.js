import React, { useRef, useState } from 'react';
import { useForm } from '../hooks/useForm';

import PropTypes from 'prop-types';

export default function GasolinaFilter({ previous, next, refrescarDatos }) {

  const [formValues, handleInputChange] = useForm({
    provincia: '',
    municipio: '',
    precio: ''
  });

  const { provincia, municipio, precio } = formValues;
  const [show, setShow] = useState( false );
  const botonFiltrar = useRef();

  const handleShow = () => {

    setShow( s => !s );

  };

  const handleSearch = ( e ) => {

    e.preventDefault();
    botonFiltrar.current.click();
    refrescarDatos( provincia, municipio, precio );

  };


  return (
    <>
      <div className="paginas-container">
        <button className="btn btn-success" onClick={previous} > Página anterior </button>
        <button className="btn btn-success" onClick={next} > Página siguiente </button>
      </div>
      <button
        className="btn btn-primary btn-filter"
        onClick={ handleShow }
        ref={ botonFiltrar }
      >
        Filtrar
      </button>
      <div className={'trayectos-filter ' + ( show ? '' : 'not-show' )}>
        <form>
          <label htmlFor="origen">Provincia:</label>
          <input
            className="form-control"
            type="text"
            name="provincia"
            onChange={handleInputChange}
            value={provincia}
          />

          <label htmlFor="origen">Municipio:</label>
          <input
            className="form-control"
            type="text"
            name="municipio"
            onChange={handleInputChange}
            value={municipio}
          />

          <label htmlFor="origen">Precio:</label>
          <input
            className="form-control"
            type="text"
            name="precio"
            onChange={handleInputChange}
            value={precio}
          />

          <button
            className="btn btn-primary form-control"
            onClick={handleSearch}
          >
            Buscar
          </button>

        </form>
      </div>
    </>
  );

};
GasolinaFilter.propTypes = {

  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  refrescarDatos: PropTypes.func.isRequired

};
